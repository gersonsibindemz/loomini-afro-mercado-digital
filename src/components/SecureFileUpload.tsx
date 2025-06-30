
import React, { useState, useCallback } from 'react';
import { Upload, X, AlertCircle, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { useSecurity } from './SecurityProvider';

interface SecureFileUploadProps {
  onFileSelect: (file: File) => void;
  allowedTypes: string[];
  maxSize?: number;
  accept?: string;
  className?: string;
}

const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onFileSelect,
  allowedTypes,
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { validateFileType } = useSecurity();

  const validateFile = useCallback((file: File): boolean => {
    setError('');
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize) {
      setError(`Arquivo muito grande. Tamanho máximo: ${Math.round(maxSize / (1024 * 1024))}MB`);
      return false;
    }

    // Additional security validation
    if (!validateFileType(file, allowedTypes)) {
      setError('Arquivo não passou na validação de segurança');
      return false;
    }

    // Check for suspicious file names
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
    const fileName = file.name.toLowerCase();
    if (suspiciousExtensions.some(ext => fileName.endsWith(ext))) {
      setError('Tipo de arquivo não permitido por motivos de segurança');
      return false;
    }

    return true;
  }, [allowedTypes, maxSize, validateFileType]);

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setSuccess(`Arquivo selecionado: ${file.name}`);
      onFileSelect(file);
    }
  }, [validateFile, onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setSuccess('');
    setError('');
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-loomini-blue bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleInputChange}
          accept={accept}
        />
        
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-8 w-8 text-green-500" />
              <span className="text-lg font-medium text-gray-700">
                {selectedFile.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Arraste um arquivo aqui ou
              </p>
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="mt-2"
              >
                Selecionar arquivo
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Máximo {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mt-4 border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SecureFileUpload;
