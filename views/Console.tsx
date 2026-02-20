import React, { useState } from 'react';
import { useAppContext } from '../App';
import { Terminal, ArrowLeft, CheckCircle, Smartphone, Wifi, Package, CreditCard, Send, Server, Database } from 'lucide-react';
import { CONSOLE_TRANSFER_OPTIONS } from '../constants';

const ConsoleView: React.FC = () => {
  const { bundles, purchaseBundle, user, setView, transferConsoleData } = useAppContext();
  const [activeTab, setActiveTab] = useState<'distribute' | 'topup'>('distribute');
  
  // State for Distribution
  const [recipient, setRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [distributing, setDistributing] = useState(false);

  // State for Topup
  const [selectedTopupId, setSelectedTopupId] = useState<string>('');
  const [toppingUp, setToppingUp] = useState(false);

  // Filter for console bundles (for topup)
  const topupBundles = bundles.filter(b => b.category === 'console' && b.provider === 'AirtelTigo');

  // --- Handlers ---

  const handleTopup = async () => {
      if (!selectedTopupId) return;
      const bundle = topupBundles.find(b => b.id === selectedTopupId);
      if (!bundle) return;

      if (!user || user.walletBalance < bundle.price) {
          alert('Insufficient wallet balance to buy this console credit.');
          return;
      }

      if(!confirm(`Buy ${bundle.dataAmount} of Console Credit for GH₵${bundle.price.toFixed(2)}?`)) return;

      setToppingUp(true);
      const success = await purchaseBundle(selectedTopupId);
      setToppingUp(false);
      
      if (success) {
          alert('Console Balance Updated!');
          setSelectedTopupId('');
          setActiveTab('distribute'); // Switch back to dashboard
      }
  };

  const handleDistribute = async () => {
      if (!transferAmount || !recipient) return;
      if (recipient.length < 10) return alert('Invalid phone number');

      if (!['027', '057', '026', '056'].some(prefix => recipient.startsWith(prefix))) {
        if(!confirm("The number does not start with standard AirtelTigo prefixes. Continue?")) return;
      }

      if ((user?.consoleBalance || 0) < transferAmount) {
          alert('Insufficient Console Balance. Please Top Up.');
          return;
      }

      setDistributing(true);
      const success = await transferConsoleData(transferAmount, recipient);
      setDistributing(false);

      if (success) {
          alert(`Successfully sent ${transferAmount}GB to ${recipient}`);
          setRecipient('');
          setTransferAmount(0);
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
       {/* Header */}
       <div className="bg-gray-900 text-white py-6 px-4 shadow-lg border-b border-red-700">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                    <button 
                        onClick={() => setView('dashboard')}
                        className="mr-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-mono font-bold tracking-tight text-red-500 flex items-center">
                            <Terminal className="mr-2" /> AIRTELTIGO CONSOLE
                        </h1>
                        <p className="text-gray-500 text-xs font-mono">SECURE GATEWAY v2.0</p>
                    </div>
                </div>
                
                {/* Balance Display */}
                <div className="bg-gray-800 rounded-lg p-3 px-6 border border-gray-700 flex items-center shadow-inner">
                    <div className="mr-6 text-right border-r border-gray-600 pr-6">
                        <div className="text-xs text-gray-400 font-bold uppercase">Console Credit</div>
                        <div className="text-3xl font-mono font-bold text-red-500">
                            {user?.consoleBalance?.toFixed(1) || '0.0'} <span className="text-sm">GB</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-bold uppercase">Wallet Funds</div>
                        <div className="text-xl font-mono font-bold text-white">
                            GH₵{user?.walletBalance.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
       </div>

       {/* Tabs */}
       <div className="bg-white shadow-sm border-b border-gray-200">
           <div className="max-w-6xl mx-auto flex">
               <button 
                onClick={() => setActiveTab('distribute')}
                className={`px-8 py-4 font-bold text-sm flex items-center space-x-2 border-b-2 transition-colors ${
                    activeTab === 'distribute' 
                    ? 'border-red-600 text-red-600 bg-red-50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
               >
                   <Send size={18} />
                   <span>DISTRIBUTE DATA</span>
               </button>
               <button 
                onClick={() => setActiveTab('topup')}
                className={`px-8 py-4 font-bold text-sm flex items-center space-x-2 border-b-2 transition-colors ${
                    activeTab === 'topup' 
                    ? 'border-red-600 text-red-600 bg-red-50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
               >
                   <Database size={18} />
                   <span>BUY CREDIT (TOPUP)</span>
               </button>
           </div>
       </div>

       {/* Content */}
       <div className="flex-grow p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                
                {/* DISTRIBUTE VIEW */}
                {activeTab === 'distribute' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                                    <Wifi size={20} className="mr-2 text-red-600"/> Recipient Details
                                </h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Recipient Number (AirtelTigo)</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                                            <input 
                                                type="tel"
                                                value={recipient}
                                                onChange={(e) => setRecipient(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none font-mono text-xl tracking-widest"
                                                placeholder="027XXXXXXX"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Select Data Amount</label>
                                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                            {CONSOLE_TRANSFER_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setTransferAmount(opt.value)}
                                                    className={`py-3 rounded border font-mono font-bold transition-all ${
                                                        transferAmount === opt.value
                                                        ? 'bg-red-600 text-white border-red-600 shadow-md'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:bg-red-50'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Transaction Summary</h3>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Recipient:</span>
                                        <span className="font-mono font-medium">{recipient || '---'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Payload:</span>
                                        <span className="font-mono font-medium">{transferAmount ? `${transferAmount}GB` : '---'}</span>
                                    </div>
                                    <div className="h-px bg-gray-200 my-2"></div>
                                    <div className="flex justify-between items-center font-bold">
                                        <span className="text-gray-800">Deduction:</span>
                                        <span className="text-red-600">{transferAmount ? `${transferAmount} GB` : '0 GB'}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleDistribute}
                                    disabled={distributing || !recipient || !transferAmount || ((user?.consoleBalance || 0) < transferAmount)}
                                    className={`w-full py-4 rounded font-bold tracking-wider transition-all shadow-lg flex items-center justify-center ${
                                        distributing || !recipient || !transferAmount || ((user?.consoleBalance || 0) < transferAmount)
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-red-500/30'
                                    }`}
                                >
                                    {distributing ? (
                                        <span className="animate-pulse">PROCESSING...</span>
                                    ) : (
                                        <>
                                            <Send size={18} className="mr-2" />
                                            SEND DATA
                                        </>
                                    )}
                                </button>
                                {transferAmount > (user?.consoleBalance || 0) && (
                                    <p className="text-red-500 text-xs text-center mt-3 font-bold">Insufficient Console Credit</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* TOPUP VIEW */}
                {activeTab === 'topup' && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-800">Buy Console Credit</h2>
                            <p className="text-gray-500 mt-2">Purchase bulk data to stock up your console balance.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topupBundles.map(bundle => (
                                <div 
                                    key={bundle.id}
                                    onClick={() => setSelectedTopupId(bundle.id)}
                                    className={`cursor-pointer bg-white rounded-xl p-6 border-2 transition-all hover:shadow-xl ${
                                        selectedTopupId === bundle.id
                                        ? 'border-red-600 shadow-lg scale-105'
                                        : 'border-transparent hover:border-gray-200 shadow-md'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                                            <Server size={24} />
                                        </div>
                                        {selectedTopupId === bundle.id && (
                                            <CheckCircle className="text-red-600" size={24} />
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-mono font-bold text-gray-900">{bundle.dataAmount}</h3>
                                    <p className="text-gray-500 text-sm mb-6">{bundle.description}</p>
                                    <div className="flex items-end justify-between">
                                        <div className="text-3xl font-bold text-red-600">GH₵{bundle.price.toLocaleString()}</div>
                                        <div className="text-xs text-gray-400 font-mono">NO EXPIRY</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={handleTopup}
                                disabled={!selectedTopupId || toppingUp}
                                className={`px-12 py-4 rounded-full font-bold text-lg shadow-lg transition-all flex items-center ${
                                    !selectedTopupId || toppingUp
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-900 text-white hover:bg-black hover:scale-105'
                                }`}
                            >
                                {toppingUp ? 'PROCESSING PAYMENT...' : 'CONFIRM PURCHASE'} <CreditCard className="ml-2" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
       </div>
    </div>
  );
};

export default ConsoleView;