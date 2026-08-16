import React from 'react';
import BlogCard from '@/components/BlogCard.jsx';

const RelatedPosts = ({ relatedPosts }) => {
  if (!relatedPosts || relatedPosts.length === 0) return null;

  return (
    <section className="border-t border-border pt-16 mt-16">
      <h2 className="text-2xl font-bold mb-8">Related Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedPosts.slice(0, 3).map((post, index) => (
          <BlogCard key={post.id} post={post} variant="featured" delay={index * 0.1} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;