import Image from 'next/image';
import Link from 'next/link';

export default function Features({ showHeading = true }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
       
        {showHeading && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Our Powerful Features
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Discover what makes ImageTools the best choice for image processing.
            </p>
          </div>
        )}

     
        <div className="grid gap-8 md:grid-cols-3">
       
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h4 className="ml-3 text-lg font-medium text-gray-900">Image Compressor</h4>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Advanced compression algorithms reduce file sizes by up to 90% while maintaining quality. Supports batch processing and customizable settings.
              </p>
              <div className="mt-4">
                <Link href="/ImageCom" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Try Compressor →
                </Link>
              </div>
            </div>
          </div>

       
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="ml-3 text-lg font-medium text-gray-900">Background Remover</h4>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                AI-powered background removal with pixel-perfect accuracy. Handles complex images and provides transparent PNG outputs.
              </p>
              <div className="mt-4">
                <Link href="/Background" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Try Background Remover →
                </Link>
              </div>
            </div>
          </div>

         
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="  shrink-0">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h4 className="ml-3 text-lg font-medium text-gray-900">Extension Converter</h4>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Convert between multiple formats including JPG, PNG, WebP, GIF, and TIFF. Preserves metadata and quality during conversion.
              </p>
              <div className="mt-4">
                <Link href="/Convert" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Try Converter →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
