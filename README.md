# UngalMeenavan

Fresh from the Sea. Straight to Your Home.

## Overview

UngalMeenavan is a premium seafood marketplace built with Next.js, TypeScript, Tailwind CSS, and Prisma.
It offers separate CUSTOMER and ADMIN roles so customers can browse fresh seafood, place orders, and admins can manage products, categories, banners, and orders.

## Features

- Customer authentication with email/password
- Admin authentication and dashboard
- Product browsing with dynamic categories, search, filters, and sorting
- Local SQLite database via Prisma
- Seeded demo data for admin, customer, fishermen, categories, and products
- Responsive Tailwind UI with premium seafood marketplace styling
- API routes for auth, products, cart, orders, and admin actions

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite local database
- bcrypt for password hashing
- JSON Web Tokens for session cookies

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm available

### Install

```bash
npm install
```

### Environment

Copy the example `.env.example` to `.env` and update values if needed.

```bash
cp .env.example .env
```

For a local SQLite setup, set:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secure-random-string
```

The app also supports optional services like Pusher and Cloudinary if you want to extend real-time notifications or image uploads.

### Database

Generate Prisma client and create the SQLite database:

```bash
npm run prepare
npm run db:migrate
npm run db:seed
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000` or the port shown in the console.

## Default seeded accounts

- Admin: `admin@ungalmeenavan.com` / `Admin1234!`
- Customer: `customer@ungalmeenavan.com` / `Customer1234!`

## Available app pages

- `/` - homepage
- `/auth/login` - login page
- `/auth/signup` - signup page
- `/customer` - customer marketplace
- `/admin` - admin dashboard
- `/admin/products` - admin product management
- `/admin/orders` - admin order overview

## Scripts

- `npm run dev` - start development server
- `npm run build` - build production app
- `npm run start` - start production server after build
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript type check
- `npm run db:migrate` - run Prisma migrations
- `npm run db:seed` - seed the database

## Notes

This project is designed for local development and demo use. It uses SQLite by default for quick setup and can be extended to PostgreSQL or another production database by updating `DATABASE_URL` and Prisma schema.

If you want, I can also add a `CONTRIBUTING.md` or API reference section to this README.# seafood
