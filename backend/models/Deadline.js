const mongoose = require('mongoose');

const deadlineSchema = new mongoose.Schema({
  baslik: {
    type: String,
    required: true,
  },
  tur: {
    type: String,
    enum: ['durusma', 'istinaf', 'temyiz', 'cevap_layihasi', 'tebligat', 'kesif', 'bilirkisi'],
    required: true,
  },
  tebligatTarihi: {
    type: Date,
    required: true,
  },
  sonGun: {
    type: Date,
    required: true,
  },
  dosyaNo: String,
  mahkeme: String,
  notlar: String,
  aciliyet: {
    type: String,
    enum: ['acil', 'yakin', 'guvenli'],
  },
  kalanGun: Number,
}, {
  timestamps: true,
});

// Her kaydedilmeden önce aciliyet ve kalan günü hesapla
deadlineSchema.pre('save', function(next) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(this.sonGun);
  targetDate.setHours(0, 0, 0, 0);
  
  // Kalan gün hesapla
  const diffTime = targetDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  this.kalanGun = diffDays;
  
  // Aciliyet belirle
  if (diffDays <= 3) {
    this.aciliyet = 'acil';
  } else if (diffDays <= 7) {
    this.aciliyet = 'yakin';
  } else {
    this.aciliyet = 'guvenli';
  }
  
  next();
});

module.exports = mongoose.model('Deadline', deadlineSchema);
