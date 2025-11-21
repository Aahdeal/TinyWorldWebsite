import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PERSONALIZATION_TYPES } from '../../utils/constants';

const PersonalizationDialog = ({ open, onClose, onConfirm, product, initialPersonalization = { type: 'NONE', value: '' } }) => {
  const [personalizationType, setPersonalizationType] = useState(initialPersonalization.type || 'NONE');
  const [personalizationValue, setPersonalizationValue] = useState(initialPersonalization.value || '');

  const handleConfirm = () => {
    onConfirm(personalizationType, personalizationValue);
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const calculateTotal = () => {
    const personalization = PERSONALIZATION_TYPES.find((p) => p.value === personalizationType);
    return (product?.basePrice || 0) + (personalization?.price || 0);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md max-h-xl">
        <DialogHeader>
          <DialogTitle>Customize Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-1">{product?.name}</h4>
            <p className="text-sm text-muted-foreground">
              Base Price: {formatCurrency(product?.basePrice || 0)}
            </p>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">Personalization Options</Label>
            <RadioGroup
              value={personalizationType}
              onValueChange={(value) => {
                setPersonalizationType(value);
                if (value === 'NONE') {
                  setPersonalizationValue('');
                }
              }}
              className="space-y-3"
            >
              {PERSONALIZATION_TYPES.map((type) => (
                <div key={type.value} className="flex items-start space-x-3">
                  <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                  <Label
                    htmlFor={type.value}
                    className="flex-1 cursor-pointer space-y-1"
                  >
                    <div className="font-medium">{type.label}</div>
                    {type.price > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(type.price)} extra
                      </div>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {(personalizationType === 'INITIAL' || personalizationType === 'NAME') && (
            <div>
              <Label htmlFor="personalizationValue">
                {personalizationType === 'INITIAL' ? 'Initial' : 'Name'} *
              </Label>
              <Input
                id="personalizationValue"
                value={personalizationValue}
                onChange={(e) => setPersonalizationValue(e.target.value.toUpperCase())}
                maxLength={personalizationType === 'INITIAL' ? 1 : 50}
                required
                placeholder={personalizationType === 'INITIAL' ? 'Enter initial (e.g., A)' : 'Enter name'}
                className="mt-2"
              />
            </div>
          )}

          <Separator />

          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={personalizationType !== 'NONE' && !personalizationValue.trim()}
            className="bg-primary/65"
          >
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalizationDialog;

