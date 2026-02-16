import React, { useState } from 'react';
import { useAppContext } from '../App';

const AuthView: React.FC = () => {
  const { view, setView, login, register } = useAppContext();
  const isLogin = view === 'login';
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      if (!name || !username || !phoneNumber) {
          alert("All fields are required");
          setLoading(false);
          return;
      }
      success = await register(name, email, password, username, phoneNumber);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-falcon-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-falcon-100">
        <div className="bg-falcon-900 py-6 text-center">
          <h2 className="text-2xl font-bold text-white">{isLogin ? 'Welcome Back' : 'Join Falcon Network'}</h2>
          <p className="text-falcon-200 text-sm mt-1">{isLogin ? 'Log in to manage your data.' : 'Create an account to get started.'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {!isLogin && (
            <>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-falcon-500 focus:border-falcon-500"
                    placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input 
                    type="text" 
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-falcon-500 focus:border-falcon-500"
                    placeholder="johndoe123"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input 
                    type="tel" 
                    required 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-falcon-500 focus:border-falcon-500"
                    placeholder="024XXXXXXX"
                    />
                </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-falcon-500 focus:border-falcon-500"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-falcon-500 focus:border-falcon-500"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-falcon-600 hover:bg-falcon-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-falcon-500 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="px-8 pb-8 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => {
                setView(isLogin ? 'signup' : 'login');
                setEmail('');
                setPassword('');
                setName('');
                setUsername('');
                setPhoneNumber('');
              }}
              className="font-medium text-falcon-600 hover:text-falcon-500"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
          <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-500 text-left">
            <p><strong>Demo Credentials:</strong></p>
            <p>User: user@falcon.com / password</p>
            <p>Admin: admin@falcon.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;