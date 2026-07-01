This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

## Email Notifications

This app uses [Resend](https://resend.com) to notify active subscribers when a new blog post is published.

Create a local `.env.local` file using `.env.example` as the template:

```bash
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL="The Editorial <onboarding@resend.dev>"
NEXT_PUBLIC_BASE_URL=http://localhost:3000
EMAIL_BATCH_SIZE=25
EMAIL_ALLOWED_RECIPIENTS=
```

Ask the site owner to replace `re_xxxxxxxxx` with their real Resend API key. For production, replace `RESEND_FROM_EMAIL` with a verified sender/domain from Resend.

Notification flow:

1. A signed-in author publishes a post through `/api/blog`.
2. The blog is saved to MongoDB first.
3. The route schedules `notifySubscribersOfNewPost` with Next.js `after()`, so email failures do not block publishing.
4. The email service atomically claims the blog notification job to prevent duplicate emails for the same post.
5. It fetches subscribers where `active !== false`, builds a responsive HTML email, and sends in batches with `Promise.all`.
6. Delivery success/failure is recorded on the blog document under `emailNotification`.

To test locally:

1. Add your Resend key to `.env.local`.
2. Keep `RESEND_FROM_EMAIL` as `onboarding@resend.dev` for a first sandbox test, and set `EMAIL_ALLOWED_RECIPIENTS` to your Resend account email. Remove `EMAIL_ALLOWED_RECIPIENTS` after verifying a sending domain.
3. Start the app with `npm run dev`.
4. Subscribe a test email from the homepage.
5. Publish a blog post from the dashboard.
6. Check the inbox and the server logs. If Resend is not configured or delivery fails, the blog still publishes and the error is logged.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
