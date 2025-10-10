'use client';

import { useState, useRef } from 'react';
import Navigation from '@/components/navigation';
import { Card } from '@smatrx/ui';
import { Button } from '@smatrx/ui';
import { 
  FileText, 
  Upload, 
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
  File,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ResumeUploadClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function ResumeUploadClient({ user }: ResumeUploadClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or Word document');
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // TODO: Implement actual upload and parsing
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploaded(true);
      setUploading(false);
    } catch (err) {
      setError('Failed to upload resume. Please try again.');
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(droppedFile.type)) {
        setError('Please upload a PDF or Word document');
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navigation user={user} variant="authenticated" />

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="w-10 h-10 text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-bold">Upload Your Resume</h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our AI will extract your skills, experience, and qualifications
            </p>
          </motion.div>

          {!uploaded ? (
            <>
              {/* Upload Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="p-8">
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                      file ? 'border-purple-500 bg-purple-900/10' : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {!file ? (
                      <>
                        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold mb-2">Drop your resume here</h3>
                        <p className="text-gray-400 mb-6">or click to browse</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="resume-upload"
                        />
                        <label htmlFor="resume-upload">
                          <Button variant="outline" className="cursor-pointer" as="span">
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                        </label>
                        <p className="text-xs text-gray-500 mt-4">
                          Supports PDF, DOC, DOCX (Max 5MB)
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <File className="w-8 h-8 text-purple-400" />
                          <div className="text-left">
                            <p className="font-medium text-white">{file.name}</p>
                            <p className="text-sm text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveFile}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  {file && !error && (
                    <div className="mt-6 flex justify-center">
                      <Button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload & Analyze
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Info Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <Card className="p-6 bg-gray-800/30 border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="font-semibold mb-2">AI-Powered Analysis</h4>
                  <p className="text-sm text-gray-400">
                    Our AI extracts skills, experience, and qualifications with high accuracy
                  </p>
                </Card>

                <Card className="p-6 bg-gray-800/30 border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="font-semibold mb-2">Private & Secure</h4>
                  <p className="text-sm text-gray-400">
                    Your resume is processed securely and never shared with third parties
                  </p>
                </Card>

                <Card className="p-6 bg-gray-800/30 border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="font-semibold mb-2">Review & Edit</h4>
                  <p className="text-sm text-gray-400">
                    You can review and edit all imported skills before saving
                  </p>
                </Card>
              </motion.div>
            </>
          ) : (
            // Success State
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-12 text-center">
                <CheckCircle2 className="w-20 h-20 mx-auto mb-6 text-green-500" />
                <h2 className="text-3xl font-bold mb-4">Resume Uploaded Successfully!</h2>
                <p className="text-gray-400 mb-8">
                  We've analyzed your resume and extracted your skills and experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/skills">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      View Your Skills
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploaded(false);
                      setFile(null);
                    }}
                  >
                    Upload Another
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Alternative Options */}
          {!uploaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-400 mb-4">Don't have a resume ready?</p>
              <Link href="/skills/import">
                <Button variant="outline">
                  Try Other Import Options
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

