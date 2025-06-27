
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const ProductCardSkeleton = () => (
  <Card className="animate-pulse">
    <div className="h-48 bg-gray-200 rounded-t-lg" />
    <CardContent className="p-4">
      <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
      <div className="h-6 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
      <div className="flex items-center mb-3">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="ml-2 h-4 bg-gray-200 rounded w-16" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-20 mb-4" />
      <div className="space-y-2">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </CardContent>
  </Card>
);

export const ProductListSkeleton = ({ count = 12 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(count)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const AnalyticsCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-32" />
    </CardHeader>
    <CardContent>
      <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-24" />
    </CardContent>
  </Card>
);

export const ChartSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-40" />
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-gray-200 rounded" />
    </CardContent>
  </Card>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            {[...Array(cols)].map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const LoadingSpinner = ({ text = "Carregando..." }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
    <p className="text-gray-600">{text}</p>
  </div>
);
