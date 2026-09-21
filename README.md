This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

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

## Form security

Contact messages and all checkout flows require Cloudflare Turnstile. Set
`TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in `.env` locally and in your
hosting provider's environment settings for deployment. Only the public site key
is exposed through `/api/turnstile`; the secret is used exclusively by the server.

Configure `disegnoproducts.com` and `www.disegnoproducts.com` as allowed hostnames
in your Cloudflare widget. For preview domains, set `TURNSTILE_ALLOWED_HOSTNAMES`
to a comma-separated list of all permitted hostnames and add them in Cloudflare.
Local development permits `localhost` and `127.0.0.1` on the server, but the
widget must also allow the hostname in Cloudflare. Restart after changing env vars.

Both submission APIs validate every token with Cloudflare, require the matching
form action and allowed hostname, and block requests on missing keys, invalid or
reused tokens, and verification outages. Verification occurs before product
lookups, email delivery, or preview-success responses. The browser refreshes
verification after every submitted request. The tracking page is currently a
local mock lookup with no submission API or real order data.

Run `npm run test:security` for mocked verification and API integration tests;
these tests never send email or create real orders. Turnstile reduces automated
abuse but cannot guarantee that every bot is blocked. Hosting-level rate limits
can provide additional protection against high-volume requests.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



https://docs.google.com/spreadsheets/d/15Bad1tfOwUmbozMDdLAnEGqNP7_8fxxroXnUyDSXWzE/edit?gid=1322570892#gid=1322570892
