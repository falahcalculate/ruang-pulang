export interface ReferenceEntry {
  id: string;
  group: 'quran' | 'hadis' | 'fikih';
  citation: string;
  contextNote: string;
  url: string | null;
  status: 'dalam_peninjauan' | 'terperiksa_sumber' | 'tertinjau';
}

export const REFERENCES_NOTICE = {
  reviewLabel: 'Audit Sumber v1.1 · 16 November 2026',
  publicStatusNotice:
    'Materi diperiksa berdasarkan sumber rujukan; bukan fatwa atau pengesahan lembaga/ulama. Panduan fikih bersifat pengantar.',
  tahajudGuideLabel:
    'Panduan pengantar untuk menemani pembaca belajar. Bukan pengganti pembelajaran fikih.',
  explanation:
    'Daftar ini mencantumkan sumber yang digunakan untuk mencocokkan nomor ayat, hadis, dan ringkasan materi. Ringkasan dalam journal adalah parafrasa editorial, bukan kutipan terjemahan resmi. Untuk kutipan langsung, gunakan teks dan terjemahan di sumber aslinya.',
  quranIntro:
    "Gunakan Al-Qur'an Digital Bimas Islam sebagai sumber utama teks Arab, terjemahan Kementerian Agama RI, audio, dan tafsir.",
  hadisIntro:
    'Nomor hadis berikut cocok dengan penomoran yang ditampilkan oleh Sunnah.com. Gunakan nama kitab dan bab sebagai pengenal tambahan karena beberapa situs/edisi dapat memakai sistem penomoran berbeda.',
  fikihNote:
    'Catatan: sumber-sumber web merupakan sarana penelusuran. Situs penerbit/penyaji bukan pengganti kitab yang dirujuk. Untuk perbedaan pendapat, persoalan pribadi, atau penerapan fikih yang berdampak hukum, mintalah penjelasan dari ahli yang kompeten.',
};

export const REFERENCE_ENTRIES: ReferenceEntry[] = [
  // Al-Qur'an — Kementerian Agama RI (18 entries)
  {
    id: 'ref-kemenag-quran',
    group: 'quran',
    citation: "Al-Qur'an Digital — Bimas Islam, Kementerian Agama RI",
    contextNote:
      "Sumber utama teks Arab, terjemahan Kementerian Agama RI, audio, dan tafsir.",
    url: 'https://bimasislam.kemenag.go.id/al-quran',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-al-baqarah',
    group: 'quran',
    citation: 'QS. Al-Baqarah',
    contextNote: 'Ayat rujukan: 2:152, 153, 155–157, 186.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/al-baqarah',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-ali-imran',
    group: 'quran',
    citation: "QS. Ali 'Imran",
    contextNote: 'Ayat rujukan: 3:135, 159.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/ali-imran',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-an-nisa',
    group: 'quran',
    citation: 'QS. An-Nisa',
    contextNote: 'Ayat rujukan: 4:110.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/an-nisa',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-ar-rad',
    group: 'quran',
    citation: "QS. Ar-Ra'd",
    contextNote: 'Ayat rujukan: 13:28.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/ar-rad',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-ibrahim',
    group: 'quran',
    citation: 'QS. Ibrahim',
    contextNote: 'Ayat rujukan: 14:7.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/ibrahim',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-an-nahl',
    group: 'quran',
    citation: 'QS. An-Nahl',
    contextNote: 'Ayat rujukan: 16:90.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/an-nahl',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-al-isra',
    group: 'quran',
    citation: 'QS. Al-Isra',
    contextNote: 'Ayat rujukan: 17:79.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/al-isra',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-al-ankabut',
    group: 'quran',
    citation: "QS. Al-'Ankabut",
    contextNote: 'Ayat rujukan: 29:45.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/al-ankabut',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-az-zumar',
    group: 'quran',
    citation: 'QS. Az-Zumar',
    contextNote: 'Ayat rujukan: 39:53–54.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/az-zumar',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-fussilat',
    group: 'quran',
    citation: 'QS. Fussilat',
    contextNote: 'Ayat rujukan: 41:30.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/fussilat',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-ghafir',
    group: 'quran',
    citation: 'QS. Ghafir',
    contextNote: 'Ayat rujukan: 40:60.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/gafir',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-al-furqan',
    group: 'quran',
    citation: 'QS. Al-Furqan',
    contextNote: 'Ayat rujukan: 25:70–71.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/al-furqan',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-al-qalam',
    group: 'quran',
    citation: 'QS. Al-Qalam',
    contextNote: 'Ayat rujukan: 68:4.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/al-qalam',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-al-muzzammil',
    group: 'quran',
    citation: 'QS. Al-Muzzammil',
    contextNote: 'Ayat rujukan: 73:1–6, 20.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/al-muzzammil',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-al-hasyr',
    group: 'quran',
    citation: 'QS. Al-Hasyr',
    contextNote: 'Ayat rujukan: 59:18–19.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/al-hasyr',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-at-talaq',
    group: 'quran',
    citation: 'QS. At-Talaq',
    contextNote: 'Ayat rujukan: 65:3.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/at-talaq',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-at-tahrim',
    group: 'quran',
    citation: 'QS. At-Tahrim',
    contextNote: 'Ayat rujukan: 66:8.',
    url: 'https://bimasislam.kemenag.go.id/al-quran/at-tahrim',
    status: 'terperiksa_sumber',
  },

  // Hadis — Kitab primer dan rujukan teks (6 entries)
  {
    id: 'ref-bukhari-1',
    group: 'hadis',
    citation: 'Sahih al-Bukhari 1',
    contextNote: 'Niat dan amal.',
    url: 'https://sunnah.com/bukhari:1',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-bukhari-1145',
    group: 'hadis',
    citation: 'Sahih al-Bukhari 1145',
    contextNote: 'Doa, permohonan, dan istigfar pada sepertiga malam terakhir.',
    url: 'https://sunnah.com/bukhari:1145',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-bukhari-6464',
    group: 'hadis',
    citation: 'Sahih al-Bukhari 6464',
    contextNote: 'Amal yang dilakukan dengan tepat, moderat, dan konsisten meskipun sedikit.',
    url: 'https://sunnah.com/bukhari:6464',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-bukhari-6465',
    group: 'hadis',
    citation: 'Sahih al-Bukhari 6465',
    contextNote: 'Anjuran agar seseorang mengambil amalan sesuai kemampuannya.',
    url: 'https://sunnah.com/bukhari:6465',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-bukhari-6534',
    group: 'hadis',
    citation: 'Sahih al-Bukhari 6534',
    contextNote:
      'Orang yang memiliki kezaliman/hak terhadap saudaranya diminta menyelesaikannya sebelum hari akhirat.',
    url: 'https://sunnah.com/bukhari:6534',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-muslim-749a',
    group: 'hadis',
    citation: 'Sahih Muslim 749a',
    contextNote:
      'Salat malam dua rakaat demi dua rakaat dan witir sebagai penutup ketika khawatir Subuh tiba.',
    url: 'https://sunnah.com/muslim:749a',
    status: 'terperiksa_sumber',
  },

  // Fikih, tahajud, dan penjelasan taubat (5 entries)
  {
    id: 'ref-nu-online-tahajud-niat',
    group: 'fikih',
    citation: 'NU Online — Tata Cara Shalat Tahajud: Niat, Rakaat, Bacaan Surat, dan Doanya',
    contextNote: 'Pengertian tahajud setelah tidur, rakaat, dan bacaan surah.',
    url: 'https://islam.nu.or.id/shalat/tata-cara-shalat-tahajud-niat-rakaat-bacaan-surat-dan-doanya-rd75P',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-nu-online-tahajud-waktu',
    group: 'fikih',
    citation: 'NU Online — Tata Cara Shalat Tahajud, dari Waktu hingga Doanya',
    contextNote: 'Penjelasan waktu dan tata cara menurut rujukan fikih yang dikutip artikel.',
    url: 'https://islam.nu.or.id/syariah/tata-cara-shalat-tahajud-dari-waktu-hingga-doanya-eC0P3',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-kemenag-tahajud-tidur',
    group: 'fikih',
    citation: 'Kementerian Agama RI — Mendirikan Shalat Tahajud tapi Belum Tidur, Sahkah?',
    contextNote:
      'Penjelasan layanan tanya jawab fikih Kemenag mengenai tidur dan pelaksanaan setelah Isya.',
    url: 'https://kemenag.go.id/en/tanya-jawab-fiqih/mendirikan-shalat-tahajud-tapi-belum-tidur-sahkah-XPm7Q',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-hadits-nu-riyadhus-2',
    group: 'fikih',
    citation: 'Hadits NU — Riyadhus Shalihin No. 2, Bab Taubat',
    contextNote: 'Ringkasan syarat taubat yang dinukil dari penjelasan ulama dalam Riyadhus Shalihin.',
    url: 'https://hadits.nu.or.id/riyadhus-shalihin/2',
    status: 'terperiksa_sumber',
  },
  {
    id: 'ref-mui-khutbah-taubat',
    group: 'fikih',
    citation: 'Majelis Ulama Indonesia — Khutbah tentang taubat nasuha',
    contextNote: 'Ringkasan rukun/syarat taubat dan penyelesaian hak orang lain.',
    url: 'https://mui.or.id/public/index.php/baca/khutbah/khutbah-shalat-gerhana-komitmen-meninggalkan-maksiat-dan-bergegas-dalam-taubat',
    status: 'terperiksa_sumber',
  },
];

export const PRODUCTION_REVIEW_NOTES = {
  title: 'Catatan Produksi dan Peninjauan',
  subtitle: 'Daftar pemeriksaan sebelum naskah dipindahkan ke desain final dan dipasarkan.',
  checklist: [
    'Pemilik konten telah mencocokkan nomor dan topik rujukan terhadap sumber yang tercantum; pemeriksaan ini bukan fatwa atau pengesahan ulama. Untuk materi fikih dan kasus khusus, mintalah peninjauan ahli yang kompeten.',
    'Panduan tahajud telah dirumuskan sebagai pengantar dengan rujukan Kementerian Agama RI dan NU Online; pertahankan batasan bahwa ini bukan panduan fikih menyeluruh.',
    "Doa personal dipastikan tidak diklaim sebagai doa ma'tsur atau bacaan wajib.",
    'Penyunting memeriksa ejaan, konsistensi istilah, dan pengulangan antarmalam.',
    'Desainer menyediakan ruang tulis yang cukup untuk setiap pertanyaan dan lembar pendukung.',
    'Tracker diberi keterangan bahwa pencatatan bukan pengukuran iman dan malam yang terlewat tidak berarti gagal.',
    'Versi PDF diuji di layar ponsel/tablet dan saat dicetak.',
    'Prototype diuji kepada pengguna sasaran sebelum peluncuran.',
  ],
  statusAkhir:
    'Versi editorial 1.1 telah diperiksa terhadap sumber Al-Qur’an Kementerian Agama RI, kitab hadis, serta rujukan fikih yang dicantumkan. Pemeriksaan ini adalah audit referensi dan redaksi, bukan fatwa atau pengesahan ulama. Produk dapat dilanjutkan ke desain dan pengujian beta dengan status tersebut dinyatakan secara jujur. Jangan mengklaim telah disahkan atau difatwakan.',
};
