'use client';

import { useState } from 'react';

import Features from '../Features/page';

export default function BackgroundRemover() {
  const [originalFile, setOriginalFile] = useState(null);  
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setOriginalFile(file);
      setOriginalImage(URL.createObjectURL(file));
      setProcessedImage(null);
      setError(null);
    }
  };

  const removeBg = async () => {
    if (!originalFile) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append("image_file", originalFile);
      formData.append("size", "auto");
  
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Background removal failed");
      }
  
      const blob = await response.blob();
      setProcessedImage(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      setError("Failed to remove background." ,err);
    } finally {
      setLoading(false);
    }
  };
  

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'background_removed.png';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    

    
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Background Remover</h2>
          <p className="mt-4 text-lg text-gray-500">Remove backgrounds from images using AI.</p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
         
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

           
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload an Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

       
            {originalImage && (
              <div className="mb-6">
                <button
                  onClick={removeBg}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Remove Background'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {originalImage && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Original</h3>
                  <img src={originalImage} alt="Original" className="w-full h-auto rounded-lg shadow" />
                </div>
              )}
              {processedImage && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Processed</h3>
                  <img src={processedImage} alt="Processed" className="w-full h-auto rounded-lg shadow" />
                  <button
                    onClick={downloadImage}
                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Download Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
        <Features showHeading={false}/>

      
    </div>
  );
}