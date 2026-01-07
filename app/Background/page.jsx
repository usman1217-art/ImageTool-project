'use client';

import { useState, useEffect } from 'react';
import Features from '../Features/page';

export default function BackgroundRemover() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (originalImage) URL.revokeObjectURL(originalImage);
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
      formData.append('image', originalFile);

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to remove background. Check API credits.');

      const blob = await response.blob();
      if (processedImage) URL.revokeObjectURL(processedImage);
      setProcessedImage(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'removed_bg.png';
    link.click();
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
            Magic <span className="text-indigo-600">Eraser</span>
          </h1>
          <p className="mt-4 text-slate-500 text-lg">Fast, AI-powered background removal.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded-r-lg">
              {error}
            </div>
          )}

          {/* Upload Box */}
          <div className="bg-white p-2 rounded-3xl shadow-xl border border-slate-200">
            <label className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="p-4 bg-indigo-50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-slate-700">Drop your image here</p>
                <p className="text-sm text-slate-400">PNG or JPG up to 10MB</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>

          {/* Action Button */}
          {originalImage && (
            <button
              onClick={removeBg}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 text-xl"
            >
              {loading ? 'AI is working...' : 'Remove Background Now'}
            </button>
          )}

          {/* Result Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {originalImage && (
              <div className="bg-white p-4 rounded-3xl shadow-md border border-slate-100">
                <p className="text-center font-bold text-slate-400 mb-4 text-sm uppercase">Original</p>
                <img src={originalImage} className="rounded-xl w-full h-auto max-h-[400px] object-contain" alt="Original" />
              </div>
            )}

            {processedImage && (
              <div className="bg-white p-4 rounded-3xl shadow-md border border-slate-100">
                <p className="text-center font-bold text-indigo-600 mb-4 text-sm uppercase">Result</p>
                <div className="rounded-xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-gray-200">
                  <img src={processedImage} className="w-full h-auto max-h-[400px] object-contain" alt="Processed" />
                </div>
                <button
                  onClick={downloadImage}
                  className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Download PNG
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Features showHeading={false} />
    </div>
  );
}