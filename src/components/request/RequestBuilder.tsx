import React, { useState } from 'react';
import { useRequestStore } from '../../store/requestStore';
import { useEnvironmentStore } from '../../store/environmentStore';
import { HttpMethod, RequestHeader, RequestParam } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Send, Save, Trash2, Plus, X } from 'lucide-react';

const RequestBuilder: React.FC = () => {
  const { currentRequest, executeRequest, isLoading, error } = useRequestStore();
  const { resolveVariables } = useEnvironmentStore();
  
  const [method, setMethod] = useState<HttpMethod>(currentRequest?.method || 'GET');
  const [url, setUrl] = useState(currentRequest?.url || '');
  const [headers, setHeaders] = useState<RequestHeader[]>(currentRequest?.headers || []);
  const [params, setParams] = useState<RequestParam[]>(currentRequest?.params || []);
  const [body, setBody] = useState<string>(
    typeof currentRequest?.body.content === 'string' 
      ? currentRequest?.body.content 
      : JSON.stringify(currentRequest?.body.content, null, 2) || ''
  );
  
  // Generate a unique ID
  const generateId = () => Math.random().toString(36).substring(2, 15);
  
  const handleMethodChange = (value: string) => {
    setMethod(value as HttpMethod);
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  
  const addHeader = () => {
    const newHeader: RequestHeader = {
      id: generateId(),
      key: '',
      value: '',
      enabled: true,
    };
    setHeaders([...headers, newHeader]);
  };
  
  const updateHeader = (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setHeaders(
      headers.map((header) =>
        header.id === id ? { ...header, [field]: value } : header
      )
    );
  };
  
  const removeHeader = (id: string) => {
    setHeaders(headers.filter((header) => header.id !== id));
  };
  
  const addParam = () => {
    const newParam: RequestParam = {
      id: generateId(),
      key: '',
      value: '',
      enabled: true,
    };
    setParams([...params, newParam]);
  };
  
  const updateParam = (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setParams(
      params.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };
  
  const removeParam = (id: string) => {
    setParams(params.filter((param) => param.id !== id));
  };
  
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };
  
  const handleSendRequest = () => {
    if (!url) return;
    
    // Resolve environment variables in URL
    const resolvedUrl = resolveVariables(url);
    
    // Create request object
    const request = {
      id: currentRequest?.id || generateId(),
      name: currentRequest?.name || 'New Request',
      url: resolvedUrl,
      method,
      headers,
      params,
      body: {
        contentType: 'json',
        content: method !== 'GET' ? body : '',
      },
      createdAt: currentRequest?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    executeRequest(request);
  };
  
  return (
    <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-32">
            <Select value={method} onValueChange={handleMethodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                <SelectItem value="HEAD">HEAD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Input
              placeholder="Enter request URL"
              value={url}
              onChange={handleUrlChange}
            />
          </div>
          <div>
            <Button onClick={handleSendRequest} isLoading={isLoading}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <div className="mt-4">
          <Tabs defaultValue="params">
            <TabsList className="w-full">
              <TabsTrigger value="params" className="flex-1">Params</TabsTrigger>
              <TabsTrigger value="headers" className="flex-1">Headers</TabsTrigger>
              <TabsTrigger value="body" className="flex-1">Body</TabsTrigger>
            </TabsList>
            
            <TabsContent value="params" className="mt-4">
              <div className="space-y-2">
                {params.map((param) => (
                  <div key={param.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={param.enabled}
                      onChange={(e) => updateParam(param.id, 'enabled', e.target.checked)}
                      className="h-4 w-4 rounded border-dark-600 text-primary-500 focus:ring-primary-500"
                    />
                    <Input
                      placeholder="Key"
                      value={param.key}
                      onChange={(e) => updateParam(param.id, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={param.value}
                      onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <button
                      onClick={() => removeParam(param.id)}
                      className="p-2 text-dark-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addParam}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Parameter
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="headers" className="mt-4">
              <div className="space-y-2">
                {headers.map((header) => (
                  <div key={header.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={(e) => updateHeader(header.id, 'enabled', e.target.checked)}
                      className="h-4 w-4 rounded border-dark-600 text-primary-500 focus:ring-primary-500"
                    />
                    <Input
                      placeholder="Key"
                      value={header.key}
                      onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={header.value}
                      onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <button
                      onClick={() => removeHeader(header.id)}
                      className="p-2 text-dark-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addHeader}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Header
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="body" className="mt-4">
              <div className="space-y-2">
                {method !== 'GET' && (
                  <textarea
                    value={body}
                    onChange={handleBodyChange}
                    placeholder="Request body (JSON)"
                    className="w-full h-64 bg-dark-900 border border-dark-700 rounded-md p-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}
                {method === 'GET' && (
                  <div className="p-4 text-dark-400 text-center">
                    Body is not applicable for GET requests
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RequestBuilder;