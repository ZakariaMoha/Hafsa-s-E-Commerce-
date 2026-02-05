import { motion } from 'framer-motion';
import { categories } from '@/data/products';
import { Category } from '@/types/product';
import categoryJewelry from '@/assets/category-jewelry.jpg';
import categoryBags from '@/assets/category-bags.jpg';
import categoryMakeup from '@/assets/category-makeup.jpg';

const categoryImages: Record<Category, string> = {
  jewelry: categoryJewelry,
  bags: categoryBags,
  makeup: categoryMakeup,
};

interface CategoryNavProps {
  activeCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
}

const CategoryNav = ({ activeCategory, onCategoryChange }: CategoryNavProps) => {
  return (
    <section id="categories" className="py-16 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Explore our curated collections of luxury items
          </p>
        </motion.div>

        {/* Category Pills - Mobile Horizontal Scroll */}
        <div className="flex md:hidden gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          <button
            onClick={() => onCategoryChange('all')}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full font-accent text-sm tracking-wide transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-gold'
                : 'bg-card border border-border hover:border-primary'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full font-accent text-sm tracking-wide transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-gold'
                  : 'bg-card border border-border hover:border-primary'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Category Cards - Desktop */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onCategoryChange(cat.id)}
              className={`group relative overflow-hidden rounded-2xl aspect-[4/3] transition-all duration-300 ${
                activeCategory === cat.id ? 'ring-4 ring-primary ring-offset-4' : ''
              }`}
            >
              {/* Background Image */}
              <img
                src={categoryImages[cat.id]}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-chocolate/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-4xl mb-2">{cat.icon}</span>
                <h3 className="font-display text-2xl font-bold text-ivory mb-1">
                  {cat.name}
                </h3>
                <p className="text-ivory/70 text-sm">
                  {cat.description}
                </p>
              </div>

              {/* Active indicator */}
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;
