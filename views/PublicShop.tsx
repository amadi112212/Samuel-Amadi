import React, { useState } from 'react';
import { useAppContext } from '../App';
import { ShoppingBag, ArrowLeft, CheckCircle, Smartphone, UserPlus, X, Phone, AlertCircle, LogIn } from 'lucide-react';
import { Provider } from '../types';

const PublicShopView: React.FC = () => {
    const { currentShopOwner: owner, bundles, setView, purchaseFromShop, register, login } = useAppContext();
    const [selectedBundleId, setSelectedBundleId] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [network, setNetwork] = useState<Provider>('MTN');
    const [processing, setProcessing] = useState(false);
    
    // Sign Up Modal State
    const [showSignup, setShowSignup] = useState(false);
    const [suName, setSuName] = useState('');
    const [suEmail, setSuEmail] = useState('');
    const [suPhone, setSuPhone] = useState('');
    const [suUsername, setSuUsername] = useState('');
    const [suPassword, setSuPassword] = useState('');
    const [suLoading, setSuLoading] = useState(false);

    // Login Modal State
    const [showLogin, setShowLogin] = useState(false);
    const [lEmail, setLEmail] = useState('');
    const [lPassword, setLPassword] = useState('');
    const [lLoading, setLLoading] = useState(false);

    if (!owner) return <div className="p-8 text-center">Shop not found</div>;

    // Filter bundles by network
    const displayBundles = bundles.filter(b => b.provider === network);

    const handlePurchase = async () => {
        if (!selectedBundleId || !phoneNumber || phoneNumber.length < 10) {
            alert("Please fill all fields correctly");
            return;
        }
        
        const bundle = bundles.find(b => b.id === selectedBundleId);
        if(!bundle) return;

        // Custom Price lookup
        const price = owner.shopPrices?.[selectedBundleId] || bundle.price;

        if(!confirm(`Confirm Purchase:\n${bundle.name}\nPrice: GH₵${price.toFixed(2)}\nNumber: ${phoneNumber}`)) return;

        setProcessing(true);
        // Simulate external payment + purchase
        const success = await purchaseFromShop(owner.id, selectedBundleId, phoneNumber);
        setProcessing(false);

        if(success) {
            alert(`Success! Data bundle sent to ${phoneNumber}.`);
            setPhoneNumber('');
            setSelectedBundleId('');
        }
    };

    const handleAgentSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuLoading(true);
        // Register passing the owner.id as parentId
        const success = await register(suName, suEmail, suPassword, suUsername, suPhone, owner.id);
        setSuLoading(false);
        
        if (success) {
            alert(`Account created! You are now an agent for ${owner.name}.`);
            setShowSignup(false);
            // The App context will auto-login and switch view to Dashboard
        }
    };

    const handleAgentLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLLoading(true);
        const success = await login(lEmail, lPassword);
        setLLoading(false);
        if (success) {
            setShowLogin(false);
            // App context handles redirection to dashboard
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* Shop Header */}
            <div className="bg-falcon-900 text-white pb-20 pt-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => setView('landing')} className="flex items-center text-falcon-200 hover:text-white mb-4 text-sm">
                        <ArrowLeft size={16} className="mr-1"/> Back to Falcon Network
                    </button>
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-center md:text-left mb-4 md:mb-0">
                            <div className="inline-flex items-center justify-center p-3 bg-falcon-800 rounded-full mb-3">
                                <ShoppingBag size={24} />
                            </div>
                            <h1 className="text-3xl font-bold">{owner.shopName || `${owner.username}'s Shop`}</h1>
                            <div className="flex flex-col md:flex-row md:items-center text-falcon-200 mt-1 text-sm">
                                <span>Trusted Data Bundle Reseller</span>
                                {owner.shopSupportPhone && (
                                    <>
                                        <span className="hidden md:inline mx-2">•</span>
                                        <span className="flex items-center justify-center md:justify-start">
                                            <Phone size={14} className="mr-1" /> Help: {owner.shopSupportPhone}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={() => setShowLogin(true)}
                                className="text-white hover:bg-white/10 px-5 py-2 rounded-full font-bold transition-colors flex items-center justify-center border border-falcon-700 hover:border-falcon-500"
                            >
                                <LogIn size={18} className="mr-2" /> Agent Login
                            </button>
                            <button 
                                onClick={() => setShowSignup(true)}
                                className="bg-white text-falcon-900 hover:bg-falcon-50 px-6 py-2 rounded-full font-bold shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
                            >
                                <UserPlus size={18} className="mr-2" /> Become an Agent
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 -mt-12">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
                    
                    {/* Important Notice */}
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg flex items-start">
                        <div className="mr-3 flex-shrink-0"><AlertCircle className="text-red-500" size={20} /></div>
                        <div>
                            <h3 className="text-red-800 font-bold text-sm">Important Notice</h3>
                            <p className="text-red-700 text-sm mt-1">
                                Our data bundles <strong>do not support</strong> EVD SIMs, Turbonet SIMs, or Broadband SIMs. Please ensure you are sending to a standard SIM card.
                                <span className="block mt-2 font-medium">Complaints should be sent within 24 hours, else they cannot be checked.</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Form */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Buy Data Bundle</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Network</label>
                                    <div className="flex gap-2">
                                        {(['MTN', 'Telecel', 'AirtelTigo'] as Provider[]).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => { setNetwork(p); setSelectedBundleId(''); }}
                                                className={`flex-1 py-2 text-sm rounded border ${
                                                    network === p 
                                                    ? 'bg-falcon-50 border-falcon-500 text-falcon-700 font-bold' 
                                                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Select Package</label>
                                    <select 
                                        value={selectedBundleId}
                                        onChange={(e) => setSelectedBundleId(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-falcon-500 outline-none bg-white"
                                    >
                                        <option value="">-- Choose Bundle --</option>
                                        {displayBundles.map(b => {
                                            const price = owner.shopPrices?.[b.id] || b.price;
                                            return (
                                                <option key={b.id} value={b.id}>
                                                    {b.dataAmount} - GH₵{price.toFixed(2)} ({b.validity})
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <Smartphone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            placeholder="024XXXXXXX"
                                            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-falcon-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <button 
                                    onClick={handlePurchase}
                                    disabled={processing}
                                    className="w-full bg-falcon-600 hover:bg-falcon-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors mt-2"
                                >
                                    {processing ? 'Processing Payment...' : 'Pay & Activate'}
                                </button>
                                
                                <p className="text-center text-xs text-gray-400 mt-2">
                                    Secure payment powered by Falcon Network
                                </p>
                            </div>
                        </div>

                        {/* Preview / Info */}
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-col justify-center text-center">
                            <div className="mb-6">
                                <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Why Buy From Us?</h4>
                                <ul className="text-sm text-gray-600 space-y-2 text-left inline-block">
                                    <li className="flex items-center"><CheckCircle size={16} className="text-green-500 mr-2" /> Instant Delivery</li>
                                    <li className="flex items-center"><CheckCircle size={16} className="text-green-500 mr-2" /> Best Prices</li>
                                    <li className="flex items-center"><CheckCircle size={16} className="text-green-500 mr-2" /> Secure Transaction</li>
                                </ul>
                            </div>
                            <div className="mt-auto">
                                <div className="text-xs text-gray-400">Powered by</div>
                                <div className="font-bold text-gray-600">Falcon Network</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Signup Modal */}
            {showSignup && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-fade-in">
                        <div className="bg-falcon-900 px-6 py-4 flex justify-between items-center text-white">
                            <h3 className="font-bold">Sign Up as Agent</h3>
                            <button onClick={() => setShowSignup(false)} className="hover:text-falcon-200">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Create an account to access special agent pricing from <strong>{owner.shopName || owner.name}</strong>.
                            </p>
                            <form onSubmit={handleAgentSignup} className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-500">FULL NAME</label>
                                    <input required value={suName} onChange={e=>setSuName(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="John Doe" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500">USERNAME</label>
                                        <input required value={suUsername} onChange={e=>setSuUsername(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="user123" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500">PHONE</label>
                                        <input required value={suPhone} onChange={e=>setSuPhone(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="024XXXXXXX" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500">EMAIL</label>
                                    <input required type="email" value={suEmail} onChange={e=>setSuEmail(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="email@example.com" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500">PASSWORD</label>
                                    <input required type="password" value={suPassword} onChange={e=>setSuPassword(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="••••••••" />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={suLoading}
                                    className="w-full bg-falcon-700 hover:bg-falcon-800 text-white font-bold py-2 rounded mt-2 disabled:opacity-50"
                                >
                                    {suLoading ? 'Creating Account...' : 'Register as Agent'}
                                </button>
                            </form>
                            <div className="mt-4 text-center text-xs text-gray-500">
                                Already have an account? <button onClick={() => { setShowSignup(false); setShowLogin(true); }} className="text-falcon-600 font-bold hover:underline">Log in</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Login Modal */}
            {showLogin && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden animate-fade-in">
                        <div className="bg-falcon-900 px-6 py-4 flex justify-between items-center text-white">
                            <h3 className="font-bold">Agent Login</h3>
                            <button onClick={() => setShowLogin(false)} className="hover:text-falcon-200">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Log in to your agent dashboard.
                            </p>
                            <form onSubmit={handleAgentLogin} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500">EMAIL</label>
                                    <input required type="email" value={lEmail} onChange={e=>setLEmail(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="email@example.com" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500">PASSWORD</label>
                                    <input required type="password" value={lPassword} onChange={e=>setLPassword(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="••••••••" />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={lLoading}
                                    className="w-full bg-falcon-700 hover:bg-falcon-800 text-white font-bold py-2 rounded mt-2 disabled:opacity-50"
                                >
                                    {lLoading ? 'Logging in...' : 'Log In'}
                                </button>
                            </form>
                            <div className="mt-4 text-center text-xs text-gray-500">
                                Don't have an account? <button onClick={() => { setShowLogin(false); setShowSignup(true); }} className="text-falcon-600 font-bold hover:underline">Sign up</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicShopView;