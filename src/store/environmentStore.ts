import { create } from 'zustand';
import { Environment, EnvironmentVariable } from '../types';

interface EnvironmentState {
  environments: Environment[];
  currentEnvironment: Environment | null;
  isLoading: boolean;
  error: string | null;
}

interface EnvironmentActions {
  createEnvironment: (name: string) => void;
  updateEnvironment: (id: string, data: Partial<Environment>) => void;
  deleteEnvironment: (id: string) => void;
  setCurrentEnvironment: (id: string | null) => void;
  addVariable: (environmentId: string, key: string, value: string) => void;
  updateVariable: (environmentId: string, variableId: string, data: Partial<EnvironmentVariable>) => void;
  deleteVariable: (environmentId: string, variableId: string) => void;
  resolveVariables: (text: string) => string;
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

export const useEnvironmentStore = create<EnvironmentState & EnvironmentActions>((set, get) => ({
  environments: [],
  currentEnvironment: null,
  isLoading: false,
  error: null,

  createEnvironment: (name) => {
    const newEnvironment: Environment = {
      id: generateId(),
      name,
      variables: [],
    };

    set((state) => ({
      environments: [...state.environments, newEnvironment],
      currentEnvironment: state.currentEnvironment || newEnvironment,
    }));
  },

  updateEnvironment: (id, data) => {
    set((state) => ({
      environments: state.environments.map((env) =>
        env.id === id ? { ...env, ...data } : env
      ),
      currentEnvironment:
        state.currentEnvironment?.id === id
          ? { ...state.currentEnvironment, ...data }
          : state.currentEnvironment,
    }));
  },

  deleteEnvironment: (id) => {
    set((state) => {
      const newEnvironments = state.environments.filter((env) => env.id !== id);
      return {
        environments: newEnvironments,
        currentEnvironment:
          state.currentEnvironment?.id === id
            ? newEnvironments.length > 0
              ? newEnvironments[0]
              : null
            : state.currentEnvironment,
      };
    });
  },

  setCurrentEnvironment: (id) => {
    if (id === null) {
      set({ currentEnvironment: null });
      return;
    }

    const environment = get().environments.find((env) => env.id === id);
    if (environment) {
      set({ currentEnvironment: environment });
    }
  },

  addVariable: (environmentId, key, value) => {
    const newVariable: EnvironmentVariable = {
      id: generateId(),
      key,
      value,
      enabled: true,
    };

    set((state) => ({
      environments: state.environments.map((env) =>
        env.id === environmentId
          ? { ...env, variables: [...env.variables, newVariable] }
          : env
      ),
      currentEnvironment:
        state.currentEnvironment?.id === environmentId
          ? {
              ...state.currentEnvironment,
              variables: [...state.currentEnvironment.variables, newVariable],
            }
          : state.currentEnvironment,
    }));
  },

  updateVariable: (environmentId, variableId, data) => {
    set((state) => ({
      environments: state.environments.map((env) =>
        env.id === environmentId
          ? {
              ...env,
              variables: env.variables.map((variable) =>
                variable.id === variableId
                  ? { ...variable, ...data }
                  : variable
              ),
            }
          : env
      ),
      currentEnvironment:
        state.currentEnvironment?.id === environmentId
          ? {
              ...state.currentEnvironment,
              variables: state.currentEnvironment.variables.map((variable) =>
                variable.id === variableId
                  ? { ...variable, ...data }
                  : variable
              ),
            }
          : state.currentEnvironment,
    }));
  },

  deleteVariable: (environmentId, variableId) => {
    set((state) => ({
      environments: state.environments.map((env) =>
        env.id === environmentId
          ? {
              ...env,
              variables: env.variables.filter(
                (variable) => variable.id !== variableId
              ),
            }
          : env
      ),
      currentEnvironment:
        state.currentEnvironment?.id === environmentId
          ? {
              ...state.currentEnvironment,
              variables: state.currentEnvironment.variables.filter(
                (variable) => variable.id !== variableId
              ),
            }
          : state.currentEnvironment,
    }));
  },

  resolveVariables: (text) => {
    const { currentEnvironment } = get();
    if (!currentEnvironment) return text;

    let resolvedText = text;
    currentEnvironment.variables
      .filter((variable) => variable.enabled)
      .forEach((variable) => {
        const regex = new RegExp(`{{${variable.key}}}`, 'g');
        resolvedText = resolvedText.replace(regex, variable.value);
      });

    return resolvedText;
  },
}));

// Initialize with some demo environments
export const initEnvironmentStore = () => {
  const devEnvironment: Environment = {
    id: 'dev-env',
    name: 'Development',
    variables: [
      { id: 'v1', key: 'baseUrl', value: 'https://dev-api.example.com', enabled: true },
      { id: 'v2', key: 'apiKey', value: 'dev-api-key-123', enabled: true },
    ],
  };

  const prodEnvironment: Environment = {
    id: 'prod-env',
    name: 'Production',
    variables: [
      { id: 'v1', key: 'baseUrl', value: 'https://api.example.com', enabled: true },
      { id: 'v2', key: 'apiKey', value: 'prod-api-key-456', enabled: true },
    ],
  };

  useEnvironmentStore.setState({
    environments: [devEnvironment, prodEnvironment],
    currentEnvironment: devEnvironment,
  });
};