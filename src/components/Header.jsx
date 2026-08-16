import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import BlogDropdown from '@/components/BlogDropdown.jsx';
import logo from '@/assets/logo.png';

// The blog is a static app living at fisayo.org/blog/ — the rest of the site
// is WordPress. Main-site entries are plain <a> full-page links; only Blog is
// an in-app route.
const MAIN_SITE = [
  { name: 'Home', href: 'https://fisayo.org/' },
  { name: 'My Story', href: 'https://fisayo.org/mystory/' },
  { name: 'Global Academy', href: 'https://fisayo.org/global-academy/' },
  { name: 'Opportunities', href: 'https://fisayo.org/opportunities/' },
  { name: 'Investor Memos', href: 'https://fisayo.org/memos/' },
  { name: 'Speaking', href: 'https://fisayo.org/speaking/' },
  { name: 'Partners', href: 'https://fisayo.org/partners/' },
];

const linkClasses =
  'px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container-custom flex h-16 items-center justify-between">
        <a href="https://fisayo.org/" className="flex items-center space-x-2">
          <img src={logo} alt="Fisayo.org" className="h-8 w-auto" />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:space-x-1">
          {MAIN_SITE.slice(0, 2).map((link) => (
            <a key={link.href} href={link.href} className={linkClasses}>
              {link.name}
            </a>
          ))}

          {/* Blog — in-app link with the Latest Insights dropdown */}
          <div className="relative group">
            <Link
              to="/blog"
              className="flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-primary bg-accent"
            >
              Blog
              <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            <BlogDropdown />
          </div>

          {MAIN_SITE.slice(2).map((link) => (
            <a key={link.href} href={link.href} className={linkClasses}>
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button asChild>
            <a href="https://fisayo.org/opportunities/">Opportunity Universe</a>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-2 mt-8">
              <Link
                to="/blog"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-base font-medium rounded-lg text-primary bg-accent"
              >
                Blog
              </Link>
              {MAIN_SITE.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  {link.name}
                </a>
              ))}
              <Button asChild className="mt-4">
                <a href="https://fisayo.org/opportunities/">Opportunity Universe</a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Header;
