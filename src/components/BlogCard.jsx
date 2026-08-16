import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from '@/lib/motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPostImageUrl, formatPostDate } from '@/lib/blog';

const BlogCard = ({ post, variant = 'recent', delay = 0 }) => {
  if (!post) return null;

  const imageUrl = getPostImageUrl(post);

  const formattedDate = formatPostDate(post.publication_date);

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="h-full"
      >
        <Card className="group h-full flex flex-col overflow-hidden border-border hover:shadow-lg transition-all duration-300">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {post.category && (
              <Badge className="absolute top-4 left-4 bg-background/90 text-foreground backdrop-blur-sm hover:bg-background">
                {post.category}
              </Badge>
            )}
          </div>
          <CardContent className="flex-1 flex flex-col p-6">
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              <Link to={`/blog/${post.slug}`} className="focus:outline-none">
                <span className="absolute inset-0 z-10"></span>
                {post.title}
              </Link>
            </h3>
            <p className="text-muted-foreground line-clamp-3 mb-6 flex-1 text-sm">
              {post.excerpt}
            </p>
            <div className="flex items-center text-primary font-medium text-sm mt-auto">
              Read Article
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Recent variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="group"
    >
      <Link to={`/blog/${post.slug}`} className="flex flex-col sm:flex-row gap-4 focus:outline-none group">
        <div className="w-full sm:w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center py-1">
          {post.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              {post.category}
            </span>
          )}
          <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h4>
          <div className="flex items-center text-sm text-muted-foreground mt-auto">
            <Calendar className="mr-2 h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;