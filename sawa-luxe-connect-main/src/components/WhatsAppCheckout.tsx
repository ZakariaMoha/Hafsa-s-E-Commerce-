import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, MapPin, User, Phone, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().trim().regex(/^\+?254\d{9}$/, 'Enter valid Kenyan phone (+254...)'),
  location: z.string().trim().min(5, 'Please provide your location').max(200),
});

interface WhatsAppCheckoutProps {
  onBack: () => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(price);
};

const WhatsAppCheckout = ({ onBack }: WhatsAppCheckoutProps) => {
  const { items, getTotalPrice, clearCart, closeCart } = useCart();
  const STORE_PHONE_PLAIN = import.meta.env.VITE_STORE_PHONE_PLAIN ?? '254700000000';
  const STORE_PHONE = import.meta.env.VITE_STORE_PHONE ?? '+254';
  const STORE_LOCATION = import.meta.env.VITE_STORE_LOCATION ?? 'Eastleigh';

  const [formData, setFormData] = useState({
    name: '',
    phone: STORE_PHONE,
    location: STORE_LOCATION,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'form' | 'preview'>('form');

  const totalPrice = getTotalPrice();
  const deliveryFee = totalPrice >= 10000 ? 0 : 300;
  const grandTotal = totalPrice + deliveryFee;

  const generateWhatsAppMessage = () => {
    const orderItems = items
      .map((item) => `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`)
      .join('\n');

    const message = `🛍️ *NEW ORDER - Hafsa's Boutique*

*Customer Details:*
👤 Name: ${formData.name}
📱 Phone: ${formData.phone}
📍 Location: ${formData.location}

*Order Items:*
${orderItems}

*Summary:*
Subtotal: ${formatPrice(totalPrice)}
Delivery: ${deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
*TOTAL: ${formatPrice(grandTotal)}*

Thank you for shopping with us! 🙏
`;
    return encodeURIComponent(message);
  };

  const handleSubmit = () => {
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStep('preview');
  };

  const handleSendToWhatsApp = async () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${STORE_PHONE_PLAIN}?text=${message}`;

    // Try to persist order to Google Sheet (best-effort)
    try {
      const order = {
        orderId: `${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        items: items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
        subtotal: getTotalPrice(),
        deliveryFee: deliveryFee,
        total: grandTotal,
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      // dynamic import to avoid circular deps during SSR/build tools
      const mod = await import('@/lib/googleSheets');
      if (mod && mod.appendOrderToSheet) {
        mod.appendOrderToSheet(order as any);
      }
    } catch (err) {
      // non-blocking
      console.warn('Failed to persist order to sheet', err);
    }

    window.open(whatsappUrl, '_blank');
    toast.success('Order sent to WhatsApp!', {
      description: 'We will confirm your order shortly.',
    });
    clearCart();
    closeCart();
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={step === 'preview' ? () => setStep('form') : onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="font-display text-xl font-bold">
            {step === 'form' ? 'Your Details' : 'Order Preview'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {step === 'form' ? 'Step 1 of 2' : 'Step 2 of 2 - Confirm & Send'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {step === 'form' ? (
          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+254 7XX XXX XXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., Section 2, Near mosque"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={errors.location ? 'border-destructive' : ''}
              />
              {errors.location && (
                <p className="text-xs text-destructive">{errors.location}</p>
              )}
              <p className="text-xs text-muted-foreground">
                We deliver within Eastleigh. Include street/building details.
              </p>
            </div>

            {/* Order Summary */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <h3 className="font-display font-semibold">Order Summary</h3>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} x{item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Preview message */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-whatsapp" />
                <span className="font-accent font-semibold text-sm">WhatsApp Message Preview</span>
              </div>
              <div className="text-sm whitespace-pre-wrap bg-white dark:bg-card rounded-lg p-3 border border-border">
                {decodeURIComponent(generateWhatsAppMessage())}
              </div>
            </div>

            {/* Confirmation */}
            <div className="flex items-start gap-3 bg-muted/50 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Ready to send?</h4>
                <p className="text-sm text-muted-foreground">
                  This will open WhatsApp with your order details. You can review before sending.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        {step === 'form' ? (
          <Button
            className="w-full bg-primary text-primary-foreground hover:opacity-90"
            size="lg"
            onClick={handleSubmit}
          >
            Continue to Preview
          </Button>
        ) : (
          <Button
            className="w-full bg-whatsapp text-primary-foreground font-accent whatsapp-pulse hover:opacity-90"
            size="lg"
            onClick={handleSendToWhatsApp}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Send Order via WhatsApp
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default WhatsAppCheckout;
