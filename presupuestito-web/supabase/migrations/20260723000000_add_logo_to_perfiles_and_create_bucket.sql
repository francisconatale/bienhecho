-- Add logo_path to perfiles
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS logo_path TEXT;

-- Create company-logos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('company-logos', 'company-logos', true, 2097152, ARRAY['image/png', 'image/jpeg', 'image/jpg']::text[])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Set up RLS policies for the bucket
-- Allow public read access to the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'company-logos' );

-- Allow authenticated users to upload and update their own logos
CREATE POLICY "Users can upload their own logo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'company-logos' AND (storage.foldername(name))[1] = auth.uid()::text );

CREATE POLICY "Users can update their own logo"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'company-logos' AND (storage.foldername(name))[1] = auth.uid()::text );

CREATE POLICY "Users can delete their own logo"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'company-logos' AND (storage.foldername(name))[1] = auth.uid()::text );
