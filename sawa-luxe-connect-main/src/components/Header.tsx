import { ShoppingBag, Menu, X, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';

const STORE_PHONE = import.meta.env.VITE_STORE_PHONE ?? '+254 700 000 000';
const STORE_LOCATION = import.meta.env.VITE_STORE_LOCATION ?? 'Sawa Mall, Eastleigh';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {STORE_LOCATION}
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {STORE_PHONE}
            </span>
          </div>
          <span className="font-accent text-xs tracking-wider">Karibu! Welcome to Luxury</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex flex-col">
            <span className="font-display text-2xl md:text-3xl font-bold text-foreground">
              UDGON
            </span>
            <span className="text-xs font-accent tracking-[0.2em] text-muted-foreground uppercase">
              JEWELLARY
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#jewelry" className="font-accent text-sm tracking-wide hover:text-primary transition-colors">
              Jewelry ✨
            </a>
            <a href="#bags" className="font-accent text-sm tracking-wide hover:text-primary transition-colors">
              Bags 👜
            </a>
            <a href="#makeup" className="font-accent text-sm tracking-wide hover:text-primary transition-colors">
              Makeup 💄
            </a>
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground rounded-full text-xs flex items-center justify-center font-medium"
                >
                  {totalItems}
                </motion.span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-card border-t border-border overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-4">
              <a
                href="#jewelry"
                className="font-accent text-sm tracking-wide hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Jewelry ✨
              </a>
              <a
                href="#bags"
                className="font-accent text-sm tracking-wide hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bags 👜
              </a>
              <a
                href="#makeup"
                className="font-accent text-sm tracking-wide hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Makeup 💄
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
