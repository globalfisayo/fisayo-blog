import React, { useMemo, useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JoyHeader from '@/joy/components/JoyHeader.jsx';
import JoyFooter from '@/joy/components/JoyFooter.jsx';
import FilterBar from '@/joy/components/FilterBar.jsx';
import OpportunityCard from '@/joy/components/OpportunityCard.jsx';
import { getAllOpportunities, getAllTypes, filterOpportunities } from '@/joy/lib/opportunities';
import { SPONSOR_LOCKUP, PAGE_SIZE } from '@/joy/config';

// Read initial filter state from the URL so filtered views are shareable
// (e.g. /joy/?type=Scholarship&status=open&q=uk).
function initialFilters() {
  const params = new URLSearchParams(window.location.search);
  return {
    type: params.get('type') || 'All',
    status: params.get('status') || 'open',
    query: params.get('q') || '',
  };
}

function JoyApp() {
  const all = useMemo(() => getAllOpportunities(), []);
  const types = useMemo(() => getAllTypes(all), [all]);

  const init = useMemo(initialFilters, []);
  const [type, setType] = useState(init.type);
  const [status, setStatus] = useState(init.status);
  const [query, setQuery] = useState(init.query);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Keep the URL in sync (replaceState — no history spam while typing).
  useEffect(() => {
    const params = new URLSearchParams();
    if (type !== 'All') params.set('type', type);
    if (status !== 'open') params.set('status', status);
    if (query.trim()) params.set('q', query.trim());
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
    setVisible(PAGE_SIZE);
  }, [type, status, query]);

  const filtered = useMemo(
    () => filterOpportunities(all, { type, status, query }),
    [all, type, status, query],
  );
  const shown = filtered.slice(0, visible);
  const openCount = useMemo(() => all.filter((o) => o.effectiveStatus === 'open').length, [all]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JoyHeader />

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-accent/60 to-background">
        <div className="container-custom py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground mb-5">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span>
              {SPONSOR_LOCKUP[0]} × {SPONSOR_LOCKUP[1]}
            </span>
          </div>
          <h1 className="mb-4">Opportunity Universe</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Jobs, scholarships, fellowships, internships and programmes that change
            trajectories — found, verified and refreshed daily for ambitious Africans.
          </p>
          <p className="mt-5 text-sm font-medium text-foreground">
            <span className="text-primary font-bold">{openCount}</span> opportunities open right now
            · <span className="text-muted-foreground font-normal">{all.length} tracked in total</span>
          </p>
        </div>
      </section>

      {/* Universe */}
      {/* min-w-0: as a flex item, main must not inherit the nowrap filter
          pills' intrinsic width as its minimum — that blows out mobile. */}
      <main id="universe" className="container-custom w-full min-w-0 flex-1 py-8 md:py-10">
        <FilterBar
          types={types}
          type={type}
          setType={setType}
          status={status}
          setStatus={setStatus}
          query={query}
          setQuery={setQuery}
          shownCount={filtered.length}
          totalCount={all.length}
        />

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-lg font-medium text-foreground mb-1">Nothing matches those filters</p>
            <p className="text-sm">Try clearing the search or switching the status to “All”.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {shown.map((opp, i) => (
                <OpportunityCard key={opp.id} opp={opp} delay={Math.min((i % PAGE_SIZE) * 0.03, 0.4)} />
              ))}
            </div>
            {visible < filtered.length && (
              <div className="text-center mt-10">
                <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Show more ({filtered.length - visible} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <JoyFooter />
    </div>
  );
}

export default JoyApp;
