# Noe Valley Town Council (Static Site)

A deployable satire website for the **Noe Valley Town Council**, built as a plain static site with HTML, CSS, and lightweight JavaScript.

## Project structure

```
noe-valley-town-council/
├── .gitignore
├── index.html
├── resolutions.html
├── press.html
├── eyesore.html
├── about.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   ├── content.js
│   └── site.js
└── assets/
    └── images/
        └── noe-seal.svg
```

## Content editing

- Update satire content in `js/content.js`.
- Update layout/sections in the page HTML files.
- Update styling and responsive behavior in `css/styles.css`.

## Local preview

From the project root:

```bash
cd /Users/alexandermerenkov/Documents/noe-valley-town-council
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## GitHub repo usage

1. Create a new repo on GitHub (for example `noe-valley-town-council`).
2. In this project folder, initialize and push:

```bash
git init
git add .
git commit -m "Initial Noe Valley Town Council static site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

3. Future updates:

```bash
git add .
git commit -m "Update council content"
git push
```

## Deploy to Cloudflare Pages

1. In Cloudflare dashboard, go to **Workers & Pages** → **Create** → **Pages**.
2. Connect your GitHub repo.
3. Build settings:
   - Framework preset: `None`
   - Build command: leave empty
   - Build output directory: `.`
4. Save and deploy.

Cloudflare will deploy all root-level HTML pages as-is.

## Custom domain setup (Cloudflare Pages)

1. Open your Pages project.
2. Go to **Custom domains** → **Set up a custom domain**.
3. Enter your domain (for example `towncouncil.noevalley.example`).
4. Follow Cloudflare DNS prompts to add/verify records.
5. Wait for SSL provisioning to complete.

## Notes for maintainability

- Header and footer are reusable via `js/site.js` and injected on each page.
- Core datasets (resolutions, press entries, eyesore archive) live in one place (`js/content.js`) for easy future updates.
- No backend or build tooling is required.
