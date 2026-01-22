import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatSize } from '../lib/utils';
import { UploadCloud, FileText, X, Check } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);
    },
    [onFileSelect],
  );

  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { 'application/pdf': ['.pdf'] },
      maxSize: maxFileSize,
    });

  const file = acceptedFiles[0] || null;

  return (
    <div className="h-full">
      <div
        {...getRootProps()}
        className={`
           relative h-full min-h-[300px] border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center p-8
           ${isDragActive
            ? 'border-brand-primary bg-brand-primary/5 scale-[1.02]'
            : file
              ? 'border-brand-secondary bg-brand-secondary/5'
              : 'border-white/10 hover:border-white/30 hover:bg-white/5'
          }
        `}
      >
        <input {...getInputProps()} />

        {file ? (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-brand-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-secondary/30">
              <FileText className="w-10 h-10 text-brand-secondary" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-1 truncate max-w-[250px] mx-auto">
              {file.name}
            </h4>
            <p className="text-text-muted text-sm px-3 py-1 bg-white/5 rounded-full inline-block">
              {formatSize(file.size)}
            </p>

            <button
              type="button"
              className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect?.(null);
              }}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-brand-secondary text-sm font-medium bg-brand-secondary/10 px-3 py-1 rounded-full border border-brand-secondary/20">
              <Check className="w-4 h-4" />
              Ready to Analyze
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`
              w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto transition-transform duration-500
              ${isDragActive ? 'scale-110 bg-brand-primary/20' : ''}
            `}>
              <UploadCloud className={`
                 w-12 h-12 text-brand-primary transition-all duration-500
                 ${isDragActive ? '-translate-y-1' : ''}
               `} />
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium text-white">
                <span className="text-brand-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-text-muted">
                Supported Format: PDF (Max 20MB)
              </p>
            </div>

            {isDragActive && (
              <div className="absolute inset-0 bg-brand-primary/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <p className="text-xl font-bold text-white bg-brand-dark/80 px-6 py-3 rounded-full">
                  Drop PDF Here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default FileUploader;
