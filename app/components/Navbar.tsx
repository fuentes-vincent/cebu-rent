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
      <header className="fixed w-full bg-white z-10">
        <div className="py-4 border-b-[1px] border-neutral-200">
          <div className="flex items-center justify-between max-w-[2520px] mx-auto px-4 md:px-8">
            {/* Logo */}
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

            {/* Replace the old search div with the Search component */}
            <div className="w-2/3">
              <Search />
            </div>

            {/* Right Side */}
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