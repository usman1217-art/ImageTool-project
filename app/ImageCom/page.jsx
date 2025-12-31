"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import Features from "../Features/page";

export default function Compressor() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(0.8);
  const [loading, setLoading] = useState(false);

 
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      const compressedFile = await imageCompression(
        originalFile,
        options
      );

      setCompressedImage(URL.createObjectURL(compressedFile));
      setCompressedSize(compressedFile.size);
    } catch (err) {
      console.error("Image compression failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!compressedImage) return;

    const link = document.createElement("a");
    link.href = compressedImage;
    link.download = "compressed-image.jpg";
    link.click();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Image Compressor
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Reduce image size without losing quality.
          </p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
          
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compression Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) =>
                    setQuality(parseFloat(e.target.value))
                  }
                  className="w-full"
                />

                <button
                  onClick={compressImage}
                  disabled={loading}
                  className="mt-4 w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Compressing..." : "Compress Image"}
                </button>
              </div>
            )}

          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {originalImage && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Original</h3>
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full rounded-lg shadow"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Size: {(originalSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              {compressedImage && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Compressed</h3>
                  <img
                    src={compressedImage}
                    alt="Compressed"
                    className="w-full rounded-lg shadow"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Size:{" "}
                    {(compressedSize / 1024 / 1024).toFixed(2)} MB
                  </p>

                  <button
                    onClick={downloadImage}
                    className="mt-4 w-full py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Download Compressed Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Features showHeading={false} />
    </div>
  );
}
