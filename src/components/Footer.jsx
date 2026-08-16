import React from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="Fisayo.org" className="h-8 w-auto" />
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Practical insights on investing, careers, and global opportunities
              — written plainly for ambitious Africans.
            </p>
          </div>

          {/* Main site */}
          <div>
            <span className="text-sm font-semibold text-foreground tracking-wide uppercase mb-4 block">Explore</span>
            <ul className="space-y-2">
              <li>
                <a href="https://fisayo.org/" className="text-sm hover:text-foreground transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="https://fisayo.org/mystory/" className="text-sm hover:text-foreground transition-colors duration-200">
                  My Story
                </a>
              </li>
              <li>
                <a href="https://fisayo.org/opportunities/" className="text-sm hover:text-foreground transition-colors duration-200">
                  Opportunities
                </a>
              </li>
              <li>
                <a href="https://fisayo.org/memos/" className="text-sm hover:text-foreground transition-colors duration-200">
                  Investor Memos
                </a>
              </li>
            </ul>
          </div>

          {/* Blog */}
          <div>
            <span className="text-sm font-semibold text-foreground tracking-wide uppercase mb-4 block">On the Blog</span>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-sm hover:text-foreground transition-colors duration-200">
                  All posts
                </Link>
              </li>
              <li><span className="text-sm">Investing</span></li>
              <li><span className="text-sm">Career</span></li>
              <li><span className="text-sm">Opportunities</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              © {currentYear} Fisayo.org. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
