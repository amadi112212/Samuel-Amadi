export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export type Provider = 'MTN' | 'Telecel' | 'AirtelTigo';

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  phoneNumber: string;
  role: UserRole;
  walletBalance: number;
  password?: string; // Only used internally by backend
  apiKey?: string;
  // Shop Features
  shopName?: string;
  shopSlug?: string;
  shopSupportPhone?: string; // Number for complaints/compliments
  shopPrices?: Record<string, number>; // bundleId -> customPrice (Public)
  agentPrices?: Record<string, number>; // bundleId -> agentPrice (For signed up agents)
  profitBalance: number;
  parentId?: string; // ID of the shop owner this user is an agent for
  // Console Features
  consoleBalance: number; // Stored in GB
}

export interface Bundle {
  id: string;
  provider: Provider;
  name: string;
  price: number;
  dataAmount: string; // e.g., "1GB", "10GB"
  validity: string; // e.g., "Daily", "Weekly", "Monthly"
  description: string;
  category?: 'standard' | 'console';
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'PURCHASE' | 'BULK_PURCHASE' | 'PROFIT_CASHOUT' | 'ADMIN_CREDIT' | 'ADMIN_DEBIT' | 'CONSOLE_TOPUP' | 'CONSOLE_TRANSFER';
  amount: number; // Money for financial tx, GB for console transfer
  date: string;
  description: string;
  status: OrderStatus;
  bundleId?: string; // Optional, for purchases
}

export type ViewState = 'landing' | 'login' | 'signup' | 'dashboard' | 'buy_data' | 'wallet' | 'orders' | 'admin' | 'docs' | 'my_shop' | 'public_shop' | 'console';

export interface AppContextType {
  user: User | null;
  agentParent: User | null; // The shop owner if the current user is an agent
  isLoading: boolean;
  view: ViewState;
  setView: (view: ViewState) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, username: string, phoneNumber: string, parentId?: string) => Promise<boolean>;
  logout: () => void;
  bundles: Bundle[];
  transactions: Transaction[];
  addBundle: (bundle: Bundle) => Promise<void>;
  deleteBundle: (id: string) => Promise<void>;
  purchaseBundle: (bundleId: string, phoneNumber?: string) => Promise<boolean>;
  topUpWallet: (amount: number) => Promise<boolean>;
  getUsers: () => Promise<User[]>;
  // Shop methods
  updateShopSettings: (name: string, prices: Record<string, number>, agentPrices?: Record<string, number>, supportPhone?: string) => Promise<boolean>;
  cashoutProfit: () => Promise<boolean>;
  viewShop: (username: string) => Promise<void>;
  currentShopOwner: User | null;
  purchaseFromShop: (shopOwnerId: string, bundleId: string, phoneNumber: string) => Promise<boolean>;
  // Admin methods
  adminAdjustUserBalance: (userId: string, amount: number, type: 'CREDIT' | 'DEBIT') => Promise<boolean>;
  // Console methods
  transferConsoleData: (amountGB: number, phoneNumber: string) => Promise<boolean>;
  // API & Security
  generateApiKey: () => Promise<void>;
  changePassword: (oldP: string, newP: string) => Promise<boolean>;
}