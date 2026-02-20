import { Bundle, Transaction, UserRole, OrderStatus } from './types';

export const PUBLIC_BUNDLES: Bundle[] = [
  { id: 'pub_1gb', provider: 'MTN', name: 'Standard 1GB', price: 5.50, dataAmount: '1GB', validity: 'No Expiry', description: 'Standard Rate' },
  { id: 'pub_2gb', provider: 'MTN', name: 'Standard 2GB', price: 11.00, dataAmount: '2GB', validity: 'No Expiry', description: 'Standard Rate' },
  { id: 'pub_3gb', provider: 'MTN', name: 'Standard 3GB', price: 15.00, dataAmount: '3GB', validity: 'No Expiry', description: 'Standard Rate' },
  { id: 'pub_4gb', provider: 'MTN', name: 'Standard 4GB', price: 20.00, dataAmount: '4GB', validity: 'No Expiry', description: 'Standard Rate' },
];

export const CONSOLE_BUNDLES: Bundle[] = [
  { id: 'at_con_1gb', provider: 'AirtelTigo', name: 'Console Starter 1GB', price: 5.00, dataAmount: '1GB', validity: 'No Expiry', description: 'Console Credit', category: 'console' },
  { id: 'at_con_100gb', provider: 'AirtelTigo', name: 'Console Pro 100GB', price: 365.00, dataAmount: '100GB', validity: 'No Expiry', description: 'Console Credit', category: 'console' },
  { id: 'at_con_200gb', provider: 'AirtelTigo', name: 'Console Pro 200GB', price: 730.00, dataAmount: '200GB', validity: 'No Expiry', description: 'Console Credit', category: 'console' },
  { id: 'at_con_500gb', provider: 'AirtelTigo', name: 'Console Pro 500GB', price: 1825.00, dataAmount: '500GB', validity: 'No Expiry', description: 'Console Credit', category: 'console' },
  { id: 'at_con_1tb', provider: 'AirtelTigo', name: 'Console Enterprise 1TB', price: 3650.00, dataAmount: '1TB', validity: 'No Expiry', description: 'Console Credit', category: 'console' },
];

export const CONSOLE_TRANSFER_OPTIONS = [
    { value: 1, label: '1GB' },
    { value: 2, label: '2GB' },
    { value: 3, label: '3GB' },
    { value: 4, label: '4GB' },
    { value: 5, label: '5GB' },
    { value: 10, label: '10GB' },
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
  { id: 'mtn_25gb', provider: 'MTN', name: 'MTN 25GB', price: 95.00, dataAmount: '25GB', validity: 'No Expiry', description: 'Standard data package' },
  
  // Telecel
  { id: 'tele_5gb', provider: 'Telecel', name: 'Telecel 5GB', price: 19.00, dataAmount: '5GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'tele_10gb', provider: 'Telecel', name: 'Telecel 10GB', price: 35.00, dataAmount: '10GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'tele_15gb', provider: 'Telecel', name: 'Telecel 15GB', price: 52.00, dataAmount: '15GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'tele_20gb', provider: 'Telecel', name: 'Telecel 20GB', price: 69.00, dataAmount: '20GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'tele_25gb', provider: 'Telecel', name: 'Telecel 25GB', price: 86.00, dataAmount: '25GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'tele_30gb', provider: 'Telecel', name: 'Telecel 30GB', price: 103.00, dataAmount: '30GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'tele_40gb', provider: 'Telecel', name: 'Telecel 40GB', price: 137.00, dataAmount: '40GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'tele_50gb', provider: 'Telecel', name: 'Telecel 50GB', price: 171.00, dataAmount: '50GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'tele_100gb', provider: 'Telecel', name: 'Telecel 100GB', price: 340.00, dataAmount: '100GB', validity: 'No Expiry', description: 'Standard data package' },

  // AirtelTigo Standard (3.70/GB from 1GB to 25GB)
  { id: 'at_1gb', provider: 'AirtelTigo', name: 'AT 1GB', price: 3.70, dataAmount: '1GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'at_2gb', provider: 'AirtelTigo', name: 'AT 2GB', price: 7.40, dataAmount: '2GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'at_3gb', provider: 'AirtelTigo', name: 'AT 3GB', price: 11.10, dataAmount: '3GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'at_4gb', provider: 'AirtelTigo', name: 'AT 4GB', price: 14.80, dataAmount: '4GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'at_5gb', provider: 'AirtelTigo', name: 'AT 5GB', price: 18.50, dataAmount: '5GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'at_6gb', provider: 'AirtelTigo', name: 'AT 6GB', price: 22.20, dataAmount: '6GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'at_7gb', provider: 'AirtelTigo', name: 'AT 7GB', price: 25.90, dataAmount: '7GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'at_8gb', provider: 'AirtelTigo', name: 'AT 8GB', price: 29.60, dataAmount: '8GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'at_9gb', provider: 'AirtelTigo', name: 'AT 9GB', price: 33.30, dataAmount: '9GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'at_10gb', provider: 'AirtelTigo', name: 'AT 10GB', price: 37.00, dataAmount: '10GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'at_15gb', provider: 'AirtelTigo', name: 'AT 15GB', price: 55.50, dataAmount: '15GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'at_20gb', provider: 'AirtelTigo', name: 'AT 20GB', price: 74.00, dataAmount: '20GB', validity: 'No Expiry', description: 'Standard data package' },
  { id: 'at_25gb', provider: 'AirtelTigo', name: 'AT 25GB', price: 92.50, dataAmount: '25GB', validity: 'No Expiry', description: 'Standard data package' },
  
  // Console Bundles
  ...CONSOLE_BUNDLES
];

export const SYSTEM_PROMPT = `You are a helpful customer support AI for Falcon Network, a data bundle sales platform.
Your goal is to assist users with buying data, understanding pricing, and checking order status.
Users can buy data for MTN, Telecel, and AirtelTigo.`;