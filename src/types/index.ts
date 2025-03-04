export type User = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export type RequestHeader = {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
};

export type RequestParam = {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
};

export type RequestBody = {
  contentType: 'json' | 'form-data' | 'x-www-form-urlencoded' | 'raw' | 'binary';
  content: string | FormData | Record<string, any>;
};

export type Environment = {
  id: string;
  name: string;
  variables: EnvironmentVariable[];
};

export type EnvironmentVariable = {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
};

export type ApiRequest = {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  headers: RequestHeader[];
  params: RequestParam[];
  body: RequestBody;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
};

export type Collection = {
  id: string;
  name: string;
  description?: string;
  requests: ApiRequest[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  collaborators?: string[];
};

export type HistoryItem = {
  id: string;
  request: ApiRequest;
  response?: ApiResponse;
  timestamp: string;
};

export type Theme = {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkMode: boolean;
};