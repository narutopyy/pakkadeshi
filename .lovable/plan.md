## Goals

1. Update WhatsApp number to **7607562632** and contact email to **anikaedibleoil@outlook.com** everywhere.
2. Generate a brand **logo** and **favicon** for Pakka Deshi.
3. Make the site **mobile friendly** (audit + fix key pages).
4. **Hide the Lovable badge** on the published site.
5. Add a **Blog page** (route + nav) that lists posts from the database.
6. Create the first blog post: **"Why Healthy Oil Matters for Everyone"**.

## Changes

### 1. Contact info (WhatsApp + email)
- Update `whatsapp_settings.phone_number` to `917607562632` (E.164, India) via data update.
- Update `site_settings` social/contact + Organization JSON-LD in `index.html` (phone + email).
- Replace hardcoded `+919999999999` / `wa.me/919999999999` in:
  - `src/components/Navbar.tsx`
  - `src/components/Footer.tsx`
  - `src/pages/ContactPage.tsx`
  - `index.html` structured data
- Replace any placeholder contact email with `anikaedibleoil@outlook.com`.

### 2. Logo + favicon
- Generate a Pakka Deshi logo (mustard-gold + earth-brown, traditional Indian feel, transparent PNG) → `public/logo.png`.
- Generate a matching favicon → `public/favicon.png`; delete old `public/favicon.ico`; update `<link rel="icon">` in `index.html`.
- Use the new logo in `Navbar` and `Footer` (replace the "प" circle).
- Upload logo URL to `site_settings.logo_url` so admin/dynamic places pick it up.

### 3. Mobile friendliness
- Audit `HomePage`, `ProductsPage`, `AboutPage`, `ProcessPage`, `ContactPage` at 375px.
- Fix typical issues: oversized hero text, fixed widths, grid → stack on mobile, touch target sizes (min 44px), padding, image overflow, sticky CTA spacing.
- Ensure floating WhatsApp button doesn't overlap content/chatbot on small screens.

### 4. Remove Lovable badge
- Use publish settings to hide the "Edit with Lovable" badge (requires Pro — will attempt; if plan blocks it, will notify you).

### 5. Blog page
- New route `/blog` → `src/pages/BlogPage.tsx` using `useBlogPosts()` hook (already exists).
- Card grid: featured image, title, excerpt, date, "Read more".
- New route `/blog/:slug` → `src/pages/BlogPostPage.tsx` for individual post (title, hero image, content, share to WhatsApp).
- Add **Blog** link to `Navbar` and `Footer`.
- SEO via `react-helmet-async` per post (install + wrap in `main.tsx`).

### 6. First blog post (DB insert)
- Insert into `blog_posts`:
  - Slug: `why-healthy-oil-matters-for-everyone`
  - Title (EN): *Why Healthy Oil Matters for Everyone*
  - Title (HI): *स्वस्थ तेल हर किसी के लिए क्यों ज़रूरी है*
  - Full content (EN + HI) — ~600 words covering: hidden dangers of refined oils, benefits of cold-pressed mustard oil (omega-3, MUFA, antioxidants), heart/skin/immunity benefits, traditional cold-pressed process, who it helps (kids, elders, athletes, everyone), how to switch.
  - Status: `published`, published_at: now, featured image: existing product image.

## Technical notes

- WhatsApp number stored without `+` for `wa.me/` links; display as `+91 76075 62632`.
- All hardcoded WhatsApp/email strings will be replaced; long-term they're read from `whatsapp_settings` + `site_settings`, but I'll also fix the hardcoded fallbacks.
- Blog post insert via `supabase--insert`; no schema change needed.
- Helmet provider added once in `src/main.tsx`; remove static canonical from `index.html` to avoid duplicates on blog routes.
- Badge hide is a publish setting toggle (no code change).

## Out of scope

- Building a rich text editor for blog admin (current `AdminBlog` stays as-is).
- Custom domain / email deliverability setup.
