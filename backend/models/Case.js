const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  // Dosya Numarası
  dosyaNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // Dosya Türü
  tur: {
    type: String,
    enum: [
      'hukuk',
      'ceza',
      'icra',
      'iş',
      'aile',
      'idari',
      'vergi',
      'ticaret',
      'diger'
    ],
    required: true
  },

  // Alt Tür / Konu
  konu: {
    type: String,
    trim: true
  },

  // Müvekkil (Client referansı)
  muvekkilId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },

  muvekkilAd: {
    type: String,
    trim: true
  },

  // Karşı Taraf
  karsiTaraf: {
    type: String,
    trim: true
  },

  karsiTarafVekili: {
    type: String,
    trim: true
  },

  // Mahkeme (Court referansı)
  mahkemeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court'
  },

  mahkeme: {
    type: String,
    trim: true
  },

  // Dosya Durumu
  durum: {
    type: String,
    enum: ['acik', 'karar_asamasinda', 'kapali', 'arsiv'],
    default: 'acik'
  },

  // Karar Bilgisi
  kararTarihi: {
    type: Date
  },

  kararSonucu: {
    type: String,
    enum: ['kabul', 'red', 'kismi_kabul', 'feragat', 'sulh', 'diger', ''],
    default: ''
  },

  // Finansal Bilgiler
  vekaletUcreti: {
    type: Number,
    default: 0
  },

  tahsilEdilen: {
    type: Number,
    default: 0
  },

  kalan: {
    type: Number,
    default: 0
  },

  // Dava Değeri
  davaKonusuDeger: {
    type: Number
  },

  // Önemlilik
  oncelik: {
    type: String,
    enum: ['dusuk', 'orta', 'yuksek', 'cok_yuksek'],
    default: 'orta'
  },

  // Notlar
  notlar: {
    type: String
  },

  // UYAP Bilgileri
  uyapDosyaNo: {
    type: String,
    trim: true
  },

  // Başvuru/Açılış Tarihi
  basvuruTarihi: {
    type: Date
  },

  // İlk Duruşma Tarihi
  ilkDurusmaTarihi: {
    type: Date
  },

  // Taraflar (detaylı)
  davaci: {
    type: String,
    trim: true
  },

  davali: {
    type: String,
    trim: true
  },

  // Etiketler
  etiketler: [{
    type: String,
    trim: true
  }],

  // İlişkili Dosyalar (file paths)
  belgeler: [{
    ad: String,
    tur: String, // dilekce, tebligat, karar, vb.
    dosyaYolu: String,
    tarih: {
      type: Date,
      default: Date.now
    }
  }],

  // İstatistikler
  durusmaSayisi: {
    type: Number,
    default: 0
  },

  sonDurusma: {
    type: Date
  },

  gelecekDurusma: {
    type: Date
  }

}, {
  timestamps: true
});

// İndeksler
caseSchema.index({ dosyaNo: 1 }, { unique: true });
caseSchema.index({ durum: 1, createdAt: -1 });
caseSchema.index({ muvekkilId: 1 });
caseSchema.index({ mahkemeId: 1 });
caseSchema.index({ tur: 1, durum: 1 });
caseSchema.index({ oncelik: -1, createdAt: -1 });
caseSchema.index({ etiketler: 1 });

// Kalan vekalet ücretini hesapla (middleware)
caseSchema.pre('save', function(next) {
  if (this.isModified('vekaletUcreti') || this.isModified('tahsilEdilen')) {
    this.kalan = (this.vekaletUcreti || 0) - (this.tahsilEdilen || 0);
  }
  next();
});

// Virtual - dosya özeti
caseSchema.virtual('ozet').get(function() {
  return `${this.dosyaNo} - ${this.muvekkilAd} / ${this.karsiTaraf}`;
});

// Virtual - aktif mi?
caseSchema.virtual('aktif').get(function() {
  return this.durum === 'acik' || this.durum === 'karar_asamasinda';
});

module.exports = mongoose.model('Case', caseSchema);
