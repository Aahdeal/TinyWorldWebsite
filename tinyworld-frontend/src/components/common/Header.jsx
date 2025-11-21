import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Image, ShoppingCart, User, LogOut, Menu, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="sticky top-0 z-50 w-full overflow-hidden bg-primary bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-primary/60 p-4 py-5 shadow-sm rounded-b-2xl">
      <div className="container mx-auto flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="block text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
        >
          TinyWorld
        </a>

        {/* Desktop Navigation */}
        <div className="ml-8 hidden items-center lg:flex">
          <ul className="mt-4 flex flex-col gap-x-6 gap-y-1.5 lg:mt-0 lg:flex-row lg:items-center">
            <li>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-x-2 p-2 text-base font-medium hover:text-primary transition-colors cursor-pointer"
              >
                <Home className="h-5 w-5" />
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/gallery')}
                className="flex items-center gap-x-2 p-2 text-base font-medium hover:text-primary transition-colors cursor-pointer"
              >
                <Image className="h-5 w-5" />
                Gallery
              </button>
            </li>
          </ul>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/cart')}
                className="relative h-11 w-11"
              >
                <ShoppingCart className="h-6 w-6" />
                {getCartItemCount() > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold"
                  >
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>

              {user?.role === 'ADMIN' && (
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => {
                    navigate('/admin');
                    setIsMenuOpen(false);
                  }}
                  className="hidden lg:inline-flex h-11 text-black"
                >
                  <Settings className="h-7 w-7 mr-2" />
                  Admin
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigate('/account');
                  setIsMenuOpen(false);
                }}
                className="h-11 w-11"
              >
                <User className="h-7 w-7" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
                className="h-11 w-11"
              >
                <LogOut className="h-7 w-7" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="default"
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="hidden lg:inline-flex h-11 text-base"
              >
                Login
              </Button>
              <Button
                size="default"
                onClick={() => {
                  navigate('/register');
                  setIsMenuOpen(false);
                }}
                className="hidden lg:inline-flex h-11 text-base"
              >
                Sign Up
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="secondary"
            size="icon"
            className="lg:hidden h-11 w-11"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'bg-background border-t p-5 lg:hidden',
          isMenuOpen ? 'block' : 'hidden'
        )}
      >
        <ul className="flex flex-col gap-y-3">
          <li>
            <button
              onClick={() => {
                navigate('/');
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-x-3 p-3 text-base font-medium hover:text-primary transition-colors cursor-pointer w-full text-left"
            >
              <Home className="h-5 w-5" />
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                navigate('/gallery');
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-x-3 p-3 text-base font-medium hover:text-primary transition-colors cursor-pointer w-full text-left"
            >
              <Image className="h-5 w-5" />
              Gallery
            </button>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <button
                  onClick={() => {
                    navigate('/cart');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-x-3 p-3 text-base font-medium hover:text-primary transition-colors cursor-pointer w-full text-left"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Cart
                  {getCartItemCount() > 0 && (
                    <Badge variant="destructive" className="ml-2 font-bold">
                      {getCartItemCount()}
                    </Badge>
                  )}
                </button>
              </li>
              {user?.role === 'ADMIN' && (
                <li>
                  <button
                    onClick={() => {
                      navigate('/admin');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-x-3 p-3 text-base font-medium hover:text-primary transition-colors cursor-pointer w-full text-left"
                  >
                    <Settings className="h-5 w-5" />
                    Admin
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => {
                    navigate('/account');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-x-3 p-3 text-base font-medium hover:text-primary transition-colors cursor-pointer w-full text-left"
                >
                  <User className="h-5 w-5" />
                  Account
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-x-3 p-3 text-base font-medium hover:text-destructive transition-colors cursor-pointer w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start h-12 text-base"
                >
                  Login
                </Button>
              </li>
              <li>
                <Button
                  size="default"
                  onClick={() => {
                    navigate('/register');
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start h-12 text-base"
                >
                  Sign Up
                </Button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;

