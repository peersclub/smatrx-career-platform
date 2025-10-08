'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@smatrx/ui'
import { Badge } from '@smatrx/ui'
import { Button } from '@smatrx/ui'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  File,
  FileText,
  Image,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye
} from 'lucide-react'
import { useState, useRef, useCallback } from 'react'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface UploadedFile {
  id: string
  file: File
  preview?: string
  uploadProgress: number
  uploadStatus: 'pending' | 'uploading' | 'complete' | 'error'
  uploadedUrl?: string
  error?: string
}

interface DocumentUploadProps {
  title?: string
  description?: string
  acceptedFileTypes?: string[] // e.g., ['application/pdf', 'image/*']
  maxFileSize?: number // in bytes
  maxFiles?: number
  onUpload?: (files: File[]) => Promise<string[]> // Returns URLs of uploaded files
  onComplete?: (uploadedUrls: string[]) => void
  className?: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) return Image
  if (file.type === 'application/pdf') return FileText
  return File
}

const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

const validateFile = (
  file: File,
  acceptedTypes?: string[],
  maxSize?: number
): { valid: boolean; error?: string } => {
  // Check file size
  if (maxSize && file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(maxSize)}`
    }
  }

  // Check file type
  if (acceptedTypes && acceptedTypes.length > 0) {
    const isAccepted = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        // Handle wildcard types like "image/*"
        const prefix = type.slice(0, -2)
        return file.type.startsWith(prefix)
      }
      return file.type === type
    })

    if (!isAccepted) {
      return {
        valid: false,
        error: `File type not accepted. Allowed: ${acceptedTypes.join(', ')}`
      }
    }
  }

  return { valid: true }
}

// ============================================================================
// COMPONENT
// ============================================================================

export function DocumentUpload({
  title = 'Upload Documents',
  description = 'Drag and drop your files here, or click to browse',
  acceptedFileTypes = ['application/pdf', 'image/*'],
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  onUpload,
  onComplete,
  className
}: DocumentUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate preview for image files
  const generatePreview = useCallback((file: File): Promise<string | undefined> => {
    if (!isImageFile(file)) return Promise.resolve(undefined)

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => resolve(undefined)
      reader.readAsDataURL(file)
    })
  }, [])

  // Add files to upload queue
  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)

    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate and add files
    const validFiles: UploadedFile[] = []

    for (const file of fileArray) {
      const validation = validateFile(file, acceptedFileTypes, maxFileSize)

      if (!validation.valid) {
        alert(`${file.name}: ${validation.error}`)
        continue
      }

      const preview = await generatePreview(file)

      validFiles.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview,
        uploadProgress: 0,
        uploadStatus: 'pending'
      })
    }

    setFiles(prev => [...prev, ...validFiles])
  }, [files.length, maxFiles, acceptedFileTypes, maxFileSize, generatePreview])

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files)
    }
  }

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }

  // Remove file from queue
  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  // Simulate upload with progress
  const simulateUpload = (fileId: string): Promise<string> => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setFiles(prev =>
          prev.map(f =>
            f.id === fileId
              ? { ...f, uploadProgress: progress, uploadStatus: 'uploading' as const }
              : f
          )
        )

        if (progress >= 100) {
          clearInterval(interval)
          const mockUrl = `https://storage.example.com/${fileId}`

          setFiles(prev =>
            prev.map(f =>
              f.id === fileId
                ? {
                    ...f,
                    uploadProgress: 100,
                    uploadStatus: 'complete' as const,
                    uploadedUrl: mockUrl
                  }
                : f
            )
          )

          resolve(mockUrl)
        }
      }, 200)
    })
  }

  // Upload all files
  const handleUploadAll = async () => {
    setIsUploading(true)

    try {
      const filesToUpload = files.filter(f => f.uploadStatus === 'pending')

      if (onUpload) {
        // Use custom upload handler
        const fileObjects = filesToUpload.map(f => f.file)
        const uploadedUrls = await onUpload(fileObjects)

        // Update file status
        setFiles(prev =>
          prev.map((f, index) => {
            if (f.uploadStatus === 'pending') {
              return {
                ...f,
                uploadProgress: 100,
                uploadStatus: 'complete' as const,
                uploadedUrl: uploadedUrls[filesToUpload.findIndex(tf => tf.id === f.id)]
              }
            }
            return f
          })
        )

        onComplete?.(uploadedUrls)
      } else {
        // Simulate upload
        const uploadPromises = filesToUpload.map(f => simulateUpload(f.id))
        const uploadedUrls = await Promise.all(uploadPromises)

        onComplete?.(uploadedUrls)
      }
    } catch (error) {
      console.error('Upload failed:', error)

      // Mark files as error
      setFiles(prev =>
        prev.map(f =>
          f.uploadStatus === 'uploading'
            ? { ...f, uploadStatus: 'error' as const, error: 'Upload failed' }
            : f
        )
      )
    } finally {
      setIsUploading(false)
    }
  }

  const pendingFiles = files.filter(f => f.uploadStatus === 'pending')
  const completedFiles = files.filter(f => f.uploadStatus === 'complete')

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
          <br />
          <span className="text-xs text-gray-500 mt-1">
            Max file size: {formatFileSize(maxFileSize)} • Max files: {maxFiles}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFileTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />

          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-purple-500' : 'text-gray-400'}`} />

          <p className="text-base font-medium text-gray-900 mb-1">
            {isDragging ? 'Drop files here' : 'Drag and drop files here'}
          </p>
          <p className="text-sm text-gray-600">or click to browse</p>

          <p className="text-xs text-gray-500 mt-4">
            Accepted: {acceptedFileTypes.join(', ')}
          </p>
        </div>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {files.map((uploadedFile) => {
                const FileIcon = getFileIcon(uploadedFile.file)

                return (
                  <motion.div
                    key={uploadedFile.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    {/* Preview or icon */}
                    {uploadedFile.preview ? (
                      <img
                        src={uploadedFile.preview}
                        alt={uploadedFile.file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded">
                        <FileIcon className="w-6 h-6 text-gray-600" />
                      </div>
                    )}

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>

                      {/* Progress bar */}
                      {uploadedFile.uploadStatus === 'uploading' && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-purple-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadedFile.uploadProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {uploadedFile.uploadProgress}%
                          </p>
                        </div>
                      )}

                      {uploadedFile.error && (
                        <p className="text-xs text-red-600 mt-1">{uploadedFile.error}</p>
                      )}
                    </div>

                    {/* Status icon */}
                    {uploadedFile.uploadStatus === 'complete' && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                    {uploadedFile.uploadStatus === 'uploading' && (
                      <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                    )}
                    {uploadedFile.uploadStatus === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}

                    {/* Remove button */}
                    {uploadedFile.uploadStatus !== 'uploading' && (
                      <button
                        onClick={() => removeFile(uploadedFile.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Summary */}
        {files.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {completedFiles.length > 0 && (
                <span className="text-green-600 font-medium">
                  {completedFiles.length} uploaded
                </span>
              )}
              {pendingFiles.length > 0 && completedFiles.length > 0 && ' • '}
              {pendingFiles.length > 0 && (
                <span>{pendingFiles.length} pending</span>
              )}
            </div>

            {pendingFiles.length > 0 && (
              <Button
                onClick={handleUploadAll}
                disabled={isUploading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {pendingFiles.length} {pendingFiles.length === 1 ? 'File' : 'Files'}
                  </>
                )}
              </Button>
            )}

            {completedFiles.length > 0 && pendingFiles.length === 0 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">All files uploaded</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
