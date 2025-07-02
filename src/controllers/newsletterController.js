const NewsletterSubscription = require('../models/NewsletterSubscription');
const { createClient } = require('redis');

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email, preferences } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Check if email already exists
    const existingSubscription = await NewsletterSubscription.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(409).json({
          success: false,
          message: 'Email is already subscribed to the newsletter'
        });
      }
    }

    // Create new subscription
    const subscription = new NewsletterSubscription({
      email,
      preferences: preferences || {}
    });

    // inSTantiate Redis client
    const publisher = createClient({
      url: process.env.REDIS_URL
    })

    // Connect to Redis
    await publisher.connect();
    
    // Publish subscription event to Redis
    await publisher.publish('newsletter:subscribe', JSON.stringify({
      email: subscription.email,
    }));

    await subscription.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        email: subscription.email,
        subscribedAt: subscription.subscribedAt,
      }
    });

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        error: error.message
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email is already subscribed'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  subscribe,
}; 