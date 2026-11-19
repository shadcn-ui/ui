# LaunchKit — SaaS Dashboard Starter

A professional, ship-ready SaaS dashboard built with Next.js 15, React 19, and shadcn/ui. Stop building dashboards from scratch. Start with a polished foundation and ship your product faster.

## What's Included

- **Login & Signup pages** — Clean auth forms with email/password and Google OAuth placeholders
- **Dashboard** — KPI metric cards, recent transactions table, recent sales list
- **Settings** — Tabbed settings with profile, team management, and notification preferences
- **Billing** — Current plan display, usage meters, plan comparison, invoice history
- **Customers** — Empty state pattern ready for your data
- **Sidebar navigation** — Collapsible, responsive, with keyboard shortcut (Cmd+B)
- **Dark/Light mode** — System-aware theme switching
- **Responsive design** — Mobile-first, works on all screen sizes

## Tech Stack

- **Next.js 15** with App Router and Turbopack
- **React 19**
- **Tailwind CSS v4**
- **shadcn/ui** components (included, not a dependency)
- **Radix UI** primitives for accessibility
- **TypeScript** throughout
- **next-themes** for dark mode

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

Visit [http://localhost:3000/login](http://localhost:3000/login) for the login page.

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx          # Centered auth layout
│   │   ├── login/page.tsx      # Login page
│   │   └── signup/page.tsx     # Signup page
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Sidebar + header layout
│   │   ├── page.tsx            # Main dashboard
│   │   ├── billing/page.tsx    # Billing & plans
│   │   ├── customers/page.tsx  # Customers (empty state)
│   │   └── settings/page.tsx   # Settings with tabs
│   ├── globals.css             # Theme variables & Tailwind
│   └── layout.tsx              # Root layout with theme provider
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── app-sidebar.tsx         # Main sidebar navigation
│   ├── nav-main.tsx            # Navigation items
│   ├── nav-user.tsx            # User dropdown menu
│   ├── site-header.tsx         # Top header bar
│   ├── theme-provider.tsx      # Theme context
│   └── theme-toggle.tsx        # Light/dark toggle
├── hooks/
│   └── use-mobile.ts           # Mobile detection hook
├── lib/
│   └── utils.ts                # Utility functions (cn)
├── package.json
├── tsconfig.json
├── next.config.ts
└── components.json
```

## Customization

### Adding shadcn/ui components

This project includes a `components.json` file. You can add more components:

```bash
npx shadcn@latest add [component-name]
```

### Changing the theme

Edit the CSS variables in `app/globals.css`. The starter uses a zinc-based neutral palette. You can customize colors using the [shadcn/ui theme editor](https://ui.shadcn.com/themes).

### Adding new pages

1. Create a new folder in `app/(dashboard)/`
2. Add a `page.tsx` file
3. Add a navigation item in `components/app-sidebar.tsx`

## What's NOT Included

This is a frontend starter. It does not include:

- Authentication logic (use NextAuth, Clerk, Supabase Auth, etc.)
- Database or ORM (use Prisma, Drizzle, etc.)
- Payment processing (use Stripe, Lemon Squeezy, etc.)
- API routes (add your own as needed)
- Email service
- Deployment configuration

This is intentional. You bring your own backend, auth, and payments. The starter gives you the UI foundation.

## License

See LICENSE.md for full license terms.

**Personal License** — Use on unlimited personal projects.
**Commercial License** — Use on unlimited client and commercial projects.

You may NOT redistribute, resell, or share this starter kit as a template or starter product.
