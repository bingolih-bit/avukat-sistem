const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  // Mahkeme Bilgileri
  ad: {
    type: String,
    required: true,
    trim: true
  },

  tur: {
    type: String,
    enum: [
      'asliye_hukuk',
      'asliye_ceza',
      'sulh_hukuk',
      'sulh_ceza',
      'aile',
      'icra',
      'iş',
      'idare',
      'vergi',
      'bölge_adliye',
      'yargıtay',
      'danıştay',
      'anayasa',
      'diger'
    ],
    default: 'asliye_hukuk'
  },

  // Lokasyon
  sehir: {
    type: String,
    required: true,
    trim: true
  },

  ilce: {
    type: String,
    trim: true
  },

  adres: {
    type: String,
    trim: true
  },

  // İletişim
  telefon: {
    type: String,
    trim: true
  },

  faks: {
    type: String,
    trim: true
  },

  email: {
    type: String,
    trim: true,
    lowercase: true
  },

  // UYAP Bilgileri
  uyapKodu: {
    type: String,
    trim: true
  },

  // Notlar
  notlar: {
    type: String
  },

  // Aktif mi?
  aktif: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

// İndeksler
courtSchema.index({ ad: 1 });
courtSchema.index({ sehir: 1, tur: 1 });
courtSchema.index({ uyapKodu: 1 }, { sparse: true });
courtSchema.index({ aktif: 1 });

// Virtual - tam adı
courtSchema.virtual('tamAd').get(function() {
  return `${this.ad} ${this.sehir}`;
});

module.exports = mongoose.model('Court', courtSchema);
