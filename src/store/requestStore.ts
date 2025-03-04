import { create } from 'zustand';
import { ApiRequest, ApiResponse, Collection, HistoryItem, HttpMethod, RequestHeader, RequestParam } from '../types';
import axios from 'axios';

interface RequestState {
  collections: Collection[];
  currentRequest: ApiRequest | null;
  currentResponse: ApiResponse | null;
  history: HistoryItem[];
  favorites: string[]; // Array of request IDs
  isLoading: boolean;
  error: string | null;
}

interface RequestActions {
  createCollection: (name: string, description?: string) => void;
  updateCollection: (id: string, data: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  createRequest: (collectionId: string, request: Partial<ApiRequest>) => void;
  updateRequest: (collectionId: string, requestId: string, data: Partial<ApiRequest>) => void;
  deleteRequest: (collectionId: string, requestId: string) => void;
  setCurrentRequest: (request: ApiRequest | null) => void;
  executeRequest: (request: ApiRequest) => Promise<void>;
  addToFavorites: (requestId: string) => void;
  removeFromFavorites: (requestId: string) => void;
  clearHistory: () => void;
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Create initial request template
const createRequestTemplate = (method: HttpMethod = 'GET'): ApiRequest => ({
  id: generateId(),
  name: 'New Request',
  url: '',
  method,
  headers: [],
  params: [],
  body: {
    contentType: 'json',
    content: '',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useRequestStore = create<RequestState & RequestActions>((set, get) => ({
  collections: [],
  currentRequest: createRequestTemplate(),
  currentResponse: null,
  history: [],
  favorites: [],
  isLoading: false,
  error: null,

  createCollection: (name, description) => {
    const newCollection: Collection = {
      id: generateId(),
      name,
      description,
      requests: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: '1', // Assuming current user ID
    };

    set((state) => ({
      collections: [...state.collections, newCollection],
    }));
  },

  updateCollection: (id, data) => {
    set((state) => ({
      collections: state.collections.map((collection) =>
        collection.id === id
          ? { ...collection, ...data, updatedAt: new Date().toISOString() }
          : collection
      ),
    }));
  },

  deleteCollection: (id) => {
    set((state) => ({
      collections: state.collections.filter((collection) => collection.id !== id),
    }));
  },

  createRequest: (collectionId, requestData) => {
    const newRequest: ApiRequest = {
      ...createRequestTemplate(),
      ...requestData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      collections: state.collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              requests: [...collection.requests, newRequest],
              updatedAt: new Date().toISOString(),
            }
          : collection
      ),
      currentRequest: newRequest,
    }));
  },

  updateRequest: (collectionId, requestId, data) => {
    set((state) => ({
      collections: state.collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              requests: collection.requests.map((request) =>
                request.id === requestId
                  ? { ...request, ...data, updatedAt: new Date().toISOString() }
                  : request
              ),
              updatedAt: new Date().toISOString(),
            }
          : collection
      ),
      currentRequest:
        state.currentRequest?.id === requestId
          ? { ...state.currentRequest, ...data, updatedAt: new Date().toISOString() }
          : state.currentRequest,
    }));
  },

  deleteRequest: (collectionId, requestId) => {
    set((state) => ({
      collections: state.collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              requests: collection.requests.filter((request) => request.id !== requestId),
              updatedAt: new Date().toISOString(),
            }
          : collection
      ),
      currentRequest:
        state.currentRequest?.id === requestId ? null : state.currentRequest,
    }));
  },

  setCurrentRequest: (request) => {
    set({ currentRequest: request, currentResponse: null });
  },

  executeRequest: async (request) => {
    set({ isLoading: true, error: null, currentResponse: null });

    try {
      const startTime = performance.now();

      // Prepare headers
      const headers: Record<string, string> = {};
      request.headers
        .filter((header) => header.enabled)
        .forEach((header) => {
          headers[header.key] = header.value;
        });

      // Prepare params
      const params: Record<string, string> = {};
      request.params
        .filter((param) => param.enabled)
        .forEach((param) => {
          params[param.key] = param.value;
        });

      // Prepare request config
      const config = {
        method: request.method.toLowerCase(),
        url: request.url,
        headers,
        params,
        data: request.method !== 'GET' ? request.body.content : undefined,
      };

      // Execute request
      const response = await axios(config);
      const endTime = performance.now();

      // Create response object
      const apiResponse: ApiResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        data: response.data,
        time: Math.round(endTime - startTime),
        size: JSON.stringify(response.data).length,
      };

      // Create history item
      const historyItem: HistoryItem = {
        id: generateId(),
        request,
        response: apiResponse,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        currentResponse: apiResponse,
        isLoading: false,
        history: [historyItem, ...state.history],
      }));
    } catch (error) {
      let errorMessage = 'An error occurred';
      let errorResponse: ApiResponse | null = null;

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Error: ${error.response.status} ${error.response.statusText}`;
        errorResponse = {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers as Record<string, string>,
          data: error.response.data,
          time: 0,
          size: JSON.stringify(error.response.data || {}).length,
        };
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Create history item for failed request
      const historyItem: HistoryItem = {
        id: generateId(),
        request,
        response: errorResponse,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        error: errorMessage,
        isLoading: false,
        currentResponse: errorResponse,
        history: [historyItem, ...state.history],
      }));
    }
  },

  addToFavorites: (requestId) => {
    set((state) => ({
      favorites: [...state.favorites, requestId],
    }));
  },

  removeFromFavorites: (requestId) => {
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== requestId),
    }));
  },

  clearHistory: () => {
    set({ history: [] });
  },
}));

// Initialize with some demo data
export const initRequestStore = () => {
  const demoCollection: Collection = {
    id: 'demo-collection',
    name: 'Demo APIs',
    description: 'A collection of demo API endpoints',
    requests: [
      {
        id: 'demo-request-1',
        name: 'Get Users',
        url: 'https://jsonplaceholder.typicode.com/users',
        method: 'GET',
        headers: [
          { id: 'h1', key: 'Accept', value: 'application/json', enabled: true },
        ],
        params: [],
        body: {
          contentType: 'json',
          content: '',
        },
        description: 'Fetch a list of users',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-request-2',
        name: 'Create Post',
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'POST',
        headers: [
          { id: 'h1', key: 'Content-Type', value: 'application/json', enabled: true },
          { id: 'h2', key: 'Accept', value: 'application/json', enabled: true },
        ],
        params: [],
        body: {
          contentType: 'json',
          content: JSON.stringify({
            title: 'foo',
            body: 'bar',
            userId: 1,
          }, null, 2),
        },
        description: 'Create a new post',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: '1',
  };

  useRequestStore.setState({
    collections: [demoCollection],
    currentRequest: demoCollection.requests[0],
  });
};