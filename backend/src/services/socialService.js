/**
 * Social Service - User interactions, comments, and reactions
 */

const { v4: uuidv4 } = require('uuid');

class SocialService {
  constructor() {
    // In-memory storage (in production, use a database)
    this.comments = new Map();
    this.reactions = new Map();
    this.users = new Map();
    this.discussions = new Map();
    this.insights = [];
  }

  // Generate anonymous user handle
  generateUserHandle() {
    const adjectives = ['Smart', 'Savvy', 'Bold', 'Wise', 'Sharp', 'Quick', 'Keen', 'Bright'];
    const nouns = ['Trader', 'Analyst', 'Investor', 'Strategist', 'Observer', 'Expert'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 1000);
    return `${adj}${noun}${num}`;
  }

  // Create or get user
  getOrCreateUser(userId) {
    if (!this.users.has(userId)) {
      this.users.set(userId, {
        id: userId,
        handle: this.generateUserHandle(),
        avatar: this.getRandomAvatar(),
        createdAt: new Date().toISOString(),
        stats: {
          comments: 0,
          reactions: 0,
          insightsShared: 0
        }
      });
    }
    return this.users.get(userId);
  }

  getRandomAvatar() {
    const avatars = ['🧑‍💼', '👨‍💻', '👩‍💼', '🧑‍🔬', '👨‍🏫', '👩‍🎓', '🦊', '🐺', '🦁', '🐯', '🦅', '🐉'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  // Add a comment
  addComment(userId, data) {
    const user = this.getOrCreateUser(userId);
    const comment = {
      id: uuidv4(),
      userId,
      userHandle: user.handle,
      userAvatar: user.avatar,
      country: data.country,
      indicator: data.indicator,
      pageId: data.pageId || 'global',
      text: data.text,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      replies: []
    };

    const key = `${data.country || 'global'}_${data.indicator || 'general'}`;
    if (!this.comments.has(key)) {
      this.comments.set(key, []);
    }
    this.comments.get(key).push(comment);
    user.stats.comments++;

    return comment;
  }

  // Get comments for a specific context
  getComments(country, indicator, limit = 50) {
    const key = `${country || 'global'}_${indicator || 'general'}`;
    const comments = this.comments.get(key) || [];
    return comments.slice(-limit).reverse();
  }

  // Get all recent comments
  getAllRecentComments(limit = 30) {
    const allComments = [];
    this.comments.forEach(comments => {
      allComments.push(...comments);
    });
    return allComments
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Add a reaction
  addReaction(userId, targetId, reactionType) {
    const user = this.getOrCreateUser(userId);
    const reaction = {
      id: uuidv4(),
      userId,
      userHandle: user.handle,
      targetId,
      type: reactionType,
      timestamp: new Date().toISOString()
    };

    if (!this.reactions.has(targetId)) {
      this.reactions.set(targetId, []);
    }
    
    // Check if user already reacted
    const existing = this.reactions.get(targetId).find(r => r.userId === userId);
    if (!existing) {
      this.reactions.get(targetId).push(reaction);
      user.stats.reactions++;
    }

    return {
      reaction,
      totalReactions: this.reactions.get(targetId).length
    };
  }

  // Share an insight
  shareInsight(userId, data) {
    const user = this.getOrCreateUser(userId);
    const insight = {
      id: uuidv4(),
      userId,
      userHandle: user.handle,
      userAvatar: user.avatar,
      title: data.title,
      content: data.content,
      countries: data.countries || [],
      indicators: data.indicators || [],
      sentiment: data.sentiment || 'neutral',
      timestamp: new Date().toISOString(),
      likes: 0,
      shares: 0,
      views: 0
    };

    this.insights.push(insight);
    user.stats.insightsShared++;

    // Keep only last 500 insights
    if (this.insights.length > 500) {
      this.insights = this.insights.slice(-500);
    }

    return insight;
  }

  // Get insights feed
  getInsightsFeed(limit = 20, filters = {}) {
    let feed = [...this.insights];

    if (filters.country) {
      feed = feed.filter(i => i.countries.includes(filters.country));
    }

    if (filters.sentiment) {
      feed = feed.filter(i => i.sentiment === filters.sentiment);
    }

    return feed
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Create a discussion thread
  createDiscussion(userId, data) {
    const user = this.getOrCreateUser(userId);
    const discussion = {
      id: uuidv4(),
      userId,
      userHandle: user.handle,
      userAvatar: user.avatar,
      title: data.title,
      content: data.content,
      category: data.category || 'general',
      tags: data.tags || [],
      timestamp: new Date().toISOString(),
      replies: [],
      participants: [userId],
      views: 0,
      isPinned: false
    };

    this.discussions.set(discussion.id, discussion);
    return discussion;
  }

  // Add reply to discussion
  addReply(userId, discussionId, content) {
    const user = this.getOrCreateUser(userId);
    const discussion = this.discussions.get(discussionId);
    
    if (!discussion) return null;

    const reply = {
      id: uuidv4(),
      userId,
      userHandle: user.handle,
      userAvatar: user.avatar,
      content,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    discussion.replies.push(reply);
    if (!discussion.participants.includes(userId)) {
      discussion.participants.push(userId);
    }

    return reply;
  }

  // Get discussions
  getDiscussions(category = null, limit = 20) {
    let discussions = Array.from(this.discussions.values());
    
    if (category) {
      discussions = discussions.filter(d => d.category === category);
    }

    return discussions
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      })
      .slice(0, limit);
  }

  // Get leaderboard
  getLeaderboard(limit = 10) {
    const leaderboard = Array.from(this.users.values())
      .map(user => ({
        handle: user.handle,
        avatar: user.avatar,
        score: user.stats.comments * 2 + user.stats.reactions + user.stats.insightsShared * 5,
        stats: user.stats
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return leaderboard;
  }

  // Get user stats
  getUserStats(userId) {
    const user = this.users.get(userId);
    if (!user) return null;

    return {
      handle: user.handle,
      avatar: user.avatar,
      stats: user.stats,
      memberSince: user.createdAt
    };
  }

  // Get platform stats
  getPlatformStats() {
    return {
      totalUsers: this.users.size,
      totalComments: Array.from(this.comments.values()).reduce((sum, c) => sum + c.length, 0),
      totalInsights: this.insights.length,
      totalDiscussions: this.discussions.size,
      activeToday: Math.floor(this.users.size * 0.3) + 1 // Simulated
    };
  }
}

module.exports = new SocialService();
