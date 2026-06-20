-- Create table for signature verifications
CREATE TABLE public.signature_verifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    signature_image_url TEXT NOT NULL,
    document_name TEXT,
    document_hash TEXT,
    is_genuine BOOLEAN,
    confidence_score NUMERIC(5,2),
    verification_result TEXT,
    digital_signature TEXT,
    public_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.signature_verifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for demo purposes)
CREATE POLICY "Anyone can insert verifications"
ON public.signature_verifications
FOR INSERT
WITH CHECK (true);

-- Create policy to allow anyone to read (for demo purposes)
CREATE POLICY "Anyone can read verifications"
ON public.signature_verifications
FOR SELECT
USING (true);

-- Create storage bucket for signatures
INSERT INTO storage.buckets (id, name, public)
VALUES ('signatures', 'signatures', true);

-- Create policy for uploading signatures
CREATE POLICY "Anyone can upload signatures"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'signatures');

-- Create policy for reading signatures
CREATE POLICY "Anyone can read signatures"
ON storage.objects
FOR SELECT
USING (bucket_id = 'signatures');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_signature_verifications_updated_at
BEFORE UPDATE ON public.signature_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();