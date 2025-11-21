import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const GalleryItem = ({ product, onClick }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card
      className="group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative bg-muted/30 p-6">
          <img
            src={product.imageUrl || '/placeholder-image.jpg'}
            alt={product.name}
            className="mx-auto h-64 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&w=400&q=85';
            }}
          />
        </div>
        <div className="space-y-3 border-t p-6">
          <div className="space-y-2">
            {product.categoryName && (
              <Badge variant="outline" className="text-xs font-medium">
                {product.categoryName}
              </Badge>
            )}
            <h3 className="text-lg font-semibold leading-tight">{product.name}</h3>
            {product.description && (
              <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                {product.description.length > 100
                  ? `${product.description.substring(0, 100)}...`
                  : product.description}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(product.basePrice || 0)}
              </p>
              {product.basePrice && product.basePrice > 0 && (
                <p className="text-muted-foreground text-xs">
                  Personalization available
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GalleryItem;

