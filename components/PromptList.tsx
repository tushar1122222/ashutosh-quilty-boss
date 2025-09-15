
import React, { useState } from 'react';
import Icon from './Icon';

interface PromptListProps {
  prompts: string[];
  isLoading: boolean;
  error: string | null;
  hasImage: boolean;
}

const PromptItem: React.FC<{ text: string; index: number }> = ({ text, index }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex items-start space-x-4 group">
            <span className="text-sm font-mono text-cyan-400 mt-1">{index + 1}.</span>
            <p className="flex-1 text-gray-300">{text}</p>
            <button onClick={handleCopy} className="p-1.5 rounded-md text-gray-500 hover:bg-gray-700 hover:text-white transition-opacity opacity-0 group-hover:opacity-100">
                <Icon name={copied ? 'check' : 'copy'} className="w-5 h-5" />
            </button>
        </div>
    );
};


const PromptList: React.FC<PromptListProps> = ({ prompts, isLoading, error, hasImage }) => {
  const handleCopyAll = () => {
    const allPromptsText = prompts.map((p, i) => `${i + 1}. ${p}`).join('\n\n');
    navigator.clipboard.writeText(allPromptsText);
  };
    
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Icon name="spinner" className="w-16 h-16 animate-spin text-cyan-500" />
        <p className="mt-4 text-lg">Generating prompts...</p>
        <p className="text-sm">This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600">
        <p className="text-lg">{hasImage ? 'Click "Generate Prompts" to begin.' : 'Upload an image to get started.'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Generated Prompts ({prompts.length})</h2>
        <button
            onClick={handleCopyAll}
            className="flex items-center py-2 px-4 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition-colors"
        >
            <Icon name="copy" className="w-5 h-5 mr-2" />
            Copy All
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {prompts.map((prompt, index) => (
          <PromptItem key={index} text={prompt} index={index} />
        ))}
      </div>
    </div>
  );
};

export default PromptList;
