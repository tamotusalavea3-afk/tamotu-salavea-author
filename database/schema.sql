CREATE TABLE IF NOT EXISTS reviews (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 book TEXT NOT NULL,
 name TEXT NOT NULL,
 rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
 review TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('approved','pending','rejected')),
 flags TEXT,
 fingerprint TEXT UNIQUE,
 created_at TEXT NOT NULL,
 moderated_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_reviews_status_book ON reviews(status,book);
