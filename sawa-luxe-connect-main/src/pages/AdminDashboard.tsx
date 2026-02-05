import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Menu,
  X,
  ShoppingBag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { products } from '@/data/products';
import { Product, Category } from '@/types/product';
import { fetchOrdersFromSheet } from '@/lib/googleSheets';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(price);
};

const categoryColors: Record<Category, string> = {
  jewelry: 'bg-primary/10 text-primary',
  bags: 'bg-accent/10 text-accent',
  makeup: 'bg-secondary/10 text-secondary',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {
    const data = await fetchOrdersFromSheet();
    if (data) setOrders(data);
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  // Check auth
  const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
  if (!isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock stats
  const stats = {
    totalProducts: products.length,
    lowStock: products.filter((p) => p.stock <= 3).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    featured: products.filter((p) => p.featured).length,
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Hafsa's Admin</h1>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:transform-none ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <h1 className="font-display text-xl font-bold">Hafsa's</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
          </div>

          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as typeof activeTab);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-display text-2xl font-bold mb-6">Dashboard Overview</h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-card rounded-xl p-5 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{stats.lowStock}</p>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-secondary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{formatPrice(stats.totalValue)}</p>
                  <p className="text-sm text-muted-foreground">Inventory Value</p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{stats.featured}</p>
                  <p className="text-sm text-muted-foreground">Featured Items</p>
                </div>
              </div>

              {/* Low Stock Alert */}
              {stats.lowStock > 0 && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-8">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Low Stock Alert</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stats.lowStock} products have 3 or fewer items in stock
                  </p>
                </div>
              )}

              {/* Recent Products Preview */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-semibold">Featured Products</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('products')}>
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.filter((p) => p.featured).slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="font-display text-2xl font-bold">Products</h2>
                <Button className="bg-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Products Table */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Product</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Price</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Stock</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b border-border last:border-0">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-sm">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${categoryColors[product.category]}`}>
                              {product.category}
                            </span>
                          </td>
                          <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                          <td className="p-4">
                            <span className={`text-sm ${product.stock <= 3 ? 'text-destructive font-medium' : ''}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">Orders</h2>
                <Button variant="ghost" size="sm" onClick={() => loadOrders()}>
                  <Search className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Location</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Items</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o: any) => (
                        <tr key={o.orderId || o.OrderID || o.timestamp} className="border-b border-border last:border-0">
                          <td className="p-4 text-sm">{o.orderId || o.OrderID || o.timestamp}</td>
                          <td className="p-4 text-sm">{o.name || o.CustomerName}</td>
                          <td className="p-4 text-sm">{o.phone || o.Phone}</td>
                          <td className="p-4 text-sm">{o.location || o.Location}</td>
                          <td className="p-4 text-sm max-w-xs">
                            {(o.items || o.Items || []).length ? (o.items || o.Items || []).map((it:any, idx:number) => (
                              <div key={idx} className="text-xs text-muted-foreground">{it.name || String(it)}</div>
                            )) : <div className="text-xs text-muted-foreground">—</div>}
                          </td>
                          <td className="p-4 text-sm">{o.total || o.Total}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground">No orders found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
