import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Home, 
  ShoppingBag, 
  Wallet, 
  List, 
  ShieldCheck, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { AppContextType, ViewState, User, Bundle, Transaction, UserRole } from './types';
import { api } from './lib/backend';
import PublicViews from './views/Public';
import AuthView from './views/Auth';
import DashboardView from './views/Dashboard';
import AdminView from './views/Admin';
import AIChat from './components/AIChat';

// Create Context
export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within App");
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewState>('landing');
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initial Data Fetch
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      // Check session
      const currentUser = await api.auth.getSession();
      if (currentUser) {
        setUser(currentUser);
        setView(currentUser.role === UserRole.ADMIN ? 'admin' : 'dashboard');
      }
      
      // Load bundles regardless of auth (for public pricing)
      const fetchedBundles = await api.data.getBundles();
      setBundles(fetchedBundles);
      
      setIsLoading(false);
    };
    init();
  }, []);

  // Fetch user data when user changes
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        // Refresh bundles (in case of admin updates)
        const b = await api.data.getBundles();
        setBundles(b);

        // Fetch user specific transactions
        if (user.role === UserRole.USER) {
           const txs = await api.wallet.getTransactions(user.id);
           setTransactions(txs);
           
           // Refresh user balance (backend source of truth)
           const refreshedUser = await api.auth.getSession();
           if(refreshedUser) setUser(refreshedUser);
        }
      };
      fetchData();
    } else {
        setTransactions([]);
    }
  }, [user?.id, view]); // Re-fetch on view change to keep data fresh

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await api.auth.login(email, password);
    if (res.user) {
        setUser(res.user);
        setView(res.user.role === UserRole.ADMIN ? 'admin' : 'dashboard');
        return true;
    }
    alert(res.error || 'Login failed');
    return false;
  };

  const register = async (name: string, email: string, password: string, username: string, phoneNumber: string): Promise<boolean> => {
      const res = await api.auth.register(name, email, password, username, phoneNumber);
      if (res.user) {
          // Auto login after register
          await login(email, password);
          return true;
      }
      alert(res.error || 'Registration failed');
      return false;
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
    setView('landing');
  };

  const addBundle = async (bundle: Bundle) => {
    await api.data.addBundle(bundle);
    const updated = await api.data.getBundles();
    setBundles(updated);
  };

  const deleteBundle = async (id: string) => {
    await api.data.deleteBundle(id);
    const updated = await api.data.getBundles();
    setBundles(updated);
  };

  const purchaseBundle = async (bundleId: string, phoneNumber?: string): Promise<boolean> => {
    if (!user) return false;
    
    const res = await api.data.purchase(user.id, bundleId, phoneNumber);
    if (res.success) {
        // Refresh Data
        const txs = await api.wallet.getTransactions(user.id);
        setTransactions(txs);
        // Update local user balance immediately for UI responsiveness, fetch real later
        const b = bundles.find(x => x.id === bundleId);
        if(b) setUser(prev => prev ? ({...prev, walletBalance: prev.walletBalance - b.price}) : null);
        
        return true;
    } else {
        alert(res.error || 'Purchase failed');
        return false;
    }
  };

  const topUpWallet = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    
    const success = await api.wallet.topUp(user.id, amount);
    if (success) {
        // Refresh Data
        const txs = await api.wallet.getTransactions(user.id);
        setTransactions(txs);
        setUser(prev => prev ? ({...prev, walletBalance: prev.walletBalance + amount}) : null);
        return true;
    }
    return false;
  };

  const getUsers = async () => {
      return await api.users.getAll();
  };

  // Render logic based on view state
  const renderView = () => {
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-falcon-600"></div>
            </div>
        );
    }

    switch (view) {
      case 'landing':
        return <PublicViews />;
      case 'login':
      case 'signup':
        return <AuthView />;
      case 'docs':
        return user ? <PublicViews /> : <AuthView />;
      case 'dashboard':
      case 'buy_data':
      case 'wallet':
      case 'orders':
        return user ? <DashboardView /> : <AuthView />;
      case 'admin':
        return user?.role === UserRole.ADMIN ? <AdminView /> : <AuthView />;
      default:
        return <PublicViews />;
    }
  };

  return (
    <AppContext.Provider value={{
      user, view, isLoading, setView, login, register, logout, bundles, transactions,
      addBundle, deleteBundle, purchaseBundle, topUpWallet, getUsers
    }}>
      <div className="min-h-screen flex flex-col bg-falcon-50 text-gray-800">
        <Navigation />
        <main className="flex-grow">
          {renderView()}
        </main>
        <Footer />
        <AIChat />
      </div>
    </AppContext.Provider>
  );
};

const Navigation: React.FC = () => {
  const { user, view, setView, logout } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const NavLink = ({ target, label, icon: Icon }: { target: ViewState, label: string, icon?: any }) => (
    <button
      onClick={() => {
        setView(target);
        setIsOpen(false);
      }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
        view === target ? 'bg-falcon-700 text-white' : 'text-falcon-100 hover:bg-falcon-800 hover:text-white'
      }`}
    >
      {Icon && <Icon size={18} />}
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="bg-falcon-900 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView(user ? 'dashboard' : 'landing')}>
            <div className="bg-white p-1.5 rounded-full mr-2">
               <ShieldCheck className="h-6 w-6 text-falcon-900" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Falcon Network</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {!user && <NavLink target="landing" label="Home" icon={Home} />}
              
              {user && user.role === UserRole.USER && (
                <>
                  <NavLink target="dashboard" label="Dashboard" icon={Home} />
                  <NavLink target="buy_data" label="Buy Data" icon={ShoppingBag} />
                  <NavLink target="wallet" label="Wallet" icon={Wallet} />
                  <NavLink target="orders" label="Orders" icon={List} />
                  <NavLink target="docs" label="API Docs" icon={FileText} />
                </>
              )}
              
              {user && user.role === UserRole.ADMIN && (
                <NavLink target="admin" label="Admin Panel" icon={ShieldCheck} />
              )}
            </div>
          </div>

          <div className="hidden md:block">
            {user ? (
               <div className="flex items-center space-x-4">
                 <div className="text-falcon-100 text-sm text-right">
                    <p className="font-medium text-white">{user.name}</p>
                    {user.role === UserRole.USER && (
                        <p className="text-falcon-400">Bal: GH₵{user.walletBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                    )}
                 </div>
                 <button 
                  onClick={logout}
                  className="bg-falcon-800 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  title="Logout"
                 >
                   <LogOut size={18} />
                 </button>
               </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button onClick={() => setView('login')} className="text-white hover:text-falcon-100 px-3 py-2">Login</button>
                <button onClick={() => setView('signup')} className="bg-falcon-500 hover:bg-falcon-600 text-white px-4 py-2 rounded-md font-medium transition-colors">Sign Up</button>
              </div>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-falcon-800 inline-flex items-center justify-center p-2 rounded-md text-falcon-100 hover:text-white hover:bg-falcon-700 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-falcon-800 pb-3 pt-2 px-2 space-y-1 sm:px-3 shadow-lg">
          {!user && (
            <>
              <NavLink target="landing" label="Home" icon={Home} />
              <button onClick={() => { setView('login'); setIsOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-falcon-700">Login</button>
              <button onClick={() => { setView('signup'); setIsOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-falcon-700">Sign Up</button>
            </>
          )}
          {user && (
            <>
              <div className="px-3 py-2 text-white border-b border-falcon-700 mb-2">
                <p className="font-bold">{user.name}</p>
                <p className="text-sm text-falcon-200">Balance: GH₵{user.walletBalance.toLocaleString()}</p>
              </div>
              {user.role === UserRole.USER ? (
                <>
                  <NavLink target="dashboard" label="Dashboard" icon={Home} />
                  <NavLink target="buy_data" label="Buy Data" icon={ShoppingBag} />
                  <NavLink target="wallet" label="Wallet" icon={Wallet} />
                  <NavLink target="orders" label="History" icon={List} />
                  <NavLink target="docs" label="API Docs" icon={FileText} />
                </>
              ) : (
                 <NavLink target="admin" label="Admin Panel" icon={ShieldCheck} />
              )}
              <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-200 hover:bg-red-800 hover:text-white">
                <LogOut size={18} /> <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-falcon-900 text-falcon-100 py-8 mt-auto">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p>&copy; {new Date().getFullYear()} Falcon Network. All rights reserved.</p>
      <div className="mt-2 flex justify-center space-x-4 text-sm">
        <span className="hover:text-white cursor-pointer">Privacy Policy</span>
        <span className="hover:text-white cursor-pointer">Terms of Service</span>
        <span className="hover:text-white cursor-pointer">Support</span>
      </div>
    </div>
  </footer>
);

export default App;