import React, { useEffect, useState } from "react";

export default function Error() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setInView(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 px-4 text-center min-h-screen flex items-center justify-center">
      <div
        className={`transition-all duration-1000 ease-out max-w-md mx-auto ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Error Code */}
        <div className="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          404
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>

        {/* Action Button */}
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go back home
        </a>
        
      </div>
    </section>
  );
}
