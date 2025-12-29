// src/components/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthContext } from './AuthProvider';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuthContext();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="border-b border-gray-300 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link
              href="/"
              className="inline-flex items-center px-1 pt-1 text-lg font-medium text-gray-900"
            >
              After The Doll
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === '/dashboard'
                      ? 'border-b-2 border-gray-900 text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Archives
                </Link>
                <Link
                  href="/forum"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname?.startsWith('/forum')
                      ? 'border-b-2 border-gray-900 text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Forum
                </Link>
                <Link
                  href="/friends"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === '/friends'
                      ? 'border-b-2 border-gray-900 text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Friends
                </Link>
              </>
            )}
            {!user && (
              <Link
                href="/forum"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname?.startsWith('/forum')
                    ? 'border-b-2 border-gray-900 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Forum
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/archive/new"
                  className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded"
                >
                  Create Archive
                </Link>
                <Link
                  href={`/u/${user.username}`}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  @{user.username}
                </Link>
                <Link
                  href="/settings"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
