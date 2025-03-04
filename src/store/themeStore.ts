import { create } from 'zustand';
import { Theme } from '../types';

interface ThemeState {
  themes: Theme[];
  currentTheme: Theme;
}

interface ThemeActions {
  setTheme: (themeId: string) => void;
  createTheme: (theme: Omit<Theme, 'id'>) => void;
  updateTheme: (id: string, data: Partial<Theme>) => void;
  deleteTheme: (id: string) => void;
}

const defaultThemes: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    primaryColor: '#0ea5e9',
    secondaryColor: '#d946ef',
    accentColor: '#84cc16',
    darkMode: true,
  },
  {
    id: 'sunset',
    name: 'Sunset',
    primaryColor: '#f97316',
    secondaryColor: '#ec4899',
    accentColor: '#eab308',
    darkMode: true,
  },
  {
    id: 'ocean',
    name: 'Ocean',
    primaryColor: '#06b6d4',
    secondaryColor: '#8b5cf6',
    accentColor: '#10b981',
    darkMode: true,
  },
  {
    id: 'light',
    name: 'Light Mode',
    primaryColor: '#0284c7',
    secondaryColor: '#a21caf',
    accentColor: '#65a30d',
    darkMode: false,
  },
];

export const useThemeStore = create<ThemeState & ThemeActions>((set, get) => ({
  themes: defaultThemes,
  currentTheme: defaultThemes[0],

  setTheme: (themeId) => {
    const theme = get().themes.find((t) => t.id === themeId);
    if (theme) {
      set({ currentTheme: theme });
      // Apply theme to document
      document.documentElement.classList.toggle('dark', theme.darkMode);
      
      // Set CSS variables for theme colors
      document.documentElement.style.setProperty('--color-primary', theme.primaryColor);
      document.documentElement.style.setProperty('--color-secondary', theme.secondaryColor);
      document.documentElement.style.setProperty('--color-accent', theme.accentColor);
    }
  },

  createTheme: (theme) => {
    const newTheme: Theme = {
      ...theme,
      id: Math.random().toString(36).substring(2, 15),
    };
    set((state) => ({
      themes: [...state.themes, newTheme],
    }));
  },

  updateTheme: (id, data) => {
    set((state) => ({
      themes: state.themes.map((theme) =>
        theme.id === id ? { ...theme, ...data } : theme
      ),
      currentTheme:
        state.currentTheme.id === id
          ? { ...state.currentTheme, ...data }
          : state.currentTheme,
    }));
  },

  deleteTheme: (id) => {
    // Don't allow deleting the current theme
    if (get().currentTheme.id === id) {
      return;
    }
    
    // Don't allow deleting the default theme
    if (id === 'default') {
      return;
    }
    
    set((state) => ({
      themes: state.themes.filter((theme) => theme.id !== id),
    }));
  },
}));