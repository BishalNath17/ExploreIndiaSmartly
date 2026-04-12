const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: String,
  content: { type: String, required: true },
  coverImage: String,
  author: { type: String, default: 'Explore India Smartly' },
  category: { type: String, enum: ['travel-guide', 'budget-tips', 'culture', 'adventure', 'food', 'general'], default: 'general' },
  tags: [String],
  relatedState: String,
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  readTime: Number
}, { timestamps: true });

// Auto-generate slug from title if not provided
blogSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  // Estimate read time (~200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
