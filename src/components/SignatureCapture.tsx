import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SignatureCaptureProps {
  onSignatureCaptured: (imageDataUrl: string) => void;
  signaturePreview: string | null;
  onClear: () => void;
}

export function SignatureCapture({ 
  onSignatureCaptured, 
  signaturePreview, 
  onClear 
}: SignatureCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setIsCapturing(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions or use file upload.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        onSignatureCaptured(dataUrl);
        stopCamera();
      }
    }
  }, [onSignatureCaptured, stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onSignatureCaptured(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onSignatureCaptured]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="border-2 border-dashed border-muted-foreground/25 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Signature Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        {signaturePreview ? (
          <div className="relative">
            <img 
              src={signaturePreview} 
              alt="Captured signature" 
              className="w-full max-h-64 object-contain rounded-lg border border-border"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : isCapturing ? (
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg border border-border"
            />
            <div className="flex gap-2 justify-center">
              <Button onClick={capturePhoto}>
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </Button>
              <Button variant="outline" onClick={stopCamera}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="text-muted-foreground text-center">
              <p>Upload or capture a handwritten signature image</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={startCamera} variant="default">
                <Camera className="mr-2 h-4 w-4" />
                Use Camera
              </Button>
              <Button onClick={triggerFileInput} variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}
