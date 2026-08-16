import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { getRecentPosts, formatPostDate, getPostImageUrl } from '@/lib/blog';

const shortDate = (date) =>
  formatPostDate(date, { month: 'short', day: 'numeric', year: 'numeric' });

const BlogDropdown = () => {
  const posts = getRecentPosts(5);
  const [latest, ...rest] = posts;

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-[26rem] lg:w-[28rem]">
      <div className="bg-popover border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="px-4 py-3 bg-muted/50 border-b border-border flex justify-between items-center">
          <span className="font-semibold text-sm text-foreground">Latest Insights</span>
          <Link to="/blog" className="text-xs text-primary hover:underline font-medium flex items-center">
            View all <ChevronRight className="h-3 w-3 ml-1" />
          </Link>
        </div>

        {latest ? (
          <>
            {/* Newest post, given about twice the presence of the rest */}
            <Link
              to={`/blog/${latest.slug}`}
              className="group/item flex gap-4 p-4 hover:bg-accent transition-colors"
            >
              <div className="h-36 w-36 lg:w-40 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                <img
                  src={getPostImageUrl(latest)}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                {latest.category && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">
                    {latest.category}
                  </span>
                )}
                <span className="text-base font-bold leading-snug text-foreground line-clamp-2">
                  {latest.title}
                </span>
                {latest.excerpt && (
                  <span className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {latest.excerpt}
                  </span>
                )}
                <span className="flex items-center text-xs text-muted-foreground mt-2">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  {shortDate(latest.publication_date)}
                </span>
              </div>
            </Link>

            {rest.length > 0 && (
              <div className="border-t border-border p-2 flex flex-col">
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={getPostImageUrl(post)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      {post.category && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                          {post.category}
                        </span>
                      )}
                      <span className="text-sm font-medium leading-tight text-foreground line-clamp-2">
                        {post.title}
                      </span>
                      <span className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1.5" />
                        {shortDate(post.publication_date)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">No recent posts.</div>
        )}
      </div>
    </div>
  );
};

export default BlogDropdown;
