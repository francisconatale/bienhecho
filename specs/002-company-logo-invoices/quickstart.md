# Quickstart Validation Guide

This guide details how to validate the Company Logo on Invoices feature end-to-end once implemented.

## Prerequisites

1. Local development environment running (`npm run dev`).
2. Supabase local or remote project configured and linked to the app.
3. The `company-logos` bucket must exist and have the correct public access policies configured.
4. A logged-in test user with a company profile.

## Validation Scenarios

### Scenario 1: Upload a new logo

1. Navigate to the company settings/profile page.
2. Observe the current logo (or a placeholder if none exists).
3. Select an image file (e.g., `test-logo.png`) that is smaller than 2MB.
4. Click "Upload" or "Save".
5. **Expected Outcome**:
   - A success notification is shown.
   - The UI updates to display the newly uploaded logo.
   - Verifying in Supabase Studio: The image file is present in the `company-logos` bucket.
   - Verifying in the DB: The `logo_path` field in the company profile is updated.

### Scenario 2: Error handling on upload (Size limit)

1. Select an image file that is larger than 2MB.
2. Attempt to upload.
3. **Expected Outcome**: The upload fails with a clear validation error message in the UI ("El archivo debe pesar como máximo 2MB") and no changes occur in Supabase.

### Scenario 3: Verify Invoice Display

1. Ensure your company has an uploaded logo (Scenario 1 passed).
2. Navigate to the invoices section and generate a new invoice.
3. Preview the invoice document.
4. **Expected Outcome**: The company logo is prominently displayed at the top of the invoice document.

### Scenario 4: Invoice without Logo

1. In the company settings, click the option to remove/delete the current logo.
2. Navigate to the invoices section and preview an invoice.
3. **Expected Outcome**: The invoice document renders correctly without a broken image link, gracefully handling the absence of the logo.
