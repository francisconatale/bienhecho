# Research & Decisions

## 1. Supabase Storage Upload

**Context**: We need to upload a company logo (max 2MB) to Supabase Storage.

**Decision**: Use the Supabase JS client (`@supabase/supabase-js`) in the browser to upload the file directly to a Supabase Bucket (e.g., `company-logos`) to avoid passing the binary data through a Next.js API route.

**Rationale**: Uploading directly from the client to Supabase Storage is more efficient and saves bandwidth on the Next.js server. We will enforce the 2MB size limit and image type constraints (MIME type) both on the client (before upload) and on the Supabase Storage bucket policies.

**Alternatives considered**: Uploading via a Next.js Server Action or API Route. Rejected because it requires reading the file into memory on the server and then sending it to Supabase, which adds latency and unnecessary server load.

## 2. Displaying the Logo on Invoices

**Context**: Invoices must dynamically display the uploaded logo.

**Decision**: Store the relative path of the uploaded logo in the company profile record in the database. When fetching the invoice/company data, generate a public URL for the logo using `supabase.storage.from('company-logos').getPublicUrl(path)`.

**Rationale**: Public buckets are ideal for public-facing assets like logos on invoices. Generating public URLs dynamically ensures that if the bucket configuration changes, the app handles it seamlessly. Storing only the path in the database is more robust than storing the full URL.

**Alternatives considered**: Storing the full public URL in the database. Rejected because it hardcodes the Supabase project domain in the database, making migrations or environment swaps (e.g., dev to prod) harder.
