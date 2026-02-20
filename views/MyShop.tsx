import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { Bundle } from '../types';
import { Save, DollarSign, ExternalLink, Copy, AlertCircle, Users, Phone } from 'lucide-react';

const MyShopView: React.FC = () => {
    const { user, bundles, updateShopSettings, cashoutProfit, viewShop } = useAppContext();
    const [shopName, setShopName] = useState(user?.shopName || '');
    const [supportPhone, setSupportPhone] = useState(user?.shopSupportPhone || '');
    // Using string | number to allow clearing the input (empty string)
    const [prices, setPrices] = useState<Record<string, string | number>>({});
    const [agentPrices, setAgentPrices] = useState<Record<string, string | number>>({});
    const [saving, setSaving] = useState(false);
    const [cashingOut, setCashingOut] = useState(false);

    useEffect(() => {
        if(user) {
            setShopName(user.shopName || `${user.username}'s Shop`);
            setSupportPhone(user.shopSupportPhone || '');
            setPrices(user.shopPrices || {});
            setAgentPrices(user.agentPrices || {});
        }
    }, [user]);

    const handlePriceChange = (bundleId: string, value: string) => {
        setPrices(prev => ({...prev, [bundleId]: value}));
    };

    const handleAgentPriceChange = (bundleId: string, value: string) => {
        setAgentPrices(prev => ({...prev, [bundleId]: value}));
    };

    const handleSave = async () => {
        setSaving(true);
        const cleanPrices: Record<string, number> = {};
        const cleanAgentPrices: Record<string, number> = {};
        let errorMsg = null;

        // Validate Public Prices
        for (const [key, val] of Object.entries(prices)) {
             if (val === '') continue; // Skip empty, will reset to default
             
             const num = parseFloat(val.toString());
             if (!isNaN(num)) {
                 const bundle = bundles.find(b => b.id === key);
                 if (bundle && num < bundle.price) {
                     errorMsg = `Public Price for ${bundle.name} cannot be less than base price (GH₵${bundle.price.toFixed(2)})`;
                     break;
                 }
                 cleanPrices[key] = num;
             }
        }

        if (errorMsg) {
            setSaving(false);
            alert(errorMsg);
            return;
        }

        // Validate Agent Prices
        for (const [key, val] of Object.entries(agentPrices)) {
             if (val === '') continue; // Skip empty
             
             const num = parseFloat(val.toString());
             if (!isNaN(num)) {
                 const bundle = bundles.find(b => b.id === key);
                 if (bundle && num < bundle.price) {
                     errorMsg = `Agent Price for ${bundle.name} cannot be less than base price (GH₵${bundle.price.toFixed(2)})`;
                     break;
                 }
                 cleanAgentPrices[key] = num;
             }
        }

        if (errorMsg) {
            setSaving(false);
            alert(errorMsg);
            return;
        }

        await updateShopSettings(shopName, cleanPrices, cleanAgentPrices, supportPhone);
        setSaving(false);
        alert('Shop settings saved successfully!');
    };

    const handleCashout = async () => {
        if(!user || user.profitBalance <= 0) return;
        setCashingOut(true);
        await cashoutProfit();
        setCashingOut(false);
        alert('Profit cashed out to wallet!');
    };

    const copyAgentLink = () => {
        // In a real app this would be the actual URL. Here we simulate it.
        const url = `falcon.com/shop/${user?.username}`;
        navigator.clipboard.writeText(url);
        alert("Shop Link Copied! Send this to users to sign up as your agents.");
    };

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-falcon-100">
                    <h2 className="text-gray-500 font-medium text-sm">Total Profit</h2>
                    <p className="text-3xl font-bold text-green-600 mt-2">GH₵{user.profitBalance.toFixed(2)}</p>
                    <button 
                        onClick={handleCashout}
                        disabled={user.profitBalance <= 0 || cashingOut}
                        className="mt-4 w-full bg-falcon-700 hover:bg-falcon-800 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cashingOut ? 'Processing...' : 'Cashout to Wallet'}
                    </button>
                </div>

                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-falcon-100">
                    <h2 className="text-gray-800 font-bold text-lg mb-4">Shop Settings</h2>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-grow">
                             <label className="block text-xs font-bold text-gray-500 mb-1">SHOP NAME</label>
                             <input 
                                value={shopName}
                                onChange={e => setShopName(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-falcon-500 outline-none"
                                placeholder="My Awesome Data Shop"
                             />
                        </div>
                        <div className="flex-grow">
                             <label className="block text-xs font-bold text-gray-500 mb-1">SUPPORT / COMPLAINT NUMBER</label>
                             <div className="relative">
                                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    value={supportPhone}
                                    onChange={e => setSupportPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    className="w-full border border-gray-300 rounded p-2 pl-8 focus:ring-2 focus:ring-falcon-500 outline-none"
                                    placeholder="024XXXXXXX"
                                />
                             </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 bg-gray-100 p-3 rounded text-sm text-gray-600 flex items-center justify-between">
                            <span className="font-mono overflow-hidden text-ellipsis whitespace-nowrap mr-2">falcon.com/shop/{user.username}</span>
                            <div className="flex space-x-1">
                                <button 
                                    onClick={copyAgentLink}
                                    className="text-gray-500 hover:text-falcon-600 p-1"
                                    title="Copy Link for Agents"
                                >
                                    <Copy size={16} />
                                </button>
                                <button 
                                    onClick={() => viewShop(user.username)}
                                    className="text-gray-500 hover:text-falcon-600 p-1"
                                    title="Preview Shop"
                                >
                                    <ExternalLink size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center text-xs text-falcon-600 bg-falcon-50 px-3 py-2 rounded border border-falcon-100">
                             <Users size={16} className="mr-2" />
                             Share link for users to sign up as your agents
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Configuration */}
            <div className="bg-white rounded-xl shadow-sm border border-falcon-100 overflow-hidden">
                <div className="bg-falcon-50 p-4 border-b border-falcon-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-800">Set Your Prices</h3>
                        <p className="text-xs text-gray-500">Prices cannot be lower than the base price. Clear input to reset.</p>
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-falcon-600 hover:bg-falcon-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                    >
                        <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bundle</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-blue-50">Public Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-green-50">Agent Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Est. Profit</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bundles.map(bundle => {
                                // Logic: If not set in state, default to bundle price. 
                                // But if user clears input, state becomes empty string.
                                const publicPriceVal = prices[bundle.id] !== undefined ? prices[bundle.id] : bundle.price;
                                const agentPriceVal = agentPrices[bundle.id] !== undefined ? agentPrices[bundle.id] : bundle.price;
                                
                                const publicPriceNum = parseFloat(publicPriceVal.toString()) || 0;
                                const agentPriceNum = parseFloat(agentPriceVal.toString()) || 0;
                                
                                // Calculate validity for UI feedback
                                const isPublicInvalid = (publicPriceVal !== '' && publicPriceVal !== undefined && publicPriceNum < bundle.price);
                                const isAgentInvalid = (agentPriceVal !== '' && agentPriceVal !== undefined && agentPriceNum < bundle.price);

                                const profitPublic = publicPriceNum - bundle.price;
                                const profitAgent = agentPriceNum - bundle.price;
                                return (
                                    <tr key={bundle.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{bundle.name}</div>
                                            <div className="text-xs text-gray-500">{bundle.provider} - {bundle.dataAmount}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            GH₵{bundle.price.toFixed(2)}
                                        </td>
                                        {/* Public Price Input */}
                                        <td className="px-6 py-4 whitespace-nowrap bg-blue-50/30">
                                            <div className="relative w-28">
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">GH₵</span>
                                                <input 
                                                    type="number" 
                                                    step="0.01"
                                                    min={bundle.price}
                                                    value={publicPriceVal}
                                                    onChange={e => handlePriceChange(bundle.id, e.target.value)}
                                                    className={`w-full border rounded pl-8 pr-2 py-1 text-sm focus:ring-1 outline-none ${
                                                        isPublicInvalid 
                                                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50' 
                                                        : 'border-gray-300 focus:ring-falcon-500'
                                                    }`}
                                                    placeholder={bundle.price.toFixed(2)}
                                                />
                                            </div>
                                        </td>
                                        {/* Agent Price Input */}
                                        <td className="px-6 py-4 whitespace-nowrap bg-green-50/30">
                                            <div className="relative w-28">
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">GH₵</span>
                                                <input 
                                                    type="number" 
                                                    step="0.01"
                                                    min={bundle.price}
                                                    value={agentPriceVal}
                                                    onChange={e => handleAgentPriceChange(bundle.id, e.target.value)}
                                                    className={`w-full border rounded pl-8 pr-2 py-1 text-sm focus:ring-1 outline-none ${
                                                        isAgentInvalid 
                                                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50' 
                                                        : 'border-gray-300 focus:ring-falcon-500'
                                                    }`}
                                                    placeholder={bundle.price.toFixed(2)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            <div className={profitPublic >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                Pub: {profitPublic.toFixed(2)}
                                            </div>
                                            <div className={profitAgent >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                Agt: {profitAgent.toFixed(2)}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyShopView;