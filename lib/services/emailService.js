import { Resend } from "resend";
import BlogModel from "@/lib/models/BlogModel";
import EmailModel from "@/lib/models/EmailModel";

const DEFAULT_FROM_EMAIL = "The Editorial <onboarding@resend.dev>";
const DEFAULT_BASE_URL = "http://localhost:3000";
const DEFAULT_BATCH_SIZE = 25;

/**
 * @typedef {Object} BlogNotificationPayload
 * @property {string} blogId
 * @property {string} title
 * @property {string} description
 * @property {string} author
 * @property {string} [image]
 * @property {string} [category]
 */

const getResendClient = () => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error("RESEND_API_KEY is not configured");
    }

    return new Resend(apiKey);
}

const getBaseUrl = () => {
    return (process.env.NEXT_PUBLIC_BASE_URL || process.env.APP_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
}

const getFromEmail = () => {
    return process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;
}

const getBatchSize = () => {
    const value = Number(process.env.EMAIL_BATCH_SIZE);
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_BATCH_SIZE;
}

const getAllowedRecipients = () => {
    return (process.env.EMAIL_ALLOWED_RECIPIENTS || "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
}

const stripHtml = (value = "") => {
    return value
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

const escapeHtml = (value = "") => {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const createExcerpt = (description = "", limit = 180) => {
    const text = stripHtml(description);

    if (text.length <= limit) {
        return text;
    }

    return `${text.slice(0, limit).replace(/\s+\S*$/, "")}...`;
}

const toAbsoluteUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${getBaseUrl()}${normalizedPath}`;
}

const chunk = (items, size) => {
    const chunks = [];

    for (let index = 0; index < items.length; index += size) {
        chunks.push(items.slice(index, index + size));
    }

    return chunks;
}

const formatResendError = (error) => {
    if (!error) return "Unknown Resend error";
    if (typeof error === "string") return error;

    return error.message || JSON.stringify(error);
}

const buildBlogNotificationEmail = (blog) => {
    const title = escapeHtml(blog.title);
    const author = escapeHtml(blog.author || "The Editorial");
    const category = escapeHtml(blog.category || "New Story");
    const excerpt = escapeHtml(createExcerpt(blog.description));
    const blogUrl = `${getBaseUrl()}/blogs/${blog.blogId}`;
    const imageUrl = toAbsoluteUrl(blog.image);

    return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
            </head>
            <body style="margin:0;padding:0;background:#F9F8F6;color:#1A1A1A;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F9F8F6;padding:32px 16px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#F9F8F6;border:1px solid rgba(26,26,26,0.12);">
                                <tr>
                                    <td style="padding:32px 28px 24px;border-bottom:1px solid rgba(26,26,26,0.1);">
                                        <p style="margin:0 0 10px;font-family:Inter,Arial,sans-serif;font-size:10px;line-height:1.5;text-transform:uppercase;letter-spacing:0.26em;color:#D4AF37;">The Editorial / ${category}</p>
                                        <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:1.08;font-weight:400;color:#1A1A1A;">${title}</h1>
                                    </td>
                                </tr>
                                ${imageUrl ? `
                                <tr>
                                    <td>
                                        <img src="${imageUrl}" alt="${title}" width="640" style="display:block;width:100%;max-width:640px;height:auto;border:0;">
                                    </td>
                                </tr>` : ""}
                                <tr>
                                    <td style="padding:30px 28px 36px;">
                                        <p style="margin:0 0 12px;font-family:Inter,Arial,sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:0.18em;color:#6C6863;">By ${author}</p>
                                        <p style="margin:0 0 28px;font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.7;color:#2A2A2A;">${excerpt}</p>
                                        <a href="${blogUrl}" style="display:inline-block;background:#1A1A1A;color:#FFFFFF;text-decoration:none;font-family:Inter,Arial,sans-serif;font-size:11px;line-height:1;text-transform:uppercase;letter-spacing:0.18em;padding:15px 24px;">Read More</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:22px 28px;background:#1A1A1A;">
                                        <p style="margin:0;font-family:Inter,Arial,sans-serif;font-size:10px;line-height:1.6;text-transform:uppercase;letter-spacing:0.18em;color:#EBE5DE;">The Editorial</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;
}

const claimNotificationJob = async (blogId) => {
    const result = await BlogModel.updateOne(
        {
            _id: blogId,
            $or: [
                { "emailNotification.status": { $exists: false } },
                { "emailNotification.status": { $nin: ["sending", "sent"] } }
            ]
        },
        {
            $set: {
                "emailNotification.status": "sending",
                "emailNotification.startedAt": new Date(),
                "emailNotification.lastError": null
            }
        }
    );

    return result.modifiedCount === 1;
}

const markNotificationSent = async (blogId, recipientCount) => {
    await BlogModel.findByIdAndUpdate(blogId, {
        $set: {
            "emailNotification.status": "sent",
            "emailNotification.sentAt": new Date(),
            "emailNotification.recipientCount": recipientCount,
            "emailNotification.lastError": null
        }
    });
}

const markNotificationFailed = async (blogId, error) => {
    await BlogModel.findByIdAndUpdate(blogId, {
        $set: {
            "emailNotification.status": "failed",
            "emailNotification.lastError": error instanceof Error ? error.message : String(error)
        }
    });
}

const getActiveSubscriberEmails = async () => {
    const emails = await EmailModel.find({ active: { $ne: false } }).select("email").lean();
    const subscribers = [...new Set(emails.map((item) => item.email).filter(Boolean))];
    const allowedRecipients = getAllowedRecipients();

    if (!allowedRecipients.length) {
        return subscribers;
    }

    const allowedRecipientSet = new Set(allowedRecipients);
    const filteredSubscribers = subscribers.filter((email) => allowedRecipientSet.has(email.toLowerCase()));

    console.log(
        `EMAIL_ALLOWED_RECIPIENTS is set. Sending to ${filteredSubscribers.length} of ${subscribers.length} active subscribers.`
    );

    return filteredSubscribers;
}

/**
 * Sends a new-post notification to all active subscribers.
 *
 * @param {BlogNotificationPayload} blog
 * @returns {Promise<{sent: boolean, recipientCount: number}>}
 */
export const notifySubscribersOfNewPost = async (blog) => {
    const claimed = await claimNotificationJob(blog.blogId);

    if (!claimed) {
        console.log(`Email notification already claimed or sent for blog ${blog.blogId}`);
        return { sent: false, recipientCount: 0 };
    }

    try {
        const subscribers = await getActiveSubscriberEmails();

        if (!subscribers.length) {
            await markNotificationSent(blog.blogId, 0);
            console.log(`No active subscribers to notify for blog ${blog.blogId}`);
            return { sent: true, recipientCount: 0 };
        }

        const resend = getResendClient();
        const html = buildBlogNotificationEmail(blog);
        const subject = `New Article: ${blog.title}`;

        for (const batch of chunk(subscribers, getBatchSize())) {
            await Promise.all(
                batch.map(async (to) => {
                    const result = await resend.emails.send({
                        from: getFromEmail(),
                        to,
                        subject,
                        html
                    });

                    if (result?.error) {
                        throw new Error(`Resend failed for ${to}: ${formatResendError(result.error)}`);
                    }

                    return result;
                })
            );
        }

        await markNotificationSent(blog.blogId, subscribers.length);
        console.log(`Sent blog notification for ${blog.blogId} to ${subscribers.length} subscribers.`);

        return { sent: true, recipientCount: subscribers.length };
    } catch (error) {
        console.error(`Failed to send blog notification for ${blog.blogId}:`, error);
        await markNotificationFailed(blog.blogId, error);
        return { sent: false, recipientCount: 0 };
    }
}
