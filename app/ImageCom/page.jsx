'use client';

import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import Features from '../Features/page';

export default function Compressor() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [customName, setCustomName] = useState(''); // New state for renaming
  const [quality, setQuality] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydration safety and memory cleanup
  useEffect(() => {
    setMounted(true);
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (compressedImage) URL.revokeObjectURL(compressedImage);
    };
  }, [originalImage, compressedImage]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Auto-fill filename (stripping existing extension)
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    setCustomName(baseName);

    if (originalImage) URL.revokeObjectURL(originalImage);
    setOriginalFile(file);
    setOriginalImage(URL.createObjectURL(file));
    setOriginalSize(file.size);
    setCompressedImage(null);
    setCompressedSize(0);
  };

  const compressImage = async () => {
    if (!originalFile) return;

    setLoading(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality,
      };

      const compressedFile = await imageCompression(originalFile, options);

      if (compressedImage) URL.revokeObjectURL(compressedImage);
      setCompressedImage(URL.createObjectURL(compressedFile));
      setCompressedSize(compressedFile.size);
    } catch (err) {
      console.error("Compression failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!compressedImage) return;
    const link = document.createElement("a");
    link.href = compressedImage;
    
    // Get extension from original file or default to jpg
    const extension = originalFile.name.split('.').pop();
    const fileName = customName.trim() || 'compressed_image';
    
    link.download = `${fileName}.${extension}`;
    link.click();
  };

  if (!mounted) return null;

  const savedPercent = originalSize > 0 
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100)) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
            Smart <span className="text-indigo-600">Squeezer</span>
          </h1>
          <p className="mt-4 text-slate-500 text-lg">
            Reduce file size while keeping high visual quality.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Upload Box */}
          <div className="bg-white p-2 rounded-3xl shadow-xl border border-slate-200">
            <label className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="p-4 bg-indigo-50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-slate-700">Drop your heavy image here</p>
                <p className="text-sm text-slate-400">Works with PNG, JPG, and WebP</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>

          {/* Compression Settings */}
          {originalImage && (
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Target Quality: {Math.round(quality * 100)}%
                  </label>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {quality > 0.7 ? 'High Quality' : quality > 0.4 ? 'Balanced' : 'Smallest Size'}
                  </span>
                </div>
                <input
                  type="range" min="0.1" max="1" step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <button
                onClick={compressImage}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 text-xl"
              >
                {loading ? 'Squeezing...' : 'Compress Image Now'}
              </button>
            </div>
          )}

          {/* Result Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {originalImage && (
              <div className="space-y-4">
                <div className="flex justify-between items-end px-2">
                  <p className="font-bold text-slate-400 text-sm uppercase tracking-widest">Original</p>
                  <p className="text-slate-900 font-bold">{(originalSize / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div className="bg-white p-3 rounded-3xl shadow-md border border-slate-100 h-[350px] flex items-center justify-center overflow-hidden">
                  <img src={originalImage} className="max-w-full max-h-full object-contain rounded-xl" alt="Original" />
                </div>
              </div>
            )}

            {compressedImage && (
              <div className="space-y-4">
                <div className="flex justify-between items-end px-2">
                  <p className="font-bold text-indigo-600 text-sm uppercase tracking-widest">Compressed</p>
                  <div className="text-right">
                     <p className="text-emerald-600 font-bold">{(compressedSize / 1024 / 1024).toFixed(2)} MB</p>
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Saved {savedPercent}%</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-3xl shadow-md border border-indigo-100 h-[350px] flex items-center justify-center overflow-hidden">
                  <img src={compressedImage} className="max-w-full max-h-full object-contain rounded-xl" alt="Compressed" />
                </div>

                {/* File Rename Input */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Download Name</label>
                  <div className="flex items-center bg-slate-50 rounded-lg px-3 border border-slate-100 focus-within:border-indigo-300 transition-colors">
                    <input 
                      type="text" 
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Enter file name"
                      className="bg-transparent border-none w-full py-2 text-slate-700 font-medium focus:ring-0 outline-none"
                    />
                    <span className="text-slate-400 font-bold text-sm">.{originalFile?.name.split('.').pop()}</span>
                  </div>
                </div>

                <button
                  onClick={downloadImage}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Squeezed Image
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