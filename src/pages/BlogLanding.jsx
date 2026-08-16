import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from '@/lib/motion';
import { LayoutGrid, Filter } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import BlogCard from '@/components/BlogCard.jsx';
import { Button } from '@/components/ui/button';
import { getAllPosts, getAllCategories } from '@/lib/blog';

const BlogLanding = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = getAllCategories();

  const posts = getAllPosts(activeCategory);

  // Featured grid honors is_featured; falls back to the newest posts so the
  // grid never sits empty while posts exist.
  const flagged = posts.filter((post) => post.is_featured).slice(0, 3);
  const featuredPosts = flagged.length > 0 ? flagged : posts.slice(0, 3);
  const recentPosts = posts.filter((post) => !featuredPosts.includes(post));

  return (
    <>
      <Helmet>
        <title>Blog & Insights - Fisayo.org</title>
        <meta
          name="description"
          content="Practical insights on investing, careers, and global opportunities — written plainly for ambitious Africans."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Header Section */}
          <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl"
              >
                <div className="flex items-center text-primary font-medium mb-4">
                  <LayoutGrid className="mr-2 h-5 w-5" />
                  <span>Our Blog</span>
                </div>
                <h1 className="mb-6 text-foreground text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Insights for Wealth and Investment Growth
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Investing, careers, and global opportunities — explained plainly, for ambitious Africans building a bigger future.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Filter Navigation */}
          <section className="py-6 border-b border-border sticky top-16 z-40 bg-background/95 backdrop-blur">
            <div className="container-custom">
              <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex items-center flex-shrink-0 text-muted-foreground mr-2">
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    className="flex-shrink-0 rounded-full"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Posts Grid */}
          <section className="py-16">
            <div className="container-custom">
              {featuredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredPosts.map((post, index) => (
                    <BlogCard key={post.id} post={post} variant="featured" delay={index * 0.1} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-muted/50 rounded-2xl">
                  <h3 className="text-lg font-semibold text-foreground mb-2">No insights found</h3>
                  <p className="text-muted-foreground">Check back later or try a different category.</p>
                </div>
              )}
            </div>
          </section>

          {/* Recent Posts Section */}
          {recentPosts.length > 0 && (
            <section className="py-16 bg-muted/30">
              <div className="container-custom">
                <div className="max-w-4xl">
                  <h2 className="text-2xl font-bold mb-8">More from the blog</h2>
                  <div className="space-y-8">
                    {recentPosts.map((post, index) => (
                      <BlogCard key={post.id} post={post} variant="recent" delay={index * 0.05} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogLanding;