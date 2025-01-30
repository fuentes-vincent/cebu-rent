'use client';
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";
import Search from './navbar/Search';

export default function Navbar() {
  const { user, signOut } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      {/* Desktop header */}
      <header className="hidden md:block fixed w-full bg-white z-10">
        <div className="py-4 border-b-[1px] border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-[2520px] mx-auto px-4 md:px-8">
            {/* Top row - Logo and Menu */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/rent.svg"
                  alt="Rentify Logo"
                  width={32}
                  height={32}
                  priority
                />
                <span className="text-large font-bold text-neutral-800">Cebu-rent</span>
              </Link>
            </div>

            {/* Desktop search bar - Centered */}
            <div className="hidden md:block md:w-1/3 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
              <Search />
            </div>

            {/* Right Side Menu */}
            <div className="flex items-center gap-4">
              {user ? (
                <Link 
                  href="/listings/new" 
                  className="hidden md:block text-sm font-medium text-neutral-800 py-3 px-4 rounded-full hover:bg-neutral-50 transition"
                >
                  List your property
                </Link>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hidden md:block text-sm font-medium text-neutral-800 py-3 px-4 rounded-full hover:bg-neutral-50 transition"
                >
                  Rent a home
                </button>
              )}
              
              <div 
                onClick={user ? () => signOut() : () => setShowAuthModal(true)}
                className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-6 h-6 text-neutral-700"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
                  />
                </svg>
                <div className="hidden md:block">
                  {user ? (
                    <Image
                      src={user.user_metadata?.avatar_url || "/images/placeholder.jpg"}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="w-6 h-6 text-neutral-500"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile header */}
      <header className="md:hidden">
        {/* Fixed top bar */}
        <div className="fixed top-0 left-0 right-0 bg-white z-10">
          <div className="py-4 border-b-[1px] border-neutral-200">
            <div className="flex items-center justify-between max-w-[2520px] mx-auto px-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/rent.svg"
                  alt="Rentify Logo"
                  width={32}
                  height={32}
                  priority
                />
                <span className="text-large font-bold text-neutral-800">Cebu-rent</span>
              </Link>

              {/* Mobile menu button */}
              <div 
                onClick={user ? () => signOut() : () => setShowAuthModal(true)}
                className="p-4 border-[1px] border-neutral-200 rounded-full cursor-pointer hover:shadow-md transition"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-6 h-6 text-neutral-700"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content container with adjusted spacing */}
        <div className="pt-[72px]">
          {/* Search bar with increased top margin */}
          <div className="bg-white px-4 py-2 mt-8">
            <Search />
          </div>

          {/* Main content */}
          <div className="px-4 mt-2">
            {/* Your main content goes here */}
          </div>
        </div>
      </header>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <AuthModal />
            <button 
              onClick={() => setShowAuthModal(false)}
              className="mt-4 w-full py-2 px-4 bg-gray-200 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
} 