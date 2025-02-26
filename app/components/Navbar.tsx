'use client';
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect, useRef } from "react";
import AuthModal from "@/components/auth/AuthModal";
import Search from './navbar/Search';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check auth state when component mounts
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        useAuthStore.getState().setUser(session.user)
      }
    }
    checkUser()
  }, [])

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside and not on a link or button
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('a, button')
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      router.push('/'); // Redirect to home page
      router.refresh(); // Refresh the page to update the UI
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Add this function to get initials from email
  const getInitials = (email: string) => {
    // Remove the domain part
    const name = email.split('@')[0];
    // Split by dots or numbers
    const parts = name.split(/[.\d]/);
    // Get first letter of each part and convert to uppercase
    const initials = parts
      .filter(part => part.length > 0)
      .map(part => part[0].toUpperCase())
      .join('')
      .slice(0, 2); // Only take first two letters
    return initials;
  };

  const handleMenuItemClick = () => {
    setShowUserMenu(false); // Close menu after clicking an item
  };

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
                <div className="relative" ref={menuRef}>
                  <div 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                  >
                    <div className="hidden md:block">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                          {getInitials(user.email || '')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 border border-neutral-200">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200 truncate">
                        {user.email}
                      </div>
                      <Link 
                        href="/listings/my-property"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleMenuItemClick}
                      >
                        My Properties
                      </Link>
                      <Link 
                        href="/bookings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleMenuItemClick}
                      >
                        Bookings
                      </Link>
                      <Link 
                        href="/listings/new"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleMenuItemClick}
                      >
                        Create New Listing
                      </Link>
                      <button
                        onClick={() => {
                          handleMenuItemClick();
                          handleSignOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hidden md:block text-sm font-medium text-neutral-800 py-3 px-4 rounded-full hover:bg-neutral-50 transition"
                >
                  Sign in
                </button>
              )}
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
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="p-2 border-[1px] border-neutral-200 rounded-full"
                    >
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                        {getInitials(user.email || '')}
                      </div>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-neutral-200">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                          {user.email}
                        </div>
                        <Link 
                          href="/listings/my"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Properties
                        </Link>
                        <Link 
                          href="/bookings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Bookings
                        </Link>
                        <Link 
                          href="/listings/new"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Create New Listing
                        </Link>
                        <button
                          onClick={() => {
                            handleMenuItemClick();
                            handleSignOut();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="p-4 border-[1px] border-neutral-200 rounded-full"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.5} 
                      stroke="currentColor" 
                      className="w-6 h-6"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" 
                      />
                    </svg>
                  </button>
                )}
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

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <AuthModal onClose={() => setShowAuthModal(false)} />
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