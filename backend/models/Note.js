const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  // Not Başlığı
  baslik: {
    type: String,
    trim: true
  },

  // Not İçeriği
  icerik: {
    type: String,
    required: true
  },

  // Not Türü
  tur: {
    type: String,
    enum: [
      'durusma_notu',
      'gorusme_notu',
      'telefon_notu',
      'arastirma',
      'fikir',
      'hatirlatma',
      'genel'
    ],
    default: 'genel'
  },

  // İlişkili Dosya (Case)
  dosyaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },

  // İlişkili Müvekkil
  muvekkilId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },

  // İlişkili Süre (Deadline)
  deadlineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deadline'
  },

  // Önem Derecesi
  oncelik: {
    type: String,
    enum: ['dusuk', 'orta', 'yuksek', 'acil'],
    default: 'orta'
  },

  // Etiketler
  etiketler: [{
    type: String,
    trim: true
  }],

  // Sabitlenmiş mi?
  sabitlenmis: {
    type: Boolean,
    default: false
  },

  // Renk (görsel ayırt için)
  renk: {
    type: String,
    enum: ['default', 'blue', 'green', 'yellow', 'red', 'purple', 'pink'],
    default: 'default'
  },

  // Hatırlatma tarihi
  hatirlatma: {
    type: Date
  },

  // Arşivlenmiş mi?
  arsivlenmis: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

// İndeksler
noteSchema.index({ dosyaId: 1, createdAt: -1 });
noteSchema.index({ muvekkilId: 1, createdAt: -1 });
noteSchema.index({ deadlineId: 1 });
noteSchema.index({ tur: 1, arsivlenmis: 1 });
noteSchema.index({ sabitlenmis: -1, createdAt: -1 });
noteSchema.index({ etiketler: 1 });
noteSchema.index({ baslik: 'text', icerik: 'text' });

module.exports = mongoose.model('Note', noteSchema);
