require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Tag = require('../src/models/Tag');
const Post = require('../src/models/Post');
const Comment = require('../src/models/Comment');
const { connectDB } = require('../src/config/database');
const { generateSlug, calculateReadingTime } = require('../src/utils/helpers');
const logger = require('../src/utils/logger');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    logger.info('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Tag.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // =====================
    // CREATE USERS
    // =====================
    logger.info('Creating users...');
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@educms.com',
        password_hash: 'password123',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        email_verified: true,
        is_active: true
      },
      {
        username: 'editor',
        email: 'editor@educms.com',
        password_hash: 'password123',
        first_name: 'Editor',
        last_name: 'User',
        role: 'editor',
        email_verified: true,
        is_active: true
      },
      {
        username: 'author1',
        email: 'author1@educms.com',
        password_hash: 'password123',
        first_name: 'John',
        last_name: 'Author',
        role: 'author',
        email_verified: true,
        is_active: true
      },
      {
        username: 'author2',
        email: 'author2@educms.com',
        password_hash: 'password123',
        first_name: 'Jane',
        last_name: 'Writer',
        role: 'author',
        email_verified: true,
        is_active: true
      },
      {
        username: 'subscriber1',
        email: 'subscriber@educms.com',
        password_hash: 'password123',
        first_name: 'Regular',
        last_name: 'User',
        role: 'subscriber',
        email_verified: true,
        is_active: true
      }
    ]);

    logger.info(`✅ Created ${users.length} users`);

    // =====================
    // CREATE CATEGORIES
    // =====================
    logger.info('Creating categories...');
    const categories = await Category.create([
      {
        name: 'Computer Science',
        slug: 'computer-science',
        description: 'Articles about computer science fundamentals',
        display_order: 1,
        is_active: true
      },
      {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Web development tutorials and best practices',
        display_order: 2,
        is_active: true
      },
      {
        name: 'Programming',
        slug: 'programming',
        description: 'Programming languages and techniques',
        display_order: 3,
        is_active: true
      },
      {
        name: 'Data Science',
        slug: 'data-science',
        description: 'Data science and machine learning insights',
        display_order: 4,
        is_active: true
      },
      {
        name: 'AI & Machine Learning',
        slug: 'ai-machine-learning',
        description: 'Artificial intelligence and machine learning topics',
        display_order: 5,
        is_active: true
      }
    ]);

    logger.info(`✅ Created ${categories.length} categories`);

    // =====================
    // CREATE TAGS
    // =====================
    logger.info('Creating tags...');
    const tags = await Tag.create([
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'Python', slug: 'python' },
      { name: 'React', slug: 'react' },
      { name: 'Node.js', slug: 'nodejs' },
      { name: 'MongoDB', slug: 'mongodb' },
      { name: 'Tutorial', slug: 'tutorial' },
      { name: 'Beginner', slug: 'beginner' },
      { name: 'Advanced', slug: 'advanced' },
      { name: 'Best Practices', slug: 'best-practices' },
      { name: 'Performance', slug: 'performance' }
    ]);

    logger.info(`✅ Created ${tags.length} tags`);

    // =====================
    // CREATE POSTS
    // =====================
    logger.info('Creating posts...');
    const posts = [];
    const postTitles = [
      'Getting Started with Node.js',
      'React Hooks: A Complete Guide',
      'MongoDB Best Practices',
      'JavaScript ES6 Features Explained',
      'Building Scalable Web Applications',
      'Docker for Development',
      'REST API Design Principles',
      'Database Optimization Techniques',
      'Introduction to Machine Learning',
      'Web Security Essentials',
      'Progressive Web Apps Development',
      'Microservices Architecture'
    ];

    for (let i = 0; i < postTitles.length; i++) {
      const title = postTitles[i];
      const content = `
        <h2>${title}</h2>
        <p>${faker.lorem.paragraph()}</p>
        <p>${faker.lorem.paragraph()}</p>
        <h3>Key Points</h3>
        <ul>
          <li>${faker.lorem.sentence()}</li>
          <li>${faker.lorem.sentence()}</li>
          <li>${faker.lorem.sentence()}</li>
        </ul>
        <p>${faker.lorem.paragraph()}</p>
        <h3>Conclusion</h3>
        <p>${faker.lorem.paragraph()}</p>
      `;

      const post = new Post({
        title,
        slug: generateSlug(title) + '-' + Date.now(),
        content,
        excerpt: faker.lorem.sentence(),
        author_id: users[Math.floor(Math.random() * 4)],// Random author (not subscriber)
        category_id: categories[Math.floor(Math.random() * categories.length)],
        tags: [tags[Math.floor(Math.random() * tags.length)], tags[Math.floor(Math.random() * tags.length)]],
        status: 'published',
        published_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
        reading_time: calculateReadingTime(content),
        is_featured: Math.random() > 0.7,
        view_count: Math.floor(Math.random() * 1000),
        like_count: Math.floor(Math.random() * 100),
        meta_title: title,
        meta_description: faker.lorem.sentence(),
        allow_comments: true
      });

      posts.push(post);
    }

    await Post.insertMany(posts);
    logger.info(`✅ Created ${posts.length} posts`);

    // =====================
    // CREATE COMMENTS
    // =====================
    logger.info('Creating comments...');
    const comments = [];

    for (const post of posts.slice(0, 6)) { // Add comments to first 6 posts
      for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
        const comment = new Comment({
          post_id: post._id,
          user_id: users[Math.floor(Math.random() * users.length)],
          content: faker.lorem.paragraph(),
          status: 'approved',
          ip_address: faker.internet.ipv4(),
          like_count: Math.floor(Math.random() * 20)
        });

        comments.push(comment);
      }
    }

    await Comment.insertMany(comments);
    logger.info(`✅ Created ${comments.length} comments`);

    // =====================
    // UPDATE COUNTERS
    // =====================
    logger.info('Updating counters...');

    // Update category post counts
    for (const category of categories) {
      const postCount = await Post.countDocuments({ category_id: category._id });
      await Category.findByIdAndUpdate(category._id, { post_count: postCount });
    }

    // Update user post counts
    for (const user of users) {
      const postCount = await Post.countDocuments({ author_id: user._id });
      await User.findByIdAndUpdate(user._id, { post_count: postCount });
    }

    // Update tag post counts
    for (const tag of tags) {
      const postCount = await Post.countDocuments({ tags: tag._id });
      await Tag.findByIdAndUpdate(tag._id, { post_count: postCount });
    }

    // Update post comment counts
    for (const post of posts) {
      const commentCount = await Comment.countDocuments({ post_id: post._id, status: 'approved' });
      await Post.findByIdAndUpdate(post._id, { comment_count: commentCount });
    }

    logger.info('✅ Updated all counters');

    // =====================
    // SEED SUCCESS
    // =====================
    logger.info('');
    logger.info('═══════════════════════════════════════');
    logger.info('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
    logger.info('═══════════════════════════════════════');
    logger.info('');
    logger.info('📊 SEEDED DATA SUMMARY:');
    logger.info(`   • Users: ${users.length}`);
    logger.info(`   • Categories: ${categories.length}`);
    logger.info(`   • Tags: ${tags.length}`);
    logger.info(`   • Posts: ${posts.length}`);
    logger.info(`   • Comments: ${comments.length}`);
    logger.info('');
    logger.info('🔑 TEST CREDENTIALS:');
    logger.info('   Admin:      admin@educms.com / password123');
    logger.info('   Editor:     editor@educms.com / password123');
    logger.info('   Author:     author1@educms.com / password123');
    logger.info('   Subscriber: subscriber@educms.com / password123');
    logger.info('');

    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
