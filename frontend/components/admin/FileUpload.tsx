/**
 * FileUpload Component
 * File upload with preview and validation
 */

'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  value?: string;
  onChange?: (url: string) => void;
  onUpload?: (file: File) => Promise<string>;
  preview?: boolean;
  className?: string;
  error?: string;
  onError?: (message: string) => void;
}

export default function FileUpload({
  label,
  accept = 'image/*',
  maxSize = 10,
  value,
  onChange,
  onUpload,
  preview = true,
  className,
  error,
  onError,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size BEFORE upload
    if (file.size > maxSize * 1024 * 1024) {
      const errorMsg = `File size must be less than ${maxSize}MB`;
      if (onChange) {
        onChange('');
      }
      if (onError) {
        onError(errorMsg);
      } else {
        alert(errorMsg); // Fallback to alert if no error handler
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Show preview
    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Upload file
    if (onUpload) {
      setUploading(true);
      try {
        const url = await onUpload(file);
        setPreviewUrl(url);
        onChange?.(url);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Upload failed';
        setPreviewUrl(null);
        if (onError) {
          onError(errorMsg);
        } else {
          alert(errorMsg); // Fallback to alert if no error handler
        }
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImage = previewUrl && (previewUrl.startsWith('data:image') || previewUrl.startsWith('/uploads') || previewUrl.startsWith('http'));

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
            <label className="block text-sm font-medium text-white/80">{label}</label>
      )}
      
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {previewUrl ? 'Change File' : 'Upload File'}
            </>
          )}
        </Button>

        {previewUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {preview && previewUrl && (
        <div className="mt-4">
          {isImage ? (
            <div className="relative w-full max-w-md">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-auto rounded-lg border border-gray-200"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <File className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">File uploaded</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {value && !previewUrl && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <ImageIcon className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-700">{value}</span>
        </div>
      )}
    </div>
  );
}

