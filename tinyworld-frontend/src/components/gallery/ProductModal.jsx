import React, { useState } from 'react';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useCart } from '../../context/CartContext';
import PersonalizationDialog from '../order/PersonalizationDialog';

const ProductModal = ({ open, onClose, product }) => {
  const { addToCart } = useCart();
  const [showPersonalizationDialog, setShowPersonalizationDialog] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    setShowPersonalizationDialog(true);
  };

  const handleConfirmPersonalization = (personalizationType, personalizationValue) => {
    addToCart(product, personalizationType, personalizationValue, 1);
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {product.imageUrl && (
              <div className="relative w-full bg-muted/30 rounded-lg p-8 flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-h-[400px] w-auto object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&w=400&q=85';
                  }}
                />
              </div>
            )}

            <div className="space-y-4">
              {product.categoryName && (
                <div>
                  <Badge variant="outline" className="text-sm">
                    {product.categoryName}
                  </Badge>
                </div>
              )}

              {product.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <Separator />

              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(product.basePrice || 0)}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Personalization Options</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Add Name: {formatCurrency(30)}</li>
                  <li>• Add Initial: {formatCurrency(20)}</li>
                  <li>• Normal (no personalization): Included</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleAddToCart} className="bg-primary/65">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PersonalizationDialog
        open={showPersonalizationDialog}
        onClose={() => setShowPersonalizationDialog(false)}
        onConfirm={handleConfirmPersonalization}
        product={product}
      />
    </>
  );
};

export default ProductModal;

