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
  username: string; // New field
  phoneNumber: string; // New field
  role: UserRole;
  walletBalance: number;
  password?: string; // Only used internally by backend
}

export interface Bundle {
  id: string;
  provider: Provider;
  name: string;
  price: number;
  dataAmount: string; // e.g., "1GB", "10GB"
  validity: string; // e.g., "Daily", "Weekly", "Monthly"
  description: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'PURCHASE' | 'BULK_PURCHASE';
  amount: number;
  date: string;
  description: string;
  status: OrderStatus;
  bundleId?: string; // Optional, for purchases
}

export type ViewState = 'landing' | 'login' | 'signup' | 'dashboard' | 'buy_data' | 'wallet' | 'orders' | 'admin' | 'docs';

export interface AppContextType {
  user: User | null;
  isLoading: boolean;
  view: ViewState;
  setView: (view: ViewState) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, username: string, phoneNumber: string) => Promise<boolean>;
  logout: () => void;
  bundles: Bundle[];
  transactions: Transaction[];
  addBundle: (bundle: Bundle) => Promise<void>;
  deleteBundle: (id: string) => Promise<void>;
  purchaseBundle: (bundleId: string, phoneNumber?: string) => Promise<boolean>;
  topUpWallet: (amount: number) => Promise<boolean>;
  getUsers: () => Promise<User[]>;
}