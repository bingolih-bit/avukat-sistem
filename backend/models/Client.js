const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  // Temel Bilgiler
  adSoyad: {
    type: String,
    required: true,
    trim: true
  },

  tcKimlikNo: {
    type: String,
    trim: true
  },

  vergiNo: {
    type: String,
    trim: true
  },

  // İletişim Bilgileri
  telefon: {
    type: String,
    trim: true
  },

  telefon2: {
    type: String,
    trim: true
  },

  email: {
    type: String,
    trim: true,
    lowercase: true
  },

  adres: {
    type: String,
    trim: true
  },

  sehir: {
    type: String,
    trim: true
  },

  // Müvekkil Türü
  tur: {
    type: String,
    enum: ['gercek_kisi', 'tuzel_kisi'],
    default: 'gercek_kisi'
  },

  // Tüzel kişi için
  sirketUnvan: {
    type: String,
    trim: true
  },

  yetkili: {
    type: String,
    trim: true
  },

  // Notlar ve Detaylar
  notlar: {
    type: String
  },

  // Durum
  aktif: {
    type: Boolean,
    default: true
  },

  // Dosya sayısı (computed)
  dosyaSayisi: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

// İndeksler
clientSchema.index({ adSoyad: 1 });
clientSchema.index({ tcKimlikNo: 1 }, { sparse: true });
clientSchema.index({ telefon: 1 });
clientSchema.index({ aktif: 1, createdAt: -1 });

// Virtuals
clientSchema.virtual('tamAd').get(function() {
  return this.tur === 'tuzel_kisi' && this.sirketUnvan
    ? this.sirketUnvan
    : this.adSoyad;
});

module.exports = mongoose.model('Client', clientSchema);
