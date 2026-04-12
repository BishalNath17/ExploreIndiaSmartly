const Blog = require('../models/Blog');

// GET /blogs — public (only published)
exports.getBlogs = async (req, res, next) => {
  try {
    const { category, limit, page = 1 } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    const pageSize = parseInt(limit) || 9;
    const skip = (parseInt(page) - 1) * pageSize;
    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .select('-content')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize);
    res.json({ success: true, count: blogs.length, total, page: parseInt(page), pages: Math.ceil(total / pageSize), data: blogs });
  } catch (error) { next(error); }
};

// GET /blogs/:slug — public single post
exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, data: blog });
  } catch (error) { next(error); }
};

// GET /admin/blogs — all posts including drafts
exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) { next(error); }
};

// POST /admin/blogs
exports.createBlog = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.coverImage = req.file.path;
    if (data.isPublished && !data.publishedAt) data.publishedAt = new Date();
    if (data.tags && typeof data.tags === 'string') data.tags = data.tags.split(',').map(t => t.trim());
    const blog = new Blog(data);
    await blog.save();
    res.status(201).json({ success: true, data: blog });
  } catch (error) { next(error); }
};

// PUT /admin/blogs/:slug
exports.updateBlog = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.coverImage = req.file.path;
    if (data.isPublished === 'true' || data.isPublished === true) {
      data.isPublished = true;
      if (!data.publishedAt) data.publishedAt = new Date();
    }
    if (data.tags && typeof data.tags === 'string') data.tags = data.tags.split(',').map(t => t.trim());
    const blog = await Blog.findOneAndUpdate({ slug: req.params.slug }, { $set: data }, { returnDocument: 'after' });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, data: blog });
  } catch (error) { next(error); }
};

// DELETE /admin/blogs/:slug
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndDelete({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, message: 'Blog post deleted' });
  } catch (error) { next(error); }
};
