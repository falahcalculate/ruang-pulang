export interface PolicyBlock {
  subheading?: string;
  paragraphs?: string[];
  bullets?: string[];
  externalLink?: {
    label: string;
    url: string;
  };
  afterBulletsParagraphs?: string[];
}

export interface PolicySection {
  number: string;
  title: string;
  blocks: PolicyBlock[];
}

export interface LegalPolicyDocument {
  id: 'privacy' | 'terms';
  kicker: string;
  title: string;
  lastUpdated: string;
  introParagraphs: string[];
  sections: PolicySection[];
}

export const PRIVACY_POLICY_DOCUMENT: LegalPolicyDocument = {
  id: 'privacy',
  kicker: 'PRIVACY POLICY',
  title: 'Kebijakan Privasi RUANG PULANG',
  lastUpdated: 'Terakhir diperbarui: 19 November 2026',
  introParagraphs: [
    'Selamat datang di RUANG PULANG — The Comeback Journal.',
    'Kami menghargai privasi setiap pengguna. Kebijakan Privasi ini menjelaskan bagaimana RUANG PULANG mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pengguna ketika menggunakan aplikasi kami.',
    'Dengan menggunakan RUANG PULANG, pengguna dianggap telah membaca dan memahami kebijakan ini.',
  ],
  sections: [
    {
      number: '1',
      title: 'Pengelola Aplikasi',
      blocks: [
        {
          paragraphs: [
            'RUANG PULANG merupakan produk digital yang dikelola oleh brand RUANG PULANG.',
            'Developer/Pengembang: Mas Alif',
            'Email bantuan: Email bantuan akan diperbarui kemudian.',
            'Dalam kebijakan ini, istilah "kami" merujuk kepada pengelola RUANG PULANG.',
          ],
        },
      ],
    },
    {
      number: '2',
      title: 'Informasi yang Kami Kumpulkan',
      blocks: [
        {
          paragraphs: [
            'Untuk menyediakan layanan jurnal digital, kami dapat memproses beberapa jenis informasi berikut:',
          ],
        },
        {
          subheading: 'A. Informasi akun',
          bullets: [
            'Nama atau informasi profil yang tersedia melalui Google Sign-In.',
            'Alamat email akun Google.',
            'Identitas akun pengguna yang diperlukan untuk autentikasi.',
          ],
        },
        {
          subheading: 'B. Informasi penggunaan aplikasi',
          bullets: [
            'Catatan refleksi pribadi.',
            'Jurnal doa dan catatan spiritual.',
            'Catatan Tahajud dan ibadah malam.',
            'Checklist persiapan malam.',
            'Catatan rasa syukur.',
            'Hasil muhasabah mingguan.',
            'Progres perjalanan 30 malam.',
            'Informasi lain yang pengguna masukkan melalui fitur aplikasi.',
          ],
          afterBulletsParagraphs: [
            'Kami tidak meminta pengguna memasukkan informasi sensitif yang tidak diperlukan untuk menggunakan aplikasi.',
          ],
        },
      ],
    },
    {
      number: '3',
      title: 'Tujuan Penggunaan Informasi',
      blocks: [
        {
          paragraphs: ['Informasi pengguna digunakan untuk:'],
          bullets: [
            'Membuat dan mengelola akun.',
            'Menyediakan fitur jurnal dan refleksi.',
            'Menyimpan serta menampilkan kembali catatan pengguna.',
            'Menyimpan progres perjalanan pengguna.',
            'Menjaga keamanan dan kestabilan aplikasi.',
            'Membantu menangani kendala teknis dan permintaan pengguna.',
          ],
          afterBulletsParagraphs: [
            'Kami tidak menggunakan isi jurnal pribadi pengguna untuk membuat penilaian terhadap tingkat keimanan atau kualitas ibadahnya.',
          ],
        },
      ],
    },
    {
      number: '4',
      title: 'Penyimpanan dan Layanan Pihak Ketiga',
      blocks: [
        {
          paragraphs: [
            'RUANG PULANG menggunakan layanan Firebase dari Google untuk mendukung operasional aplikasi.',
            'Layanan yang digunakan meliputi:',
          ],
          bullets: [
            'Firebase Authentication: membantu proses autentikasi dan login pengguna menggunakan Google.',
            'Cloud Firestore: menyimpan informasi akun dan data jurnal yang diperlukan oleh aplikasi.',
          ],
          afterBulletsParagraphs: [
            'Penggunaan layanan tersebut mengikuti ketentuan privasi dan keamanan penyedia layanan terkait.',
          ],
          externalLink: {
            label: 'Informasi lebih lanjut: Kebijakan Privasi Firebase',
            url: 'https://firebase.google.com/support/privacy',
          },
        },
      ],
    },
    {
      number: '5',
      title: 'Keamanan dan Kerahasiaan Data',
      blocks: [
        {
          paragraphs: [
            'Kami menerapkan pembatasan akses melalui Firebase Authentication dan Firestore Security Rules untuk membantu memastikan pengguna hanya dapat mengakses data miliknya sendiri.',
            'Namun, tidak ada sistem penyimpanan digital yang dapat menjamin keamanan secara mutlak.',
            'Pengguna bertanggung jawab menjaga keamanan akun Google yang digunakan untuk masuk ke aplikasi.',
          ],
        },
      ],
    },
    {
      number: '6',
      title: 'Pembagian Informasi kepada Pihak Lain',
      blocks: [
        {
          paragraphs: [
            'Kami tidak menjual atau menyewakan isi jurnal pribadi pengguna kepada pihak lain.',
            'Informasi dapat diproses oleh penyedia layanan teknologi yang diperlukan untuk menjalankan aplikasi, seperti Google Firebase.',
            'Kami juga dapat mengungkapkan informasi apabila diwajibkan oleh hukum atau proses hukum yang berlaku.',
          ],
        },
      ],
    },
    {
      number: '7',
      title: 'Penyimpanan dan Penghapusan Data',
      blocks: [
        {
          paragraphs: [
            'Data disimpan selama diperlukan untuk menyediakan layanan RUANG PULANG atau sesuai kewajiban hukum yang berlaku.',
            'Pengguna dapat mengajukan permintaan penghapusan akun dan data pribadi melalui kontak resmi RUANG PULANG.',
            'Permintaan akan ditinjau dan diproses sesuai ketentuan hukum yang berlaku serta kemampuan teknis sistem.',
            'Kontak penghapusan data: Email bantuan akan diperbarui kemudian.',
          ],
        },
      ],
    },
    {
      number: '8',
      title: 'Hak Pengguna',
      blocks: [
        {
          paragraphs: [
            'Sesuai ketentuan perlindungan data pribadi yang berlaku, pengguna dapat memiliki hak untuk:',
          ],
          bullets: [
            'Memperoleh informasi mengenai pemrosesan data pribadi.',
            'Meminta akses terhadap data pribadi.',
            'Memperbaiki data yang tidak akurat.',
            'Meminta penghapusan data sesuai ketentuan.',
            'Menarik persetujuan atau mengajukan keberatan atas pemrosesan tertentu sesuai ketentuan hukum.',
          ],
          afterBulletsParagraphs: [
            'Permintaan dapat disampaikan melalui kontak resmi RUANG PULANG setelah alamat kontak tersedia.',
          ],
        },
      ],
    },
    {
      number: '9',
      title: 'Perubahan Kebijakan Privasi',
      blocks: [
        {
          paragraphs: [
            'Kami dapat memperbarui Kebijakan Privasi ini apabila terdapat perubahan pada fitur, teknologi, atau ketentuan hukum.',
            'Versi terbaru akan ditampilkan melalui aplikasi atau halaman resmi RUANG PULANG.',
          ],
        },
      ],
    },
    {
      number: '10',
      title: 'Kontak',
      blocks: [
        {
          paragraphs: [
            'Untuk pertanyaan mengenai Kebijakan Privasi dan pengelolaan data:',
            'RUANG PULANG — The Comeback Journal',
            'Developer: Mas Alif',
            'Email bantuan akan diperbarui kemudian.',
          ],
        },
      ],
    },
  ],
};

export const TERMS_OF_USE_DOCUMENT: LegalPolicyDocument = {
  id: 'terms',
  kicker: 'TERMS OF USE',
  title: 'Ketentuan Penggunaan RUANG PULANG',
  lastUpdated: 'Terakhir diperbarui: 19 November 2026',
  introParagraphs: [
    'Selamat datang di RUANG PULANG — The Comeback Journal.',
    'RUANG PULANG merupakan aplikasi jurnal refleksi Islami yang dirancang untuk membantu pengguna membangun kebiasaan refleksi, mencatat doa, melakukan muhasabah, serta mendokumentasikan perjalanan ibadah malam selama 30 malam.',
    'Dengan mengakses atau menggunakan aplikasi ini, pengguna dianggap telah membaca dan menyetujui ketentuan berikut.',
  ],
  sections: [
    {
      number: '1',
      title: 'Tentang RUANG PULANG',
      blocks: [
        {
          paragraphs: [
            'RUANG PULANG merupakan produk digital berbentuk aplikasi jurnal dan refleksi pribadi.',
            'Fitur yang tersedia dapat mencakup:',
          ],
          bullets: [
            'Perjalanan refleksi 30 malam.',
            'Jurnal doa pribadi.',
            'Catatan Tahajud dan ibadah malam.',
            'Checklist persiapan malam.',
            'Jurnal rasa syukur.',
            'Muhasabah mingguan.',
            'Refleksi akhir perjalanan.',
            'Fitur pendukung lainnya.',
          ],
          afterBulletsParagraphs: [
            'RUANG PULANG merupakan alat bantu refleksi pribadi, bukan pengganti kewajiban ibadah, bimbingan agama, konsultasi ulama, atau keputusan keagamaan yang berwenang.',
          ],
        },
      ],
    },
    {
      number: '2',
      title: 'Akun dan Akses Pengguna',
      blocks: [
        {
          paragraphs: [
            'Pengguna dapat masuk ke aplikasi melalui akun Google menggunakan Firebase Authentication.',
            'Pengguna bertanggung jawab atas keamanan akun Google yang digunakan.',
            'Pengguna juga bertanggung jawab atas aktivitas yang dilakukan melalui akunnya.',
          ],
        },
      ],
    },
    {
      number: '3',
      title: 'Pembelian dan Lifetime Access',
      blocks: [
        {
          paragraphs: [
            'RUANG PULANG ditawarkan sebagai produk digital dengan skema pembayaran satu kali.',
            'Setelah pembelian berhasil melalui platform penjualan yang digunakan, pembeli akan memperoleh informasi atau tautan untuk mengakses produk melalui email.',
            'Lifetime Access berarti akses selama layanan RUANG PULANG masih dioperasikan dan tersedia.',
            'Istilah lifetime tidak berarti jaminan bahwa layanan akan tersedia selamanya tanpa kemungkinan perubahan, gangguan, atau penghentian layanan.',
          ],
        },
        {
          subheading: 'Catatan akses versi peluncuran awal:',
          paragraphs: [
            'Pada versi awal, akses aplikasi menggunakan tautan dan login Google. Aplikasi belum menerapkan verifikasi transaksi otomatis di dalam sistem.',
            'Oleh karena itu, kepemilikan tautan aplikasi tidak dengan sendirinya membuktikan bahwa seseorang telah membeli produk. Tautan yang dibagikan kepada orang lain juga dapat digunakan untuk mencoba mengakses aplikasi.',
            'Pengelola dapat mengembangkan sistem verifikasi pembelian dan pembatasan akses pada versi berikutnya.',
          ],
        },
      ],
    },
    {
      number: '4',
      title: 'Pembayaran dan Pengiriman Produk',
      blocks: [
        {
          paragraphs: [
            'Pembayaran dilakukan melalui platform penjualan resmi yang digunakan oleh RUANG PULANG, seperti Lynk.id atau Scalev.',
            'Proses transaksi, konfirmasi pembayaran, dan pengiriman email produk mengikuti mekanisme serta ketentuan platform yang digunakan.',
            'Pengguna bertanggung jawab memastikan alamat email yang dicantumkan saat pembelian benar dan dapat menerima pesan.',
            'Jika email produk tidak diterima setelah pembayaran berhasil, pengguna dapat menghubungi pengelola melalui kontak resmi yang akan disediakan.',
          ],
        },
      ],
    },
    {
      number: '5',
      title: 'Penggunaan yang Diperbolehkan',
      blocks: [
        {
          paragraphs: ['Pengguna diperbolehkan:'],
          bullets: [
            'Menggunakan aplikasi untuk kebutuhan refleksi pribadi.',
            'Mengisi dan menyimpan jurnal pribadi.',
            'Menggunakan fitur sesuai tujuan pengembangannya.',
            'Mengakses kembali catatan pribadi melalui akun yang digunakan.',
          ],
        },
      ],
    },
    {
      number: '6',
      title: 'Penggunaan yang Tidak Diperbolehkan',
      blocks: [
        {
          paragraphs: ['Pengguna tidak diperbolehkan:'],
          bullets: [
            'Menggunakan aplikasi untuk tindakan ilegal.',
            'Mencoba mengakses atau mengubah data milik pengguna lain.',
            'Mengganggu keamanan atau operasional aplikasi.',
            'Melakukan rekayasa balik, eksploitasi, atau tindakan yang merusak sistem.',
            'Menggunakan aplikasi untuk menyebarkan konten yang melanggar hukum.',
          ],
        },
      ],
    },
    {
      number: '7',
      title: 'Kepemilikan Konten dan Hak Pengguna',
      blocks: [
        {
          paragraphs: [
            'Catatan refleksi, doa, dan tulisan pribadi yang dibuat pengguna tetap merupakan konten milik pengguna.',
            'RUANG PULANG menyediakan fasilitas untuk menyimpan dan mengelola catatan tersebut sebagai bagian dari layanan aplikasi.',
            'Identitas visual, desain, nama produk, struktur aplikasi, dan materi orisinal RUANG PULANG merupakan bagian dari kekayaan intelektual pengelola atau pihak yang memiliki hak terkait.',
            'Pengguna tidak diperbolehkan menyalin, menjual kembali, atau mendistribusikan materi produk secara komersial tanpa izin.',
          ],
        },
      ],
    },
    {
      number: '8',
      title: 'Pengembalian Dana dan Pembatalan',
      blocks: [
        {
          paragraphs: [
            'Permintaan pengembalian dana atau pembatalan transaksi mengikuti ketentuan platform penjualan yang digunakan serta ketentuan hukum yang berlaku.',
            'Untuk kendala pembayaran, pengiriman produk, atau transaksi ganda, pengguna dapat menghubungi pengelola dengan menyertakan bukti transaksi.',
            'Ketentuan ini tidak menghilangkan hak konsumen yang diberikan oleh peraturan perundang-undangan.',
          ],
        },
      ],
    },
    {
      number: '9',
      title: 'Batasan Tanggung Jawab',
      blocks: [
        {
          paragraphs: [
            'RUANG PULANG disediakan sebagai alat bantu refleksi dan pencatatan pribadi.',
            'Materi yang tersedia tidak dimaksudkan sebagai fatwa, konsultasi agama individual, atau jaminan hasil tertentu dari suatu ibadah.',
            'RUANG PULANG tidak menjanjikan bahwa penggunaan aplikasi akan secara otomatis menghasilkan terkabulnya doa, kekayaan, jodoh, kesuksesan, atau hasil duniawi tertentu.',
            'Kami berupaya menjaga layanan tetap berfungsi dengan baik, tetapi tidak dapat menjamin aplikasi selalu tersedia tanpa gangguan teknis, pemeliharaan, atau kendala dari penyedia layanan pihak ketiga.',
          ],
        },
      ],
    },
    {
      number: '10',
      title: 'Perubahan Layanan dan Ketentuan',
      blocks: [
        {
          paragraphs: [
            'Pengelola dapat memperbarui fitur, tampilan, materi, maupun ketentuan penggunaan untuk meningkatkan kualitas layanan.',
            'Perubahan yang bersifat penting akan diinformasikan melalui aplikasi atau kanal resmi RUANG PULANG.',
          ],
        },
      ],
    },
    {
      number: '11',
      title: 'Hukum yang Berlaku',
      blocks: [
        {
          paragraphs: [
            'Ketentuan ini tunduk pada hukum yang berlaku di Republik Indonesia, termasuk ketentuan perlindungan konsumen dan perlindungan data pribadi sepanjang relevan.',
            'Apabila terjadi perselisihan, pengelola dan pengguna akan berupaya menyelesaikannya terlebih dahulu melalui komunikasi yang baik sesuai ketentuan hukum.',
          ],
        },
      ],
    },
    {
      number: '12',
      title: 'Kontak',
      blocks: [
        {
          paragraphs: [
            'RUANG PULANG — The Comeback Journal',
            'Pengelola: Brand RUANG PULANG',
            'Developer: Mas Alif',
            'Email bantuan akan diperbarui kemudian.',
          ],
        },
      ],
    },
  ],
};

export const POLICY_DRAFT_STATUS_NOTE =
  'Dokumen ini merupakan draf kebijakan awal versi 19 November 2026. Email bantuan akan diperbarui kemudian sebelum peluncuran publik.';
