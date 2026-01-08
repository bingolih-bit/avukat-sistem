const mongoose = require('mongoose');

const pushSubscriptionSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
    unique: true
  },
  keys: {
    p256dh: {
      type: String,
      required: true
    },
    auth: {
      type: String,
      required: true
    }
  },
  // Hangi cihaz/tarayıcıdan geldiğini takip için
  userAgent: String,

  // İleride çoklu kullanıcı için
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // },

  // Aktif mi?
  active: {
    type: Boolean,
    default: true
  },

  // Son bildirim gönderilme zamanı
  lastNotificationSent: Date,

}, {
  timestamps: true
});

// Index for better query performance
pushSubscriptionSchema.index({ endpoint: 1 });
pushSubscriptionSchema.index({ active: 1, createdAt: -1 });

module.exports = mongoose.model('PushSubscription', pushSubscriptionSchema);
