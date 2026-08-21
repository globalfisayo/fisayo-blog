import React from 'react';
import logo from '@/assets/logo.png';
import { SPONSOR_LOCKUP, SUBSCRIBE_URL } from '@/joy/config';

const JoyFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="Fisayo.org" className="h-8 w-auto" />
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              The Opportunity Universe — live jobs, scholarships, fellowships and
              programmes for ambitious Africans, verified and updated daily.
            </p>
          </div>

          <div>
            <span className="text-sm font-semibold text-foreground tracking-wide uppercase mb-4 block">
              Explore
            </span>
            <ul className="space-y-2">
              {[
                ['Home', 'https://fisayo.org/'],
                ['My Story', 'https://fisayo.org/mystory/'],
                ['Blog', 'https://fisayo.org/blog/'],
                ['Investor Memos', 'https://fisayo.org/memos/'],
              ].map(([name, href]) => (
                <li key={href}>
                  <a href={href} className="text-sm hover:text-foreground transition-colors duration-200">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-sm font-semibold text-foreground tracking-wide uppercase mb-4 block">
              Never miss an opportunity
            </span>
            <p className="text-sm mb-3 max-w-xs">
              New opportunities land here every day. Get them in your inbox first.
            </p>
            <a
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Be the first to know
            </a>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span>
            © {currentYear} Fisayo.org — improving peoples&apos; lives.
          </span>
          <span>
            In partnership with {SPONSOR_LOCKUP[0]}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default JoyFooter;
