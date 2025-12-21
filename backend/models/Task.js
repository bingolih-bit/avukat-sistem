const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  baslik: {
    type: String,
    required: true,
  },
  aciklama: String,
  dosyaNo: String,
  oncelik: {
    type: String,
    enum: ['yuksek', 'orta', 'dusuk'],
    default: 'orta',
  },
  tarih: String,
  saat: String,
  tamamlandi: {
    type: Boolean,
    default: false,
  },
  tamamlanmaTarihi: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);
