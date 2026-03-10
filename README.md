# ASH Legal Website — File Structure

## How to Deploy

Your site is 7 HTML files + 1 Netlify config. Push all of them to your GitHub repo's root directory (same place your current `index.html` lives).

### Files:

```
index.html              ← Homepage (replaces your current file)
dui-defense.html        ← ashlegal.com/dui-defense
domestic-violence.html  ← ashlegal.com/domestic-violence
petty-theft.html        ← ashlegal.com/petty-theft
vandalism.html          ← ashlegal.com/vandalism
misdemeanor-defense.html← ashlegal.com/misdemeanor-defense
expungements.html       ← ashlegal.com/expungements
netlify.toml            ← Redirects + security headers
```

### Important Notes:

1. **Images**: The site still references `assets/images/ahmed-photo.jpg`, `assets/images/Hall-of-Justice_cover.jpg`, and `assets/images/logo.png` — make sure your `assets/images/` folder stays in the repo.

2. **Clean URLs**: Netlify automatically serves `dui-defense.html` at `/dui-defense` (no `.html` extension needed). The `netlify.toml` adds a few shortcut redirects like `/dui` → `/dui-defense`.

3. **Forms**: The contact form on `index.html` uses Netlify Forms (same `name="contact"` attribute as before). Make sure Netlify Forms is enabled in your Netlify dashboard.

4. **Existing pages**: Your `/insights` page and `/failed-background-check-san-francisco` page are NOT included here — they should still work as before if they're separate files in your repo.

### What Changed on the Homepage:

- Updated "About" section (more personal, mentions Emory, flat fee)
- Expanded Practice Areas from 3 to 6 (added theft, vandalism, misdemeanor)
- All practice area cards now link to their subpages
- Added Pricing section
- Added FAQ section (with accordion)
- Updated footer with practice area links + courts served
- Added mobile menu with all page links
- Updated SEO title and meta description
- Updated hero subtitle to mention flat-fee pricing

### What Each Subpage Includes:

- Consistent nav with back-to-home link
- Page hero with practice area name
- Detailed content (charges, defenses, consequences, what to do)
- CTA section with flat fee + contact info
- Full footer with links to all other practice areas
