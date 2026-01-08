'use client';

import { useState, useEffect } from 'react';
import Features from '../Features/page';

export default function BackgroundRemover() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [customName, setCustomName] = useState(''); // New state for renaming
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (processedImage) URL.revokeObjectURL(processedImage);
    };
  }, [originalImage, processedImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (originalImage) URL.revokeObjectURL(originalImage);
      
      // Auto-fill filename (stripping existing extension)
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      setCustomName(baseName);
      
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
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      // Use customName or fallback to default
      const fileName = customName.trim() || 'removed_bg';
      link.download = `${fileName}.png`;
      link.click();
    }
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
                <p className="text-center font-bold text-slate-400 mb-4 text-sm uppercase tracking-wider">Original</p>
                <img src={originalImage} className="rounded-xl w-full h-auto max-h-[400px] object-contain" alt="Original" />
              </div>
            )}

            {processedImage && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-3xl shadow-md border border-slate-100">
                  <p className="text-center font-bold text-indigo-600 mb-4 text-sm uppercase tracking-wider">Result</p>
                  <div className="rounded-xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-gray-200">
                    <img src={processedImage} className="w-full h-auto max-h-[400px] object-contain" alt="Processed" />
                  </div>
                </div>

                {/* File Rename Input */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">File Name</label>
                  <div className="flex items-center bg-slate-50 rounded-lg px-3 border border-slate-100 focus-within:border-indigo-300 transition-colors">
                    <input 
                      type="text" 
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Enter file name"
                      className="bg-transparent border-none w-full py-2 text-slate-700 font-medium focus:ring-0 outline-none"
                    />
                    <span className="text-slate-400 font-bold text-sm">.png</span>
                  </div>
                </div>

                <button
                  onClick={downloadImage}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
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