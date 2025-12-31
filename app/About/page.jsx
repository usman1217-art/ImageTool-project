"use client"

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
     
     

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">About ImageTools</h2>
          <p className="mt-4 text-lg text-gray-500">Learn more about our mission and technology.</p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <p className="text-gray-600 text-lg leading-relaxed">
            ImageTools is a free, web-based platform designed to simplify image processing tasks. Whether you're a photographer, designer, or casual user, our tools help you compress images for faster loading, remove backgrounds effortlessly, and convert file formats with ease.
          </p>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            Built with cutting-edge technology, including AI for background removal and optimized algorithms for compression, ImageTools ensures high-quality results without compromising on speed or privacy. Your images are processed securely and never stored on our servers.
          </p>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            Our goal is to make image editing accessible to everyone, empowering creators to focus on their work rather than technical hurdles.
          </p>
        </div>
      </main>

      
     
    </div>
  );}