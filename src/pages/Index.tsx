import { useState } from 'react';
import { Shield, Fingerprint, FileSignature, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignatureCapture } from '@/components/SignatureCapture';
import { DocumentUpload } from '@/components/DocumentUpload';
import { VerificationResult } from '@/components/VerificationResult';
import { useSignatureVerification } from '@/hooks/useSignatureVerification';

const Index = () => {
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [document, setDocument] = useState<File | null>(null);

  const {
    isVerifying,
    isGeneratingDigitalSignature,
    signatureResult,
    digitalSignature,
    digitalVerificationResult,
    verifyHandwrittenSignature,
    reset,
  } = useSignatureVerification();

  const handleVerify = async () => {
    if (!signatureImage) return;
    await verifyHandwrittenSignature(signatureImage, document);
  };

  const handleClear = () => {
    setSignatureImage(null);
    setDocument(null);
    reset();
  };

  const isLoading = isVerifying || isGeneratingDigitalSignature;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Signature Verification System</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Handwritten & Digital Signatures</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Fingerprint className="h-4 w-4" />
            Powered by AI Vision & RSA-SHA256 Cryptography
          </div>
          <h2 className="text-3xl font-bold mb-3">
            Verify Signatures with Confidence
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload a handwritten signature to verify its authenticity using AI. 
            Genuine signatures can then be used to create cryptographic digital signatures 
            for document integrity and non-repudiation.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <SignatureCapture
            onSignatureCaptured={setSignatureImage}
            signaturePreview={signatureImage}
            onClear={() => setSignatureImage(null)}
          />
          <DocumentUpload
            onDocumentSelected={setDocument}
            selectedDocument={document}
            onClear={() => setDocument(null)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button
            size="lg"
            onClick={handleVerify}
            disabled={!signatureImage || isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isVerifying ? 'Analyzing...' : 'Signing...'}
              </>
            ) : (
              <>
                <FileSignature className="mr-2 h-5 w-5" />
                Verify & Sign
              </>
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleClear}
            disabled={isLoading}
          >
            Clear All
          </Button>
        </div>

        {/* Results */}
        <VerificationResult
          signatureResult={signatureResult}
          digitalSignature={digitalSignature}
          isVerifyingDigital={isGeneratingDigitalSignature}
          digitalVerificationResult={digitalVerificationResult}
        />

        {/* Info Section */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <Fingerprint className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">AI Signature Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Advanced vision AI analyzes stroke patterns, pressure variations, and line quality to detect forgeries.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">RSA Digital Signatures</h3>
            <p className="text-sm text-muted-foreground">
              2048-bit RSA keys with SHA-256 hashing ensure document integrity and authenticity.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <FileSignature className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Controlled Workflow</h3>
            <p className="text-sm text-muted-foreground">
              Digital signatures are only generated after handwritten signatures are verified as genuine.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Signature Verification System • AI-Powered Security</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
