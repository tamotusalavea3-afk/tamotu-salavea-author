# Tamotu Salave'a — Final Website Package

Approved production website package for **tamotusalavea.com**.

## Included
- Approved responsive author website design
- Official Tamotu Salave'a logo and favicon assets
- Full, uncropped book-cover presentation
- Author portrait and About the Author page
- Marks of Samoa series and The Blackwell Files series pages
- Released and upcoming book pages
- Direct Lulu purchase links for the three released books
- Public contact address: `contact@tamotusalavea.com`
- Cloudflare Email Routing-compatible contact setup
- `robots.txt`
- XML sitemap with canonical HTTPS URLs and last-modified dates
- Per-page canonical URLs and search-engine metadata
- Open Graph and Twitter social metadata
- JSON-LD structured data for the author, website, books, series, and breadcrumbs
- `max-image-preview:large` indexing directive
- 404 page configured with `noindex,follow`
- Mobile navigation and responsive layout
- Cache-busted stylesheet version for the final SEO release
- Social sharing image at `assets/og-home.jpg`

## SEO / Search Console
The sitemap is:

`https://tamotusalavea.com/sitemap.xml`

The site is intended to use the verified Google Search Console property for `tamotusalavea.com`.

After deployment, submit the sitemap in **Google Search Console → Sitemaps** and use **URL Inspection** to request indexing for the homepage and important book/series pages as needed.

## Contact privacy
The website publicly displays `contact@tamotusalavea.com`. Cloudflare Email Routing forwards incoming mail to the author's existing private mailbox without displaying that private destination address on the website.

## Final pre-launch updates

- Review copy now accurately states that submissions are reviewed manually before publication.
- Review API keeps submissions pending until the site owner approves or rejects them.
- Added a Privacy page for review/contact data transparency.
- Updated the homepage launch announcement.
- Added canonical URL coverage for the Reviews page.
- Local internal-link audit completed with no missing relative targets.

## Final deployment check

1. Deploy the entire folder to the existing Cloudflare Pages project.
2. Confirm the `REVIEWS_DB` D1 binding is present.
3. Confirm `ADMIN_TOKEN` is configured for manual moderation.
4. Submit the sitemap in Google Search Console after deployment.
5. Test one review submission end-to-end, then approve it manually before launch.
