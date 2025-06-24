
export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export const currencies: Record<string, CurrencyConfig> = {
  'Moçambique': {
    code: 'MZN',
    symbol: 'MT',
    name: 'Metical Moçambicano',
    flag: '🇲🇿'
  },
  'Angola': {
    code: 'AOA',
    symbol: 'Kz',
    name: 'Kwanza Angolano',
    flag: '🇦🇴'
  },
  'Brasil': {
    code: 'BRL',
    symbol: 'R$',
    name: 'Real Brasileiro',
    flag: '🇧🇷'
  }
};

export const formatCurrency = (
  amount: number, 
  region: string = 'Moçambique'
): string => {
  const currency = currencies[region];
  
  if (!currency) {
    return `${amount.toFixed(2)}`;
  }

  // Format based on region
  switch (region) {
    case 'Moçambique':
      return `${currency.symbol} ${amount.toLocaleString('pt-MZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    
    case 'Angola':
      return `${currency.symbol} ${amount.toLocaleString('pt-AO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    
    case 'Brasil':
      return amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    
    default:
      return `${currency.symbol} ${amount.toFixed(2)}`;
  }
};

export const parseCurrency = (value: string): number => {
  // Remove all non-numeric characters except decimal separator
  const cleanValue = value.replace(/[^\d.,]/g, '');
  
  // Handle different decimal separators
  const normalizedValue = cleanValue.replace(',', '.');
  
  return parseFloat(normalizedValue) || 0;
};

export const getCurrencyInfo = (region: string): CurrencyConfig | null => {
  return currencies[region] || null;
};
