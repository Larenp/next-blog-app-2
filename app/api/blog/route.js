import { ConnectDB } from "@/lib/config/db"
import BlogModel from "@/lib/models/BlogModel";
import UserModel from "@/lib/models/UserModel";
import EmailModel from "@/lib/models/EmailModel";
import { verifyToken } from "@/lib/utils/auth";
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';
const { NextResponse } = require("next/server")
import { writeFile } from 'fs/promises'
const fs = require('fs')
import { blog_data } from "@/Assets/assets";

async function sendSubscriberEmails(blogTitle, blogId, blogCategory, blogDescription) {
  try {
    const emails = await EmailModel.find({});
    if (!emails.length) return;

    const emailList = emails.map(e => e.email);
    console.log("Subscribers to notify:", emailList);

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || '"The Editorial" <noreply@theeditorial.com>';

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const blogUrl = `${baseUrl}/blogs/${blogId}`;

    const cleanDescription = blogDescription.replace(/<[^>]*>/g, '').slice(0, 200) + '...';

    const emailHtml = `
      <div style="font-family: Georgia, serif; background-color: #F9F8F6; color: #1A1A1A; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(26,26,26,0.1);">
        <p style="font-family: sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em; color: #D4AF37; margin-bottom: 20px;">
          ${blogCategory} / New Story
        </p>
        <h1 style="font-size: 32px; font-weight: normal; line-height: 1.1; margin: 0 0 20px 0; color: #1A1A1A;">
          ${blogTitle}
        </h1>
        <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #6C6863; margin-bottom: 30px;">
          ${cleanDescription}
        </p>
        <a href="${blogUrl}" style="display: inline-block; font-family: sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #FFFFFF; background-color: #1A1A1A; padding: 12px 24px; text-decoration: none;">
          Read Article
        </a>
        <hr style="border: 0; border-top: 1px solid rgba(26,26,26,0.1); margin: 40px 0 20px 0;" />
        <p style="font-family: sans-serif; font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: #6C6863; margin: 0;">
          © The Editorial. All rights reserved.
        </p>
      </div>
    `;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log("SMTP not configured in environment variables. Email simulation output:");
      console.log("Subject: New Article -", blogTitle);
      console.log("HTML Body Preview:\n", emailHtml);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const mailOptions = {
      from: smtpFrom,
      bcc: emailList.join(','),
      subject: `New Article: ${blogTitle}`,
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);
    console.log("Subscriber notification emails dispatched successfully.");
  } catch (err) {
    console.error("Failed to send subscriber emails:", err);
  }
}

const LoadDB = async () => {
  await ConnectDB();
  try {
    const count = await BlogModel.countDocuments();
    if (count === 0) {
      console.log("Database is empty. Seeding default blog data...");
      const seededBlogs = blog_data.map(item => ({
        title: item.title,
        description: item.description,
        category: item.category,
        author: item.author,
        image: typeof item.image === 'object' ? item.image.src : item.image,
        authorImg: typeof item.author_img === 'object' ? item.author_img.src : (item.author_img || "/author_img.png"),
        date: item.date || Date.now()
      }));
      await BlogModel.insertMany(seededBlogs);
      console.log("Database seeded successfully with", seededBlogs.length, "blogs.");
    }
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}

LoadDB();


// API Endpoint to get all blogs
export async function GET(request) {

  const blogId = request.nextUrl.searchParams.get("id");
  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    return NextResponse.json(blog);
  }
  else {
    const blogs = await BlogModel.find({});
    return NextResponse.json({ blogs })
  }
}


// API Endpoint For Uploading Blogs
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    const token = tokenCookie ? tokenCookie.value : null;

    if (!token) {
      return NextResponse.json({ success: false, msg: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, msg: "Unauthorized" }, { status: 401 });
    }

    await ConnectDB();

    // Fetch user details to get avatar and actual name
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ success: false, msg: "User profile not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get('image');
    if (!image) {
      return NextResponse.json({ success: false, msg: "Image is required" }, { status: 400 });
    }

    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `./public/${timestamp}_${image.name}`;
    await writeFile(path, buffer);
    const imgUrl = `/${timestamp}_${image.name}`;

    const blogData = {
      title: `${formData.get('title')}`,
      description: `${formData.get('description')}`,
      category: `${formData.get('category')}`,
      author: user.name,
      image: `${imgUrl}`,
      authorImg: user.avatar || "/author_img.png",
      date: Date.now()
    }

    const createdBlog = await BlogModel.create(blogData);
    console.log("Blog Saved:", createdBlog._id);

    // Dispatch subscriber notification emails asynchronously
    sendSubscriberEmails(
      createdBlog.title,
      createdBlog._id.toString(),
      createdBlog.category,
      createdBlog.description
    );

    return NextResponse.json({ success: true, msg: "Blog Added" })
  } catch (error) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
  }
}

// Creating API Endpoint to delete Blog

export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get('id');
  const blog = await BlogModel.findById(id);
  fs.unlink(`./public${blog.image}`, () => { });
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ msg: "Blog Deleted" });
}
