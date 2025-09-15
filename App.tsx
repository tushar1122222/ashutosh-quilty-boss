
import React, { useState, useCallback, useEffect } from 'react';
import type { ImageFile } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PromptControls from './components/PromptControls';
import PromptList from './components/PromptList';
import ApiKeyInput from './components/ApiKeyInput';
import { generatePromptsFromImage } from './services/geminiService';

const API_KEY_STORAGE_KEY = 'gemini-api-key';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [promptCount, setPromptCount] = useState<number>(5);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    // Load API key from local storage on initial mount
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    // Cleanup object URL to avoid memory leaks
    return () => {
      if (imageFile) {
        URL.revokeObjectURL(imageFile.previewUrl);
      }
    };
  }, [imageFile]);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
  };

  const handleImageChange = (file: File | null) => {
    if (imageFile) {
      URL.revokeObjectURL(imageFile.previewUrl);
    }
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageFile({ file, previewUrl });
      setGeneratedPrompts([]);
      setError(null);
    } else {
      setImageFile(null);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!apiKey) {
      setError("Please enter your Gemini API key first.");
      return;
    }
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPrompts([]);

    try {
      const prompts = await generatePromptsFromImage(imageFile.file, promptCount, apiKey);
      setGeneratedPrompts(prompts);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, promptCount, apiKey]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        {/* Control Panel */}
        <div className="w-1/3 max-w-sm flex flex-col border-r border-gray-700 bg-gray-800 p-6 space-y-6 overflow-y-auto">
          <ImageUploader imageFile={imageFile} onImageChange={handleImageChange} />
          <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
          <PromptControls
            promptCount={promptCount}
            setPromptCount={setPromptCount}
            onGenerate={handleGenerate}
            isDisabled={!imageFile || isLoading}
          />
        </div>

        {/* Prompt Display Panel */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <PromptList
            prompts={generatedPrompts}
            isLoading={isLoading}
            error={error}
            hasImage={!!imageFile}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
