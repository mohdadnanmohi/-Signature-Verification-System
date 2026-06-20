import { useState, useRef, useCallback } from 'react';
import { FileText, Upload, X, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DocumentUploadProps {
  onDocumentSelected: (file: File) => void;
  selectedDocument: File | null;
  onClear: () => void;
}

export function DocumentUpload({ 
  onDocumentSelected, 
  selectedDocument, 
  onClear 
}: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onDocumentSelected(file);
    }
  }, [onDocumentSelected]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onDocumentSelected(file);
    }
  }, [onDocumentSelected]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card className="border-2 border-dashed border-muted-foreground/25 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedDocument ? (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <File className="h-10 w-10 text-primary" />
              <div>
                <p className="font-medium truncate max-w-[200px]">{selectedDocument.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedDocument.size)}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center py-8 space-y-4 rounded-lg transition-colors ${
              isDragging ? 'bg-primary/10' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-muted-foreground text-center">
              <p>Drag and drop a document or click to browse</p>
              <p className="text-sm mt-1">PDF, DOC, TXT, or any file type</p>
            </div>
            <Button onClick={triggerFileInput} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Select Document
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
