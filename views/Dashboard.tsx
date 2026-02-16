import React, { useState } from 'react';
import { useAppContext } from '../App';
import { CreditCard, History, TrendingUp, Package, Plus, Check, AlertCircle, Upload, Smartphone, ArrowRight, ShoppingCart, FileSpreadsheet, AlignLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import * as XLSX from 'xlsx';
import { Bundle, OrderStatus, Provider } from '../types';

const DashboardView: React.FC = () => {
  const { view } = useAppContext();

  switch (view) {
    case 'buy_data': return <PurchaseSubView />;
    case 'wallet': return <WalletSubView />;
    case 'orders': return <OrdersSubView />;
    case 'dashboard':
    default:
      return <DashboardHomeSubView />;
  }
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
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
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
    const { bundles, purchaseBundle } = useAppContext();
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

    const availableBundles = bundles.filter(b => b.provider === network);

    // --- Helpers ---
    const getProvider = (phone: string): Provider | null => {
        const p = phone.startsWith('0') ? phone.substring(0, 3) : '0' + phone.substring(0, 2);
        const mtn = ['024', '054', '055', '059', '025'];
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
            b.dataAmount.replace('GB', '').trim() === cleanAmount
        );
    };

    // --- Handlers ---
    const handleSinglePurchase = async () => {
        if (!selectedBundleId) return alert('Please select a data package');
        if (recipient.length < 10) return alert('Invalid phone number');
        if (recipient !== confirmRecipient) return alert('Phone numbers do not match');
        
        // Validate network prefix
        const detected = getProvider(recipient);
        if (detected && detected !== network) {
            if (!confirm(`The number ${recipient} seems to be ${detected}, but you selected ${network}. Continue?`)) return;
        }

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
        
        if (!confirm(`Process ${validItems.length} transactions? Total: GH₵${validItems.reduce((sum, item) => sum + item.bundle.price, 0).toFixed(2)}`)) return;

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
                                                {b.dataAmount} - GH₵{b.price.toFixed(2)} ({b.validity})
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
                                    <p className="text-xs text-gray-400 mt-1">Enter 10-digit Ghana number</p>
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
                                                        <span className="font-bold">{p.bundle.dataAmount} - GH₵{p.bundle.price}</span>
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
                                                <span>GH₵{preview.filter(p => p.valid).reduce((acc, c) => acc + c.bundle.price, 0).toFixed(2)}</span>
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
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>
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
              {transactions.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No transactions found</td></tr>
              ) : transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tx.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tx.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     {tx.type === 'PURCHASE' || tx.type === 'BULK_PURCHASE' ? (
                       <span className="flex items-center text-orange-600"><Package size={14} className="mr-1"/> Purchase</span>
                     ) : (
                       <span className="flex items-center text-green-600"><Plus size={14} className="mr-1"/> Deposit</span>
                     )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'DEPOSIT' ? '+' : '-'}GH₵{tx.amount.toFixed(2)}
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