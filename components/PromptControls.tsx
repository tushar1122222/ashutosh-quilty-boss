
import React from 'react';
import Icon from './Icon';

interface PromptControlsProps {
  promptCount: number;
  setPromptCount: (count: number) => void;
  onGenerate: () => void;
  isDisabled: boolean;
}

const PromptControls: React.FC<PromptControlsProps> = ({ promptCount, setPromptCount, onGenerate, isDisabled }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="promptCount" className="block text-lg font-semibold text-gray-300">
          Number of Prompts
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            id="promptCount"
            min="1"
            max="1000"
            value={promptCount}
            onChange={(e) => setPromptCount(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <input 
            type="number"
            min="1"
            max="1000"
            value={promptCount}
            onChange={(e) => setPromptCount(Number(e.target.value))}
            className="w-24 bg-gray-700 border border-gray-600 rounded-md text-center py-1"
          />
        </div>
      </div>
      <button
        onClick={onGenerate}
        disabled={isDisabled}
        className="w-full flex items-center justify-center py-3 px-4 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
      >
        <Icon name="generate" className="w-5 h-5 mr-2" />
        Generate Prompts
      </button>
    </div>
  );
};

export default PromptControls;
