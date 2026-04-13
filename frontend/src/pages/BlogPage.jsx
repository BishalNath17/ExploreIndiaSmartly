import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Search, Tag } from 'lucide-react';
import { getImageUrl } from '../config/api';
import useApiData from '../hooks/useApiData';
import SectionHeader from '../components/layout/SectionHeader';
import PageHero from '../components/layout/PageHero';
import EmptyState from '../components/ui/EmptyState';
import ScrollReveal from '../components/ui/ScrollReveal';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Travel Guides', value: 'travel-guide' },
  { label: 'Budget Tips', value: 'budget-tips' },
  { label: 'Culture', value: 'culture' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Food', value: 'food' },
  { label: 'General', value: 'general' },
];

const BlogCard = ({ post }) => (
  <ScrollReveal>
    <Link
      to={`/blog/${post.slug}`}
      className="group glass rounded-2xl overflow-hidden flex flex-col h-full hover:border-india-orange/30 transition-all duration-300"
    >
      <div className="aspect-[16/9] overflow-hidden bg-white/5">
        {post.coverImage ? (
          <img
            src={getImageUrl(post.coverImage)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-india-orange/10 to-transparent">
            <BookOpen size={40} className="text-india-orange/40" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          {post.category && (
            <span className="text-[10px] uppercase tracking-wider bg-india-orange/15 text-india-orange px-2 py-0.5 rounded-full font-medium">
              {post.category.replace('-', ' ')}
            </span>
          )}
          {post.readTime && (
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <Clock size={10} /> {post.readTime} min read
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold mb-2 group-hover:text-india-orange transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-3 flex-1">
          {post.excerpt || 'Read this travel guide to explore the hidden wonders of India...'}
        </p>
        <div className="flex items-center gap-1 mt-4 text-india-orange text-xs font-medium">
          Read More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  </ScrollReveal>
);

const BlogPage = () => {
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const endpoint = category ? `/blogs?category=${category}` : '/blogs';
  const { data: blogs, loading } = useApiData(endpoint);

  const filteredBlogs = (blogs || []).filter(post => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (post.title || '').toLowerCase().includes(q) ||
           (post.excerpt || '').toLowerCase().includes(q);
  });

  return (
    <>
      <PageHero
        badge={{ text: 'Travel Stories', icon: BookOpen }}
        badgeColor="india-orange"
        title="Travel Blog"
        highlightWord="Blog"
        subtitle="Expert guides, budget tips, cultural insights, and inspiring stories from across India."
        gradientFrom="from-india-orange/10"
      />

      <section className="section-padding pb-4">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="relative mb-5 max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-india-orange/50 transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  category === c.value
                    ? 'bg-india-orange text-white shadow-lg shadow-india-orange/25'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 section-padding">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-sm text-gray-500">
              Showing <span className="text-white font-bold">{filteredBlogs.length}</span> article{filteredBlogs.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[16/9] bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-20 bg-white/10 rounded-full" />
                    <div className="h-5 w-3/4 bg-white/10 rounded-full" />
                    <div className="h-3 w-full bg-white/5 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <EmptyState icon={BookOpen} message="No blog posts yet. Check back soon for travel stories and guides!" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogPage;
