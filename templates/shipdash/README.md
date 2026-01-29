# ShipDash

**The SaaS Dashboard Starter Kit That Ships Today**

Stop wasting weeks building the same dashboard UI. ShipDash gives you a complete, professional dashboard with login, settings, billing, and analytics — ready to customize and launch.

## Quick Start

```bash
# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) to see your dashboard.

## What's Included

### Pages
- **Login** — Clean authentication page with social login buttons
- **Dashboard** — Overview with stats, charts, recent sales, and orders table
- **Analytics** — Page views, conversion rates, and top pages
- **Customers** — Customer list with empty state
- **Billing** — Subscription management, pricing plans, payment methods, invoices
- **Settings** — Profile, notifications, and security settings

### Components
- 15+ UI components based on shadcn/ui
- Responsive sidebar with mobile support
- Dark/light mode (follows system preference)
- Fully typed with TypeScript

### Technical Stack
- React 19
- TypeScript
- Tailwind CSS 4
- Vite
- React Router
- Recharts (for charts)
- Radix UI primitives

## Project Structure

```
shipdash/
├── public/
│   └── logo.svg
├── src/
│   ├── components/
│   │   └── ui/           # UI components (button, card, input, etc.)
│   ├── layouts/
│   │   └── DashboardLayout.tsx
│   ├── lib/
│   │   └── utils.ts      # Utility functions
│   ├── pages/
│   │   ├── Analytics.tsx
│   │   ├── Billing.tsx
│   │   ├── Customers.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── Settings.tsx
│   ├── App.tsx           # Main app with routes
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles and theme
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Customization

### Changing Colors

Edit the CSS variables in `src/index.css`:

```css
@theme {
  --color-primary: hsl(240 5.9% 10%);
  --color-secondary: hsl(240 4.8% 95.9%);
  /* ... other colors */
}
```

### Adding New Pages

1. Create a new file in `src/pages/`
2. Add the route in `src/App.tsx`
3. Add navigation item in `src/layouts/DashboardLayout.tsx`

### Connecting to Backend

This is a frontend-only starter. To connect your backend:

1. Replace the mock data in pages with API calls
2. Add authentication logic to the Login page
3. Implement form submissions

## What's NOT Included

- Backend/API (this is frontend only)
- Database
- Authentication service
- Payment processing
- Hosting

You bring your own backend. This is the UI.

## License

Licensed for personal and commercial use. See LICENSE file for details.

## Support

Questions? Issues? [Open an issue](https://github.com/your-repo/issues) or reach out on Twitter.

---

Built with [shadcn/ui](https://ui.shadcn.com) components.
