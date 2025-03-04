import { create } from 'zustand';
import { AuthState, User } from '../types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Mock user data for demo purposes
const mockUsers = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'password',
    avatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: new Date().toISOString(),
  },
];

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      set({ 
        user: userWithoutPassword as User, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('User already exists');
      }
      
      const newUser = {
        id: String(mockUsers.length + 1),
        username,
        email,
        password,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        createdAt: new Date().toISOString(),
      };
      
      mockUsers.push(newUser);
      
      const { password: _, ...userWithoutPassword } = newUser;
      
      set({ 
        user: userWithoutPassword as User, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
    
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);
      localStorage.setItem('user', JSON.stringify({ ...parsedUser, ...userData }));
    }
  },
}));

// Initialize auth state from localStorage
export const initAuth = () => {
  const user = localStorage.getItem('user');
  if (user) {
    useAuthStore.setState({ 
      user: JSON.parse(user), 
      isAuthenticated: true 
    });
  }
};