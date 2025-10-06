'use client';

import { useState, useRef } from 'react';
import { Card } from '@smatrx/ui';
import { Button } from '@smatrx/ui';
import { Upload, FileText, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ResumeUploadProps {
  onUploadComplete?: (analysis: any) => void;
}

export default function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a PDF, DOC, DOCX, or TXT file');
      setUploadStatus('error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size must be less than 5MB');
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/resume/upload-simple', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Upload failed';
        const tip = errorData.tip;
        throw new Error(tip ? `${errorMessage}. ${tip}` : errorMessage);
      }

      const result = await response.json();
      setUploadStatus('success');
      onUploadComplete?.(result);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to upload and analyze resume. Please try again.');
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileSelect({ target: fileInputRef.current } as any);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Card className="p-6">
      <div className="text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileSelect}
          className="hidden"
          id="resume-upload"
        />
        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-700 rounded-lg p-8 hover:border-cyan-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileText className="w-12 h-12 mx-auto mb-3 text-cyan-500" />
          <h3 className="font-semibold mb-1">Upload Resume</h3>
          <p className="text-sm text-gray-500 mb-4">
            Drop your resume here or click to browse
          </p>
          <p className="text-xs text-gray-600">
            Supports PDF and TXT files (max 5MB)
          </p>
        </div>

        {isUploading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing your resume...</span>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-500">
            <CheckCircle className="w-4 h-4" />
            <span>Resume analyzed successfully!</span>
          </div>
        )}

        {uploadStatus === 'error' && errorMessage && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-red-500">
            <XCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="mt-4">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Select Resume
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
