import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { Bundle, Provider, User } from '../types';
import { Trash2, PlusCircle, Edit, Users, Package, Check } from 'lucide-react';

const AdminView: React.FC = () => {
  const { bundles, addBundle, deleteBundle, getUsers } = useAppContext();
  const [activeTab, setActiveTab] = useState<'bundles' | 'users'>('bundles');
  const [users, setUsers] = useState<User[]>([]);
  
  // Bundle Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Bundle>>({
    name: '',
    provider: 'MTN',
    price: 0,
    dataAmount: '',
    validity: '',
    description: ''
  });

  useEffect(() => {
      if (activeTab === 'users') {
          fetchUsers();
      }
  }, [activeTab]);

  const fetchUsers = async () => {
      const fetched = await getUsers();
      setUsers(fetched);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.provider) return;
    
    setIsSubmitting(true);
    await addBundle({
      id: `b${Date.now()}`,
      provider: formData.provider!,
      name: formData.name!,
      price: Number(formData.price),
      dataAmount: formData.dataAmount || '0GB',
      validity: formData.validity || 'Daily',
      description: formData.description || ''
    });
    setIsSubmitting(false);
    
    setIsFormOpen(false);
    setFormData({ name: '', provider: 'MTN', price: 0, dataAmount: '', validity: '', description: '' });
  };

  const handleDelete = async (id: string) => {
      if(confirm('Are you sure you want to delete this bundle?')) {
          await deleteBundle(id);
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
           <p className="text-gray-500 mt-1">Manage platform resources.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('bundles')}
            className={`px-6 py-3 font-medium text-sm flex items-center space-x-2 border-b-2 transition-colors ${activeTab === 'bundles' ? 'border-falcon-600 text-falcon-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
              <Package size={18} />
              <span>Bundles</span>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium text-sm flex items-center space-x-2 border-b-2 transition-colors ${activeTab === 'users' ? 'border-falcon-600 text-falcon-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
              <Users size={18} />
              <span>Users</span>
          </button>
      </div>

      {/* Bundles Content */}
      {activeTab === 'bundles' && (
        <div className="animate-fade-in">
            <div className="flex justify-end mb-4">
                 <button 
                    onClick={() => setIsFormOpen(true)}
                    className="bg-falcon-700 hover:bg-falcon-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md transition-colors"
                >
                    <PlusCircle size={20} />
                    <span>Add Bundle</span>
                </button>
            </div>

            {isFormOpen && (
                <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-falcon-200">
                <h3 className="text-lg font-bold mb-4">Create New Bundle</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                        <select 
                            className="border p-2 rounded w-full" 
                            value={formData.provider} 
                            onChange={e => setFormData({...formData, provider: e.target.value as Provider})}
                        >
                            <option value="MTN">MTN</option>
                            <option value="Telecel">Telecel</option>
                            <option value="AirtelTigo">AirtelTigo</option>
                        </select>
                    </div>
                    <input className="border p-2 rounded" placeholder="Bundle Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    <input className="border p-2 rounded" placeholder="Price (GH₵)" type="number" step="0.01" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                    <input className="border p-2 rounded" placeholder="Data Amount (e.g. 5GB)" value={formData.dataAmount} onChange={e => setFormData({...formData, dataAmount: e.target.value})} required />
                    <input className="border p-2 rounded" placeholder="Validity (e.g. Monthly)" value={formData.validity} onChange={e => setFormData({...formData, validity: e.target.value})} required />
                    <textarea className="border p-2 rounded md:col-span-2" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    <div className="md:col-span-2 flex space-x-3 justify-end">
                    <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-falcon-600 text-white rounded hover:bg-falcon-700 disabled:opacity-50">
                        {isSubmitting ? 'Saving...' : 'Save Bundle'}
                    </button>
                    </div>
                </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-falcon-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {bundles.map(bundle => (
                    <tr key={bundle.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs font-bold px-2 py-1 rounded text-white ${
                                bundle.provider === 'MTN' ? 'bg-yellow-500' : 
                                bundle.provider === 'Telecel' ? 'bg-red-500' : 'bg-blue-500'
                            }`}>{bundle.provider}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{bundle.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{bundle.dataAmount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-bold">GH₵{bundle.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{bundle.validity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDelete(bundle.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors">
                            <Trash2 size={16} />
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
      )}

      {/* Users Content */}
      {activeTab === 'users' && (
          <div className="animate-fade-in bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-falcon-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(u => (
                    <tr key={u.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.phoneNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-700">GH₵{u.walletBalance.toFixed(2)}</td>
                    </tr>
                    ))}
                    {users.length === 0 && (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">No users found.</td></tr>
                    )}
                </tbody>
             </table>
          </div>
      )}
    </div>
  );
};

export default AdminView;