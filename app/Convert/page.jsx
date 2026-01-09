'use client';

import { useState, useEffect } from 'react';

export default function ImageConverter() {
  const [originalImage, setOriginalImage] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [format, setFormat] = useState('png');
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (convertedImage) URL.revokeObjectURL(convertedImage);
    };
  }, [originalImage, convertedImage]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    setCustomName(baseName);

    try {
      let displayFile = file;
      const fileNameLower = file.name.toLowerCase();
      
      if (fileNameLower.endsWith('.heic') || fileNameLower.endsWith('.heif')) {
        const heic2any = (await import('heic2any')).default;
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
        });
        displayFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      }

      if (originalImage) URL.revokeObjectURL(originalImage);
      setOriginalImage(URL.createObjectURL(displayFile));
      setConvertedImage(null);
    } catch (err) {
      setError('Could not process this file type.');
    } finally {
      setLoading(false);
    }
  };

  const convertImage = async () => {
    if (!originalImage) return;
    setLoading(true);
    setError(null);

    try {
      const img = new window.Image();
      img.src = originalImage;

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        if (format === 'jpg' || format === 'heic') {
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);

        // Logic for HEIC Output
        if (format === 'heic') {
          const heic2any = (await import('heic2any')).default;
          // Canvas -> Blob (JPEG) -> HEIC Blob
          canvas.toBlob(async (blob) => {
            try {
              const heicBlob = await heic2any({
                blob: blob,
                toType: 'image/heic',
                quality: 0.8
              });
              if (convertedImage) URL.revokeObjectURL(convertedImage);
              setConvertedImage(URL.createObjectURL(heicBlob));
              setLoading(false);
            } catch (e) {
              setError("HEIC encoding failed.");
              setLoading(false);
            }
          }, 'image/jpeg', 0.9);
        } else {
          // Logic for standard formats
          const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
          canvas.toBlob((blob) => {
            if (blob) {
              if (convertedImage) URL.revokeObjectURL(convertedImage);
              setConvertedImage(URL.createObjectURL(blob));
            }
            setLoading(false);
          }, mimeType, 0.9);
        }
      };
    } catch (err) {
      setError('Error processing the image.');
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (convertedImage) {
      const link = document.createElement('a');
      link.href = convertedImage;
      const fileName = customName.trim() || 'converted_file';
      link.download = `${fileName}.${format}`;
      link.click();
    }
  };

  if (!mounted) return <div className="min-h-screen bg-slate-50" />; 

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
            Format <span className="text-indigo-600">Shifter</span>
          </h1>
          <p className="mt-4 text-slate-500 text-lg">Convert to PNG, JPG, WebP, and HEIC instantly.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded-r-lg">{error}</div>}

          <div className="bg-white p-2 rounded-3xl shadow-xl border border-slate-200">
            <label className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="text-lg font-bold text-slate-700">{loading ? "Processing..." : "Upload Image"}</p>
                <p className="text-sm text-slate-400">All modern formats supported</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.heic,.heif" />
            </label>
          </div>

          {originalImage && (
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Target Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-4 px-4 text-lg font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="png">PNG (Lossless)</option>
                  <option value="jpg">JPG (Standard)</option>
                  <option value="webp">WebP (Compressed)</option>
                  <option value="heic">HEIC (High Efficiency)</option>
                </select>
              </div>
              <button
                onClick={convertImage}
                disabled={loading}
                className="w-full md:w-auto px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
              >
                {loading ? 'Converting...' : 'Convert Now'}
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {originalImage && (
              <div className="space-y-4">
                <p className="text-center font-bold text-slate-400 text-sm uppercase tracking-widest">Original</p>
                <div className="bg-white p-3 rounded-3xl shadow-md border border-slate-100 h-[350px] flex items-center justify-center overflow-hidden">
                  <img src={originalImage} className="max-w-full max-h-full object-contain rounded-xl" alt="Original" />
                </div>
              </div>
            )}

            {convertedImage && (
              <div className="space-y-4">
                <p className="text-center font-bold text-indigo-600 text-sm uppercase tracking-widest">Converted</p>
                <div className="bg-white p-3 rounded-3xl shadow-md border border-indigo-100 h-[350px] flex items-center justify-center overflow-hidden relative">
                    <img src={convertedImage} className="max-w-full max-h-full object-contain rounded-xl" alt="Converted" />
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">File Name</label>
                  <div className="flex items-center bg-slate-50 rounded-lg px-3 border border-slate-100">
                    <input 
                      type="text" 
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="bg-transparent border-none w-full py-2 text-slate-700 font-medium focus:ring-0 outline-none"
                    />
                    <span className="text-slate-400 font-bold text-sm">.{format}</span>
                  </div>
                </div>

                <button
                  onClick={downloadImage}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  Download {format.toUpperCase()}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}