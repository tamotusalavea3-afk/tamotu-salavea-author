# Cloudflare D1 Reviews Setup

This site is configured for the existing D1 database:
- Database: `tamotu-book-reviews`
- Pages/Worker binding: `REVIEWS_DB`
- Public endpoint: `/api/reviews`

## Important
The database schema already in Cloudflare uses:
`book_slug`, `reviewer_name`, `rating`, `review_text`, `status`, `moderation_reason`, `created_at`, `ip_hash`.
The API files in this package have been aligned to that schema.

## Deployment
Upload/deploy the entire package to the `tamotu-salavea-author` Pages project. Cloudflare Pages Functions will automatically expose:
- `GET /api/reviews?book=BOOK_TITLE` — approved reviews
- `POST /api/reviews` — new review submission, stored as `pending`

## Binding
In Settings → Bindings, keep:
- Type: D1 database
- Variable name: `REVIEWS_DB`
- Database: `tamotu-book-reviews`

## Moderation
`/api/moderate` requires a secret named `ADMIN_TOKEN`. Add it before using that endpoint. Never expose this token in browser JavaScript.
