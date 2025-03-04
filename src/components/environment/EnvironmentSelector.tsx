import React, { useState } from 'react';
import { useEnvironmentStore } from '../../store/environmentStore';
import { Environment, EnvironmentVariable } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Settings, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const EnvironmentSelector: React.FC = () => {
  const {
    environments,
    currentEnvironment,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
    setCurrentEnvironment,
    addVariable,
    updateVariable,
    deleteVariable,
  } = useEnvironmentStore();

  const [isOpen, setIsOpen] = useState(false);
  const [newEnvName, setNewEnvName] = useState('');
  const [isCreatingEnv, setIsCreatingEnv] = useState(false);
  const [newVarKey, setNewVarKey] = useState('');
  const [newVarValue, setNewVarValue] = useState('');

  const handleCreateEnvironment = () => {
    if (newEnvName.trim()) {
      createEnvironment(newEnvName);
      setNewEnvName('');
      setIsCreatingEnv(false);
    }
  };

  const handleAddVariable = () => {
    if (currentEnvironment && newVarKey.trim() && newVarValue.trim()) {
      addVariable(currentEnvironment.id, newVarKey, newVarValue);
      setNewVarKey('');
      setNewVarValue('');
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <Select
          value={currentEnvironment?.id || ''}
          onValueChange={(value) => setCurrentEnvironment(value === 'none' ? null : value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Environment</SelectItem>
            {environments.map((env) => (
              <SelectItem key={env.id} value={env.id}>
                {env.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-dark-800 rounded-lg shadow-lg border border-dark-700 z-10">
          <div className="p-4 border-b border-dark-700 flex justify-between items-center">
            <h3 className="font-medium text-white">Environment Manager</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-white">Environments</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreatingEnv(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>

            {isCreatingEnv && (
              <div className="mb-4 p-2 bg-dark-700/50 rounded-md">
                <div className="flex gap-2">
                  <Input
                    value={newEnvName}
                    onChange={(e) => setNewEnvName(e.target.value)}
                    placeholder="Environment name"
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleCreateEnvironment}>
                    Create
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreatingEnv(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
              {environments.length === 0 ? (
                <div className="text-center py-2 text-dark-400 text-sm">
                  <p>No environments created yet</p>
                </div>
              ) : (
                environments.map((env) => (
                  <div
                    key={env.id}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      currentEnvironment?.id === env.id
                        ? 'bg-dark-700'
                        : 'hover:bg-dark-700'
                    }`}
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => setCurrentEnvironment(env.id)}
                    >
                      <span className="text-sm">{env.name}</span>
                      <span className="text-xs text-dark-400 ml-2">
                        ({env.variables.length} variables)
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          const newName = prompt('Enter new name', env.name);
                          if (newName) {
                            updateEnvironment(env.id, { name: newName });
                          }
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          if (
                            confirm(
                              'Are you sure you want to delete this environment?'
                            )
                          ) {
                            deleteEnvironment(env.id);
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

            {currentEnvironment && (
              <>
                <div className="border-t border-dark-700 pt-4 mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">
                    Variables for {currentEnvironment.name}
                  </h4>

                  <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                    {currentEnvironment.variables.length === 0 ? (
                      <div className="text-center py-2 text-dark-400 text-sm">
                        <p>No variables in this environment</p>
                      </div>
                    ) : (
                      currentEnvironment.variables.map((variable) => (
                        <div
                          key={variable.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={variable.enabled}
                            onChange={(e) =>
                              updateVariable(currentEnvironment.id, variable.id, {
                                enabled: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-dark-600 text-primary-500 focus:ring-primary-500"
                          />
                          <Input
                            value={variable.key}
                            onChange={(e) =>
                              updateVariable(currentEnvironment.id, variable.id, {
                                key: e.target.value,
                              })
                            }
                            placeholder="Key"
                            className="flex-1"
                          />
                          <Input
                            value={variable.value}
                            onChange={(e) =>
                              updateVariable(currentEnvironment.id, variable.id, {
                                value: e.target.value,
                              })
                            }
                            placeholder="Value"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              deleteVariable(currentEnvironment.id, variable.id)
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      value={newVarKey}
                      onChange={(e) => setNewVarKey(e.target.value)}
                      placeholder="New key"
                      className="flex-1"
                    />
                    <Input
                      value={newVarValue}
                      onChange={(e) => setNewVarValue(e.target.value)}
                      placeholder="Value"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleAddVariable}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-dark-400 mt-2">
                  <p>
                    Use variables in your requests with the format:{' '}
                    <code className="bg-dark-700 px-1 py-0.5 rounded">
                      {'{{variableName}}'}
                    </code>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentSelector;