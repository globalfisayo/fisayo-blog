import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from '@/lib/motion';
import { ChevronRight, Calendar, User, Tag, Download, Quote, ArrowLeft, Loader2 } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import RelatedPosts from '@/components/RelatedPosts.jsx';
import ShareButton from '@/components/ShareButton.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { loadPost, getPostImageUrl, getPostAttachmentUrl, formatPostDate } from '@/lib/blog';

const BlogPostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let active = true;
    setIsLoading(true);
    loadPost(slug).then((result) => {
      if (active) {
        setPost(result);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-32 container-custom text-center">
          <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            We couldn't find the article you're looking for. It might have been removed or the URL is incorrect.
          </p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = getPostImageUrl(post);

  const formattedDate = formatPostDate(post.publication_date);

  const relatedPosts = post.relatedPosts || [];

  const attachmentUrl = getPostAttachmentUrl(post);

  return (
    <>
      <Helmet>
        <title>{`${post.title} - Fisayo.org`}</title>
        <meta name="description" content={post.excerpt || post.title} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative min-h-[50vh] flex items-end pb-20 pt-32 overflow-hidden bg-slate-900">
            <div className="absolute inset-0 z-0">
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-iea-gradient mix-blend-multiply opacity-80"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
            </div>

            <div className="container-custom relative z-10 w-full">
              <nav className="flex items-center text-sm text-white/70 mb-8" aria-label="Breadcrumb">
                <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl"
              >
                {post.category && (
                  <Badge className="bg-white text-slate-900 hover:bg-white/90 mb-6 font-semibold uppercase tracking-wider">
                    {post.category}
                  </Badge>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                  {post.title}
                </h1>
                
                {post.excerpt && (
                  <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-3xl">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{post.author || 'Fisayo Adeyemi'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Content & Sidebar */}
          <section className="py-16">
            <div className="container-custom">
              <div className="flex flex-col lg:flex-row gap-16">
                
                {/* Main Article Body */}
                <article className="flex-1 w-full lg:max-w-[75ch] prose-layout">
                  {post.content ? (
                    <div className="text-foreground" dangerouslySetInnerHTML={{ __html: post.content }} />
                  ) : (
                    <p className="text-muted-foreground italic">Content is currently unavailable for this post.</p>
                  )}
                  
                  <RelatedPosts relatedPosts={relatedPosts} />
                </article>

                {/* Sidebar — shown first on mobile so the download is visible at a glance */}
                <aside className="w-full lg:w-80 flex-shrink-0 order-first lg:order-none">
                  <div className="lg:sticky lg:top-24 bg-card rounded-2xl p-6 border border-border shadow-sm">
                    <h3 className="text-lg font-bold mb-4 border-b border-border pb-4">About this post</h3>
                    
                    <div className="space-y-4 text-sm mb-6">
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground flex items-center"><Calendar className="h-4 w-4 mr-2"/> Published</span>
                        <span className="font-medium text-right">{formattedDate}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground flex items-center"><User className="h-4 w-4 mr-2"/> Author</span>
                        <span className="font-medium text-right">{post.author || 'Fisayo Adeyemi'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground flex items-center"><Tag className="h-4 w-4 mr-2"/> Category</span>
                        <span className="font-medium text-right">{post.category || 'General'}</span>
                      </div>
                    </div>

                    {attachmentUrl && (
                      <Button className="w-full bg-white text-primary border border-primary/20 hover:bg-muted shadow-sm mb-6 font-semibold" asChild>
                        <a href={attachmentUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Download file
                        </a>
                      </Button>
                    )}

                    <div className="bg-muted/50 rounded-xl p-4 mb-6">
                      <p className="text-xs text-muted-foreground leading-relaxed text-balance">
                        © Fisayo.org. You are welcome to share this article with attribution and a link back to the original post.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <ShareButton title={post.title} className="flex-1" />
                      <Button variant="outline" size="sm" className="flex-1">
                        <Quote className="mr-2 h-4 w-4" />
                        Cite
                      </Button>
                    </div>
                  </div>
                </aside>

              </div>
            </div>
          </section>

        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default BlogPostDetail;