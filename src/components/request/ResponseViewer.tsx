import React, { useState } from 'react';
import { useRequestStore } from '../../store/requestStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Clock, FileText, Database, Code } from 'lucide-react';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/atom-one-dark.css';

// Register languages
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);

const ResponseViewer: React.FC = () => {
  const { currentResponse, isLoading } = useRequestStore();
  const [activeTab, setActiveTab] = useState('body');

  if (isLoading) {
    return (
      <div className="bg-dark-800 rounded-lg border border-dark-700 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-dark-300">Sending request...</p>
        </div>
      </div>
    );
  }

  if (!currentResponse) {
    return (
      <div className="bg-dark-800 rounded-lg border border-dark-700 p-8 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-dark-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Response Yet</h3>
          <p className="text-dark-300">Send a request to see the response here</p>
        </div>
      </div>
    );
  }

  const formatJson = (data: any) => {
    try {
      const formatted = JSON.stringify(data, null, 2);
      return hljs.highlight(formatted, { language: 'json' }).value;
    } catch (error) {
      return String(data);
    }
  };

  const formatXml = (data: string) => {
    try {
      if (typeof data === 'string' && data.trim().startsWith('<')) {
        return hljs.highlight(data, { language: 'xml' }).value;
      }
      return data;
    } catch (error) {
      return data;
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-500';
    if (status >= 300 && status < 400) return 'text-blue-500';
    if (status >= 400 && status < 500) return 'text-yellow-500';
    if (status >= 500) return 'text-red-500';
    return 'text-white';
  };

  const formatContentType = (headers: Record<string, string>) => {
    const contentType = headers['content-type'] || '';
    if (contentType.includes('application/json')) return 'JSON';
    if (contentType.includes('application/xml') || contentType.includes('text/xml')) return 'XML';
    if (contentType.includes('text/html')) return 'HTML';
    if (contentType.includes('text/plain')) return 'Text';
    return 'Unknown';
  };

  return (
    <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
      <div className="bg-dark-900 p-4 flex items-center justify-between border-b border-dark-700">
        <div className="flex items-center">
          <span className={`text-lg font-mono ${getStatusColor(currentResponse.status)}`}>
            {currentResponse.status}
          </span>
          <span className="ml-2 text-dark-300">{currentResponse.statusText}</span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-dark-300">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{currentResponse.time}ms</span>
          </div>
          <div className="flex items-center">
            <Database className="h-4 w-4 mr-1" />
            <span>{(currentResponse.size / 1024).toFixed(2)} KB</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full rounded-none border-b border-dark-700">
          <TabsTrigger value="body" className="flex-1">Body</TabsTrigger>
          <TabsTrigger value="headers" className="flex-1">Headers</TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="p-0">
          <div className="relative">
            <div className="absolute top-2 right-2 bg-dark-700 text-xs px-2 py-1 rounded text-dark-300">
              {formatContentType(currentResponse.headers)}
            </div>
            <pre className="p-4 overflow-auto max-h-96 bg-dark-900 m-0 text-sm">
              <code
                dangerouslySetInnerHTML={{
                  __html:
                    formatContentType(currentResponse.headers) === 'XML'
                      ? formatXml(currentResponse.data)
                      : formatJson(currentResponse.data),
                }}
              />
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="headers" className="p-4">
          <div className="space-y-2">
            {Object.entries(currentResponse.headers).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-medium text-dark-200 w-1/3">{key}:</span>
                <span className="text-dark-300 w-2/3">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseViewer;