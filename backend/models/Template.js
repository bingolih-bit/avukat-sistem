const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  // Şablon Başlığı
  baslik: {
    type: String,
    required: true,
    trim: true
  },

  // Şablon Türü
  tur: {
    type: String,
    enum: [
      'dava_dilekce',
      'cevap_layihasi',
      'istinaf',
      'temyiz',
      'delil_listesi',
      'tanik_listesi',
      'icra_takibi',
      'sure_uzatma',
      'vekalet',
      'diger'
    ],
    required: true
  },

  // Şablon İçeriği
  icerik: {
    type: String,
    required: true
  },

  // Kategori
  kategori: {
    type: String,
    enum: ['hukuk', 'ceza', 'icra', 'iş', 'aile', 'idari', 'ticaret', 'genel'],
    default: 'genel'
  },

  // Değişkenler (placeholder'lar)
  // Örnek: {{MÜVEKKIL_ADI}}, {{DOSYA_NO}}, vb.
  degiskenler: [{
    ad: String,
    aciklama: String,
    varsayilan: String
  }],

  // Sık kullanılan mı?
  sikKullanilanlar: {
    type: Boolean,
    default: false
  },

  // Kullanım sayısı
  kullanimSayisi: {
    type: Number,
    default: 0
  },

  // Son kullanım
  sonKullanim: {
    type: Date
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
templateSchema.index({ tur: 1, kategori: 1 });
templateSchema.index({ sikKullanilanlar: -1, kullanimSayisi: -1 });
templateSchema.index({ baslik: 'text', icerik: 'text' });

// Kullanım sayısını artır
templateSchema.methods.kullanimArtir = function() {
  this.kullanimSayisi += 1;
  this.sonKullanim = new Date();
  return this.save();
};

module.exports = mongoose.model('Template', templateSchema);
