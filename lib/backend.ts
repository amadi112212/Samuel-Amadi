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

const generateKey = () => {
  return 'sk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '_v2';
};

// Seed Database
const seedDB = () => {
  const users = db.get(STORAGE_KEYS.USERS, []);
  if (users.length === 0) {
    const seedUsers: User[] = [
      { id: 'admin1', name: 'Admin User', username: 'admin', phoneNumber: '0550000000', email: 'admin@falcon.com', password: 'password', role: UserRole.ADMIN, walletBalance: 0, profitBalance: 0, consoleBalance: 0, apiKey: generateKey() },
      { id: 'u1', name: 'Kofi Mensah', username: 'kofi_m', phoneNumber: '0244123456', email: 'user@falcon.com', password: 'password', role: UserRole.USER, walletBalance: 50.00, profitBalance: 12.50, shopName: "Kofi Data Plug", shopPrices: {}, agentPrices: {}, consoleBalance: 0 }
    ];
    db.set(STORAGE_KEYS.USERS, seedUsers);
  } else {
      // Migration for existing users to add consoleBalance and ensure apiKey field exists
      const updatedUsers = users.map((u: User) => ({
          ...u,
          consoleBalance: u.consoleBalance !== undefined ? u.consoleBalance : 0,
          agentPrices: u.agentPrices || {},
          parentId: u.parentId || undefined,
          shopSupportPhone: u.shopSupportPhone || undefined
          // We don't force generate apiKey here to allow "No API Key" state, 
          // but we ensure the field is acknowledged in type if we were using a real DB schema
      }));
      db.set(STORAGE_KEYS.USERS, updatedUsers);
  }

  // Smart bundle seeding: merge new constants with existing DB bundles
  const storedBundles = db.get(STORAGE_KEYS.BUNDLES, []) as Bundle[];
  if (storedBundles.length === 0) {
    db.set(STORAGE_KEYS.BUNDLES, INITIAL_BUNDLES);
  } else {
    // Check if new bundles from constants are missing in DB
    const newBundles = INITIAL_BUNDLES.filter(initB => !storedBundles.some(dbB => dbB.id === initB.id));
    if (newBundles.length > 0) {
        const merged = [...storedBundles, ...newBundles];
        db.set(STORAGE_KEYS.BUNDLES, merged);
    }
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

    register: async (name: string, email: string, password: string, username: string, phoneNumber: string, parentId?: string): Promise<{ user: User | null, error?: string }> => {
      await new Promise(r => setTimeout(r, DELAY));
      const users = db.get(STORAGE_KEYS.USERS, []) as User[];
      
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { user: null, error: 'Email already exists' };
      }
      if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { user: null, error: 'Username already taken' };
      }

      // If parentId is provided, verify it exists
      if (parentId) {
          const parent = users.find(u => u.id === parentId);
          if (!parent) parentId = undefined; // Fallback to no parent if invalid
      }

      const newUser: User = {
        id: `u${Date.now()}`,
        name,
        email,
        username,
        phoneNumber,
        password,
        role: UserRole.USER,
        walletBalance: 0.00,
        profitBalance: 0.00,
        consoleBalance: 0,
        shopName: `${username}'s Shop`,
        shopSlug: username,
        shopPrices: {},
        agentPrices: {},
        parentId: parentId
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
    },

    changePassword: async (userId: string, oldPw: string, newPw: string): Promise<{success: boolean, error?: string}> => {
        await new Promise(r => setTimeout(r, DELAY));
        const users = db.get(STORAGE_KEYS.USERS, []) as User[];
        const userIndex = users.findIndex(u => u.id === userId);
        
        if(userIndex === -1) return {success: false, error: "User not found"};
        const user = users[userIndex];

        if(user.password !== oldPw) return {success: false, error: "Incorrect old password"};
        
        user.password = newPw;
        users[userIndex] = user;
        db.set(STORAGE_KEYS.USERS, users);
        return {success: true};
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
    },
    getById: async (id: string): Promise<User | null> => {
        await new Promise(r => setTimeout(r, DELAY / 2));
        const users = db.get(STORAGE_KEYS.USERS, []) as User[];
        const user = users.find(u => u.id === id);
        if (user) {
            const { password, ...safe } = user;
            return safe as User;
        }
        return null;
    },
    getByUsername: async (username: string): Promise<User | null> => {
        await new Promise(r => setTimeout(r, DELAY / 2));
        const users = db.get(STORAGE_KEYS.USERS, []) as User[];
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (user) {
            const { password, ...safe } = user;
            return safe as User;
        }
        return null;
    },
    generateNewApiKey: async (userId: string): Promise<string> => {
        await new Promise(r => setTimeout(r, DELAY));
        const users = db.get(STORAGE_KEYS.USERS, []) as User[];
        const index = users.findIndex(u => u.id === userId);
        if(index === -1) throw new Error("User not found");
        
        const newKey = generateKey();
        users[index].apiKey = newKey;
        db.set(STORAGE_KEYS.USERS, users);
        return newKey;
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
      let cost = bundle.price;
      
      // LOGIC: Check if user is an AGENT
      let parentIndex = -1;
      if (user.parentId) {
          parentIndex = users.findIndex(u => u.id === user.parentId);
          if (parentIndex !== -1) {
              // Override cost with Parent's Agent Price for this bundle
              const parent = users[parentIndex];
              const agentPrice = parent.agentPrices?.[bundleId];
              if (agentPrice && agentPrice > 0) {
                  cost = agentPrice;
              }
          }
      }

      if (user.walletBalance < cost) {
        return { success: false, error: `Insufficient funds. Cost: GH₵${cost.toFixed(2)}` };
      }

      // Determine transaction type
      const isConsoleTopup = bundle.category === 'console';

      // Deduct Wallet Balance from User (Agent/Regular)
      user.walletBalance -= cost;
      
      // If Console Topup, add to console balance
      if (isConsoleTopup) {
          const gbAmount = parseFloat(bundle.dataAmount.replace(/[^0-9.]/g, ''));
          user.consoleBalance = (user.consoleBalance || 0) + gbAmount;
      }

      users[userIndex] = user;

      // Handle Profit for Parent if User is Agent
      if (parentIndex !== -1) {
          const parent = users[parentIndex];
          // Profit = Amount Agent Paid - Platform Price (Original bundle price)
          // Ensure profit isn't negative (though platform takes full price regardless)
          const profit = cost - bundle.price;
          if (profit > 0) {
             parent.profitBalance = (parent.profitBalance || 0) + profit;
             users[parentIndex] = parent;
          }
      }

      db.set(STORAGE_KEYS.USERS, users);

      // Create transaction
      const tx: Transaction = {
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: user.id,
        type: isConsoleTopup ? 'CONSOLE_TOPUP' : 'PURCHASE',
        amount: cost,
        date: new Date().toISOString(),
        description: isConsoleTopup 
            ? `Console Topup: ${bundle.dataAmount}` 
            : `Purchased ${bundle.name}${phone ? ' for ' + phone : ''}`,
        status: OrderStatus.COMPLETED,
        bundleId
      };

      const transactions = db.get(STORAGE_KEYS.TRANSACTIONS, []) as Transaction[];
      transactions.unshift(tx); // Add to top
      db.set(STORAGE_KEYS.TRANSACTIONS, transactions);

      return { success: true };
    },

    transferConsoleData: async (userId: string, amountGB: number, phone: string): Promise<{ success: boolean, error?: string }> => {
        await new Promise(r => setTimeout(r, DELAY));
        
        const users = db.get(STORAGE_KEYS.USERS, []) as User[];
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return { success: false, error: 'User not found' };
        
        const user = users[userIndex];

        if ((user.consoleBalance || 0) < amountGB) {
            return { success: false, error: 'Insufficient Console Balance' };
        }

        // Deduct Console Balance
        user.consoleBalance -= amountGB;
        users[userIndex] = user;
        db.set(STORAGE_KEYS.USERS, users);

        // Record Transaction
        const tx: Transaction = {
            id: `ctx-${Date.now()}`,
            userId: user.id,
            type: 'CONSOLE_TRANSFER',
            amount: amountGB, // Store GB here for record
            date: new Date().toISOString(),
            description: `Console Transfer: ${amountGB}GB to ${phone}`,
            status: OrderStatus.COMPLETED
        };

        const transactions = db.get(STORAGE_KEYS.TRANSACTIONS, []) as Transaction[];
        transactions.unshift(tx);
        db.set(STORAGE_KEYS.TRANSACTIONS, transactions);

        return { success: true };
    }
  },

  shop: {
      updateSettings: async (userId: string, name: string, prices: Record<string, number>, agentPrices?: Record<string, number>, supportPhone?: string): Promise<boolean> => {
          await new Promise(r => setTimeout(r, DELAY));
          const users = db.get(STORAGE_KEYS.USERS, []) as User[];
          const index = users.findIndex(u => u.id === userId);
          if (index === -1) return false;
          
          users[index].shopName = name;
          users[index].shopPrices = prices;
          if(agentPrices) users[index].agentPrices = agentPrices;
          if(supportPhone) users[index].shopSupportPhone = supportPhone;
          
          db.set(STORAGE_KEYS.USERS, users);
          return true;
      },
      
      purchaseFromShop: async (shopOwnerId: string, bundleId: string, phoneNumber: string): Promise<{success: boolean, error?: string}> => {
          await new Promise(r => setTimeout(r, DELAY));
          const users = db.get(STORAGE_KEYS.USERS, []) as User[];
          const bundles = db.get(STORAGE_KEYS.BUNDLES, []) as Bundle[];
          const ownerIndex = users.findIndex(u => u.id === shopOwnerId);
          const bundle = bundles.find(b => b.id === bundleId);

          if (ownerIndex === -1 || !bundle) return { success: false, error: "Invalid Shop or Bundle" };
          
          const owner = users[ownerIndex];
          const customPrice = owner.shopPrices?.[bundleId] || bundle.price;
          
          // Calculate Profit
          // We assume the customer pays the 'customPrice' via external gateway
          // The system takes 'bundle.price'
          // The owner keeps (customPrice - bundle.price)
          const profit = customPrice - bundle.price;

          if (profit < 0) {
              // Usually shouldn't happen unless user set price lower than cost
              // In that case, user loses money? For now let's just enforce profit >= 0 logic in UI
          }

          // Credit profit to owner
          users[ownerIndex].profitBalance = (users[ownerIndex].profitBalance || 0) + Math.max(0, profit);
          db.set(STORAGE_KEYS.USERS, users);

          // Record Transaction (For the system record, not linked to a specific user wallet since it's external pay)
          // Ideally we log this as a sale for the agent
          
          return { success: true };
      },

      cashout: async (userId: string): Promise<boolean> => {
          await new Promise(r => setTimeout(r, DELAY));
          const users = db.get(STORAGE_KEYS.USERS, []) as User[];
          const index = users.findIndex(u => u.id === userId);
          if (index === -1) return false;

          const profit = users[index].profitBalance || 0;
          if (profit <= 0) return false;

          users[index].walletBalance += profit;
          users[index].profitBalance = 0;
          db.set(STORAGE_KEYS.USERS, users);

           // Create transaction record
            const tx: Transaction = {
                id: `cash-${Date.now()}`,
                userId,
                type: 'PROFIT_CASHOUT',
                amount: profit,
                date: new Date().toISOString(),
                description: 'Shop Profit Cashout',
                status: OrderStatus.COMPLETED
            };

            const transactions = db.get(STORAGE_KEYS.TRANSACTIONS, []) as Transaction[];
            transactions.unshift(tx);
            db.set(STORAGE_KEYS.TRANSACTIONS, transactions);

          return true;
      }
  },

  admin: {
    adjustBalance: async (userId: string, amount: number, type: 'CREDIT' | 'DEBIT'): Promise<boolean> => {
        await new Promise(r => setTimeout(r, DELAY));
        
        const users = db.get(STORAGE_KEYS.USERS, []) as User[];
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return false;
        
        const user = users[userIndex];
        
        if (type === 'CREDIT') {
            user.walletBalance += amount;
        } else {
            // Allow going negative? Probably not for prepaid.
            if (user.walletBalance < amount) return false;
            user.walletBalance -= amount;
        }
        
        users[userIndex] = user;
        db.set(STORAGE_KEYS.USERS, users);

        const tx: Transaction = {
            id: `adm-${Date.now()}`,
            userId: user.id,
            type: type === 'CREDIT' ? 'ADMIN_CREDIT' : 'ADMIN_DEBIT',
            amount: amount,
            date: new Date().toISOString(),
            description: type === 'CREDIT' ? 'Admin Deposit' : 'Admin Deduction',
            status: OrderStatus.COMPLETED
        };

        const transactions = db.get(STORAGE_KEYS.TRANSACTIONS, []) as Transaction[];
        transactions.unshift(tx);
        db.set(STORAGE_KEYS.TRANSACTIONS, transactions);

        return true;
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