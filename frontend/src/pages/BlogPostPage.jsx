import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Tag, User, BookOpen } from 'lucide-react';
import useApiData from '../hooks/useApiData';
import { motion } from 'framer-motion';
import { getImageUrl } from '../config/api';
import BackButton from '../components/ui/BackButton';

const BlogPostPage = () => {
  const { slug } = useParams();
  const { data: post, loading, error } = useApiData(`/blogs/${slug}`);

  if (loading) {
    return (
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 section-padding">
        <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-white/10 rounded-full" />
          <div className="h-10 w-3/4 bg-white/10 rounded-full" />
          <div className="aspect-[16/9] bg-white/5 rounded-2xl" />
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-white/5 rounded-full" style={{ width: `${90 - i * 5}%` }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <BookOpen size={48} className="text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-gray-400 mb-6">This blog post doesn't exist or has been removed.</p>
          <Link to="/blog" className="btn-primary inline-flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="pt-24 pb-16 sm:pt-32 sm:pb-24 section-padding">
      <div className="max-w-3xl mx-auto">
        <BackButton fallback="/blog" label="Back to Blog" className="mb-8" />

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {post.category && (
            <span className="text-[11px] uppercase tracking-wider bg-india-orange/15 text-india-orange px-3 py-1 rounded-full font-medium">
              {post.category.replace('-', ' ')}
            </span>
          )}
          {post.readTime && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={12} /> {post.readTime} min read
            </span>
          )}
          {post.publishedAt && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar size={12} /> {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

        {/* Author */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-400">
          <User size={14} /> <span>{post.author || 'Explore India Smartly'}</span>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10">
            <img src={getImageUrl(post.coverImage)} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-india-orange prose-strong:text-white prose-p:text-gray-300 prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-white/10">
            <Tag size={14} className="text-gray-500" />
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-white/5 text-gray-400 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogPostPage;
