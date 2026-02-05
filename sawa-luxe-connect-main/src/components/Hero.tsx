import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-jewelry.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury jewelry collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-chocolate/90 via-chocolate/70 to-chocolate/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary font-accent text-sm tracking-wide">Eastleigh's Finest Curations</span>
          </motion.div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-ivory leading-tight mb-6">
            Elegance
            <span className="block text-gradient-gold">Delivered</span>
          </h1>

          {/* Subtitle */}
          <p className="text-ivory/80 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
            Discover our handpicked collection of jewelry, designer bags, and premium makeup. 
            Shop from Sawa Mall and receive at your doorstep.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-gold-light shadow-gold transition-all duration-300"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Shop Collection
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-ivory/30 text-ivory hover:bg-ivory/10 backdrop-blur-sm"
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Categories
            </Button>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex items-center gap-6 text-ivory/60 text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-whatsapp rounded-full animate-pulse" />
              Same-day Eastleigh delivery
            </span>
            <span>•</span>
            <span>100% Authentic</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">WhatsApp Support</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, y: { repeat: Infinity, duration: 2 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ivory/50"
      >
        <ArrowDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
};

export default Hero;
