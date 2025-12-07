/**
 * Products Page
 * Displays all available products
 */

import type { Metadata } from 'next';
import { publicApi } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our collection of products',
};

export default async function ProductsPage() {
  let products = [];
  let error = null;

  try {
    products = await publicApi.getProducts(true);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load products';
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover innovative products and solutions for your needs.
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>Error: {error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {product.image_url && (
                  <div className="relative h-48 w-full bg-gray-200">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {product.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">
                        ${product.price}
                      </p>
                      {product.stock !== undefined && (
                        <p className="text-sm text-gray-500">
                          Stock: {product.stock}
                        </p>
                      )}
                    </div>
                    {product.category && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

