import Link from 'next/link';

export const metadata = {
  title: "Home",
  icons: {
    icon: "/image.png",
  },
};

function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      
      <main className="px-6 text-center max-w-4xl">

        {/* HERO */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight">
          Transform Your Images <br /> Effortlessly
        </h1>

        <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-600">
          Compress, remove backgrounds, and convert image formats using
          AI-powered tools. Fast. Simple. Free.
        </p>

        {/* GLASS BUTTON */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/Features"
            className="relative px-12 py-4 text-lg font-semibold text-white rounded-xl
            bg-indigo-600/80 backdrop-blur-md shadow-lg
            hover:bg-white/30 hover:text-indigo-900
            hover:backdrop-blur-xl hover:ring-2 hover:ring-white/50
            transition-all duration-300"
          >
            Get Started
          </Link>
        </div>

        {/* TRUST / STATS */}
        <div className="mt-12 flex flex-wrap justify-center gap-10 text-gray-700">

          <div className="text-center">
            <h3 className="text-3xl font-bold text-indigo-600">500+</h3>
            <p className="text-sm mt-1">Images Converted</p>
          </div>

          <div className="text-center">
            <h3 className="text-3xl font-bold text-indigo-600">99.9%</h3>
            <p className="text-sm mt-1">Accuracy Rate</p>
          </div>

          <div className="text-center">
            <h3 className="text-3xl font-bold text-indigo-600">100%</h3>
            <p className="text-sm mt-1">Free to Use</p>
          </div>

        </div>

      </main>
    </div>
  );
}

export default Home;
