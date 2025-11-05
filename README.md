# The Unlived Project

An AI-powered emotional museum where users can write unsent letters and receive AI-generated replies.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (planned)

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
the-unlived/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── write/             # Write letter page
│   ├── exhibition/        # Exhibition gallery page
│   ├── result/            # AI reply result page
│   ├── about/             # About page
│   └── letters/[id]/      # Dynamic letter detail page
├── components/            # React components
│   ├── HomePage.tsx
│   ├── WritePage.tsx
│   ├── ExhibitionPage.tsx
│   ├── ResultPage.tsx
│   ├── DetailPage.tsx
│   ├── AboutPage.tsx
│   └── Navigation.tsx
└── public/               # Static assets
```

## Features

- 📝 Write unsent letters anonymously
- 🤖 Receive AI-generated empathetic replies
- 🖼️ View public exhibition of AI responses
- 🎨 Beautiful UI with smooth animations
- 🔒 Privacy-first: original messages remain private

## Deployment

This project is configured to deploy on Vercel with zero configuration.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## License

MIT
