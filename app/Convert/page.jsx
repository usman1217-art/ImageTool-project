'use client';

import { useState, useEffect } from 'react';
import Features from '../Features/page';

export default function Converter() {
  const [originalImage, setOriginalImage] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [format, setFormat] = useState('png');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Hydration safety
  useEffect(() => {
    setMounted(true);
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (convertedImage) URL.revokeObjectURL(convertedImage);
    };
  }, [originalImage, convertedImage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (originalImage) URL.revokeObjectURL(originalImage);
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

          // Fix for JPG transparency (fills background with white)
          if (format === 'jpg') {
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
          canvas.toBlob((blob) => {
            if (blob) {
              if (convertedImage) URL.revokeObjectURL(convertedImage);
              setConvertedImage(URL.createObjectURL(blob));
            } else {
              setError('Failed to convert image.');
            }
            setLoading(false);
          }, mimeType, 0.9);
        } catch (err) {
          setError('Error processing the image.');
          setLoading(false);
        }
      };
    } catch (err) {
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
            Format <span className="text-indigo-600">Shifter</span>
          </h1>
          <p className="mt-4 text-slate-500 text-lg">Convert any image to PNG, JPG, or WebP instantly.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded-r-lg animate-shake">
              {error}
            </div>
          )}

          {/* Upload Box */}
          <div className="bg-white p-2 rounded-3xl shadow-xl border border-slate-200">
            <label className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="p-4 bg-indigo-50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-slate-700">Upload image to convert</p>
                <p className="text-sm text-slate-400">Supports all major image formats</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>

          {/* Controls */}
          {originalImage && (
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Target Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-4 px-4 text-lg font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="png">PNG (Lossless)</option>
                  <option value="jpg">JPG (Small size)</option>
                  <option value="webp">WebP (Modern)</option>
                </select>
              </div>
              <button
                onClick={convertImage}
                disabled={loading}
                className="w-full md:w-auto px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'Processing...' : 'Convert Now'}
              </button>
            </div>
          )}

          {/* Results Display */}
          <div className="grid md:grid-cols-2 gap-8">
            {originalImage && (
              <div className="space-y-4">
                <p className="text-center font-bold text-slate-400 text-sm uppercase tracking-widest">Original Image</p>
                <div className="bg-white p-3 rounded-3xl shadow-md border border-slate-100 h-[350px] flex items-center justify-center overflow-hidden">
                  <img src={originalImage} className="max-w-full max-h-full object-contain rounded-xl" alt="Original" />
                </div>
              </div>
            )}

            {convertedImage && (
              <div className="space-y-4">
                <p className="text-center font-bold text-indigo-600 text-sm uppercase tracking-widest">Converted {format.toUpperCase()}</p>
                <div className="bg-white p-3 rounded-3xl shadow-md border border-indigo-100 h-[350px] flex items-center justify-center overflow-hidden relative">
                  {/* Checkerboard pattern for transparency preview */}
                  <div className="absolute inset-3 rounded-xl bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-gray-100 -z-0"></div>
                  <img src={convertedImage} className="max-w-full max-h-full object-contain rounded-xl relative z-10" alt="Converted" />
                </div>
                <button
                  onClick={downloadImage}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download {format.toUpperCase()}
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