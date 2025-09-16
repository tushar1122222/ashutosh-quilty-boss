import React, { useState, useEffect } from 'react';
import * as geminiService from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import PromptList from './components/PromptList';
import Loader from './components/Loader';
import ApiKeyInput from './components/ApiKeyInput';

function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [numPrompts, setNumPrompts] = useState(5);
  
  const [category, setCategory] = useState('general');
  const [additionalSentence, setAdditionalSentence] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    window.location.reload(); 
  };

  const handleGeneratePrompts = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }
    if (!apiKey) {
      alert("Please enter your Gemini API Key.");
      return;
    }
    setIsLoading(true);
    setPrompts([]);
    try {
      const generatedPrompts = await geminiService.generatePromptsForImage(
        image,
        numPrompts,
        category,
        additionalSentence
      );
      setPrompts(generatedPrompts);
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating prompts.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKey) {
    return <ApiKeyInput onSubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-400">Ashutosh's Quilty Boss</h1>
          <p className="text-gray-400 mt-2">Upload an image and get creative prompts instantly!</p>
        </header>

        <main className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col space-y-6">
              <ImageUploader onImageUpload={setImage} />
              
              <div>
                <label htmlFor="num-prompts" className="block mb-2 font-medium">Number of Prompts: {numPrompts}</label>
                <input
                  id="num-prompts"
                  type="range"
                  min="1"
                  max="10"
                  value={numPrompts}
                  onChange={(e) => setNumPrompts(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label htmlFor="category-select" className="block mb-2 font-medium">Category</label>
                <select 
                  id="category-select" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="general">General (No specific style)</option>
                  <option value="vector">Vector</option>
                  <option value="mascot logo">Mascot Logo</option>
                  <option value="raster illustration">Raster Illustration</option>
                  <option value="typography">Typography</option>
                </select>
              </div>

              <div>
                <label htmlFor="additional-sentence" className="block mb-2 font-medium">Add to All Prompts (Optional)</label>
                <input
                  type="text"
                  id="additional-sentence"
                  value={additionalSentence}
                  onChange={(e) => setAdditionalSentence(e.target.value)}
                  placeholder="e.g., in a futuristic style"
                  className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={handleGeneratePrompts}
                disabled={isLoading || !image}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                {isLoading ? 'Generating...' : 'Generate Prompts'}
              </button>
            </div>

            <div className="flex items-center justify-center min-h-[200px] bg-gray-900 rounded-lg p-4">
              {isLoading ? <Loader /> : <PromptList prompts={prompts} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;