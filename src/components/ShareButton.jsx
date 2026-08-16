import React from 'react';
import { Share2, Linkedin, MessageCircle, Twitter, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const ShareButton = ({ title, className }) => {
  const { toast } = useToast();
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = title || 'Novola Charity Foundation';
  const enc = encodeURIComponent;

  const links = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    whatsapp: `https://wa.me/?text=${enc(`${shareText} ${url}`)}`,
    x: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(shareText)}`,
  };

  const openShare = (href) => window.open(href, '_blank', 'noopener,noreferrer');

  const nativeShare = async () => {
    try {
      await navigator.share({ title: shareText, url });
    } catch {
      /* user dismissed the share sheet */
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied', description: 'The article link is on your clipboard.' });
    } catch {
      toast({ title: 'Copy this link', description: url });
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {canNativeShare && (
          <>
            <DropdownMenuItem onClick={nativeShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share via…
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => openShare(links.linkedin)}>
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShare(links.whatsapp)}>
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShare(links.x)}>
          <Twitter className="mr-2 h-4 w-4" />
          X (Twitter)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyLink}>
          <Link2 className="mr-2 h-4 w-4" />
          Copy link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
