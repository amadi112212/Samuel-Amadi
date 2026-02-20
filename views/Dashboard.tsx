import React, { useState } from 'react';
import { useAppContext } from '../App';
import { CreditCard, History, TrendingUp, Package, Plus, Check, AlertCircle, Upload, Smartphone, ArrowRight, ShoppingCart, FileSpreadsheet, AlignLeft, Info, Terminal, Search, Calendar, Filter, X, Phone, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import * as XLSX from 'xlsx';
import { Bundle, OrderStatus, Provider } from '../types';

const DashboardView: React.FC = () => {
  const { view, user } = useAppContext();

  // Switch between Agent view and Regular User view
  if (user?.parentId && view === 'dashboard') {
      return <AgentDashboardView />;
  }

  switch (view) {
    case 'buy_data': return <PurchaseSubView />;
    case 'wallet': return <WalletSubView />;
    case 'orders': return <OrdersSubView />;
    case 'dashboard':
    default:
      return <DashboardHomeSubView />;
  }
};

const AgentDashboardView = () => {
    const { user, transactions, setView, agentParent } = useAppContext();
    const recentOrders = transactions.slice(0, 5); // Show top 5

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-falcon-800 text-white p-6 rounded-xl shadow-lg">
                <div>
                    <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
                    <p className="text-falcon-200 mt-1">Agent Portal</p>
                </div>
                {agentParent?.shopSupportPhone && (
                    <div className="mt-4 md:mt-0 bg-white/10 px-4 py-2 rounded-lg flex items-center">
                        <Phone size={18} className="mr-2" />
                        <div>
                            <p className="text-xs text-falcon-200">Support Line</p>
                            <p className="font-bold">{agentParent.shopSupportPhone}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Important Notice */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex items-start">
                <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                <div>
                    <h3 className="text-red-800 font-bold">Important Notice</h3>
                    <p className="text-red-700 text-sm mt-1">
                        Our data bundles <strong>do not support</strong> EVD SIMs, Turbonet SIMs, or Broadband SIMs. Please ensure you are sending to a standard SIM card.
                        <span className="block mt-2 font-medium">Complaints should be sent within 24 hours, else they cannot be checked.</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Wallet Card */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-falcon-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-500 font-medium">Wallet Balance</h3>
                        <Wallet className="text-falcon-600" />
                    </div>
                    <p className="text-4xl font-bold text-gray-800">GH₵{user?.walletBalance.toFixed(2)}</p>
                    <button 
                        onClick={() => setView('wallet')}
                        className="mt-6 w-full bg-falcon-600 hover:bg-falcon-700 text-white py-3 rounded-lg font-bold"
                    >
                        Top Up Wallet
                    </button>
                 </div>

                 {/* Actions */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-falcon-100 flex flex-col justify-center space-y-4">
                     <button 
                        onClick={() => setView('buy_data')}
                        className="w-full bg-falcon-50 hover:bg-falcon-100 text-falcon-800 py-4 rounded-xl flex items-center justify-center space-x-3 transition-colors border border-falcon-200"
                     >
                         <div className="bg-white p-2 rounded-full shadow-sm"><Package size={24} /></div>
                         <span className="font-bold text-lg">Place New Order</span>
                     </button>
                     <button 
                        onClick={() => setView('orders')}
                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 py-4 rounded-xl flex items-center justify-center space-x-3 transition-colors border border-gray-200"
                     >
                         <div className="bg-white p-2 rounded-full shadow-sm"><History size={24} /></div>
                         <span className="font-bold text-lg">Transaction History</span>
                     </button>
                 </div>
            </div>

            {/* Recent History */}
            <div className="bg-white rounded-xl shadow-sm border border-falcon-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {recentOrders.length === 0 ? <p className="text-gray-500 text-sm">No recent activity.</p> : recentOrders.map(tx => (
                        <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                             <div>
                                 <p className="font-medium text-sm text-gray-900">{tx.description}</p>
                                 <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                             </div>
                             <div className="text-right">
                                <span className={`font-bold ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'DEPOSIT' ? '+' : '-'}GH₵{tx.amount.toFixed(2)}
                                </span>
                                <div className={`text-xs mt-1 ${tx.status === OrderStatus.COMPLETED ? 'text-green-600' : 'text-red-500'}`}>
                                    {tx.status}
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DashboardHomeSubView = () => {
  const { user, transactions, setView } = useAppContext();
  
  const recentOrders = transactions.filter(t => t.type === 'PURCHASE' || t.type === 'BULK_PURCHASE').slice(0, 3);
  
  // Mock data for spending chart
  const data = [
    { name: 'Mon', amt: 20 },
    { name: 'Tue', amt: 0 },
    { name: 'Wed', amt: 50 },
    { name: 'Thu', amt: 10 },
    { name: 'Fri', amt: 100 },
    { name: 'Sat', amt: 20 },
    { name: 'Sun', amt: 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* SIM Restriction Notification */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex items-start">
        <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="text-red-800 font-bold">Important Notice</h3>
          <p className="text-red-700 text-sm mt-1">
            Our data bundles <strong>do not support</strong> EVD SIMs, Turbonet SIMs, or Broadband SIMs. Please ensure you are sending to a standard SIM card.
            <span className="block mt-2 font-medium">Complaints should be sent within 24 hours, else they cannot be checked.</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-falcon-800 to-falcon-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-falcon-100 text-sm font-medium">Wallet Balance</p>
              <h2 className="text-3xl font-bold mt-1">GH₵{user?.walletBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
          <button 
            onClick={() => setView('wallet')}
            className="mt-6 w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Fund Wallet
          </button>
        </div>

        {/* Quick Actions */}
        <div className="md:col-span-2 grid grid-cols-3 gap-4">
           <button 
             onClick={() => setView('buy_data')}
             className="bg-white p-6 rounded-xl shadow-sm border border-falcon-100 hover:shadow-md transition-all flex flex-col items-center justify-center group"
            >
              <div className="bg-falcon-50 p-3 rounded-full mb-3 group-hover:bg-falcon-100">
                <Package className="h-8 w-8 text-falcon-600" />
              </div>
              <span className="font-semibold text-gray-800">Buy Data</span>
           </button>
           
           <button 
             onClick={() => setView('orders')}
             className="bg-white p-6 rounded-xl shadow-sm border border-falcon-100 hover:shadow-md transition-all flex flex-col items-center justify-center group"
            >
              <div className="bg-falcon-50 p-3 rounded-full mb-3 group-hover:bg-falcon-100">
                <History className="h-8 w-8 text-falcon-600" />
              </div>
              <span className="font-semibold text-gray-800">History</span>
           </button>
           
           <button 
             onClick={() => setView('console')}
             className="bg-white p-6 rounded-xl shadow-sm border border-falcon-100 hover:shadow-md transition-all flex flex-col items-center justify-center group"
            >
              <div className="bg-red-50 p-3 rounded-full mb-3 group-hover:bg-red-100">
                <Terminal className="h-8 w-8 text-red-600" />
              </div>
              <span className="font-semibold text-gray-800">Console</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-falcon-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Recent Purchases</h3>
            <button onClick={() => setView('orders')} className="text-sm text-falcon-600 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No recent purchases.</p>
            ) : recentOrders.map(tx => (
              <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-falcon-50 rounded-lg transition-colors border border-gray-100">
                 <div className="flex items-center space-x-3">
                   <div className="bg-falcon-100 p-2 rounded-full">
                     <TrendingUp size={16} className="text-falcon-700"/>
                   </div>
                   <div>
                     <p className="font-medium text-gray-800">{tx.description}</p>
                     <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="font-bold text-red-600">-GH₵{tx.amount.toFixed(2)}</p>
                   <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{tx.status}</span>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spending Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-falcon-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Usage Trends</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#E8F5E9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="amt" fill="#43A047" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const PurchaseSubView = () => {
    const { bundles, purchaseBundle, user, agentParent } = useAppContext();
    const [activeTab, setActiveTab] = useState<'single' | 'bulk_text' | 'bulk_excel'>('single');
    
    // Single Purchase State
    const [network, setNetwork] = useState<Provider>('MTN');
    const [selectedBundleId, setSelectedBundleId] = useState<string>('');
    const [recipient, setRecipient] = useState('');
    const [confirmRecipient, setConfirmRecipient] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Bulk State
    const [bulkInput, setBulkInput] = useState('');
    const [preview, setPreview] = useState<any[]>([]);

    // Filter bundles to show only standard ones for the selected network
    const availableBundles = bundles.filter(b => b.provider === network && b.category !== 'console');

    // Helper to get display price (handles agent override visually)
    const getPrice = (bundle: Bundle) => {
        if (user?.parentId && agentParent?.agentPrices?.[bundle.id]) {
            return agentParent.agentPrices[bundle.id];
        }
        return bundle.price;
    };

    // --- Helpers ---
    const getProvider = (phone: string): Provider | null => {
        const p = phone.startsWith('0') ? phone.substring(0, 3) : '0' + phone.substring(0, 2);
        const mtn = ['024', '054', '055', '059', '025', '053']; // Added 053
        const telecel = ['020', '050'];
        const at = ['027', '057', '026', '056'];

        if (mtn.includes(p)) return 'MTN';
        if (telecel.includes(p)) return 'Telecel';
        if (at.includes(p)) return 'AirtelTigo';
        return null;
    };

    const findBundle = (provider: Provider, amountStr: string) => {
        const cleanAmount = String(amountStr).toUpperCase().replace('GB', '').trim();
        return bundles.find(b => 
            b.provider === provider && 
            b.dataAmount.replace('GB', '').trim() === cleanAmount &&
            b.category !== 'console' // Ensure bulk doesn't pick console
        );
    };

    // --- Handlers ---
    const handleSinglePurchase = async () => {
        if (!selectedBundleId) return alert('Please select a data package');
        if (recipient.length < 10) return alert('Invalid phone number');
        if (recipient !== confirmRecipient) return alert('Phone numbers do not match');
        
        setIsSubmitting(true);
        const success = await purchaseBundle(selectedBundleId, recipient);
        setIsSubmitting(false);

        if (success) {
            alert('Order processed successfully!');
            setRecipient('');
            setConfirmRecipient('');
            setSelectedBundleId('');
        }
    };

    const parseBulkData = (input: string) => {
         const lines = input.split('\n').filter(l => l.trim().length > 0);
         return lines.map((line, idx) => {
            const trimmed = line.trim();
            // Match: "phone amount" or "phone,amount"
            const parts = trimmed.split(/[\s,]+/);
            
            if (parts.length < 2) {
                return { id: idx, raw: line, valid: false, error: 'Invalid format. Use: Phone Amount' };
            }

            const rawPhone = parts[0];
            const amount = parts[1];
            // Normalize phone
            const phone = rawPhone.startsWith('0') ? rawPhone : '0' + rawPhone;
            
            if (phone.length < 10) return { id: idx, phone, valid: false, error: 'Invalid Phone Length' };

            const provider = getProvider(phone);
            if (!provider) return { id: idx, phone, valid: false, error: 'Unknown Network Prefix' };

            const bundle = findBundle(provider, amount);
            if (!bundle) return { id: idx, phone, provider, amount, valid: false, error: `No ${provider} bundle for ${amount}GB` };

            return { id: idx, phone, provider, amount, bundle, valid: true };
         });
    };

    const handleBulkVerify = () => {
        setPreview(parseBulkData(bulkInput));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const arrayBuffer = evt.target?.result;
                const wb = XLSX.read(arrayBuffer, { type: 'array' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
                
                // Convert array of arrays to string format expected by parseBulkData
                // We assume Col A = Phone, Col B = Amount
                const text = data
                    .filter(row => row && row.length >= 2 && row[0] && row[1]) // Ensure row has data
                    .map(row => `${row[0]} ${row[1]}`)
                    .join('\n');
                
                setBulkInput(text);
                setPreview(parseBulkData(text));
                setActiveTab('bulk_text');
            };
            reader.readAsArrayBuffer(file);
        } else {
            // Text or CSV
            const text = await file.text();
            setBulkInput(text); // Set to text area for visibility
            setPreview(parseBulkData(text)); // Auto parse
            setActiveTab('bulk_text'); // Switch to text view to show preview
        }
    };

    const handleBulkProcess = async () => {
        const validItems = preview.filter(p => p.valid);
        if (validItems.length === 0) return;
        
        const totalCost = validItems.reduce((sum, item) => sum + getPrice(item.bundle), 0);
        
        if (!confirm(`Process ${validItems.length} transactions? Total: GH₵${totalCost.toFixed(2)}`)) return;

        setIsSubmitting(true);
        let successCount = 0;
        for (const item of validItems) {
             const result = await purchaseBundle(item.bundle.id, item.phone);
             if (result) successCount++;
        }
        setIsSubmitting(false);
        alert(`Processed ${successCount}/${validItems.length} orders successfully.`);
        setBulkInput('');
        setPreview([]);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-yellow-400 rounded-t-lg p-4 mb-0">
                <h2 className="text-xl font-bold text-gray-900">Regular Data Bundle Purchase</h2>
                <p className="text-gray-800 text-sm">Choose single or bulk order option</p>
            </div>
            
            <div className="bg-white rounded-b-lg shadow-md border border-gray-200 overflow-hidden min-h-[500px]">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    <button 
                        onClick={() => setActiveTab('single')}
                        className={`flex-1 py-4 text-center font-medium text-sm flex items-center justify-center space-x-2 ${activeTab === 'single' ? 'bg-white border-t-2 border-t-green-600 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <ShoppingCart size={18} />
                        <span>Single Order</span>
                    </button>
                    <button 
                         onClick={() => setActiveTab('bulk_text')}
                        className={`flex-1 py-4 text-center font-medium text-sm flex items-center justify-center space-x-2 ${activeTab === 'bulk_text' ? 'bg-white border-t-2 border-t-green-600 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <AlignLeft size={18} />
                        <span>Bulk (Text)</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('bulk_excel')}
                        className={`flex-1 py-4 text-center font-medium text-sm flex items-center justify-center space-x-2 ${activeTab === 'bulk_excel' ? 'bg-white border-t-2 border-t-green-600 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <FileSpreadsheet size={18} />
                        <span>Bulk (Excel)</span>
                    </button>
                </div>

                <div className="p-8">
                    {/* Single Order Form */}
                    {activeTab === 'single' && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Single Purchase</h3>
                                <p className="text-gray-500 text-sm">Fill the details below to proceed.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Network</label>
                                    <select 
                                        value={network}
                                        onChange={(e) => {
                                            setNetwork(e.target.value as Provider);
                                            setSelectedBundleId('');
                                        }}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                                    >
                                        <option value="MTN">MTN</option>
                                        <option value="Telecel">Telecel</option>
                                        <option value="AirtelTigo">AirtelTigo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Data Package</label>
                                    <select 
                                        value={selectedBundleId}
                                        onChange={(e) => setSelectedBundleId(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                                    >
                                        <option value="">Select a package</option>
                                        {availableBundles.map(b => (
                                            <option key={b.id} value={b.id}>
                                                {b.dataAmount} - GH₵{getPrice(b).toFixed(2)} ({b.validity})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Number</label>
                                    <input 
                                        type="tel"
                                        placeholder="e.g. 024XXXXXXX"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value.replace(/\D/g,'').slice(0,10))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Enter 10-digit Ghana number (Ported numbers allowed)</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Recipient</label>
                                    <input 
                                        type="tel"
                                        placeholder="Repeat number"
                                        value={confirmRecipient}
                                        onChange={(e) => setConfirmRecipient(e.target.value.replace(/\D/g,'').slice(0,10))}
                                        className={`w-full border rounded-md px-3 py-2.5 focus:ring-2 outline-none ${
                                            confirmRecipient && recipient !== confirmRecipient 
                                            ? 'border-red-300 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-green-500'
                                        }`}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Must match recipient number</p>
                                </div>
                            </div>

                            <button 
                                onClick={handleSinglePurchase}
                                disabled={isSubmitting}
                                className="w-full bg-falcon-800 hover:bg-falcon-900 text-white font-bold py-3 rounded-md shadow-md transition-colors flex items-center justify-center mt-6"
                            >
                                {isSubmitting ? 'Processing...' : (
                                    <>Proceed to Purchase <ArrowRight size={18} className="ml-2" /></>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Bulk Text & Preview */}
                    {activeTab === 'bulk_text' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Paste Numbers & Plans</label>
                                    <textarea 
                                        value={bulkInput}
                                        onChange={(e) => setBulkInput(e.target.value)}
                                        placeholder={`0240123456 1\n0501234567 2GB`}
                                        className="w-full h-64 border border-gray-300 rounded-md p-3 font-mono text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
                                    />
                                    <button 
                                        onClick={handleBulkVerify}
                                        className="mt-3 w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition-colors"
                                    >
                                        Verify Data
                                    </button>
                                </div>
                                <div className="border border-gray-200 rounded-md bg-gray-50 flex flex-col h-80 md:h-auto">
                                    <div className="p-3 border-b border-gray-200 bg-white font-semibold text-gray-700">Preview</div>
                                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                        {preview.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">No valid data yet.</p>}
                                        {preview.map((p, i) => (
                                            <div key={i} className={`text-xs p-2 rounded border ${p.valid ? 'bg-white border-green-200' : 'bg-red-50 border-red-200 text-red-600'}`}>
                                                {p.valid ? (
                                                    <div className="flex justify-between">
                                                        <span>{p.phone} ({p.provider})</span>
                                                        <span className="font-bold">{p.bundle.dataAmount} - GH₵{getPrice(p.bundle).toFixed(2)}</span>
                                                    </div>
                                                ) : (
                                                    <span>{p.raw || p.phone} - {p.error}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {preview.some(p => p.valid) && (
                                        <div className="p-3 border-t border-gray-200 bg-white">
                                            <div className="flex justify-between font-bold text-sm mb-2">
                                                <span>Total:</span>
                                                <span>GH₵{preview.filter(p => p.valid).reduce((acc, c) => acc + getPrice(c.bundle), 0).toFixed(2)}</span>
                                            </div>
                                            <button 
                                                onClick={handleBulkProcess}
                                                disabled={isSubmitting}
                                                className="w-full bg-falcon-700 text-white py-2 rounded font-bold hover:bg-falcon-800"
                                            >
                                                {isSubmitting ? 'Processing...' : 'Process Order'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bulk Excel Upload */}
                    {activeTab === 'bulk_excel' && (
                        <div className="flex flex-col items-center justify-center py-12 animate-fade-in border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                             <FileSpreadsheet size={48} className="text-gray-400 mb-4" />
                             <h3 className="text-lg font-medium text-gray-900">Upload Excel, CSV or Text File</h3>
                             <p className="text-sm text-gray-500 mb-6">Format: Column A (Phone), Column B (Amount)</p>
                             
                             <label className="cursor-pointer bg-falcon-600 text-white px-6 py-2 rounded-md font-medium hover:bg-falcon-700 transition-colors shadow-sm">
                                 <span>Choose File</span>
                                 <input type="file" accept=".csv,.txt,.xlsx,.xls" className="hidden" onChange={handleFileUpload} />
                             </label>
                             <p className="text-xs text-gray-400 mt-4">Supported files: .xlsx, .xls, .csv, .txt</p>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-200 text-center text-xs text-gray-500">
                    Tip: Double-check numbers before submitting to avoid failed orders.
                </div>
            </div>
        </div>
    );
};

const WalletSubView = () => {
  const { user, topUpWallet, transactions } = useAppContext();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amount);
    if (!val || val <= 0) return;

    setLoading(true);
    await topUpWallet(val);
    setLoading(false);
    setAmount('');
    alert('Wallet funded successfully!');
  };

  const walletTx = transactions.filter(t => t.type === 'DEPOSIT');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-falcon-100">
        <div className="bg-falcon-900 p-6 text-white text-center">
          <p className="opacity-80 text-sm uppercase tracking-wider mb-1">Current Balance</p>
          <h1 className="text-4xl font-bold">GH₵{user?.walletBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h1>
        </div>
        <div className="p-8">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">Top Up Wallet</h3>
          <form onSubmit={handleTopUp} className="flex flex-col sm:flex-row gap-4">
             <div className="flex-grow relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">GH₵</span>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Enter amount (e.g. 50)"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falcon-500 focus:border-transparent outline-none"
                  required
                />
             </div>
             <button 
               type="submit" 
               disabled={loading}
               className="bg-falcon-600 hover:bg-falcon-700 text-white px-8 py-3 rounded-lg font-bold shadow-sm transition-colors disabled:opacity-50 min-w-[140px]"
             >
               {loading ? 'Funding...' : 'Fund Now'}
             </button>
          </form>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-xl text-gray-800 mb-4">Funding History</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {walletTx.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No deposit history found.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {walletTx.map(tx => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {tx.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">
                      +GH₵{tx.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const OrdersSubView = () => {
  const { transactions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'PURCHASE' | 'DEPOSIT'>('ALL');
  
  const filteredTransactions = transactions.filter(tx => {
    const searchLower = searchTerm.toLowerCase();
    // Check ID, Description (which contains Phone and GB), and Amount
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchLower) || 
      tx.description.toLowerCase().includes(searchLower) ||
      tx.amount.toString().includes(searchLower);

    // Date check (YYYY-MM-DD string match)
    // tx.date is ISO string, so startsWith works for YYYY-MM-DD
    const matchesDate = dateFilter ? tx.date.startsWith(dateFilter) : true;
    
    // Type Check
    let matchesType = true;
    if (typeFilter === 'PURCHASE') {
      matchesType = (tx.type === 'PURCHASE' || tx.type === 'BULK_PURCHASE' || tx.type === 'CONSOLE_TOPUP' || tx.type === 'CONSOLE_TRANSFER');
    } else if (typeFilter === 'DEPOSIT') {
      matchesType = (tx.type === 'DEPOSIT' || tx.type === 'ADMIN_CREDIT');
    }

    return matchesSearch && matchesDate && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
         <div className="flex flex-col md:flex-row gap-4">
             {/* Search Input */}
             <div className="flex-grow relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search Number, ID, or GB..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falcon-500 outline-none"
                 />
                 {searchTerm && (
                     <button 
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                     >
                         <X size={14} />
                     </button>
                 )}
             </div>

             {/* Date Filter */}
             <div className="relative">
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                    type="date" 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falcon-500 outline-none bg-white text-gray-600 w-full md:w-auto"
                 />
             </div>

             {/* Type Filter */}
             <div className="relative">
                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falcon-500 outline-none bg-white appearance-none cursor-pointer w-full md:w-auto text-gray-600"
                 >
                     <option value="ALL">All Types</option>
                     <option value="PURCHASE">Purchases</option>
                     <option value="DEPOSIT">Deposits</option>
                 </select>
             </div>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-falcon-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-falcon-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No transactions match your search.</td></tr>
              ) : filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-medium text-gray-900">{new Date(tx.date).toLocaleDateString()}</p>
                    <div className="text-xs text-gray-400">{new Date(tx.date).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div>{tx.description}</div>
                    <div className="text-xs text-gray-400 font-mono mt-1">ID: {tx.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     {tx.type === 'PURCHASE' || tx.type === 'BULK_PURCHASE' || tx.type === 'CONSOLE_TRANSFER' ? (
                       <span className="flex items-center text-orange-600"><Package size={14} className="mr-1"/> Order</span>
                     ) : tx.type === 'CONSOLE_TOPUP' ? (
                        <span className="flex items-center text-blue-600"><Terminal size={14} className="mr-1"/> Topup</span>
                     ) : (
                       <span className="flex items-center text-green-600"><Plus size={14} className="mr-1"/> Deposit</span>
                     )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${tx.type === 'DEPOSIT' || tx.type === 'ADMIN_CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'DEPOSIT' || tx.type === 'ADMIN_CREDIT' ? '+' : '-'}
                    {tx.type === 'CONSOLE_TRANSFER' ? `${tx.amount} GB` : `GH₵${tx.amount.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      tx.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' : 
                      tx.status === OrderStatus.FAILED ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;