
import React from 'react';
import { Globe, BarChart3, Clock, Book } from 'lucide-react';

interface ProductMetadataProps {
  language: string;
  level: string;
  type: 'course' | 'ebook';
  duration?: string;
  pages?: number;
}

const ProductMetadata: React.FC<ProductMetadataProps> = ({
  language,
  level,
  type,
  duration,
  pages
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
      <div className="flex items-center space-x-2">
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-sm">Idioma: {language}</span>
      </div>
      <div className="flex items-center space-x-2">
        <BarChart3 className="w-4 h-4 text-gray-500" />
        <span className="text-sm">Nível: {level}</span>
      </div>
      {type === 'course' && duration ? (
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm">Duração: {duration}</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Book className="w-4 h-4 text-gray-500" />
          <span className="text-sm">Páginas: {pages}</span>
        </div>
      )}
    </div>
  );
};

export default ProductMetadata;
