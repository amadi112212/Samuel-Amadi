import React from 'react';
import { useAppContext } from '../App';
import { CheckCircle, Zap, Shield, Code, Server, Smartphone, Globe, ArrowRight } from 'lucide-react';
import { INITIAL_BUNDLES, PUBLIC_BUNDLES } from '../constants';

const PublicViews: React.FC = () => {
  const { view, setView, user } = useAppContext();

  if (view === 'docs' && user) return <ApiDocs />;

  // Landing Page
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-falcon-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Data That Moves <span className="text-falcon-400">As Fast As You</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-falcon-100 mb-8">
            Affordable, high-speed data bundles for MTN, Telecel, and AirtelTigo. Seamless connectivity with instant activation.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setView('signup')}
              className="bg-falcon-500 hover:bg-falcon-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all transform hover:scale-105"
            >
              Get Started
            </button>
            <button 
              onClick={() => setView('login')}
              className="bg-transparent border-2 border-falcon-400 text-falcon-100 hover:text-white hover:border-white px-8 py-3 rounded-lg font-semibold text-lg transition-all"
            >
              Login to Agent Portal
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-falcon-900">Why Choose Falcon Network?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Zap} 
            title="Instant Activation" 
            desc="Purchased data is credited to your device immediately after payment confirmation." 
          />
          <FeatureCard 
            icon={Shield} 
            title="Secure Payments" 
            desc="Your wallet and transactions are protected with industry-standard encryption." 
          />
          <FeatureCard 
            icon={Smartphone} 
            title="All Networks" 
            desc="Support for MTN, Telecel, and AirtelTigo across all devices." 
          />
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-falcon-900 mb-4">Standard Data Rates</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Below are our standard rates. Want to save more? 
            <button onClick={() => setView('signup')} className="text-falcon-600 font-bold hover:underline ml-1">
               Create an Agent Account
            </button> for exclusive wholesale pricing starting at GH₵4.10/GB!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PUBLIC_BUNDLES.map(bundle => (
              <div key={bundle.id} className="bg-falcon-50 rounded-xl p-6 shadow-md border border-falcon-100 hover:shadow-xl transition-shadow flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-falcon-200 text-falcon-800 text-xs px-2 py-1 rounded-bl-lg font-bold">
                    GUEST
                </div>
                <h3 className="text-xl font-bold text-falcon-800">{bundle.name}</h3>
                <div className="my-4">
                  <span className="text-4xl font-extrabold text-falcon-900">GH₵{bundle.price.toFixed(2)}</span>
                </div>
                <div className="space-y-2 mb-6 flex-grow">
                  <div className="flex items-center text-gray-600">
                    <CheckCircle size={16} className="text-falcon-500 mr-2" /> {bundle.provider}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckCircle size={16} className="text-falcon-500 mr-2" /> {bundle.dataAmount} Data
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckCircle size={16} className="text-falcon-500 mr-2" /> {bundle.validity} Validity
                  </div>
                </div>
                <button 
                  onClick={() => setView('signup')}
                  className="w-full bg-white border border-falcon-600 text-falcon-700 py-2 rounded-md hover:bg-falcon-50 transition-colors font-medium mb-2"
                >
                  Buy Now
                </button>
                <div className="text-center text-xs text-falcon-600">
                   <span className="font-semibold">Agent Price:</span> GH₵{(bundle.price * 0.75).toFixed(2)}*
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
              <button 
                onClick={() => setView('signup')}
                className="inline-flex items-center bg-falcon-700 hover:bg-falcon-800 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-colors"
              >
                  Unlock Wholesale Rates <ArrowRight size={18} className="ml-2" />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-falcon-100 text-center">
    <div className="inline-flex items-center justify-center p-3 bg-falcon-100 rounded-full text-falcon-800 mb-4">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

const ApiDocs: React.FC = () => (
  <div className="max-w-5xl mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold text-falcon-900 mb-4">API Documentation</h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Integrate Falcon Network services directly into your own applications.
      </p>
    </div>

    <div className="space-y-12">
      {/* Auth Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Shield className="mr-2 text-falcon-600" /> Authentication
        </h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <span className="bg-falcon-600 text-white px-2 py-1 rounded text-xs font-bold uppercase mr-2">Header</span>
            <code className="text-sm text-falcon-800 font-mono">Authorization: Bearer &lt;YOUR_API_KEY&gt;</code>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">All API requests must be authenticated using a Bearer token.</p>
          </div>
        </div>
      </section>

      {/* Purchase Endpoint */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Code className="mr-2 text-falcon-600" /> Purchase Bundle
        </h2>
        <div className="bg-slate-900 rounded-lg shadow-lg overflow-hidden text-white">
          <div className="bg-slate-800 px-6 py-3 flex items-center">
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold uppercase mr-3">POST</span>
            <code className="font-mono text-sm">/api/v1/purchase</code>
          </div>
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-gray-400 text-xs uppercase font-bold mb-2">Request Body</h4>
              <pre className="font-mono text-sm text-blue-300">
{`{
  "bundle_id": "mtn1",
  "phone_number": "0244123456"
}`}
              </pre>
            </div>
            <div>
              <h4 className="text-gray-400 text-xs uppercase font-bold mb-2">Response (200 OK)</h4>
              <pre className="font-mono text-sm text-green-400">
{`{
  "status": "success",
  "transaction_id": "tx_123456789",
  "message": "1GB Data sent to 0244123456"
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default PublicViews;