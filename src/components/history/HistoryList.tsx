import React, { useState } from 'react';
import { useRequestStore } from '../../store/requestStore';
import { HistoryItem } from '../../types';
import { Button } from '../ui/Button';
import { Clock, Trash2, ExternalLink, Search } from 'lucide-react';
import { Input } from '../ui/Input';

const HistoryList: React.FC = () => {
  const { history, clearHistory, setCurrentRequest } = useRequestStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.request.name.toLowerCase().includes(searchLower) ||
      item.request.url.toLowerCase().includes(searchLower) ||
      item.request.method.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  const getStatusColor = (status?: number) => {
    if (!status) return 'text-red-500';
    if (status >= 200 && status < 300) return 'text-green-500';
    if (status >= 300 && status < 400) return 'text-blue-500';
    if (status >= 400 && status < 500) return 'text-yellow-500';
    if (status >= 500) return 'text-red-500';
    return 'text-white';
  };

  const handleLoadRequest = (item: HistoryItem) => {
    setCurrentRequest(item.request);
  };

  return (
    <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
      <div className="p-4 border-b border-dark-700 flex justify-between items-center">
        <h3 className="font-medium text-white flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Request History
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-dark-400 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="p-4 border-b border-dark-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-400" />
          <Input
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-dark-400">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No request history found</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-700">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-dark-700 cursor-pointer"
                onClick={() => handleLoadRequest(item)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <span
                      className={`text-xs font-mono px-2 py-1 rounded mr-2 ${
                        item.request.method === 'GET'
                          ? 'bg-green-500/20 text-green-300'
                          : item.request.method === 'POST'
                          ? 'bg-blue-500/20 text-blue-300'
                          : item.request.method === 'PUT'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : item.request.method === 'DELETE'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {item.request.method}
                    </span>
                    <span className="text-sm font-medium">{item.request.name}</span>
                  </div>
                  <span className="text-xs text-dark-400">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <div className="text-xs text-dark-300 truncate mb-2">
                  {item.request.url}
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-mono ${getStatusColor(
                      item.response?.status
                    )}`}
                  >
                    {item.response ? `${item.response.status} ${item.response.statusText}` : 'Failed'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadRequest(item);
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryList;