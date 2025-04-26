import { useState } from 'react';
import { Search, Grid, FileText, Users, LogOut, Plus, Edit2, Trash2, Filter, ArrowLeft, ArrowRight, LayoutGrid, List } from 'lucide-react';

export default function ProductUI() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const products = [
    { id: 1, name: 'Galaxy S21', category: 'Mobile Phone', stock: 50, image: '/api/placeholder/220/140' },
    { id: 2, name: 'Pixel 7 Pro', category: 'Mobile Phone', stock: 5, image: '/api/placeholder/220/140' },
    { id: 3, name: 'iPhone', category: 'Mobile Phone', stock: 12, image: '/api/placeholder/220/140' },
    { id: 4, name: 'Xiaomi', category: 'Mobile Phone', stock: 2, image: '/api/placeholder/220/140' },
    { id: 5, name: 'OnePlus', category: 'Mobile Phone', stock: 1, image: '/api/placeholder/220/140' },
    { id: 6, name: 'iPhone 14', category: 'Mobile Phone', stock: 10, image: '/api/placeholder/220/140' },
    { id: 7, name: 'iPhone SE', category: 'Mobile Phone', stock: 12, image: '/api/placeholder/220/140' },
    { id: 8, name: 'Galaxy Note', category: 'Mobile Phone', stock: 1, image: '/api/placeholder/220/140' }
  ];
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">SmartGear</h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50">
                <Grid size={18} className="mr-3" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-white bg-blue-600 rounded-lg">
                <Grid size={18} className="mr-3" />
                <span>Products</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50">
                <FileText size={18} className="mr-3" />
                <span>Orders</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50">
                <Users size={18} className="mr-3" />
                <span>Users</span>
              </a>
            </li>
          </ul>
          
          <div className="pt-8 mt-8 border-t border-gray-200">
            <a href="#" className="flex items-center px-4 py-3 text-red-600 rounded-lg hover:bg-red-50">
              <LogOut size={18} className="mr-3" />
              <span>Logout</span>
            </a>
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Mobile Phones</h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button 
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={20} className="text-gray-600" />
              </button>
              <button 
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} className="text-gray-600" />
              </button>
            </div>
            
            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={18} className="mr-2" />
              Add Product
            </button>
          </div>
        </header>
        
        <main className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                    <div className="flex items-center mt-2">
                      <span className="text-gray-500 text-sm">In stock:</span>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{product.stock}</span>
                    </div>
                    
                    <div className="flex mt-4 space-x-2">
                      <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-md transition-colors font-medium">
                        Edit
                      </button>
                      <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-md transition-colors font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="p-4 font-medium text-gray-600">Image</th>
                    <th className="p-4 font-medium text-gray-600">Name</th>
                    <th className="p-4 font-medium text-gray-600">Category</th>
                    <th className="p-4 font-medium text-gray-600">Stock</th>
                    <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="w-16 h-12 overflow-hidden rounded bg-gray-100">
                          <img 
                            src={product.image || '/api/placeholder/220/140'} 
                            alt="Product Image" 
                            className="w-full h-full object-cover" 
                            onError={(e) => e.target.src = '/api/placeholder/220/140'}
                          />
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-800">{product.name}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors inline-flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit
                          </button>
                          <button 
                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors inline-flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-1">
              <button 
                className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ArrowLeft size={16} />
              </button>
              
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-md">2</button>
              
              <button 
                className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-200"
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ArrowRight size={16} />
              </button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
}