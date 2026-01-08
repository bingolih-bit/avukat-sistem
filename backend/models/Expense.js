const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  // İlişkili Dosya (Case)
  dosyaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },

  // Masraf Türü
  tur: {
    type: String,
    enum: [
      'harç',
      'noter',
      'bilirkisi',
      'keşif',
      'tebligat',
      'fotokopi',
      'ulaşım',
      'posta',
      'tercüme',
      'avukatlık_ücreti',
      'diger'
    ],
    required: true
  },

  // Açıklama
  aciklama: {
    type: String,
    required: true,
    trim: true
  },

  // Tutar
  tutar: {
    type: Number,
    required: true,
    min: 0
  },

  // Para Birimi
  paraBirimi: {
    type: String,
    enum: ['TRY', 'USD', 'EUR', 'GBP'],
    default: 'TRY'
  },

  // Tarih
  tarih: {
    type: Date,
    default: Date.now
  },

  // Ödeme Şekli
  odemeSekli: {
    type: String,
    enum: ['nakit', 'kart', 'havale', 'cek', 'diger'],
    default: 'nakit'
  },

  // Müvekkile fatura edildi mi?
  faturaEdildi: {
    type: Boolean,
    default: false
  },

  // Müvekkil tarafından ödendi mi?
  tahsilEdildi: {
    type: Boolean,
    default: false
  },

  // Tahsilat tarihi
  tahsilatTarihi: {
    type: Date
  },

  // Belge/Fatura var mı?
  belgeDosyaYolu: {
    type: String
  },

  // Notlar
  notlar: {
    type: String
  }

}, {
  timestamps: true
});

// İndeksler
expenseSchema.index({ dosyaId: 1, tarih: -1 });
expenseSchema.index({ tur: 1 });
expenseSchema.index({ faturaEdildi: 1, tahsilEdildi: 1 });
expenseSchema.index({ tarih: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
