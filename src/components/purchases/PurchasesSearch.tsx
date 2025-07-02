
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PurchasesSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
}

const PurchasesSearch: React.FC<PurchasesSearchProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType
}) => {
  return (
    <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Pesquisar nas minhas compras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterType('all')}
          size="sm"
        >
          Todos
        </Button>
        <Button
          variant={filterType === 'course' ? 'default' : 'outline'}
          onClick={() => setFilterType('course')}
          size="sm"
        >
          Cursos
        </Button>
        <Button
          variant={filterType === 'ebook' ? 'default' : 'outline'}
          onClick={() => setFilterType('ebook')}
          size="sm"
        >
          E-books
        </Button>
      </div>
    </div>
  );
};

export default PurchasesSearch;
