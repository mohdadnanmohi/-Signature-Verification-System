import { CheckCircle2, XCircle, AlertCircle, Shield, FileKey } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface VerificationResultProps {
  signatureResult: {
    isGenuine: boolean;
    confidence: number;
    analysis: string;
  } | null;
  digitalSignature: {
    signature: string;
    publicKey: string;
    documentHash: string;
  } | null;
  isVerifyingDigital: boolean;
  digitalVerificationResult: boolean | null;
}

export function VerificationResult({
  signatureResult,
  digitalSignature,
  isVerifyingDigital,
  digitalVerificationResult,
}: VerificationResultProps) {
  if (!signatureResult) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Handwritten Signature Result */}
      <Card className={`border-2 ${signatureResult.isGenuine ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              {signatureResult.isGenuine ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Handwritten Signature Analysis
            </span>
            <Badge variant={signatureResult.isGenuine ? 'default' : 'destructive'}>
              {signatureResult.isGenuine ? 'GENUINE' : 'FORGED'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Confidence Score</span>
              <span className="font-medium">{signatureResult.confidence}%</span>
            </div>
            <Progress 
              value={signatureResult.confidence} 
              className={signatureResult.isGenuine ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}
            />
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm">{signatureResult.analysis}</p>
          </div>
        </CardContent>
      </Card>

      {/* Digital Signature Result */}
      {signatureResult.isGenuine && digitalSignature && (
        <Card className="border-2 border-blue-500/50 bg-blue-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Digital Signature Generated
              </span>
              <Badge variant="outline" className="border-blue-500 text-blue-500">
                RSA-SHA256
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Document Hash (SHA-256)</label>
                <div className="mt-1 p-2 bg-muted rounded font-mono text-xs break-all">
                  {digitalSignature.documentHash}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Digital Signature</label>
                <div className="mt-1 p-2 bg-muted rounded font-mono text-xs break-all max-h-20 overflow-y-auto">
                  {digitalSignature.signature.substring(0, 100)}...
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Public Key (for verification)</label>
                <div className="mt-1 p-2 bg-muted rounded font-mono text-xs break-all max-h-20 overflow-y-auto">
                  {digitalSignature.publicKey.substring(0, 100)}...
                </div>
              </div>
            </div>

            {digitalVerificationResult !== null && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                digitalVerificationResult ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'
              }`}>
                {digitalVerificationResult ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Digital signature verified successfully!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">Digital signature verification failed</span>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Blocked Digital Signature */}
      {!signatureResult.isGenuine && (
        <Card className="border-2 border-amber-500/50 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Digital Signature Blocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Digital signature generation has been blocked because the handwritten signature 
              was classified as potentially forged. Only verified genuine signatures can be 
              used to digitally sign documents for security purposes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
