import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { chipStyle } from '@/joy/lib/typeStyles';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'all', label: 'All' },
];

// The Notion database offered per-category views plus a gallery filter; this
// bar replaces both: free-text search, one-tap type pills, and a status
// toggle. State lives in the URL (?type=&status=&q=) so filtered views can be
// shared as links.
const FilterBar = ({ types, type, setType, status, setStatus, query, setQuery, shownCount, totalCount }) => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search opportunities…"
          className="pl-9"
          aria-label="Search opportunities"
        />
      </div>
      <div className="flex items-center gap-1 rounded-lg bg-muted p-1 w-fit" role="group" aria-label="Filter by status">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStatus(opt.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              status === opt.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <span className="text-sm text-muted-foreground sm:ml-auto">
        {shownCount} of {totalCount} opportunities
      </span>
    </div>

    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1" role="group" aria-label="Filter by type">
      <button
        type="button"
        onClick={() => setType('All')}
        className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
          type === 'All'
            ? 'bg-foreground text-background border-foreground'
            : 'bg-background text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
        }`}
      >
        All types
      </button>
      {types.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setType(t === type ? 'All' : t)}
          className="whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all"
          style={
            type === t
              ? { ...chipStyle(t), outline: '2px solid currentColor', outlineOffset: '-1px' }
              : chipStyle(t)
          }
        >
          {t}
        </button>
      ))}
    </div>
  </div>
);

export default FilterBar;
