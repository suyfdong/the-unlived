# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Unlived Project** is an AI-powered emotional museum where users write unsent letters and receive AI-generated empathetic replies. The project was recently migrated from Vite + React SPA to Next.js App Router architecture for better SEO, performance, and deployment on Vercel.

## Development Commands

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build (required before deployment)
npm run build

# Run production build locally
npm start

# Lint code
npm run lint
```

## Architecture & Key Patterns

### Client vs Server Components

This project uses Next.js 16 App Router. **Important distinction**:

- **All page components** (`app/*/page.tsx`) are Server Components by default - they just import client components
- **All interactive components** (`components/*.tsx`) are Client Components marked with `'use client'` directive
- Client components handle all user interactions, animations (Framer Motion), and browser APIs

### Navigation Pattern

The project uses Next.js routing, not client-side state management:

- **Links**: Use `<Link>` from `next/link` for navigation
- **Programmatic navigation**: Use `useRouter()` from `next/navigation`
- **Current route**: Use `usePathname()` from `next/navigation`
- **NO `onClick` navigation callbacks** - the old Vite SPA pattern has been removed

Example pattern used throughout:
```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Component() {
  const pathname = usePathname();
  return <Link href="/write">Navigate</Link>
}
```

### Page Structure Pattern

Every route follows this structure:
```tsx
// app/*/page.tsx (Server Component)
import ComponentName from '@/components/ComponentName'
import Navigation from '@/components/Navigation'

export default function Page() {
  return (
    <>
      <Navigation />
      <ComponentName />
    </>
  )
}
```

The Navigation component is included in every page (not in layout) to allow pathname detection.

### Dynamic Routes

- Letter details use dynamic routing: `app/letters/[id]/page.tsx`
- The `[id]` parameter is passed to components via props:
  ```tsx
  export default function Page({ params }: { params: { id: string } }) {
    return <DetailPage id={params.id} />
  }
  ```

### Import Paths

TypeScript is configured with path alias `@/*` pointing to project root:
```tsx
import HomePage from '@/components/HomePage'  // ✅ Correct
import HomePage from '../components/HomePage' // ❌ Avoid relative imports
```

### Styling Architecture

- **Tailwind CSS** for all styling - no CSS modules or styled-components
- **Google Fonts** imported in `app/globals.css` via `@import` (must be first line)
- **Custom animations** defined in globals.css (`@keyframes`)
- **Framer Motion** for complex animations (all components use it extensively)
- **Color scheme**: Cyan/blue gradients (`#00D4FF`, `#A7FF83`, `#FFB347`) on dark backgrounds

### Component Patterns

All interactive components share these patterns:

1. **'use client' directive** at the very top
2. **Framer Motion** for animations (`motion.div`, `whileHover`, etc.)
3. **State management** via `useState` - no global state
4. **Responsive design** - mobile-first with `md:` breakpoints
5. **Accessibility** - semantic HTML, proper ARIA labels

### Data Flow (Planned)

Currently static UI. When backend integration happens:

- Supabase client library is already installed (`@supabase/supabase-js`)
- Environment variables should use `NEXT_PUBLIC_` prefix for client-side access
- API routes can be added in `app/api/` directory

## Build Configuration

### TypeScript

- Uses `moduleResolution: "bundler"` (Next.js 16 default)
- Path alias configured: `"@/*": ["./*"]`
- Strict mode enabled
- Auto-configured by Next.js on first build

### Next.js Config

- ESM format (`export default`) due to `"type": "module"` in package.json
- React strict mode enabled
- Currently minimal config - extend as needed

### Tailwind Config

**Note**: The current `tailwind.config.js` references old Vite paths. It should be updated to:
```js
content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}']
```

## Deployment

### Vercel (Recommended)

This project is optimized for Vercel:

1. Connect GitHub repo to Vercel
2. Zero configuration needed - auto-detected as Next.js
3. Auto-deploy on every push to main
4. See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed Chinese instructions

### Build Validation

Always test production build locally before deploying:
```bash
npm run build  # Should complete without errors
npm start      # Test at http://localhost:3000
```

## File Organization

- `app/` - Next.js App Router pages (one folder per route)
- `components/` - All React components (shared across routes)
- `public/` - Static assets (images, cursor SVGs, etc.)
- `app/globals.css` - Global styles and Tailwind directives

## Migration Notes

This project was migrated from Vite to Next.js. When working on it:

- No more Vite config files (removed: `vite.config.ts`, `index.html`, `src/` directory)
- Old pattern (removed): `onNavigate` callback props for navigation
- New pattern: Direct Next.js `Link` and `useRouter()` usage
- All components were converted to work with App Router

## Common Gotchas

1. **CSS @import order**: Font imports must be before `@tailwind` directives
2. **'use client' placement**: Must be the very first line (before imports)
3. **Dynamic imports**: Framer Motion works fine with 'use client', no need for dynamic imports
4. **ESM config files**: Use `export default` not `module.exports` in config files
5. **Case sensitivity**: Next.js routes are case-sensitive in production
