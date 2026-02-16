import { Bundle, Transaction, User, UserRole, OrderStatus } from '../types';
import { INITIAL_BUNDLES } from '../constants';

/**
 * SIMULATED BACKEND SERVICE
 * 
 * This file acts as a mock Node.js/Express backend + Database.
 * It uses localStorage to persist data.
 * In a production environment, these functions would be replaced by 
 * fetch() calls to a real API endpoint.
 */

const STORAGE_KEYS = {
  USERS: 'falcon_users',
  BUNDLES: 'falcon_bundles',
  TRANSACTIONS: 'falcon_transactions',
  SESSION: 'falcon_session'
};

const DELAY = 800; // Simulate network latency in ms

// --- Database Layer ---

const db = {
  get: (key: string, defaultVal: any) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  },
  set: (key: string, val: any) => {
    localStorage.setItem(key, JSON.stringify(val));
  }
};

// Seed Database
const seedDB = () => {
  const users = db.get(STORAGE_KEYS.USERS, []);
  if (users.length === 0) {
    const seedUsers: User[] = [
      { id: 'admin1', name: 'Admin User', username: 'admin', phoneNumber: '0550000000', email: 'admin@falcon.com', password: 'password', role: UserRole.ADMIN, walletBalance: 0 },
      { id: 'u1', name: 'Kofi Mensah', username: 'kofi_m', phoneNumber: '0244123456', email: 'user@falcon.com', password: 'password', role: UserRole.USER, walletBalance: 50.00 }
    ];
    db.set(STORAGE_KEYS.USERS, seedUsers);
  }

  const bundles = db.get(STORAGE_KEYS.BUNDLES, []);
  if (bundles.length === 0) {
    db.set(STORAGE_KEYS.BUNDLES, INITIAL_BUNDLES);
  }
};

// Initialize on load
seedDB();

// --- API Layer ---

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<{ user: User | null, token: string | null, error?: string }> => {
      await new Promise(r => setTimeout(r, DELAY));
      const users = db.get(STORAGE_KEYS.USERS, []) as User[];
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (user) {
        const { password, ...safeUser } = user;
        const token = `fake-jwt-${user.id}-${Date.now()}`;
        db.set(STORAGE_KEYS.SESSION, { userId: user.id, token });
        return { user: safeUser as User, token };
      }
      return { user: null, token: null, error: 'Invalid credentials' };
    },

    register: async (name: string, email: string, password: string, username: string, phoneNumber: string): Promise<{ user: User | null, error?: string }> => {
      await new Promise(r => setTimeout(r, DELAY));
      const users = db.get(STORAGE_KEYS.USERS, []) as User[];
      
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { user: null, error: 'Email already exists' };
      }
      if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { user: null, error: 'Username already taken' };
      }

      const newUser: User = {
        id: `u${Date.now()}`,
        name,
        email,
        username,
        phoneNumber,
        password,
        role: UserRole.USER,
        walletBalance: 0.00
      };

      users.push(newUser);
      db.set(STORAGE_KEYS.USERS, users);
      
      const { password: _, ...safeUser } = newUser;
      return { user: safeUser as User };
    },

    logout: async () => {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    },

    getSession: async (): Promise<User | null> => {
      // await new Promise(r => setTimeout(r, 200)); // Fast check
      const session = db.get(STORAGE_KEYS.SESSION, null);
      if (!session) return null;
      
      const users = db.get(STORAGE_KEYS.USERS, []) as User[];
      const user = users.find(u => u.id === session.userId);
      if (user) {
        const { password, ...safeUser } = user;
        return safeUser as User;
      }
      return null;
    }
  },

  users: {
    getAll: async (): Promise<User[]> => {
        await new Promise(r => setTimeout(r, DELAY / 2));
        const users = db.get(STORAGE_KEYS.USERS, []) as User[];
        // Return safe users
        return users.map(u => {
            const { password, ...safe } = u;
            return safe as User;
        });
    }
  },

  data: {
    getBundles: async (): Promise<Bundle[]> => {
      await new Promise(r => setTimeout(r, DELAY / 2));
      return db.get(STORAGE_KEYS.BUNDLES, INITIAL_BUNDLES);
    },

    addBundle: async (bundle: Bundle): Promise<void> => {
      await new Promise(r => setTimeout(r, DELAY));
      const bundles = db.get(STORAGE_KEYS.BUNDLES, []) as Bundle[];
      bundles.push(bundle);
      db.set(STORAGE_KEYS.BUNDLES, bundles);
    },

    deleteBundle: async (id: string): Promise<void> => {
      await new Promise(r => setTimeout(r, DELAY));
      let bundles = db.get(STORAGE_KEYS.BUNDLES, []) as Bundle[];
      bundles = bundles.filter(b => b.id !== id);
      db.set(STORAGE_KEYS.BUNDLES, bundles);
    },

    purchase: async (userId: string, bundleId: string, phone?: string): Promise<{ success: boolean, error?: string }> => {
      await new Promise(r => setTimeout(r, DELAY));
      
      const users = db.get(STORAGE_KEYS.USERS, []) as User[];
      const bundles = db.get(STORAGE_KEYS.BUNDLES, []) as Bundle[];
      const userIndex = users.findIndex(u => u.id === userId);
      const bundle = bundles.find(b => b.id === bundleId);

      if (userIndex === -1 || !bundle) return { success: false, error: 'Invalid request' };

      const user = users[userIndex];
      if (user.walletBalance < bundle.price) {
        return { success: false, error: 'Insufficient funds' };
      }

      // Deduct balance
      user.walletBalance -= bundle.price;
      users[userIndex] = user;
      db.set(STORAGE_KEYS.USERS, users);

      // Create transaction
      const tx: Transaction = {
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: user.id,
        type: 'PURCHASE',
        amount: bundle.price,
        date: new Date().toISOString(),
        description: `Purchased ${bundle.name}${phone ? ' for ' + phone : ''}`,
        status: OrderStatus.COMPLETED,
        bundleId
      };

      const transactions = db.get(STORAGE_KEYS.TRANSACTIONS, []) as Transaction[];
      transactions.unshift(tx); // Add to top
      db.set(STORAGE_KEYS.TRANSACTIONS, transactions);

      return { success: true };
    }
  },

  wallet: {
    topUp: async (userId: string, amount: number): Promise<boolean> => {
      await new Promise(r => setTimeout(r, DELAY));
      
      const users = db.get(STORAGE_KEYS.USERS, []) as User[];
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) return false;

      users[userIndex].walletBalance += amount;
      db.set(STORAGE_KEYS.USERS, users);

      const tx: Transaction = {
        id: `dep-${Date.now()}`,
        userId,
        type: 'DEPOSIT',
        amount: amount,
        date: new Date().toISOString(),
        description: 'Wallet Deposit',
        status: OrderStatus.COMPLETED
      };

      const transactions = db.get(STORAGE_KEYS.TRANSACTIONS, []) as Transaction[];
      transactions.unshift(tx);
      db.set(STORAGE_KEYS.TRANSACTIONS, transactions);

      return true;
    },

    getTransactions: async (userId: string): Promise<Transaction[]> => {
      await new Promise(r => setTimeout(r, DELAY / 2));
      const transactions = db.get(STORAGE_KEYS.TRANSACTIONS, []) as Transaction[];
      // Return only user's transactions (unless admin, but for now strict)
      return transactions.filter(t => t.userId === userId);
    }
  }
};