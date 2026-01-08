const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  baslik: {
    type: String,
    required: true,
    trim: true
  },

  tamamlandi: {
    type: Boolean,
    default: false
  },

  oncelik: {
    type: String,
    enum: ['dusuk', 'orta', 'yuksek'],
    default: 'orta'
  },

  sira: {
    type: Number,
    default: 0
  }
});

const checklistSchema = new mongoose.Schema({
  // İlişkili Süre (Deadline)
  deadlineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deadline',
    required: true
  },

  // İlişkili Dosya (Case)
  dosyaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },

  // Checklist Başlığı
  baslik: {
    type: String,
    required: true,
    trim: true
  },

  // Duruşma mı, dilekçe mi, vs.
  tur: {
    type: String,
    enum: ['durusma', 'dilekce', 'istinaf', 'temyiz', 'genel'],
    default: 'durusma'
  },

  // Checklist öğeleri
  items: [checklistItemSchema],

  // Tamamlanma yüzdesi
  tamamlanmaYuzdesi: {
    type: Number,
    default: 0
  },

  // Tamamlandı mı?
  tamamlandi: {
    type: Boolean,
    default: false
  },

  // Notlar
  notlar: {
    type: String
  },

  // Son tamamlanma tarihi
  sonTarih: {
    type: Date
  }

}, {
  timestamps: true
});

// Tamamlanma yüzdesini hesapla
checklistSchema.methods.hesaplaTamamlanmaYuzdesi = function() {
  if (this.items.length === 0) {
    this.tamamlanmaYuzdesi = 0;
    return 0;
  }

  const tamamlananSayisi = this.items.filter(item => item.tamamlandi).length;
  const yuzde = Math.round((tamamlananSayisi / this.items.length) * 100);

  this.tamamlanmaYuzdesi = yuzde;
  this.tamamlandi = yuzde === 100;

  return yuzde;
};

// Her save'den önce yüzdeyi hesapla
checklistSchema.pre('save', function(next) {
  this.hesaplaTamamlanmaYuzdesi();
  next();
});

// İndeksler
checklistSchema.index({ deadlineId: 1 });
checklistSchema.index({ dosyaId: 1 });
checklistSchema.index({ tamamlandi: 1, sonTarih: 1 });

module.exports = mongoose.model('Checklist', checklistSchema);
