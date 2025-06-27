const mongoose = require('mongoose');

const newsletterSubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
newsletterSubscriptionSchema.index({ email: 1 });
newsletterSubscriptionSchema.index({ isActive: 1 });

// Pre-save middleware to ensure email is lowercase
newsletterSubscriptionSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Static method to check if email exists
newsletterSubscriptionSchema.statics.emailExists = async function(email) {
  const subscription = await this.findOne({ email: email.toLowerCase() });
  return !!subscription;
};

// Instance method to deactivate subscription
newsletterSubscriptionSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

// Instance method to reactivate subscription
newsletterSubscriptionSchema.methods.reactivate = function() {
  this.isActive = true;
  return this.save();
};

module.exports = mongoose.model('NewsletterSubscription', newsletterSubscriptionSchema); 