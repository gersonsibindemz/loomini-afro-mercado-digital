
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link 
        to="/" 
        className="flex items-center hover:text-loomini-blue transition-colors duration-200"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          
          {item.path && index < items.length - 1 ? (
            <Link 
              to={item.path} 
              className="hover:text-loomini-blue transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? 'text-loomini-blue font-medium' : ''}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
