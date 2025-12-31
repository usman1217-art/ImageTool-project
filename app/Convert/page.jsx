'use client';

import { useState } from 'react';

import Features from '../Features/page';

export default function Converter() {
  const [originalImage, setOriginalImage] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [format, setFormat] = useState('png');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setOriginalImage(URL.createObjectURL(file));
      setConvertedImage(null);
      setError(null);
    }
  };

  const convertImage = async () => {
    if (!originalImage) return;

    setLoading(true);
    setError(null);

    try {
      const img = new window.Image(); 
      img.src = originalImage;

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const mimeType = `image/${format}`;
          canvas.toBlob((blob) => {
            if (blob) {
              setConvertedImage(URL.createObjectURL(blob));
            } else {
              setError('Failed to convert image. Try a different format.');
            }
            setLoading(false);
          }, mimeType);
        } catch (drawError) {
          console.error('Drawing error:', drawError);
          setError('Error processing the image.');
          setLoading(false);
        }
      };

      img.onerror = () => {
        console.error('Image load error');
        setError('Failed to load the image. Try uploading again.');
        setLoading(false);
      };
    } catch (error) {
      console.error('Conversion setup failed:', error);
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (convertedImage) {
      const link = document.createElement('a');
      link.href = convertedImage;
      link.download = `converted_image.${format}`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
     
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Extension Converter</h2>
          <p className="mt-4 text-lg text-gray-500">Convert images to different formats.</p>
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
                <label className="block text-sm font-medium text-black mb-2">
                  Output Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="webp">WebP</option>
                </select>
                <button
                  onClick={convertImage}
                  disabled={loading}
                  className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Converting...' : 'Convert Image'}
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
              {convertedImage && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Converted ({format.toUpperCase()})</h3>
                  <img src={convertedImage} alt="Converted" className="w-full h-auto rounded-lg shadow" />
                  <button
                    onClick={downloadImage}
                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Download Converted Image
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