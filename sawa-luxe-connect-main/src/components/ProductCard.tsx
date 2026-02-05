import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { useState } from 'react';
import { Product, Category } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const categoryColors: Record<Category, string> = {
  jewelry: 'bg-primary/10 text-primary border-primary/20',
  bags: 'bg-accent/10 text-accent border-accent/20',
  makeup: 'bg-secondary/10 text-secondary border-secondary/20',
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(price);
};

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} added to cart!`, {
      description: 'Click the cart to view your items',
      action: {
        label: 'View Cart',
        onClick: openCart,
      },
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {/* Blur placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay on hover */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-chocolate/20 to-transparent"
        />

        {/* Quick actions */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="absolute bottom-4 left-4 right-4 flex gap-2"
        >
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-primary-foreground hover:bg-gold-light shadow-gold"
            size="sm"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-card/90 backdrop-blur-sm"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-accent">
              <Star className="w-3 h-3 fill-current" /> Featured
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-accent">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-2 py-1 rounded-full border font-accent ${categoryColors[product.category]}`}>
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-accent font-bold text-xl text-foreground">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-muted-foreground font-accent uppercase tracking-wide">
            {product.subcategory}
          </span>
        </div>
      </div>

      {/* Mobile add to cart */}
      <div className="md:hidden p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-primary text-primary-foreground hover:bg-gold-light"
          size="sm"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </motion.article>
  );
};

export default ProductCard;
