import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { products } from '@/data/products';
import { Category } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  category: Category | 'all';
}

const ProductGrid = ({ category }: ProductGridProps) => {
  const filteredProducts = useMemo(() => {
    if (category === 'all') return products;
    return products.filter((p) => p.category === category);
  }, [category]);

  return (
    <section id="products" className="py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {category === 'all' ? 'All Products' : `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`}
            </h2>
            <p className="text-muted-foreground">
              {filteredProducts.length} exquisite items available
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
