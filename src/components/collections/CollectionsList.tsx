import React, { useState } from 'react';
import { useRequestStore } from '../../store/requestStore';
import { Collection, ApiRequest } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  FolderPlus, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Edit2, 
  Trash2, 
  Star, 
  MoreVertical,
  Copy
} from 'lucide-react';

const CollectionsList: React.FC = () => {
  const { 
    collections, 
    createCollection, 
    updateCollection, 
    deleteCollection,
    createRequest,
    updateRequest,
    deleteRequest,
    setCurrentRequest,
    favorites,
    addToFavorites,
    removeFromFavorites
  } = useRequestStore();
  
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({});
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [editingRequest, setEditingRequest] = useState<{collectionId: string, requestId: string} | null>(null);
  
  const toggleCollectionExpand = (collectionId: string) => {
    setExpandedCollections(prev => ({
      ...prev,
      [collectionId]: !prev[collectionId]
    }));
  };
  
  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName);
      setNewCollectionName('');
      setIsCreatingCollection(false);
    }
  };
  
  const handleUpdateCollection = (id: string, name: string) => {
    updateCollection(id, { name });
    setEditingCollection(null);
  };
  
  const handleCreateRequest = (collectionId: string) => {
    createRequest(collectionId, {
      name: 'New Request',
      url: '',
      method: 'GET'
    });
    
    // Ensure the collection is expanded
    setExpandedCollections(prev => ({
      ...prev,
      [collectionId]: true
    }));
  };
  
  const handleUpdateRequest = (collectionId: string, requestId: string, name: string) => {
    updateRequest(collectionId, requestId, { name });
    setEditingRequest(null);
  };
  
  const handleSelectRequest = (request: ApiRequest) => {
    setCurrentRequest(request);
  };
  
  const toggleFavorite = (requestId: string) => {
    if (favorites.includes(requestId)) {
      removeFromFavorites(requestId);
    } else {
      addToFavorites(requestId);
    }
  };
  
  return (
    <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
      <div className="p-4 border-b border-dark-700 flex justify-between items-center">
        <h3 className="font-medium text-white">Collections</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsCreatingCollection(true)}
        >
          <FolderPlus className="h-4 w-4" />
        </Button>
      </div>
      
      {isCreatingCollection && (
        <div className="p-4 border-b border-dark-700 bg-dark-700/50">
          <div className="flex gap-2">
            <Input
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection name"
              className="flex-1"
            />
            <Button size="sm" onClick={handleCreateCollection}>
              Create
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsCreatingCollection(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      <div className="p-2 max-h-96 overflow-y-auto">
        {collections.length === 0 ? (
          <div className="text-center py-8 text-dark-400">
            <FolderPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No collections yet</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2"
              onClick={() => setIsCreatingCollection(true)}
            >
              Create Collection
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {collections.map((collection) => (
              <div key={collection.id} className="rounded-md overflow-hidden">
                <div 
                  className="flex items-center justify-between p-2 hover:bg-dark-700 cursor-pointer rounded-md"
                  onClick={() => toggleCollectionExpand(collection.id)}
                >
                  <div className="flex items-center">
                    {expandedCollections[collection.id] ? (
                      <ChevronDown className="h-4 w-4 text-dark-400 mr-1" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-dark-400 mr-1" />
                    )}
                    
                    {editingCollection === collection.id ? (
                      <Input
                        value={collection.name}
                        onChange={(e) => updateCollection(collection.id, { name: e.target.value })}
                        onBlur={() => handleUpdateCollection(collection.id, collection.name)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateCollection(collection.id, collection.name);
                          }
                        }}
                        className="py-0 h-6 text-sm"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-sm font-medium">{collection.name}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateRequest(collection.id);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCollection(collection.id);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this collection?')) {
                          deleteCollection(collection.id);
                        }
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {expandedCollections[collection.id] && (
                  <div className="pl-6 pr-2 pb-2 space-y-1">
                    {collection.requests.length === 0 ? (
                      <div className="text-center py-2 text-dark-400 text-xs">
                        <p>No requests in this collection</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-1 text-xs py-1 h-auto"
                          onClick={() => handleCreateRequest(collection.id)}
                        >
                          Add Request
                        </Button>
                      </div>
                    ) : (
                      collection.requests.map((request) => (
                        <div 
                          key={request.id} 
                          className="flex items-center justify-between p-2 hover:bg-dark-700 cursor-pointer rounded-md"
                          onClick={() => handleSelectRequest(request)}
                        >
                          <div className="flex items-center">
                            <span className={`text-xs font-mono px-2 rounded mr-2 ${
                              request.method === 'GET' ? 'bg-green-500/20 text-green-300' :
                              request.method === 'POST' ? 'bg-blue-500/20 text-blue-300' :
                              request.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-300' :
                              request.method === 'DELETE' ? 'bg-red-500/20 text-red-300' :
                              'bg-purple-500/20 text-purple-300'
                            }`}>
                              {request.method}
                            </span>
                            
                            {editingRequest && 
                             editingRequest.collectionId === collection.id && 
                             editingRequest.requestId === request.id ? (
                              <Input
                                value={request.name}
                                onChange={(e) => updateRequest(collection.id, request.id, { name: e.target.value })}
                                onBlur={() => handleUpdateRequest(collection.id, request.id, request.name)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdateRequest(collection.id, request.id, request.name);
                                  }
                                }}
                                className="py-0 h-6 text-sm"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span className="text-sm truncate max-w-[150px]">{request.name}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(request.id);
                              }}
                            >
                              <Star className={`h-3 w-3 ${
                                favorites.includes(request.id) ? 'fill-yellow-500 text-yellow-500' : ''
                              }`} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingRequest({
                                  collectionId: collection.id,
                                  requestId: request.id
                                });
                              }}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this request?')) {
                                  deleteRequest(collection.id, request.id);
                                }
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsList;