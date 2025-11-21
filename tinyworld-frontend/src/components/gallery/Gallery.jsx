import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import GalleryItem from './GalleryItem';
import ProductModal from './ProductModal';

const Gallery = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadProductsByCategory(selectedCategory);
    } else {
      loadAllProducts();
    }
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        categoryService.getAllCategories(),
        productService.getAllProducts(),
      ]);
      setCategories(categoriesData);
      setProducts(productsData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load gallery data');
      setLoading(false);
    }
  };

  const loadProductsByCategory = async (categoryId) => {
    try {
      const data = await productService.getProductsByCategory(categoryId);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const loadAllProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const handleCategoryChange = (value) => {
    if (value === 'all') {
      setSelectedCategory(null);
    } else {
      const category = categories.find(c => c.categoryId === Number(value));
      setSelectedCategory(category?.categoryId || null);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const getTabValue = () => {
    if (selectedCategory === null) return 'all';
    return String(selectedCategory);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-4">
          Our Collection
        </Badge>
        <h1 className="mb-4 text-3xl font-bold [text-wrap:balance] md:text-4xl lg:text-5xl">
          Product Gallery
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-base [text-wrap:balance] md:text-lg">
          Browse through our collection of handcrafted products, each one created with care and attention to detail.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center">
          {error}
        </div>
      )}

      {/* Category Tabs */}
      <div className="mb-8 flex justify-center">
        <Tabs value={getTabValue()} onValueChange={handleCategoryChange} className="w-full">
          <TabsList className="flex flex-wrap justify-center h-auto gap-1 max-w-4xl">
            <TabsTrigger value="all" className="whitespace-nowrap">All Products</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.categoryId} value={String(category.categoryId)} className="whitespace-nowrap">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <GalleryItem
              key={product.productId}
              product={product}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      )}

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Gallery;

