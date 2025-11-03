import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X, Package, Star, LogOut, Plus, Minus, Trash2, Home } from 'lucide-react';

const API_BASE = 'http://localhost';

const EcommerceFrontend = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Accessories', 'Sports'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isLoggedIn && authToken) {
      fetchCart();
    }
  }, [isLoggedIn, authToken]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products/`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setProducts([
          { id: 1, name: 'Wireless Headphones', price: 99.99, category: 'Electronics', description: 'Premium sound quality', stock: 15 },
          { id: 2, name: 'Smart Watch', price: 199.99, category: 'Electronics', description: 'Track your fitness', stock: 8 },
          { id: 3, name: 'Running Shoes', price: 79.99, category: 'Fashion', description: 'Comfortable and durable', stock: 20 },
          { id: 4, name: 'Coffee Maker', price: 149.99, category: 'Home', description: 'Brew perfect coffee', stock: 12 },
          { id: 5, name: 'Laptop Bag', price: 49.99, category: 'Accessories', description: 'Stylish and functional', stock: 25 },
          { id: 6, name: 'Bluetooth Speaker', price: 69.99, category: 'Electronics', description: 'Portable audio', stock: 18 }
        ]);
      }
    } catch (err) {
      setProducts([
        { id: 1, name: 'Wireless Headphones', price: 99.99, category: 'Electronics', description: 'Premium sound quality', stock: 15 },
        { id: 2, name: 'Smart Watch', price: 199.99, category: 'Electronics', description: 'Track your fitness', stock: 8 }
      ]);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_BASE}/cart/`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data.items || []);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE}/order/`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const filteredProducts = products.filter(p =>
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignup ? '/register' : '/login';
      const response = await fetch(`${API_BASE}/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      if (response.ok) {
        const data = await response.json();
        setAuthToken(data.token || 'demo-token');
        setUser({ email: loginEmail, name: loginEmail.split('@')[0] });
        setIsLoggedIn(true);
        setCurrentPage('home');
        setLoginEmail('');
        setLoginPassword('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setAuthToken(null);
    setCart([]);
    setOrders([]);
    setCurrentPage('home');
  };

  const addToCart = async (product) => {
    if (!isLoggedIn) {
      setError('Please login to add items to cart');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });

      if (response.ok) {
        await fetchCart();
      } else {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
          setCart(cart.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ));
        } else {
          setCart([...cart, { ...product, quantity: 1 }]);
        }
      }
    } catch (err) {
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        setCart(cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      await fetch(`${API_BASE}/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ productId, quantity })
      });
      await fetchCart();
    } catch (err) {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await fetch(`${API_BASE}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      await fetchCart();
    } catch (err) {
      setCart(cart.filter(item => item.id !== productId));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/order/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ items: cart })
      });

      if (response.ok) {
        setCart([]);
        await fetchOrders();
        setCurrentPage('orders');
      } else {
        const order = {
          id: orders.length + 1,
          items: [...cart],
          total: getTotalPrice(),
          date: new Date().toLocaleDateString(),
          status: 'Processing'
        };
        setOrders([...orders, order]);
        setCart([]);
        setCurrentPage('orders');
      }
    } catch (err) {
      const order = {
        id: orders.length + 1,
        items: [...cart],
        total: getTotalPrice(),
        date: new Date().toLocaleDateString(),
        status: 'Processing'
      };
      setOrders([...orders, order]);
      setCart([]);
      setCurrentPage('orders');
    } finally {
      setLoading(false);
    }
  };

  const getProductIcon = (category) => {
    const icons = {
      'Electronics': '🎧',
      'Fashion': '👟',
      'Home': '☕',
      'Accessories': '💼',
      'Sports': '💧'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setCurrentPage('home')}
              >
                <span className="text-3xl">🛍️</span>
                <h1 className="text-2xl font-bold">ShopHub</h1>
              </div>
            </div>

            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                  >
                    <Home size={20} />
                    <span>Home</span>
                  </button>
                  <button
                    onClick={() => { setCurrentPage('orders'); fetchOrders(); }}
                    className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                  >
                    <Package size={20} />
                    <span>Orders</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('cart')}
                    className="relative p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                  >
                    <ShoppingCart size={24} />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {cart.length}
                      </span>
                    )}
                  </button>
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg">
                    <User size={20} />
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setCurrentPage('login')}
                  className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition shadow-md"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {showMobileMenu && (
            <div className="lg:hidden mt-4 pt-4 border-t border-white border-opacity-30">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-full text-gray-800 focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
              </div>
              {isLoggedIn && (
                <div className="space-y-2">
                  <button
                    onClick={() => { setCurrentPage('home'); setShowMobileMenu(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                  >
                    <Home size={20} />
                    <span>Home</span>
                  </button>
                  <button
                    onClick={() => { setCurrentPage('orders'); setShowMobileMenu(false); fetchOrders(); }}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                  >
                    <Package size={20} />
                    <span>Orders</span>
                  </button>
                  <button
                    onClick={() => { setCurrentPage('cart'); setShowMobileMenu(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                  >
                    <ShoppingCart size={20} />
                    <span>Cart</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {currentPage === 'login' && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 inline-block">🛍️</span>
              <h2 className="text-3xl font-bold text-gray-800">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600 mt-2">
                {isSignup ? 'Join ShopHub today' : 'Sign in to continue shopping'}
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 shadow-lg"
              >
                {loading ? 'Loading...' : (isSignup ? 'Sign Up' : 'Login')}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => { setIsSignup(!isSignup); setError(''); }}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {isSignup ? 'Login' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'home' && (
        <div className="min-h-screen bg-gray-50">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">Welcome to ShopHub</h2>
              <p className="text-xl md:text-2xl mb-8 opacity-90">Discover amazing products at unbeatable prices</p>
              {!isLoggedIn && (
                <button
                  onClick={() => setCurrentPage('login')}
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
                >
                  Start Shopping
                </button>
              )}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full font-semibold transition shadow-sm ${selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 flex flex-col">
                  <div className="text-6xl text-center mb-4">{getProductIcon(product.category)}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 flex-grow">{product.description}</p>
                  <div className="flex items-center mb-3">
                    <Star className="text-yellow-400 fill-yellow-400" size={16} />
                    <span className="ml-1 text-sm text-gray-600 font-medium">4.5</span>
                    <span className="ml-3 text-sm text-gray-500">({product.stock} in stock)</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!isLoggedIn}
                      className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${isLoggedIn
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      <Plus size={16} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentPage === 'cart' && (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h2>

            {cart.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-16 text-center">
                <ShoppingCart size={80} className="mx-auto text-gray-300 mb-6" />
                <p className="text-2xl text-gray-600 mb-4">Your cart is empty</p>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                      <div className="flex items-center gap-6">
                        <div className="text-5xl">{getProductIcon(item.category)}</div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                          <p className="text-gray-600 mb-2">${item.price.toFixed(2)} each</p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateCartItem(item.id, item.quantity - 1)}
                              className="bg-gray-200 w-9 h-9 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="font-semibold text-lg min-w-[2rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartItem(item.id, item.quantity + 1)}
                              className="bg-gray-200 w-9 h-9 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600 mb-2">${(item.price * item.quantity).toFixed(2)}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition flex items-center gap-1 text-sm"
                          >
                            <Trash2 size={16} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-semibold">${getTotalPrice()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="text-green-600 font-semibold">Free</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">${getTotalPrice()}</span>
                      </div>
                    </div>
                    <button
                      onClick={placeOrder}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 shadow-lg"
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {currentPage === 'orders' && (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-16 text-center">
                <Package size={80} className="mx-auto text-gray-300 mb-6" />
                <p className="text-2xl text-gray-600 mb-4">No orders yet</p>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                        <p className="text-gray-600 mt-1">Placed on {order.date}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-3 mb-6">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center py-2">
                          <span className="flex items-center gap-3">
                            <span className="text-3xl">{getProductIcon(item.category)}</span>
                            <span className="font-medium">{item.name} x {item.quantity}</span>
                          </span>
                          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600">${order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EcommerceFrontend;