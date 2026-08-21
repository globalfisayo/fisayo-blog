import React from 'react';
import { motion } from '@/lib/motion';
import { Calendar, Clock, ExternalLink, Bell, MapPin, Building2, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BrandCover from '@/joy/components/BrandCover.jsx';
import { chipStyle } from '@/joy/lib/typeStyles';
import { formatDate, daysUntilDeadline } from '@/joy/lib/opportunities';
import { SUBSCRIBE_URL, CLOSING_SOON_DAYS } from '@/joy/config';

const StatusBadge = ({ status }) =>
  status === 'open' ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 text-xs font-semibold">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Open
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted border border-border text-muted-foreground px-2.5 py-0.5 text-xs font-semibold">
      Closed
    </span>
  );

const OpportunityCard = ({ opp, delay = 0 }) => {
  const isOpen = opp.effectiveStatus === 'open';
  const daysLeft = daysUntilDeadline(opp);
  const closingSoon = isOpen && daysLeft !== null && daysLeft >= 0 && daysLeft <= CLOSING_SOON_DAYS;

  const deadlineLabel = opp.deadline
    ? formatDate(opp.deadline)
    : opp.deadlineNote || 'Check link for deadline';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay }}
      className="h-full"
    >
      <Card
        className={`group h-full flex flex-col overflow-hidden border-border hover:shadow-lg transition-all duration-300 ${
          isOpen ? '' : 'opacity-75 saturate-50'
        }`}
      >
        <a
          href={opp.applyUrl || SUBSCRIBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-[16/9] w-full overflow-hidden bg-muted focus:outline-none"
          aria-label={`${opp.title} — open the application page`}
        >
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
            {opp.coverSrc ? (
              <img src={opp.coverSrc} alt={opp.title} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <BrandCover opp={opp} />
            )}
          </div>
          <div className="absolute top-3 left-3">
            <StatusBadge status={opp.effectiveStatus} />
          </div>
        </a>

        <CardContent className="flex-1 flex flex-col p-5">
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {(opp.types || []).map((t) => (
              <span
                key={t}
                className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
                style={chipStyle(t)}
              >
                {t}
              </span>
            ))}
          </div>

          <h3 className="text-base font-bold leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {opp.title}
          </h3>

          {(opp.company || opp.location || opp.visaSponsorship) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
              {opp.company && (
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {opp.company}
                </span>
              )}
              {opp.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {opp.location}
                </span>
              )}
              {opp.visaSponsorship === 'Yes' && (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Visa sponsorship
                </span>
              )}
            </div>
          )}

          {opp.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{opp.description}</p>
          )}

          <div className="mt-auto space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Added {formatDate(opp.dateAdded)}</span>
            </div>
            <div className={`flex items-center gap-1.5 ${closingSoon ? 'text-amber-600 font-semibold' : ''}`}>
              <Clock className="h-3.5 w-3.5" />
              <span>
                Deadline: {deadlineLabel}
                {closingSoon && (daysLeft === 0 ? ' — closes today!' : ` — ${daysLeft} day${daysLeft === 1 ? '' : 's'} left`)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {isOpen && opp.applyUrl ? (
              <Button asChild className="w-full">
                <a href={opp.applyUrl} target="_blank" rel="noopener noreferrer">
                  Apply now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : (
              <Button variant="secondary" disabled className="w-full">
                {isOpen ? 'Link unavailable' : 'Applications closed'}
              </Button>
            )}
            <Button asChild variant="ghost" size="sm" className="w-full text-muted-foreground">
              <a href={SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer">
                <Bell className="mr-2 h-3.5 w-3.5" />
                Be the first to know
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OpportunityCard;
