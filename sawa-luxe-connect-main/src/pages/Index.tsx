import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoryNav from '@/components/CategoryNav';
import ProductGrid from '@/components/ProductGrid';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { Category } from '@/types/product';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <CategoryNav
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <ProductGrid category={activeCategory} />
      </main>
      <Footer />
      <Cart />
    </div>
  );
};

export default Index;
