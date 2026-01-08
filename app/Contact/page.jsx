"use client"
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Contact() {
  const [state, handleSubmit] = useForm("xjgkndky");

  if (state.succeeded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white shadow-xl rounded-lg">
          <h2 className="text-2xl font-bold text-indigo-600">Thanks for joining!</h2>
          <p className="mt-2 text-gray-900">We'll get back to you as soon as possible.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 underline"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Contact Us</h2>
          <p className="mt-4 text-lg text-gray-700">Have questions or feedback? We'd love to hear from you.</p>
        </div>

        <div className="mt-12 max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-900">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                placeholder="Your Name"
                required
              />
              <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-600 text-xs mt-1" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-900">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                placeholder="your@email.com"
                required
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-600 text-xs mt-1" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-gray-900">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                placeholder="Your message here..."
                required
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-600 text-xs mt-1" />
            </div>

            <div>
              <button
                type="submit"
                disabled={state.submitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {state.submitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-900 font-medium">
            Alternatively, reach out to us at <a href="mailto:support@imagetools.com" className="text-indigo-600 hover:text-indigo-800 font-bold">support@imagetools.com</a>
          </p>
        </div>
      </main>
    </div>
  );
}