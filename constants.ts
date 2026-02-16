import { Bundle, Transaction, UserRole, OrderStatus } from './types';

export const PUBLIC_BUNDLES: Bundle[] = [
  { id: 'pub_1gb', provider: 'MTN', name: 'Standard 1GB', price: 5.50, dataAmount: '1GB', validity: 'No Expiry', description: 'Standard Rate' },
  { id: 'pub_2gb', provider: 'MTN', name: 'Standard 2GB', price: 11.00, dataAmount: '2GB', validity: 'No Expiry', description: 'Standard Rate' },
  { id: 'pub_3gb', provider: 'MTN', name: 'Standard 3GB', price: 15.00, dataAmount: '3GB', validity: 'No Expiry', description: 'Standard Rate' },
  { id: 'pub_4gb', provider: 'MTN', name: 'Standard 4GB', price: 20.00, dataAmount: '4GB', validity: 'No Expiry', description: 'Standard Rate' },
];

export const INITIAL_BUNDLES: Bundle[] = [
  // MTN Bundles
  { id: 'mtn_1gb', provider: 'MTN', name: 'MTN 1GB', price: 4.10, dataAmount: '1GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_2gb', provider: 'MTN', name: 'MTN 2GB', price: 8.20, dataAmount: '2GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_3gb', provider: 'MTN', name: 'MTN 3GB', price: 12.30, dataAmount: '3GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_4gb', provider: 'MTN', name: 'MTN 4GB', price: 16.40, dataAmount: '4GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_5gb', provider: 'MTN', name: 'MTN 5GB', price: 20.40, dataAmount: '5GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_6gb', provider: 'MTN', name: 'MTN 6GB', price: 24.40, dataAmount: '6GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_8gb', provider: 'MTN', name: 'MTN 8GB', price: 32.60, dataAmount: '8GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_10gb', provider: 'MTN', name: 'MTN 10GB', price: 39.00, dataAmount: '10GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_15gb', provider: 'MTN', name: 'MTN 15GB', price: 57.00, dataAmount: '15GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_20gb', provider: 'MTN', name: 'MTN 20GB', price: 77.00, dataAmount: '20GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_25gb', provider: 'MTN', name: 'MTN 25GB', price: 96.50, dataAmount: '25GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_30gb', provider: 'MTN', name: 'MTN 30GB', price: 116.00, dataAmount: '30GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_40gb', provider: 'MTN', name: 'MTN 40GB', price: 153.00, dataAmount: '40GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_50gb', provider: 'MTN', name: 'MTN 50GB', price: 183.00, dataAmount: '50GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'mtn_100gb', provider: 'MTN', name: 'MTN 100GB', price: 358.00, dataAmount: '100GB', validity: 'No Expiry', description: 'Standard data package' },

  // Telecel Bundles
  { id: 'tel_5gb', provider: 'Telecel', name: 'Telecel 5GB', price: 19.00, dataAmount: '5GB', validity: 'No Expiry', description: 'Super Value Bundle' },
  { id: 'tel_10gb', provider: 'Telecel', name: 'Telecel 10GB', price: 35.00, dataAmount: '10GB', validity: 'No Expiry', description: 'Super Value Bundle' },
  { id: 'tel_15gb', provider: 'Telecel', name: 'Telecel 15GB', price: 52.00, dataAmount: '15GB', validity: 'No Expiry', description: 'Super Value Bundle' },
  { id: 'tel_20gb', provider: 'Telecel', name: 'Telecel 20GB', price: 69.00, dataAmount: '20GB', validity: 'No Expiry', description: 'Super Value Bundle' },
  { id: 'tel_25gb', provider: 'Telecel', name: 'Telecel 25GB', price: 86.00, dataAmount: '25GB', validity: 'No Expiry', description: 'Super Value Bundle' },
  { id: 'tel_30gb', provider: 'Telecel', name: 'Telecel 30GB', price: 103.00, dataAmount: '30GB', validity: 'No Expiry', description: 'Super Value Bundle' },
  { id: 'tel_40gb', provider: 'Telecel', name: 'Telecel 40GB', price: 137.00, dataAmount: '40GB', validity: 'No Expiry', description: 'Super Value Bundle' },
  { id: 'tel_50gb', provider: 'Telecel', name: 'Telecel 50GB', price: 171.00, dataAmount: '50GB', validity: 'No Expiry', description: 'Super Value Bundle' },
  { id: 'tel_100gb', provider: 'Telecel', name: 'Telecel 100GB', price: 340.00, dataAmount: '100GB', validity: 'No Expiry', description: 'Super Value Bundle' },

  // AirtelTigo Bundles (Rate: 3.65 per GB)
  { id: 'at_1gb', provider: 'AirtelTigo', name: 'AT 1GB', price: 3.65, dataAmount: '1GB', validity: 'No Expiry', description: 'Big Time Data' },
  { id: 'at_2gb', provider: 'AirtelTigo', name: 'AT 2GB', price: 7.30, dataAmount: '2GB', validity: 'No Expiry', description: 'Big Time Data' },
  { id: 'at_3gb', provider: 'AirtelTigo', name: 'AT 3GB', price: 10.95, dataAmount: '3GB', validity: 'No Expiry', description: 'Big Time Data' },
  { id: 'at_4gb', provider: 'AirtelTigo', name: 'AT 4GB', price: 14.60, dataAmount: '4GB', validity: 'No Expiry', description: 'Big Time Data' },
  { id: 'at_5gb', provider: 'AirtelTigo', name: 'AT 5GB', price: 18.25, dataAmount: '5GB', validity: 'No Expiry', description: 'Big Time Data' },
  { id: 'at_6gb', provider: 'AirtelTigo', name: 'AT 6GB', price: 21.90, dataAmount: '6GB', validity: 'No Expiry', description: 'Big Time Data' },
  { id: 'at_7gb', provider: 'AirtelTigo', name: 'AT 7GB', price: 25.55, dataAmount: '7GB', validity: 'No Expiry', description: 'Big Time Data' },
  { id: 'at_8gb', provider: 'AirtelTigo', name: 'AT 8GB', price: 29.20, dataAmount: '8GB', validity: 'No Expiry', description: 'Big Time Data' },
  { id: 'at_9gb', provider: 'AirtelTigo', name: 'AT 9GB', price: 32.85, dataAmount: '9GB', validity: 'No Expiry', description: 'Big Time Data' },
  { id: 'at_10gb', provider: 'AirtelTigo', name: 'AT 10GB', price: 36.50, dataAmount: '10GB', validity: 'No Expiry', description: 'Big Time Data' },
  { id: 'at_12gb', provider: 'AirtelTigo', name: 'AT 12GB', price: 43.80, dataAmount: '12GB', validity: 'No Expiry', description: 'Big Time Data' },
  { id: 'at_15gb', provider: 'AirtelTigo', name: 'AT 15GB', price: 54.75, dataAmount: '15GB', validity: 'No Expiry', description: 'Big Time Data' },
  { id: 'at_20gb', provider: 'AirtelTigo', name: 'AT 20GB', price: 73.00, dataAmount: '20GB', validity: 'No Expiry', description: 'Big Time Data' },
  { id: 'at_25gb', provider: 'AirtelTigo', name: 'AT 25GB', price: 91.25, dataAmount: '25GB', validity: 'No Expiry', description: 'Big Time Data' }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    userId: 'u1',
    type: 'DEPOSIT',
    amount: 500,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    description: 'Wallet Top-up',
    status: OrderStatus.COMPLETED
  },
  {
    id: 't2',
    userId: 'u1',
    type: 'PURCHASE',
    amount: 8.20,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    description: 'MTN 2GB Purchase',
    status: OrderStatus.COMPLETED,
    bundleId: 'mtn_2gb'
  }
];

export const SYSTEM_PROMPT = `
You are FalconBot, the AI assistant for Falcon Network.
Falcon Network sells affordable data bundles for MTN, Telecel, and AirtelTigo in Ghana.
Currency: Ghana Cedis (GH₵).

Pricing Tiers:
- Public/Guest Rates: 1GB @ GH₵5.50, 2GB @ GH₵11.00, 3GB @ GH₵15.00, 4GB @ GH₵20.00.
- Registered Agent Rates: Significantly cheaper (e.g., 1GB @ GH₵4.10).

Your goal is to help users choose the right plan. If a guest asks about prices, quote the public rates but mention that they can get cheaper rates by signing up.
Explain the Bulk Upload feature: Users can upload numbers and amounts (e.g. "0244123456 1") to buy for multiple people at once via Text or Excel.
Keep answers concise and friendly.
`;