import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import logo from '@/assets/logo.png';

// Router-free variant of the blog Header for the /joy app: this app is a
// single page, so every nav entry is a plain full-page link. "Opportunities"
// (this page) is highlighted; the CTA points here too.
const MAIN_SITE = [
  { name: 'Home', href: 'https://fisayo.org/' },
  { name: 'My Story', href: 'https://fisayo.org/mystory/' },
  { name: 'Blog', href: 'https://fisayo.org/blog/' },
  { name: 'Global Academy', href: 'https://fisayo.org/global-academy/' },
  { name: 'Investor Memos', href: 'https://fisayo.org/memos/' },
  { name: 'Speaking', href: 'https://fisayo.org/speaking/' },
  { name: 'Partners', href: 'https://fisayo.org/partners/' },
];

const linkClasses =
  'px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted';

const JoyHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container-custom flex h-16 items-center justify-between">
        <a href="https://fisayo.org/" className="flex items-center space-x-2">
          <img src={logo} alt="Fisayo.org" className="h-8 w-auto" />
        </a>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:items-center lg:space-x-1">
          {MAIN_SITE.slice(0, 3).map((link) => (
            <a key={link.href} href={link.href} className={linkClasses}>
              {link.name}
            </a>
          ))}
          <a
            href="https://fisayo.org/joy/"
            className="px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-primary bg-accent"
          >
            Opportunities
          </a>
          {MAIN_SITE.slice(3).map((link) => (
            <a key={link.href} href={link.href} className={linkClasses}>
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button asChild>
            <a href="#universe">Explore the Universe</a>
          </Button>
        </div>

        {/* Mobile navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-2 mt-8">
              <a
                href="https://fisayo.org/joy/"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-base font-medium rounded-lg text-primary bg-accent"
              >
                Opportunities
              </a>
              {MAIN_SITE.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default JoyHeader;
