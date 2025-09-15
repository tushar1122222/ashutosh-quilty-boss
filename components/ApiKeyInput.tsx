
import React from 'react';
import Icon from './Icon';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onApiKeyChange }) => {
  return (
    <div className="space-y-3">
      <label htmlFor="apiKey" className="block text-lg font-semibold text-gray-300">
        Gemini API Key
      </label>
      <div className="relative">
        <Icon name="key" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="password"
          id="apiKey"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Enter your API key"
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
      <p className="text-xs text-gray-500">
        Your key is stored in your browser. Get your free key from{' '}
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
          Google AI Studio
        </a>.
      </p>
    </div>
  );
};

export default ApiKeyInput;
