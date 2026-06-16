# Pakka Deshi Digital Hub

A modern, bilingual (English/Hindi) e-commerce website for Pakka Deshi's premium cold-pressed mustard oil products.

## Features

- 🌐 Bilingual support (English & Hindi)
- 🛒 Product catalog with admin management
- 📝 Blog & content management system
- 💬 AI-powered chatbot for customer support
- 📱 Fully responsive design
- 🎨 Modern UI with shadcn/ui components
- 🔐 Secure admin panel with Supabase authentication
- 📊 Analytics dashboard for business insights

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/narutopyy/pakkadeshi.git
cd pakkadeshi
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your Supabase credentials:
```
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
VITE_SUPABASE_URL="your_supabase_url"
```

5. Start the development server:
```bash
npm run dev
```

## Deployment

This project is optimized for deployment on Vercel:

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── integrations/    # Third-party integrations
└── assets/          # Static assets (images, etc.)
```

## Admin Panel

Access the admin panel at `/admin/login` to manage:
- Products
- Blog posts
- Site settings
- Customer enquiries
- Analytics

## License

© 2026 Pakka Deshi. All rights reserved.
