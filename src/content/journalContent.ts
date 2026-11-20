import type { NightContent, PhaseDefinition } from '../types/journal';

export const CONTENT_VERSION = '1.1-audit-sumber';

export const MANUSCRIPT_STATUS_INFO = {
  versionLabel: 'NASKAH MASTER | VERSI EDITORIAL 1.1 — REVISI HASIL AUDIT SUMBER',
  descriptor: 'Bahasa Indonesia • Guided Spiritual Reflection Journal',
  auditSummary:
    'Versi 1.1 — Pemeriksaan sumber dilakukan pada 16 November 2026. Audit ini mencocokkan nomor rujukan, isi pokok parafrasa, dan kesesuaian tema dengan sumber yang dicantumkan. Audit ini tidak menafsirkan seluruh ayat secara mendalam, tidak menetapkan hukum untuk kasus individual, dan bukan pengesahan atau fatwa.',
  publicStatusNotice:
    'Materi diperiksa berdasarkan sumber rujukan; bukan fatwa atau pengesahan lembaga/ulama. Panduan fikih bersifat pengantar.',
  statusDokumen:
    'Versi 1.1 telah melalui pemeriksaan sumber untuk mencocokkan nomor ayat, nomor hadis, dan kesesuaian ringkasan materi dengan rujukan yang dicantumkan. Pemeriksaan berbasis sumber ini bukan fatwa, sertifikasi, atau pengesahan ulama. Bagian fikih disajikan sebagai panduan pengantar; kasus pribadi, perbedaan pendapat, dan penerapan hukum tetap perlu dirujuk kepada guru agama/ahli yang kompeten.',
  prinsipPenggunaan: [
    'Journal ini adalah alat bantu refleksi dan pencatatan pribadi, bukan buku fatwa, pengganti guru agama, atau penentu kualitas iman.',
    'Periode 30 malam adalah kerangka pendampingan, bukan janji perubahan spiritual atau jaminan terkabulnya doa.',
    'Tahajud merupakan ibadah sunah dan tidak menggantikan salat wajib. Jangan gunakan tracker untuk menyalahkan diri ketika tidak terbangun.',
    'Doa yang ditulis sebagai contoh merupakan redaksi doa personal, bukan klaim bahwa semuanya merupakan doa khusus yang diriwayatkan dari Rasulullah ﷺ.',
    'Gunakan tautan sumber pada bagian akhir untuk memeriksa teks dan konteks. Ringkasan dalam journal bukan kutipan terjemahan resmi. Bila mengutip teks ayat atau hadis secara langsung pada desain final, salin dari sumber yang dirujuk dan periksa kembali ejaan, terjemahan, serta konteksnya.',
  ],
  panduanEditorial:
    "Gunakan istilah 'salat', 'tahajud', 'zikir', 'istigfar', 'Al-Qur'an', dan 'muhasabah' secara konsisten. Nada tulisan dibuat hangat, reflektif, tidak menggurui, dan tidak menekan pembaca. Istilah bahasa Inggris hanya dipakai pada judul fase atau judul malam.",
};

export const WELCOME_CONTENT = {
  title: 'Selamat Datang di Ruang Pulang',
  subtitle: 'Sebuah ruang kecil untuk berhenti sejenak, mengenali diri, dan kembali berusaha mendekat kepada Allah.',
  paragraphs: [
    'Mungkin kamu membuka journal ini karena ingin memperbaiki ibadah. Mungkin ada doa yang sudah lama kamu panjatkan, ada kebiasaan yang ingin kamu tinggalkan, atau ada bagian dari kehidupan yang ingin kamu tata kembali.',
    'Apa pun alasanmu, mulailah dari tempatmu berada sekarang. Kamu tidak harus berpura-pura sempurna. Kamu boleh mengakui bahwa ada hal yang perlu diperbaiki, lalu belajar mengambil langkah yang benar.',
    'Selama 30 malam, RUANG PULANG akan menemanimu melalui refleksi diri, renungan Islam, doa pribadi, dan aktivitas sederhana. Journal ini tidak menjanjikan bahwa semua masalah akan selesai atau seluruh keinginan akan terwujud dalam 30 malam. Tujuannya adalah membantumu menyediakan ruang untuk belajar, beribadah, dan memperbaiki kebiasaan.',
    'Semoga setiap halaman menjadi pengingat yang lembut: jangan berhenti berusaha kembali kepada Allah.',
  ],
  coreMessageLabel: 'PESAN UTAMA',
  coreMessage:
    'Kamu tidak harus menjadi sempurna untuk mulai memperbaiki diri. Mulailah dengan niat yang baik, ilmu yang benar, dan langkah yang mampu kamu usahakan.',
};

export const HOW_TO_USE_JOURNAL = {
  title: 'Cara Menggunakan Journal',
  steps: [
    'Gunakan dengan tenang. Tidak perlu mengejar halaman atau target yang membuatmu terbebani.',
    'Sediakan sekitar 10–15 menit untuk membaca renungan dan menulis refleksi. Waktu ini fleksibel; kamu boleh lebih singkat atau lebih lama.',
    'Baca bagian Renungan Islam beserta rujukannya. Bila ada penjelasan fikih yang belum dipahami, tanyakan kepada guru agama yang tepercaya.',
    'Jawab pertanyaan dengan jujur. Kamu tidak perlu menulis hal pribadi yang tidak nyaman untuk disimpan.',
    'Pilih satu tindakan kecil yang realistis. Pastikan tindakan tersebut aman dan tidak mengabaikan kesehatan serta tanggung jawab.',
    'Tuliskan doa pribadi dengan bahasa yang kamu pahami. Contoh doa dalam journal adalah inspirasi redaksi, bukan doa wajib atau doa khusus yang ditetapkan.',
    'Jika satu malam terlewat, lanjutkan ketika siap. Tidak perlu mengulang dari awal dan tidak perlu menghukum diri.',
    'Jaga privasi tulisanmu. Simpan file atau hasil cetak di tempat yang aman.',
  ],
  tahajudNoteTitle: 'CATATAN TENTANG TAHAJUD',
  tahajudNote:
    'Panduan ini mengikuti pengertian fikih yang dijelaskan oleh Kementerian Agama RI dan NU Online: tahajud dilakukan setelah tidur dan setelah pelaksanaan salat Isya, sebelum masuk waktu Subuh. Ini adalah pengertian yang dipakai dalam panduan pengantar ini; pembaca dapat mengikuti bimbingan guru agama/mazhab yang dianut untuk rincian praktik.',
};

export const BRAND_PRINCIPLES = {
  brandName: 'RUANG PULANG',
  secondaryTitle: 'A JOURNEY BACK TO ALLAH',
  subtitle: 'THE COMEBACK JOURNAL',
  tagline: '30 Malam untuk Kembali Mendekat kepada Allah',
  descriptor: 'Guided Spiritual Reflection Journal',
  coreMessage: WELCOME_CONTENT.coreMessage,
  disclaimer: MANUSCRIPT_STATUS_INFO.prinsipPenggunaan[0] + ' ' + MANUSCRIPT_STATUS_INFO.prinsipPenggunaan[1],
};

export const GENTLE_REMINDERS: string[] = [
  WELCOME_CONTENT.coreMessage,
  HOW_TO_USE_JOURNAL.steps[0],
  HOW_TO_USE_JOURNAL.steps[6],
  MANUSCRIPT_STATUS_INFO.prinsipPenggunaan[2],
];

export const PHASES: PhaseDefinition[] = [
  {
    id: 'phase-1',
    phaseNumber: 1,
    code: 'PHASE 01',
    title: 'REALIZE',
    theme: 'Menyadari bahwa aku ingin kembali.',
    description:
      'Fase ini mengajak pembaca mengenali kondisi hati, kebiasaan, dan alasan pribadi untuk memperbaiki hubungan dengan Allah. Fokusnya bukan menghakimi diri, melainkan berani melihat keadaan dengan jujur.',
    focusPoints: [
      'Mengenali kondisi hati dan pikiran.',
      'Mengidentifikasi kebiasaan yang perlu ditata.',
      'Mengingat nikmat Allah yang sering terlewat.',
      'Memperbarui niat untuk memulai perjalanan.',
    ],
    reminder:
      'Tidak perlu menyelesaikan semua persoalan malam ini. Mulailah dengan mengenali satu hal yang ingin diperbaiki.',
    nightRange: [1, 7],
  },
  {
    id: 'phase-2',
    phaseNumber: 2,
    code: 'PHASE 02',
    title: 'RETURN',
    theme: 'Belajar memulai kembali.',
    description:
      'Fase ini mengajak pembaca mengubah kesadaran menjadi langkah perbaikan: bertaubat, bertanggung jawab atas kesalahan, menjaga salat wajib, dan membangun kebiasaan baik secara bertahap.',
    focusPoints: [
      'Tidak berputus asa dari rahmat Allah.',
      'Mengakui kesalahan dan memperbaiki dampaknya.',
      'Memahami taubat dengan sungguh-sungguh.',
      'Menjaga salat dan memilih amal yang realistis.',
    ],
    reminder:
      'Penyesalan sebaiknya mengantar pada taubat dan tindakan perbaikan, bukan membuat seseorang berhenti berharap.',
    nightRange: [8, 14],
  },
  {
    id: 'phase-3',
    phaseNumber: 3,
    code: 'PHASE 03',
    title: 'RECONNECT',
    theme: 'Membangun kembali kedekatan dengan Allah.',
    description:
      'Fase ini memperkenalkan ibadah malam, panduan dasar tahajud, persiapan tidur, doa pribadi, tawakal, dan refleksi. Tahajud ditempatkan sebagai ibadah sunah untuk mendekat kepada Allah, bukan sebagai transaksi untuk memperoleh keinginan tertentu.',
    focusPoints: [
      'Menyediakan waktu khusus untuk beribadah.',
      'Mempelajari pengertian dan tata cara dasar tahajud.',
      'Menata persiapan malam dan istirahat.',
      'Menyusun doa, belajar tawakal, dan berefleksi.',
    ],
    reminder:
      'Tahajud tidak menggantikan salat wajib. Jangan jadikan tracker sebagai ukuran iman atau alasan menyalahkan diri.',
    nightRange: [15, 21],
  },
  {
    id: 'phase-4',
    phaseNumber: 4,
    code: 'PHASE 04',
    title: 'REMAIN',
    theme: 'Belajar menjaga kedekatan dalam kehidupan sehari-hari.',
    description:
      'Fase terakhir membantu pembaca membawa hasil refleksi ke kehidupan sehari-hari: bersyukur, memperbaiki salat dan akhlak, menghadapi ujian, bertawakal, dan memilih kebiasaan yang bisa dijaga setelah 30 malam.',
    focusPoints: [
      'Menghidupkan rasa syukur.',
      'Meningkatkan perhatian pada salat dan akhlak.',
      'Menghadapi kesulitan dengan sabar dan ikhtiar.',
      'Membangun rutinitas dan komitmen jangka panjang.',
    ],
    reminder:
      'Hari ke-30 bukan garis akhir. Perjalanan memperbaiki hubungan dengan Allah berlangsung sepanjang hidup.',
    nightRange: [22, 30],
  },
];

export const NIGHTS: NightContent[] = [
  // PHASE 01 — REALIZE
  {
    nightNumber: 1,
    phaseId: 'phase-1',
    title: 'The First Step',
    theme: 'MEMULAI PERJALANAN KEMBALI',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Tidak harus menunggu menjadi sempurna untuk mulai kembali.',
      'Mungkin ada ibadah yang belum terjaga, kebiasaan yang ingin ditinggalkan, atau kesalahan yang masih kamu sesali. Di tengah semua itu, kamu mungkin bertanya-tanya harus mulai dari mana.',
      'Malam ini, mulailah dengan satu langkah sederhana: mengakui bahwa kamu ingin memperbaiki diri. Kamu tidak perlu menyelesaikan semuanya sekaligus. Beri dirimu ruang untuk mengenali niat dan menentukan arah.',
    ].join('\n\n'),
    islamicInsight: [
      'QS. Az-Zumar ayat 53 mengingatkan agar manusia tidak berputus asa dari rahmat Allah. Ayat 54 melanjutkan ajakan untuk kembali kepada-Nya dan berserah diri. Pesan ini bukan alasan untuk meremehkan kesalahan, melainkan dorongan untuk bertaubat dan memperbaiki langkah.',
      'Niat juga menjadi dasar penting dalam amal. Dalam Sahih al-Bukhari nomor 1, Rasulullah ﷺ menjelaskan bahwa nilai amal berkaitan dengan niatnya.',
    ].join('\n\n'),
    referenceText: "Rujukan: QS. Az-Zumar (39): 53–54; Sahih al-Bukhari 1.",
    referenceUrl: null,
    reflectionQuestions: [
      'Apa alasan terbesarku memulai perjalanan ini?',
      'Bagian mana dari kehidupanku yang ingin aku perbaiki?',
      'Langkah kecil apa yang sanggup kulakukan malam ini?',
    ],
    smallActionPrompt:
      'Tuliskan niat dan harapanmu selama menggunakan journal ini. Pilih satu tindakan sederhana yang dapat dilakukan dalam 24 jam ke depan.',
    personalDuaExample:
      'Ya Allah, bimbinglah aku untuk kembali kepada-Mu, memperbaiki niat, dan mengambil langkah yang benar. Jangan biarkan aku berputus asa dari rahmat-Mu.',
    reminderNote:
      'Tidak perlu menyelesaikan semua persoalan malam ini. Mulailah dengan mengenali satu hal yang ingin diperbaiki.',
  },
  {
    nightNumber: 2,
    phaseId: 'phase-1',
    title: 'My Heart Today',
    theme: 'MENGENALI KONDISI HATI',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Sudahkah kamu benar-benar mendengarkan keadaan hatimu sendiri?',
      'Ada hari ketika pikiran terasa penuh: pekerjaan, keluarga, masa depan, dan hal-hal yang belum menemukan jawaban. Di tengah kesibukan, kita bisa lupa berhenti sejenak untuk mengenali apa yang sedang dirasakan.',
      'Malam ini, tidak perlu berpura-pura semuanya baik-baik saja. Kenali perasaanmu dengan jujur, lalu bawa kegelisahan itu ke dalam doa dan usaha yang baik.',
    ].join('\n\n'),
    islamicInsight:
      "QS. Ar-Ra'd ayat 28 mengaitkan ketenteraman hati orang-orang beriman dengan mengingat Allah. Ini bukan janji bahwa semua persoalan langsung hilang, tetapi pengingat bahwa zikir dan mengingat Allah memiliki tempat penting dalam kehidupan seorang mukmin.",
    referenceText: "Rujukan: QS. Ar-Ra'd (13): 28.",
    referenceUrl: null,
    reflectionQuestions: [
      'Apa yang paling banyak memenuhi pikiranku akhir-akhir ini?',
      'Hal apa yang membuatku merasa gelisah atau lelah?',
      'Kapan aku biasanya meluangkan waktu untuk mengingat Allah dengan sadar?',
    ],
    smallActionPrompt:
      'Luangkan beberapa menit tanpa gangguan. Lakukan zikir yang kamu ketahui dari tuntunan yang tepercaya, dengan tenang dan tidak terburu-buru.',
    personalDuaExample:
      'Ya Allah, Engkau mengetahui keadaan hatiku. Tuntunlah aku untuk mengingat-Mu, meminta pertolongan-Mu, dan menghadapi urusanku dengan cara yang Engkau ridai.',
    reminderNote:
      'Tidak perlu menyelesaikan semua persoalan malam ini. Mulailah dengan mengenali satu hal yang ingin diperbaiki.',
  },
  {
    nightNumber: 3,
    phaseId: 'phase-1',
    title: 'When I Feel Distant',
    theme: 'MENGENALI HAL YANG MENGHAMBAT KEDEKATAN',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Ada kalanya kesibukan mengambil begitu banyak ruang sampai kita lupa menyediakan waktu untuk mengingat Allah.',
      'Pekerjaan, hiburan, media sosial, dan tanggung jawab keluarga merupakan bagian dari kehidupan. Namun, kita perlu memeriksa apakah ada kebiasaan yang membuat ibadah tertunda atau perhatian terus-menerus terseret ke hal lain.',
      'Malam ini, bukan waktunya menyalahkan diri. Saatnya mengenali apa yang perlu ditata kembali agar urusan dunia dan kewajiban kepada Allah berada pada tempat yang semestinya.',
    ].join('\n\n'),
    islamicInsight: [
      'QS. Al-Hasyr ayat 19 mengingatkan orang beriman agar tidak menjadi seperti orang yang melupakan Allah, lalu dibuat lupa terhadap diri sendiri. Ayat ini mengajak kita menjaga kesadaran spiritual dan mengevaluasi arah hidup.',
      'Mengenali gangguan bukan berarti meninggalkan tanggung jawab dunia. Kita justru belajar mengatur waktu agar pekerjaan, keluarga, istirahat, dan ibadah tidak saling mengabaikan.',
    ].join('\n\n'),
    referenceText: 'Rujukan: QS. Al-Hasyr (59): 19.',
    referenceUrl: null,
    reflectionQuestions: [
      'Aktivitas apa yang paling sering menyita waktuku?',
      'Apakah ada kebiasaan yang membuatku menunda ibadah?',
      'Satu perubahan apa yang bisa membantu mengatur waktuku dengan lebih baik?',
    ],
    smallActionPrompt:
      'Pilih satu kebiasaan kecil untuk ditata, misalnya membatasi penggunaan ponsel menjelang tidur atau menyiapkan perlengkapan salat sebelum waktu ibadah.',
    personalDuaExample:
      'Ya Allah, bantu aku mengatur waktu dan perhatianku. Jangan biarkan kesibukan melalaikanku dari mengingat-Mu dan menjalankan tanggung jawabku.',
    reminderNote:
      'Tidak perlu menyelesaikan semua persoalan malam ini. Mulailah dengan mengenali satu hal yang ingin diperbaiki.',
  },
  {
    nightNumber: 4,
    phaseId: 'phase-1',
    title: 'Knowing Myself',
    theme: 'MUHASABAH DIRI',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Memperbaiki diri dimulai dengan keberanian melihat diri sendiri secara jujur.',
      'Lebih mudah melihat kekurangan orang lain daripada mengevaluasi perilaku sendiri. Padahal, muhasabah membantu kita mengenali tindakan yang perlu dipertahankan, diperbaiki, atau ditinggalkan.',
      'Lakukan evaluasi tanpa merendahkan diri. Tujuannya bukan menghukum masa lalu, melainkan mengambil pelajaran dan menyiapkan langkah yang lebih baik.',
    ].join('\n\n'),
    islamicInsight:
      'QS. Al-Hasyr ayat 18 mengajak orang beriman memperhatikan apa yang telah dipersiapkan untuk hari esok. Ayat ini menjadi dasar untuk mengevaluasi amal dan memikirkan bekal akhirat, bukan sekadar menilai pencapaian dunia.',
    referenceText: 'Rujukan: QS. Al-Hasyr (59): 18.',
    referenceUrl: null,
    reflectionQuestions: [
      'Perilaku apa yang ingin aku perbaiki?',
      'Pelajaran apa yang bisa kuambil dari pengalaman yang kurang baik?',
      'Apa satu perubahan yang bisa kumulai hari ini?',
    ],
    smallActionPrompt:
      'Tuliskan satu kebiasaan yang ingin diperbaiki, alasan mengapa perubahan itu penting, dan tindakan nyata untuk memulainya.',
    personalDuaExample:
      'Ya Allah, tunjukkan kepadaku kekurangan yang perlu kuperbaiki dan bimbinglah aku untuk memperbaiki akhlak serta perbuatanku.',
    reminderNote:
      'Tidak perlu menyelesaikan semua persoalan malam ini. Mulailah dengan mengenali satu hal yang ingin diperbaiki.',
  },
  {
    nightNumber: 5,
    phaseId: 'phase-1',
    title: 'Remembering Allah',
    theme: 'MEMBANGUN KEBIASAAN MENGINGAT ALLAH',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Di tengah aktivitas sehari-hari, seberapa sering kita sengaja meluangkan waktu untuk mengingat Allah?',
      'Kita dapat menghabiskan waktu untuk pekerjaan, pesan, hiburan, dan banyak urusan. Karena itu, penting untuk menyediakan momen yang membantu hati kembali mengingat siapa yang memberi kita kehidupan dan kesempatan.',
      'Mendekat kepada Allah tidak harus dimulai dengan target besar. Mulailah dari ibadah wajib yang dijaga, zikir yang dipelajari, dan kesadaran untuk menjalani aktivitas dengan cara yang baik.',
    ].join('\n\n'),
    islamicInsight:
      "QS. Al-Baqarah ayat 152 memerintahkan manusia untuk mengingat Allah dan bersyukur kepada-Nya. Mengingat Allah dapat hadir melalui zikir, doa, ibadah, dan ketaatan dalam kehidupan sehari-hari.",
    referenceText: 'Rujukan: QS. Al-Baqarah (2): 152.',
    referenceUrl: null,
    reflectionQuestions: [
      'Kapan aku paling mudah mengingat Allah?',
      'Hal apa yang sering membuatku lupa berzikir atau menunda ibadah?',
      'Kebiasaan apa yang ingin kubangun agar lebih sering mengingat Allah?',
    ],
    smallActionPrompt:
      "Tentukan satu waktu yang realistis untuk menjaga zikir atau membaca Al-Qur'an, misalnya setelah salah satu salat wajib.",
    personalDuaExample:
      'Ya Allah, jadikan aku hamba yang senantiasa mengingat dan bersyukur kepada-Mu. Bantu aku menjaga zikir dan ketaatan dalam keseharianku.',
    reminderNote:
      'Tidak perlu menyelesaikan semua persoalan malam ini. Mulailah dengan mengenali satu hal yang ingin diperbaiki.',
  },
  {
    nightNumber: 6,
    phaseId: 'phase-1',
    title: 'The Blessings I Forgot',
    theme: 'MENYADARI NIKMAT ALLAH',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Ada banyak nikmat yang mungkin terlalu sering kita terima hingga lupa mensyukurinya.',
      'Perhatian kita mudah tertuju pada sesuatu yang belum dimiliki: pekerjaan yang belum didapat, rencana yang tertunda, atau keadaan yang belum sesuai harapan. Sementara itu, ada nikmat sederhana yang hadir setiap hari dan patut disadari.',
      'Bersyukur tidak berarti berhenti memiliki cita-cita. Kita tetap boleh berusaha memperbaiki kehidupan sambil menghargai nikmat yang sudah ada.',
    ].join('\n\n'),
    islamicInsight:
      'QS. Ibrahim ayat 7 mengingatkan tentang pentingnya bersyukur kepada Allah. Syukur bukan hanya ucapan, tetapi juga kesadaran atas nikmat dan usaha menggunakan nikmat tersebut untuk kebaikan.',
    referenceText: 'Rujukan: QS. Ibrahim (14): 7.',
    referenceUrl: null,
    reflectionQuestions: [
      'Tiga nikmat apa yang paling aku syukuri hari ini?',
      'Nikmat apa yang sering kuanggap biasa?',
      'Bagaimana aku bisa menggunakan salah satu nikmat itu untuk melakukan kebaikan?',
    ],
    smallActionPrompt:
      'Tuliskan tiga hal yang kamu syukuri hari ini. Pilih satu nikmat dan pikirkan cara menggunakannya untuk kebaikan.',
    personalDuaExample:
      'Ya Allah, terima kasih atas nikmat yang kusadari maupun yang belum kusadari. Jadikan aku hamba yang pandai bersyukur dan menggunakan nikmat-Mu dalam kebaikan.',
    reminderNote:
      'Tidak perlu menyelesaikan semua persoalan malam ini. Mulailah dengan mengenali satu hal yang ingin diperbaiki.',
  },
  {
    nightNumber: 7,
    phaseId: 'phase-1',
    title: 'Renew My Intention',
    theme: 'MEMPERBARUI NIAT DAN KOMITMEN',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Perjalanan memperbaiki diri bukan tentang seberapa cepat kamu berubah, tetapi tentang niat dan usaha yang terus diperbarui.',
      'Tujuh malam pertama telah memberi ruang untuk mengenali diri. Mungkin ada hal yang baru kamu sadari, kebiasaan yang ingin diubah, atau pertanyaan yang masih perlu dipelajari.',
      'Sekarang, lihat kembali alasanmu memulai. Pastikan tujuan journal ini bukan mengejar kesempurnaan atau sekadar menuntaskan halaman, melainkan belajar menjalani ketaatan dengan lebih sadar.',
    ].join('\n\n'),
    islamicInsight:
      'Dalam Sahih al-Bukhari nomor 1, Rasulullah ﷺ menjelaskan bahwa amal bergantung pada niat. Karena itu, perbarui niat dan arahkan usaha perbaikan diri untuk mencari rida Allah.',
    referenceText: 'Rujukan: Sahih al-Bukhari 1.',
    referenceUrl: null,
    reflectionQuestions: [
      'Apa alasan terbesarku memulai perjalanan ini?',
      'Apa yang kupelajari tentang diriku selama tujuh malam terakhir?',
      'Kebiasaan baik apa yang ingin terus kuusahakan?',
    ],
    smallActionPrompt:
      'Tuliskan satu komitmen sederhana untuk minggu berikutnya. Pilih kebiasaan yang realistis dan tidak mengabaikan kesehatan serta tanggung jawabmu.',
    personalDuaExample:
      'Ya Allah, luruskan niatku, teguhkan langkahku, dan bimbinglah aku agar setiap usaha perbaikan diri dilakukan dengan ikhlas.',
    reminderNote:
      'Tidak perlu menyelesaikan semua persoalan malam ini. Mulailah dengan mengenali satu hal yang ingin diperbaiki.',
  },

  // PHASE 02 — RETURN
  {
    nightNumber: 8,
    phaseId: 'phase-2',
    title: 'A Door to Return',
    theme: 'TIDAK BERPUTUS ASA DARI RAHMAT ALLAH',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Terkadang kita merasa sudah terlalu jauh untuk kembali. Namun, seorang hamba tidak boleh berputus asa dari rahmat Allah.',
      'Mungkin ada kesalahan yang masih kamu ingat, ibadah yang belum terjaga, atau janji kepada diri sendiri yang belum berhasil ditepati. Rasa bersalah dapat menjadi pengingat untuk berubah, tetapi jangan biarkan ia membuatmu berhenti berharap.',
      'Malam ini, mulailah dengan mengakui keinginan untuk kembali dan mengambil langkah yang bertanggung jawab.',
    ].join('\n\n'),
    islamicInsight:
      'QS. Az-Zumar ayat 53–54 melarang manusia berputus asa dari rahmat Allah dan mengajak mereka kembali kepada-Nya. Harapan terhadap ampunan tidak boleh dipisahkan dari kesungguhan untuk bertaubat dan memperbaiki perbuatan.',
    referenceText: 'Rujukan: QS. Az-Zumar (39): 53–54.',
    referenceUrl: null,
    reflectionQuestions: [
      'Adakah kesalahan masa lalu yang membuatku enggan memperbaiki diri?',
      'Apa yang membuatku merasa sulit untuk kembali beribadah dengan lebih baik?',
      'Langkah nyata apa yang dapat kuambil setelah malam ini?',
    ],
    smallActionPrompt:
      'Tuliskan satu hal yang ingin diperbaiki. Jangan berhenti pada penyesalan; tentukan satu tindakan yang dapat kamu lakukan.',
    personalDuaExample:
      'Ya Allah, jangan biarkan aku berputus asa dari rahmat-Mu. Bimbinglah aku untuk kembali kepada-Mu dengan taubat dan usaha yang sungguh-sungguh.',
    reminderNote:
      'Penyesalan sebaiknya mengantar pada taubat dan tindakan perbaikan, bukan membuat seseorang berhenti berharap.',
  },
  {
    nightNumber: 9,
    phaseId: 'phase-2',
    title: 'The Weight I Carry',
    theme: 'MENGENALI KESALAHAN DAN TANGGUNG JAWAB',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Tidak semua hal yang membebani hati dapat diselesaikan dengan menghindarinya.',
      'Ada kalanya kita mengetahui bahwa sesuatu yang dilakukan tidak benar, tetapi menunda untuk mengakuinya atau memperbaiki dampaknya. Padahal, keberanian mengakui kesalahan dapat menjadi awal perubahan.',
      'Malam ini, lihat kembali hal-hal yang perlu kamu pertanggungjawabkan. Lakukan dengan jujur, tetapi tetap arahkan dirimu pada perbaikan, bukan penghukuman diri.',
    ].join('\n\n'),
    islamicInsight: [
      "QS. Ali 'Imran ayat 135 menggambarkan orang-orang bertakwa yang ketika melakukan kesalahan atau menzalimi diri sendiri, mereka mengingat Allah dan memohon ampunan, serta tidak terus-menerus mempertahankan kesalahan dengan sadar.",
      'Untuk kesalahan yang melanggar hak orang lain, penjelasan ulama tentang taubat juga mencakup penyelesaian hak tersebut. Sahih al-Bukhari 6534 mengingatkan orang yang menzalimi saudaranya agar menyelesaikan atau meminta kerelaan sebelum datang hari ketika penyelesaian tidak lagi dilakukan dengan harta. Bentuk pemulihan perlu disesuaikan dengan jenis hak dan keadaan; untuk situasi sensitif atau berisiko menimbulkan mudarat baru, mintalah bimbingan ahli yang tepercaya.',
    ].join('\n\n'),
    referenceText:
      "Rujukan: QS. Ali 'Imran (3): 135; Sahih al-Bukhari 6534; Riyadhus Shalihin, Bab 2 tentang Taubat (penjelasan ulama yang dikutip Imam an-Nawawi).",
    referenceUrl: null,
    reflectionQuestions: [
      'Kesalahan atau kebiasaan apa yang selama ini sulit kuakui?',
      'Apa yang membuatku menunda untuk memperbaikinya?',
      'Adakah hak orang lain yang perlu kukembalikan atau dampak yang perlu kuperbaiki?',
    ],
    smallActionPrompt:
      'Pilih satu hal yang perlu diperbaiki. Jika berkaitan dengan orang lain, rencanakan tindakan yang bertanggung jawab dan aman untuk memulihkan keadaan.',
    personalDuaExample:
      'Ya Allah, ampuni kesalahanku dan bimbinglah aku untuk berani bertanggung jawab serta memperbaiki apa yang masih bisa kuperbaiki.',
    reminderNote:
      'Penyesalan sebaiknya mengantar pada taubat dan tindakan perbaikan, bukan membuat seseorang berhenti berharap.',
  },
  {
    nightNumber: 10,
    phaseId: 'phase-2',
    title: 'Sincere Repentance',
    theme: 'MEMAHAMI TAUBAT DENGAN SUNGGUH-SUNGGUH',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Taubat bukan sekadar menyesali sesuatu yang telah terjadi. Taubat adalah kesungguhan untuk kembali kepada Allah dan memperbaiki arah kehidupan.',
      'Mungkin kamu pernah berniat berubah, tetapi kemudian mengulangi kesalahan yang sama. Jangan jadikan hal itu alasan untuk berhenti bertaubat. Evaluasi apa yang membuatmu kembali melakukan kesalahan dan cari langkah pencegahannya.',
      'Malam ini, pelajari makna taubat dan pikirkan perubahan nyata yang dapat kamu mulai.',
    ].join('\n\n'),
    islamicInsight: [
      'QS. At-Tahrim ayat 8 memerintahkan orang beriman untuk bertaubat kepada Allah dengan taubat nasuha. Dalam ringkasan penjelasan ulama yang dikutip Imam an-Nawawi dalam Riyadhus Shalihin, taubat atas dosa yang berkaitan dengan hak Allah mencakup meninggalkan dosa, menyesalinya, dan bertekad sungguh-sungguh untuk tidak mengulanginya. Jika dosa menyangkut hak orang lain, ada kewajiban tambahan untuk menyelesaikan hak tersebut.',
      'Ini adalah ringkasan penjelasan ulama, bukan terjemahan langsung QS. At-Tahrim ayat 8 dan bukan satu-satunya uraian rinci untuk setiap kasus. Penerapan dapat berbeda menurut jenis pelanggaran dan keadaan. Untuk persoalan khusus, mintalah bimbingan guru agama yang tepercaya.',
    ].join('\n\n'),
    referenceText:
      'Rujukan: QS. At-Tahrim (66): 8; Riyadhus Shalihin, Bab 2 tentang Taubat; Sahih al-Bukhari 6534 untuk pengingat tentang hak orang yang dizalimi.',
    referenceUrl: null,
    reflectionQuestions: [
      'Kebiasaan apa yang ingin kutinggalkan?',
      'Apa pemicu yang biasanya membuatku mengulanginya?',
      'Dukungan atau perubahan lingkungan apa yang bisa membantuku?',
    ],
    smallActionPrompt:
      'Tuliskan satu kebiasaan yang ingin ditinggalkan, satu pemicunya, dan satu kebiasaan pengganti yang lebih baik.',
    personalDuaExample:
      'Ya Allah, ampunilah kesalahanku. Bimbing aku untuk meninggalkan perbuatan yang tidak Engkau ridai dan berikan kekuatan untuk memperbaiki diri.',
    reminderNote:
      'Penyesalan sebaiknya mengantar pada taubat dan tindakan perbaikan, bukan membuat seseorang berhenti berharap.',
  },
  {
    nightNumber: 11,
    phaseId: 'phase-2',
    title: 'Learning to Move Forward',
    theme: 'MELANJUTKAN LANGKAH SETELAH MELAKUKAN KESALAHAN',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Penyesalan seharusnya membantu kita belajar, bukan membuat kita berhenti memperbaiki diri.',
      'Mengakui kesalahan adalah bagian dari tanggung jawab. Setelah itu, kita perlu memohon ampunan, memperbaiki dampak yang ditimbulkan, dan berusaha tidak mengulangi perbuatan tersebut.',
      'Malam ini, jangan hanya mengingat apa yang telah terjadi. Pikirkan pelajaran dan tindakan yang dapat membawamu ke arah yang lebih baik.',
    ].join('\n\n'),
    islamicInsight: [
      'QS. An-Nisa ayat 110 menjelaskan bahwa orang yang melakukan keburukan atau menzalimi diri sendiri, lalu memohon ampunan kepada Allah, akan mendapati Allah Maha Pengampun dan Maha Penyayang.',
      'Ayat ini menguatkan harapan untuk kembali kepada Allah. Harapan tersebut berjalan bersama taubat dan perbaikan perilaku.',
    ].join('\n\n'),
    referenceText: 'Rujukan: QS. An-Nisa (4): 110.',
    referenceUrl: null,
    reflectionQuestions: [
      'Pengalaman apa yang masih sering kuingat dan perlu kupetik pelajarannya?',
      'Apa tindakan perbaikan yang belum kulakukan?',
      'Bagaimana aku dapat mencegah kesalahan serupa terulang?',
    ],
    smallActionPrompt:
      'Tuliskan tiga hal: kesalahan atau masalah yang ingin diperbaiki, pelajaran yang diperoleh, dan tindakan berikutnya.',
    personalDuaExample:
      'Ya Allah, berikan aku ampunan, petunjuk, dan kekuatan untuk melanjutkan langkah dalam kebaikan.',
    reminderNote:
      'Penyesalan sebaiknya mengantar pada taubat dan tindakan perbaikan, bukan membuat seseorang berhenti berharap.',
  },
  {
    nightNumber: 12,
    phaseId: 'phase-2',
    title: 'Rebuilding My Prayer',
    theme: 'MEMPERBAIKI KUALITAS SALAT',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Bagaimana jika kita mulai memberi perhatian lebih pada ibadah yang setiap hari kita lakukan?',
      'Kesibukan dan pikiran yang bercabang kadang membuat salat dilakukan dengan tergesa-gesa. Kita mungkin belum memahami makna bacaan atau belum menyiapkan diri dengan baik.',
      'Malam ini, mari kembali melihat salat sebagai ibadah utama yang perlu dijaga. Perbaikan kualitas salat dimulai dari belajar, mempersiapkan diri, dan berusaha menghadirkan hati.',
    ].join('\n\n'),
    islamicInsight:
      "QS. Al-'Ankabut ayat 45 menjelaskan bahwa salat mencegah perbuatan keji dan mungkar serta mengingat Allah merupakan perkara yang besar. Salat wajib tetap menjadi prioritas; tahajud adalah ibadah sunah yang tidak menggantikannya.",
    referenceText: "Rujukan: QS. Al-'Ankabut (29): 45.",
    referenceUrl: null,
    reflectionQuestions: [
      'Bagaimana selama ini aku menjaga salat wajib?',
      'Apa yang sering mengganggu perhatianku ketika salat?',
      'Bacaan atau bagian salat apa yang ingin kupelajari kembali?',
    ],
    smallActionPrompt:
      'Pilih satu waktu salat berikutnya untuk dipersiapkan dengan lebih baik. Jauhkan gangguan, datang lebih awal, dan pelajari makna bacaan secara bertahap.',
    personalDuaExample:
      'Ya Allah, bantulah aku menjaga salat dan memperbaiki kualitas ibadahku. Jadikan salat sebagai pengingat untuk menjalani kehidupan dalam ketaatan.',
    reminderNote:
      'Penyesalan sebaiknya mengantar pada taubat dan tindakan perbaikan, bukan membuat seseorang berhenti berharap.',
  },
  {
    nightNumber: 13,
    phaseId: 'phase-2',
    title: 'Small Deeds Matter',
    theme: 'MEMBANGUN KEBIASAAN BAIK SECARA BERTAHAP',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Kita tidak harus mengubah seluruh kehidupan dalam satu malam.',
      'Keinginan memperbaiki diri kadang membuat kita memasang banyak target sekaligus. Ketika target itu sulit dipertahankan, semangat pun turun.',
      'Cobalah memilih satu kebiasaan yang sederhana dan realistis. Kebiasaan kecil yang dijaga dengan sungguh-sungguh dapat menjadi bagian penting dari perjalanan panjang.',
    ].join('\n\n'),
    islamicInsight: [
      'Dalam Sahih al-Bukhari nomor 6464, Rasulullah ﷺ mengajarkan agar amal dilakukan dengan tepat, sungguh-sungguh, dan moderat; amal yang paling dicintai Allah adalah yang dilakukan secara rutin meskipun sedikit. Sahih al-Bukhari nomor 6465 memuat tambahan anjuran agar seseorang membebani dirinya dengan amal yang sesuai kemampuannya.',
      'Konsistensi tidak berarti tidak pernah terlewat. Ketika sebuah kebiasaan terputus, evaluasi penyebabnya lalu mulai kembali tanpa menjadikan satu kegagalan sebagai alasan menyerah.',
    ].join('\n\n'),
    referenceText: 'Rujukan: Sahih al-Bukhari 6464–6465.',
    referenceUrl: null,
    reflectionQuestions: [
      'Kebiasaan baik apa yang paling ingin kubangun?',
      'Apa yang selama ini membuatku sulit menjaganya?',
      'Bagaimana cara membuat kebiasaan itu lebih realistis?',
    ],
    smallActionPrompt:
      "Pilih satu kebiasaan kecil untuk diusahakan, misalnya membaca beberapa ayat Al-Qur'an setelah salat atau menjaga zikir pada waktu tertentu.",
    personalDuaExample:
      'Ya Allah, mudahkan aku melakukan amal kebaikan dan bimbinglah aku untuk menjaganya dengan ikhlas, seimbang, dan sesuai kemampuanku.',
    reminderNote:
      'Penyesalan sebaiknya mengantar pada taubat dan tindakan perbaikan, bukan membuat seseorang berhenti berharap.',
  },
  {
    nightNumber: 14,
    phaseId: 'phase-2',
    title: 'My New Beginning',
    theme: 'MEMULAI BABAK PERUBAHAN BARU',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Dua pekan pertama ini bukan tentang menjadi sempurna. Ini tentang belajar mengambil langkah untuk memperbaiki diri.',
      'Lihat kembali alasan kamu memulai journal ini. Mungkin ada kebiasaan yang mulai kamu perhatikan, ibadah yang ingin dijaga, atau kesalahan yang kini ingin kamu perbaiki.',
      'Hari ini, pilih perubahan yang akan kamu lanjutkan. Jangan membuat komitmen hanya karena terdengar baik; pilih sesuatu yang sanggup kamu usahakan.',
    ].join('\n\n'),
    islamicInsight:
      'QS. Al-Furqan ayat 70–71 menyebut taubat, iman, dan amal saleh, serta mengabarkan rahmat Allah bagi hamba yang bertaubat dan melakukan perbaikan. Ini mengingatkan bahwa perubahan perlu diteruskan dalam bentuk perbuatan baik.',
    referenceText: 'Rujukan: QS. Al-Furqan (25): 70–71.',
    referenceUrl: null,
    reflectionQuestions: [
      'Apa pelajaran terpenting dari tujuh malam terakhir?',
      'Kebiasaan apa yang mulai ingin kuubah?',
      'Tiga langkah apa yang ingin kuusahakan pada fase berikutnya?',
    ],
    smallActionPrompt:
      'Tuliskan tiga komitmen: menjaga salat wajib, memperbaiki satu perilaku, dan membangun satu kebiasaan ibadah yang realistis.',
    personalDuaExample:
      'Ya Allah, bimbinglah aku untuk terus memperbaiki diri, menjaga niat, dan melakukan amal saleh. Jangan biarkan aku berhenti berusaha.',
    reminderNote:
      'Penyesalan sebaiknya mengantar pada taubat dan tindakan perbaikan, bukan membuat seseorang berhenti berharap.',
    phaseEvaluation: {
      title: 'My Return Reflection',
      subtitle: 'Halaman evaluasi fase — gunakan untuk mencatat pelajaran dan langkah selanjutnya.',
      questions: [
        'Apa hal paling berharga yang kupelajari selama fase RETURN?',
        'Kesalahan atau kebiasaan apa yang mulai ingin kuperbaiki?',
        'Kebiasaan baik apa yang ingin terus kuusahakan?',
        'Tuliskan pesan untuk diriku ketika suatu hari merasa kesulitan memulai lagi.',
      ],
    },
  },

  // PHASE 03 — RECONNECT
  {
    nightNumber: 15,
    phaseId: 'phase-3',
    title: 'A Quiet Night',
    theme: 'MENYEDIAKAN WAKTU KHUSUS UNTUK BERIBADAH',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Di tengah dunia yang ramai, pernahkah kamu menyediakan waktu untuk berhenti sejenak dan mengingat Allah?',
      'Sepanjang hari, perhatian kita terbagi ke pekerjaan, keluarga, pesan, dan berbagai tanggung jawab. Ketika malam tiba, tubuh mungkin lelah dan pikiran masih sibuk.',
      'Kita tidak perlu memaksakan target berat. Mulailah dengan mempersiapkan diri sebelum tidur, memperbarui niat, dan menyediakan kesempatan untuk beribadah ketika terbangun.',
    ].join('\n\n'),
    islamicInsight: [
      "QS. Al-Muzzammil ayat 1–6 berbicara tentang perintah kepada Nabi Muhammad ﷺ untuk bangun malam dan membaca Al-Qur'an secara tartil. Ayat 6 menyebut bahwa bangun malam memiliki pengaruh yang lebih kuat dan bacaan yang lebih mantap. Dalam journal ini, ayat tersebut menjadi pengantar refleksi tentang ibadah malam; penerapan praktis bagi pembaca mengikuti tuntunan ibadah yang dijelaskan dalam sumber fikih.",
      "Bangun malam dapat diisi dengan salat, membaca Al-Qur'an, zikir, dan doa. Atur waktu dengan tetap memperhatikan kesehatan dan kewajiban harian.",
    ].join('\n\n'),
    referenceText: 'Rujukan: QS. Al-Muzzammil (73): 1–6.',
    referenceUrl: null,
    reflectionQuestions: [
      'Berapa banyak waktu yang biasanya kuhabiskan untuk aktivitas sebelum tidur?',
      'Apa yang sering membuatku sulit menyediakan waktu untuk ibadah malam?',
      'Persiapan sederhana apa yang dapat kulakukan malam ini?',
    ],
    smallActionPrompt:
      'Sebelum tidur, selesaikan urusan yang perlu diselesaikan, kurangi penggunaan ponsel, siapkan perlengkapan ibadah, atur alarm, dan niatkan untuk bangun jika dimudahkan.',
    personalDuaExample:
      'Ya Allah, berikan aku kesempatan dan kemudahan untuk mengingat-Mu dan beribadah kepada-Mu pada malam hari. Bimbing aku agar tetap menjaga keseimbangan dan tanggung jawab.',
    reminderNote:
      'Tahajud tidak menggantikan salat wajib. Jangan jadikan tracker sebagai ukuran iman atau alasan menyalahkan diri.',
  },
  {
    nightNumber: 16,
    phaseId: 'phase-3',
    title: 'Learning Tahajjud',
    theme: 'MENGENAL SALAT TAHAJUD',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Keinginan beribadah akan lebih terarah ketika disertai ilmu.',
      'Mungkin kamu ingin melaksanakan tahajud, tetapi masih memiliki pertanyaan tentang waktu, jumlah rakaat, dan tata caranya. Tidak perlu merasa malu untuk belajar dari dasar.',
      'Malam ini, kenali tahajud sebagai salat sunah malam. Pelajari tuntunan dasarnya dari sumber tepercaya dan jangan ragu bertanya kepada guru agama ketika ada rincian fikih yang belum dipahami.',
    ].join('\n\n'),
    islamicInsight: [
      'QS. Al-Isra ayat 79 menyebut ibadah tahajud pada sebagian malam sebagai ibadah tambahan bagi Nabi Muhammad ﷺ. Ayat ini berbicara langsung kepada Nabi; penjelasan mengenai tahajud sebagai salat sunah malam bagi umat dirujuk bersama sumber fikih. Dalam panduan ini, definisi tahajud mengikuti penjelasan Kementerian Agama RI dan NU Online: salat malam setelah tidur dan setelah pelaksanaan salat Isya, sebelum masuk waktu Subuh.',
      "Sahih Muslim 749a adalah hadis tentang salat malam secara umum: salat malam dilaksanakan dua rakaat demi dua rakaat dan, ketika khawatir waktu Subuh tiba, ditutup dengan satu rakaat witir. Hadis ini mendukung pola salat malam, bukan menjadi satu-satunya sumber untuk mendefinisikan tahajud. NU Online menjelaskan bahwa bacaan surah setelah Al-Fatihah dapat dipilih dari bagian Al-Qur'an yang dihafal; tidak ada surah tertentu yang wajib dibaca dalam tahajud.",
    ].join('\n\n'),
    referenceText:
      'Rujukan: QS. Al-Isra (17): 79; Sahih Muslim 749a; NU Online, “Tata Cara Shalat Tahajud: Niat, Rakaat, Bacaan Surat, dan Doanya”; Kementerian Agama RI, “Mendirikan Shalat Tahajud tapi Belum Tidur, Sahkah?”',
    referenceUrl: null,
    reflectionQuestions: [
      'Apa yang selama ini membuatku ingin melaksanakan tahajud?',
      'Bagian apa dari tata cara tahajud yang masih perlu kupelajari?',
      'Bagaimana aku bisa memulai secara bertahap tanpa mengabaikan salat wajib dan istirahat?',
    ],
    smallActionPrompt:
      'Pelajari kembali waktu dan tata cara dasar tahajud melalui guru atau sumber keislaman tepercaya. Siapkan perlengkapan ibadah dan tentukan waktu bangun yang realistis.',
    personalDuaExample:
      'Ya Allah, ajarkan aku untuk beribadah dengan benar. Mudahkan langkahku mengenal dan menjaga ibadah sunah, serta jadikan usahaku sebagai bentuk penghambaan kepada-Mu.',
    reminderNote:
      'Tahajud tidak menggantikan salat wajib. Jangan jadikan tracker sebagai ukuran iman atau alasan menyalahkan diri.',
  },
  {
    nightNumber: 17,
    phaseId: 'phase-3',
    title: 'Preparing My Night',
    theme: 'MEMPERSIAPKAN DIRI UNTUK IBADAH MALAM',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Keinginan bangun malam perlu didukung oleh persiapan yang baik.',
      'Kita mungkin pernah memasang alarm, tetapi ketika berbunyi memilih kembali tidur. Daripada terus menyalahkan diri, periksa kembali waktu tidur, aktivitas sebelum tidur, kondisi tubuh, dan pengaturan alarm.',
      'Persiapan bukan jaminan kita pasti terbangun, tetapi dapat membantu membuat rencana lebih masuk akal. Istirahat yang cukup dan menjaga kesehatan juga bagian dari tanggung jawab terhadap diri.',
    ].join('\n\n'),
    islamicInsight:
      "QS. Al-Muzzammil ayat 20 menyebut bahwa Allah mengetahui keadaan manusia—termasuk orang yang sakit, bepergian untuk mencari karunia Allah, dan berjuang di jalan Allah—serta memberikan keringanan dengan memerintahkan membaca bagian Al-Qur'an yang mudah. Dalam journal ini, ayat tersebut menjadi pengingat untuk menyusun rencana ibadah malam dengan mempertimbangkan kondisi dan tanggung jawab; kalimat ini adalah penerapan reflektif, bukan rincian hukum fikih dari ayat tersebut.",
    referenceText: 'Rujukan: QS. Al-Muzzammil (73): 20.',
    referenceUrl: null,
    reflectionQuestions: [
      'Apa penyebab utama aku sulit bangun malam?',
      'Apakah waktu tidur dan aktivitas sebelum tidur sudah mendukung rencanaku?',
      'Perubahan apa yang paling mungkin kulakukan mulai malam ini?',
    ],
    smallActionPrompt:
      'Gunakan daftar persiapan: selesaikan aktivitas, kurangi layar sebelum tidur, siapkan perlengkapan ibadah, atur alarm, cukupkan istirahat, dan niatkan untuk bangun. Jika tidak terbangun, lanjutkan rutinitas pada kesempatan berikutnya tanpa menyalahkan diri.',
    smallActionChecklist: [
      'Menyelesaikan aktivitas penting sebelum waktu tidur.',
      'Mengurangi penggunaan ponsel atau layar menjelang tidur.',
      'Menyiapkan tempat dan perlengkapan ibadah.',
      'Mengatur alarm sesuai waktu yang memungkinkan.',
      'Memastikan waktu istirahat tetap cukup.',
    ],
    personalDuaExample:
      'Ya Allah, berikan aku kesehatan dan kemampuan untuk mengatur waktuku. Mudahkan aku beribadah tanpa melalaikan hak tubuh, keluarga, pekerjaan, dan tanggung jawabku.',
    reminderNote:
      'Tahajud tidak menggantikan salat wajib. Jangan jadikan tracker sebagai ukuran iman atau alasan menyalahkan diri.',
  },
  {
    nightNumber: 18,
    phaseId: 'phase-3',
    title: 'My Personal Dua',
    theme: 'MENCATAT DOA DAN PERMOHONAN PRIBADI',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Ada banyak hal yang ingin kamu sampaikan kepada Allah: tentang keluarga, pekerjaan, masa depan, kesalahan, dan harapan yang masih kamu simpan.',
      'Menulis doa bukan karena Allah membutuhkan catatan darimu. Catatan ini membantumu mengenali apa yang sedang kamu harapkan, syukuri, dan mohonkan.',
      'Berdoalah dengan penuh harap, sambil menjaga adab dan berusaha menjalankan hal-hal yang menjadi tanggung jawabmu.',
    ].join('\n\n'),
    islamicInsight: [
      'QS. Al-Baqarah ayat 186 menjelaskan kedekatan Allah dan menyebut bahwa Dia mengabulkan doa orang yang berdoa kepada-Nya. Dalam Sahih al-Bukhari 1145 disebutkan keutamaan sepertiga malam terakhir untuk berdoa, meminta, dan memohon ampunan.',
      'Kita tidak menetapkan kapan atau bagaimana suatu permohonan akan terwujud. Tetaplah berdoa, berikhtiar, dan menyerahkan hasil kepada Allah.',
    ].join('\n\n'),
    referenceText: 'Rujukan: QS. Al-Baqarah (2): 186; Sahih al-Bukhari 1145.',
    referenceUrl: null,
    reflectionQuestions: [
      'Apa yang paling ingin kumohonkan kepada Allah saat ini?',
      'Hal apa yang ingin kusyukuri dan mohonkan ampunannya?',
      'Ikhtiar apa yang perlu kulakukan seiring dengan doa tersebut?',
    ],
    smallActionPrompt:
      'Buat daftar doa pribadi dalam empat kelompok: hubungan dengan Allah, keluarga dan orang tercinta, pekerjaan atau masa depan, serta ampunan dan perbaikan diri.',
    personalDuaExample:
      'Ya Allah, Engkau mengetahui apa yang tampak dan tersembunyi. Bimbing aku untuk berdoa dalam kebaikan, berikhtiar dengan benar, dan menerima ketetapan-Mu.',
    reminderNote:
      'Tahajud tidak menggantikan salat wajib. Jangan jadikan tracker sebagai ukuran iman atau alasan menyalahkan diri.',
  },
  {
    nightNumber: 19,
    phaseId: 'phase-3',
    title: 'Speaking from the Heart',
    theme: 'BELAJAR JUJUR DALAM BERDOA',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Kamu tidak perlu menyusun kalimat yang indah untuk mengakui bahwa kamu membutuhkan pertolongan Allah.',
      'Ada hal yang sulit diceritakan kepada orang lain: kekhawatiran, penyesalan, ketakutan, dan harapan yang belum terwujud. Dalam doa, kamu dapat mengungkapkan kebutuhan dan kelemahanmu dengan bahasa yang kamu pahami.',
      'Malam ini, luangkan waktu untuk berdoa dengan tenang. Jaga adab, mohonlah kebaikan, dan akui bahwa kita selalu membutuhkan petunjuk Allah.',
    ].join('\n\n'),
    islamicInsight:
      'QS. Ghafir ayat 60 memerintahkan manusia untuk berdoa kepada Allah dan mengingatkan bahwa doa merupakan bagian dari ibadah. Karena itu, doa bukan hanya daftar permintaan, tetapi juga bentuk penghambaan dan pengakuan akan kebutuhan kita kepada Allah.',
    referenceText: 'Rujukan: QS. Ghafir (40): 60.',
    referenceUrl: null,
    reflectionQuestions: [
      'Hal apa yang ingin kusampaikan kepada Allah dengan jujur?',
      'Kekhawatiran apa yang sedang paling membebani pikiranku?',
      'Bagaimana aku dapat mengiringi doa dengan langkah yang baik?',
    ],
    smallActionPrompt:
      'Setelah salat atau ibadah malam, luangkan waktu untuk berdoa menggunakan bahasa yang kamu pahami. Sampaikan permohonan dengan tenang dan jangan merasa harus memakai kalimat yang rumit.',
    personalDuaExample:
      'Ya Allah, aku memohon petunjuk dan pertolongan-Mu. Bimbing aku untuk mengakui kelemahan, meminta kebaikan, dan berusaha menjalani apa yang Engkau perintahkan.',
    reminderNote:
      'Tahajud tidak menggantikan salat wajib. Jangan jadikan tracker sebagai ukuran iman atau alasan menyalahkan diri.',
  },
  {
    nightNumber: 20,
    phaseId: 'phase-3',
    title: 'Learning to Trust',
    theme: 'MEMAHAMI TAWAKAL SETELAH IKHTIAR',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Tidak semua hal yang kamu doakan akan terjadi sesuai waktu dan cara yang kamu harapkan.',
      'Ada usaha yang belum menunjukkan hasil dan rencana yang berubah di luar perkiraan. Dalam keadaan seperti itu, kita dapat merasa cemas dan ingin memastikan semua hal berjalan sesuai keinginan.',
      'Tawakal mengajarkan kita untuk berusaha dengan cara yang benar, mengambil keputusan dengan bijak, lalu menyerahkan hasil kepada Allah. Tawakal bukan alasan untuk berhenti bertindak.',
    ].join('\n\n'),
    islamicInsight: [
      "Dalam QS. Ali 'Imran ayat 159, setelah membulatkan tekad, manusia diperintahkan untuk bertawakal kepada Allah. QS. At-Talaq ayat 3 juga menyebut kecukupan bagi orang yang bertawakal kepada-Nya.",
      'Ayat-ayat ini mengajarkan keseimbangan antara ikhtiar, keputusan, dan penyerahan diri kepada Allah.',
    ].join('\n\n'),
    referenceText: "Rujukan: QS. Ali 'Imran (3): 159; QS. At-Talaq (65): 3.",
    referenceUrl: null,
    reflectionQuestions: [
      'Hal apa yang paling sulit kuserahkan kepada Allah?',
      'Ikhtiar apa yang masih berada dalam kendaliku?',
      'Apa yang perlu kuubah dalam cara menghadapi hasil yang belum sesuai harapan?',
    ],
    smallActionPrompt:
      'Buat dua kolom: hal yang bisa kamu usahakan dan hal yang berada di luar kendalimu. Pilih satu tindakan nyata dari kolom pertama, lalu berdoa dan serahkan hasilnya kepada Allah.',
    personalDuaExample:
      'Ya Allah, bimbing aku untuk berusaha dengan sungguh-sungguh, mengambil keputusan yang baik, dan bertawakal atas hasil yang berada di luar kendaliku.',
    reminderNote:
      'Tahajud tidak menggantikan salat wajib. Jangan jadikan tracker sebagai ukuran iman atau alasan menyalahkan diri.',
  },
  {
    nightNumber: 21,
    phaseId: 'phase-3',
    title: 'My Night Reflection',
    theme: 'MEREFLEKSIKAN PERJALANAN IBADAH MALAM',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Tujuh malam terakhir mungkin tidak selalu berjalan sesuai rencana, tetapi setiap pengalaman dapat menjadi bahan belajar.',
      'Ada malam ketika kamu terbangun dan melaksanakan tahajud. Ada malam ketika kamu tertidur hingga pagi. Ada saat ketika doa terasa mudah diungkapkan, dan ada saat ketika kamu hanya mampu duduk sejenak dalam keheningan.',
      'Jangan gunakan perjalanan ini untuk menghakimi diri. Lihat apa yang telah dipelajari dan kebiasaan apa yang ingin kamu terus usahakan.',
    ].join('\n\n'),
    islamicInsight:
      'QS. Al-Baqarah ayat 153 mengajarkan untuk memohon pertolongan dengan sabar dan salat. Ayat ini mengingatkan bahwa ibadah dan kesabaran menjadi bagian dari cara seorang mukmin menghadapi kehidupan.',
    referenceText: 'Rujukan: QS. Al-Baqarah (2): 153.',
    referenceUrl: null,
    reflectionQuestions: [
      'Pengalaman apa yang paling berkesan selama mencoba membangun ibadah malam?',
      'Apa yang kupelajari tentang kondisi dan kebiasaanku?',
      'Kebiasaan apa yang ingin terus kuusahakan setelah fase ini?',
    ],
    smallActionPrompt:
      'Tuliskan satu pengalaman yang disyukuri, satu hal yang ingin diperbaiki, dan satu komitmen yang ingin dilanjutkan.',
    personalDuaExample:
      'Ya Allah, terima setiap usaha baik yang kulakukan, ampuni kekuranganku, dan bimbing aku untuk terus berusaha mendekat kepada-Mu.',
    reminderNote:
      'Tahajud tidak menggantikan salat wajib. Jangan jadikan tracker sebagai ukuran iman atau alasan menyalahkan diri.',
    phaseEvaluation: {
      title: 'My Night Reflection',
      subtitle: 'Halaman evaluasi fase — gunakan untuk mencatat pelajaran dan langkah selanjutnya.',
      questions: [
        'Apa pengalaman paling berkesan selama mencoba membangun ibadah malam?',
        'Apa yang kupelajari tentang kebiasaan tidur dan ibadahku?',
        'Kebiasaan apa yang ingin terus kuusahakan?',
        'Tuliskan doa dan ungkapan syukur setelah melalui fase ini.',
      ],
    },
  },

  // PHASE 04 — REMAIN
  {
    nightNumber: 22,
    phaseId: 'phase-4',
    title: 'A Grateful Heart',
    theme: 'MENGHIDUPKAN RASA SYUKUR',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Jangan sampai kesibukan mengejar sesuatu yang belum dimiliki membuatmu lupa mensyukuri apa yang telah Allah berikan.',
      'Kita boleh memiliki impian dan terus memperbaiki kehidupan. Namun, perhatian pada masa depan tidak seharusnya membuat kita menutup mata terhadap nikmat yang hadir hari ini.',
      'Latih diri untuk menyadari hal-hal sederhana: kesehatan, kesempatan belajar, makanan, keluarga, teman, dan kesempatan untuk memperbaiki diri.',
    ].join('\n\n'),
    islamicInsight:
      'QS. Ibrahim ayat 7 mengingatkan pentingnya bersyukur kepada Allah. Syukur bukan hanya ucapan, tetapi juga kesadaran atas nikmat dan usaha menggunakannya untuk kebaikan.',
    referenceText: 'Rujukan: QS. Ibrahim (14): 7.',
    referenceUrl: null,
    reflectionQuestions: [
      'Tiga nikmat apa yang paling kusyukuri hari ini?',
      'Nikmat apa yang sering kuanggap biasa?',
      'Bagaimana aku bisa menggunakan salah satu nikmat itu untuk kebaikan?',
    ],
    smallActionPrompt:
      'Tuliskan tiga hal yang kamu syukuri hari ini. Pilih satu nikmat dan tentukan cara menggunakannya untuk kebaikan.',
    personalDuaExample:
      'Ya Allah, terima kasih atas nikmat yang kusadari maupun yang belum kusadari. Jadikan aku hamba yang bersyukur dan menggunakan nikmat-Mu dalam kebaikan.',
    reminderNote:
      'Hari ke-30 bukan garis akhir. Perjalanan memperbaiki hubungan dengan Allah berlangsung sepanjang hidup.',
  },
  {
    nightNumber: 23,
    phaseId: 'phase-4',
    title: 'Finding Peace in Prayer',
    theme: 'MEMPERBAIKI HUBUNGAN DENGAN SALAT',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Jangan biarkan salat hanya menjadi rutinitas yang diselesaikan tanpa perhatian.',
      'Pikiran kadang masih tertuju pada pekerjaan, pesan, atau masalah yang belum selesai. Kita mungkin belum memahami bacaan salat atau belum mempersiapkan diri dengan baik.',
      'Malam ini, pilih satu bagian dari salat yang ingin kamu perbaiki. Belajar memahami bacaan, mempersiapkan diri, dan berusaha menghadirkan hati adalah langkah yang bisa diusahakan.',
    ].join('\n\n'),
    islamicInsight:
      "QS. Al-'Ankabut ayat 45 menjelaskan bahwa salat mencegah perbuatan keji dan mungkar serta mengingat Allah merupakan perkara besar. Salat juga perlu tercermin dalam perilaku dan keputusan sehari-hari.",
    referenceText: "Rujukan: QS. Al-'Ankabut (29): 45.",
    referenceUrl: null,
    reflectionQuestions: [
      'Apakah aku sudah memberi perhatian yang cukup ketika salat?',
      'Apa yang sering mengganggu konsentrasiku?',
      'Bacaan atau bagian salat apa yang ingin kupelajari kembali?',
    ],
    smallActionPrompt:
      'Untuk salat berikutnya, persiapkan diri lebih awal, jauhkan gangguan, dan pelajari makna satu bacaan salat. Lakukan bertahap.',
    personalDuaExample:
      'Ya Allah, bantulah aku menjaga salat dan memperbaiki kualitas ibadahku. Jadikan salat sebagai pengingat untuk hidup dalam ketaatan.',
    reminderNote:
      'Hari ke-30 bukan garis akhir. Perjalanan memperbaiki hubungan dengan Allah berlangsung sepanjang hidup.',
  },
  {
    nightNumber: 24,
    phaseId: 'phase-4',
    title: 'When Life Gets Difficult',
    theme: 'MENGHADAPI UJIAN DENGAN IMAN DAN IKHTIAR',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Tidak semua perjalanan hidup berjalan sesuai rencana.',
      'Ada masa ketika pekerjaan, keuangan, kesehatan, atau hubungan terasa berat. Kita boleh merasa sedih, kecewa, dan lelah. Mengakui perasaan bukan berarti kehilangan iman.',
      'Dalam menghadapi kesulitan, kita dapat berdoa, bersabar, mencari bantuan yang tepat, dan mengambil langkah nyata. Jangan hadapi semuanya sendirian jika dukungan diperlukan.',
    ].join('\n\n'),
    islamicInsight:
      'QS. Al-Baqarah ayat 155–157 menyebut bahwa manusia akan diuji dengan berbagai keadaan dan memberikan kabar gembira bagi orang-orang yang bersabar. Kesabaran tidak berarti menolak ikhtiar atau bantuan; ia berjalan bersama usaha dan keteguhan dalam kebaikan.',
    referenceText: 'Rujukan: QS. Al-Baqarah (2): 155–157.',
    referenceUrl: null,
    reflectionQuestions: [
      'Kesulitan apa yang paling memenuhi pikiranku saat ini?',
      'Dukungan atau bantuan apa yang mungkin kubutuhkan?',
      'Apa ikhtiar terbaik yang masih bisa kulakukan?',
    ],
    smallActionPrompt:
      'Tuliskan persoalan yang sedang dihadapi, orang atau layanan yang bisa dimintai dukungan, dan satu tindakan aman serta realistis yang bisa dilakukan.',
    personalDuaExample:
      'Ya Allah, kuatkan hatiku ketika menghadapi kesulitan. Berikan aku kesabaran, petunjuk, dan kemampuan mengambil langkah yang baik. Jangan biarkan aku berputus asa dari rahmat-Mu.',
    reminderNote:
      'Hari ke-30 bukan garis akhir. Perjalanan memperbaiki hubungan dengan Allah berlangsung sepanjang hidup.',
  },
  {
    nightNumber: 25,
    phaseId: 'phase-4',
    title: 'Letting Go',
    theme: 'MELEPASKAN HAL YANG BERADA DI LUAR KENDALI',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Ada hal yang bisa kita perjuangkan, dan ada hal yang hasil akhirnya tidak berada dalam kendali kita.',
      'Kita dapat mengatur usaha, memperbaiki keputusan, meminta nasihat, dan belajar dari pengalaman. Namun, kita tidak dapat mengendalikan semua hasil atau pilihan orang lain.',
      'Belajar melepaskan bukan berarti menyerah pada tanggung jawab. Artinya, kita melakukan bagian yang mampu dilakukan, lalu tidak terus-menerus memaksakan hasil yang tidak bisa dikendalikan.',
    ].join('\n\n'),
    islamicInsight:
      'QS. At-Talaq ayat 3 mengingatkan tentang tawakal kepada Allah. Tawakal tidak menghapus ikhtiar; ia menuntun kita untuk berusaha, lalu menyerahkan hasil kepada Allah.',
    referenceText: "Rujukan: QS. At-Talaq (65): 3; QS. Ali 'Imran (3): 159.",
    referenceUrl: null,
    reflectionQuestions: [
      'Hal apa yang terus kupikirkan meskipun berada di luar kendaliku?',
      'Ikhtiar apa yang sudah atau masih perlu kulakukan?',
      'Apa yang dapat kubiarkan tidak lagi menguasai pikiranku setelah melakukan bagianku?',
    ],
    smallActionPrompt:
      "Buat dua kolom: 'Dalam kendaliku' dan 'Di luar kendaliku'. Ambil satu langkah dari kolom pertama, lalu berdoa dan belajar menerima bahwa hasil akhir bukan sepenuhnya milik kita.",
    personalDuaExample:
      'Ya Allah, ajarkan aku membedakan apa yang harus kuusahakan dan apa yang harus kuserahkan kepada-Mu. Berikan ketenangan dan kekuatan untuk terus berikhtiar.',
    reminderNote:
      'Hari ke-30 bukan garis akhir. Perjalanan memperbaiki hubungan dengan Allah berlangsung sepanjang hidup.',
  },
  {
    nightNumber: 26,
    phaseId: 'phase-4',
    title: 'A Better Version of Me',
    theme: 'MEMPERBAIKI AKHLAK DAN PERILAKU',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Perjalanan mendekat kepada Allah juga perlu tampak dalam cara kita memperlakukan sesama manusia.',
      'Kita mungkin mulai memperhatikan ibadah, doa, dan zikir. Namun, jangan lupakan cara berbicara, menepati janji, bersikap adil, dan memperlakukan orang-orang di sekitar.',
      'Malam ini, evaluasi satu perilaku yang ingin kamu perbaiki. Perubahan akhlak sering dimulai dari tindakan sederhana yang dilakukan dengan sungguh-sungguh.',
    ].join('\n\n'),
    islamicInsight:
      'QS. An-Nahl ayat 90 memerintahkan keadilan dan kebajikan serta melarang perbuatan keji, kemungkaran, dan permusuhan. QS. Al-Qalam ayat 4 memuji akhlak Rasulullah ﷺ. Kedua rujukan ini mengingatkan pentingnya akhlak dalam kehidupan seorang Muslim.',
    referenceText: 'Rujukan: QS. An-Nahl (16): 90; QS. Al-Qalam (68): 4.',
    referenceUrl: null,
    reflectionQuestions: [
      'Bagaimana selama ini aku memperlakukan orang-orang terdekat?',
      'Adakah perkataan atau tindakan yang perlu kuperbaiki?',
      'Sifat apa yang paling ingin kukembangkan dalam diriku?',
    ],
    smallActionPrompt:
      'Pilih satu tindakan konkret: meminta maaf, menepati janji, menahan ucapan yang menyakitkan, membantu seseorang, atau memperbaiki hak orang lain.',
    personalDuaExample:
      'Ya Allah, perbaikilah akhlakku. Jauhkan aku dari perilaku buruk dan bimbing aku agar membawa kebaikan bagi orang-orang di sekitarku.',
    reminderNote:
      'Hari ke-30 bukan garis akhir. Perjalanan memperbaiki hubungan dengan Allah berlangsung sepanjang hidup.',
  },
  {
    nightNumber: 27,
    phaseId: 'phase-4',
    title: 'Consistency Over Perfection',
    theme: 'MENJAGA AMAL TANPA MENUNTUT KESEMPURNAAN',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Jangan sampai keinginan melakukan semuanya dengan sempurna membuatmu berhenti melakukan kebaikan yang mampu kamu jaga.',
      'Target yang terlalu banyak dapat membuat kita kelelahan. Pilih kebiasaan yang sesuai kemampuan dan keadaan. Ketika terlewat, evaluasi penyebabnya lalu mulai kembali.',
      'Konsistensi bukan berarti tidak pernah gagal. Ia berarti terus berusaha menjaga kebaikan dengan cara yang seimbang.',
    ].join('\n\n'),
    islamicInsight:
      'Sahih al-Bukhari nomor 6464 mengajarkan agar amal dilakukan dengan tepat, sungguh-sungguh, dan moderat; amal yang paling dicintai Allah adalah yang dilakukan secara rutin meskipun sedikit. Anjuran untuk membatasi beban amal sesuai kemampuan disebut secara eksplisit dalam Sahih al-Bukhari nomor 6465.',
    referenceText: 'Rujukan: Sahih al-Bukhari 6464–6465.',
    referenceUrl: null,
    reflectionQuestions: [
      'Apakah aku membuat target ibadah yang terlalu sulit dipertahankan?',
      'Kebiasaan baik apa yang paling realistis untuk kujaga?',
      'Bagaimana aku akan menyikapi diri ketika suatu kebiasaan terlewat?',
    ],
    smallActionPrompt:
      'Pilih tiga kebiasaan: menjaga ibadah wajib, satu amalan harian yang ringan, dan satu ibadah sunah yang ingin terus diusahakan sesuai kemampuan.',
    personalDuaExample:
      'Ya Allah, bantulah aku menjaga amal kebaikan dengan ikhlas, seimbang, dan sesuai kemampuanku. Bimbing aku untuk kembali berusaha ketika terlewat.',
    reminderNote:
      'Hari ke-30 bukan garis akhir. Perjalanan memperbaiki hubungan dengan Allah berlangsung sepanjang hidup.',
  },
  {
    nightNumber: 28,
    phaseId: 'phase-4',
    title: 'My Daily Connection',
    theme: 'MEMBANGUN RUTINITAS SPIRITUAL SEHARI-HARI',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Hubungan dengan Allah tidak hanya perlu diingat ketika kita menghadapi kesulitan.',
      "Pada hari-hari yang berjalan baik, kita juga dapat menjaga salat, bersyukur, membaca Al-Qur'an, dan mengingat Allah. Rutinitas spiritual tidak harus memenuhi setiap jam; ia perlu realistis dan sesuai dengan kehidupan.",
      'Malam ini, susun kebiasaan sederhana yang bisa membantumu menjaga hubungan dengan Allah di tengah tanggung jawab sehari-hari.',
    ].join('\n\n'),
    islamicInsight:
      'QS. Al-Baqarah ayat 152 mengajak manusia mengingat Allah dan bersyukur kepada-Nya. Mengingat Allah dapat hadir melalui zikir, doa, ibadah, serta ketaatan dalam aktivitas sehari-hari.',
    referenceText: 'Rujukan: QS. Al-Baqarah (2): 152.',
    referenceUrl: null,
    reflectionQuestions: [
      'Pada waktu apa aku paling mudah mengingat Allah?',
      'Kebiasaan apa yang ingin kumasukkan ke dalam rutinitas sehari-hari?',
      'Bagaimana aku dapat menjaga ibadah di tengah kesibukan?',
    ],
    smallActionPrompt:
      "Susun rutinitas yang sederhana: menjaga salat wajib tepat waktu sesuai kemampuan, zikir atau membaca Al-Qur'an pada waktu yang realistis, muhasabah singkat, dan tahajud bila dimudahkan.",
    personalDuaExample:
      'Ya Allah, jangan biarkan kesibukan membuatku melupakan-Mu. Bimbing aku menjaga salat, mengingat-Mu, dan menggunakan waktu dalam kebaikan.',
    reminderNote:
      'Hari ke-30 bukan garis akhir. Perjalanan memperbaiki hubungan dengan Allah berlangsung sepanjang hidup.',
  },
  {
    nightNumber: 29,
    phaseId: 'phase-4',
    title: 'Looking Back',
    theme: 'MELIHAT KEMBALI PERJALANAN 30 MALAM',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Sebelum melangkah lebih jauh, berhentilah sejenak untuk melihat perjalanan yang sudah kamu lalui.',
      'Ingat malam pertama ketika kamu membuka journal ini. Apa yang membuatmu ingin memulai? Apa yang kamu sadari tentang dirimu? Kebiasaan apa yang mulai ingin kamu perbaiki?',
      'Tidak semua target harus tercapai untuk membuat perjalanan ini berarti. Perhatikan kesadaran baru, niat baik, dan langkah kecil yang ingin kamu teruskan.',
    ].join('\n\n'),
    islamicInsight:
      'QS. Al-Hasyr ayat 18 mengingatkan orang beriman agar memperhatikan apa yang telah dipersiapkan untuk hari esok. Refleksi membantu kita mengevaluasi amal dan menyiapkan langkah yang lebih baik.',
    referenceText: 'Rujukan: QS. Al-Hasyr (59): 18.',
    referenceUrl: null,
    reflectionQuestions: [
      'Apa perubahan atau kesadaran paling berarti yang kudapatkan?',
      'Pelajaran apa yang ingin kubawa ke kehidupan sehari-hari?',
      'Hal apa yang masih perlu kuusahakan setelah journal ini selesai?',
    ],
    smallActionPrompt:
      'Buat dua daftar: kebiasaan baik yang ingin dipertahankan dan hal yang masih ingin diperbaiki. Pilih satu langkah nyata untuk minggu berikutnya.',
    personalDuaExample:
      'Ya Allah, terima kasih atas kesempatan untuk belajar dan memperbaiki diri. Ampuni kekuranganku dan bimbing aku menyiapkan langkah yang lebih baik.',
    reminderNote:
      'Hari ke-30 bukan garis akhir. Perjalanan memperbaiki hubungan dengan Allah berlangsung sepanjang hidup.',
  },
  {
    nightNumber: 30,
    phaseId: 'phase-4',
    title: 'Keep Coming Back',
    theme: 'MENJAGA KOMITMEN UNTUK TERUS MENDEKAT',
    manuscriptStatus: 'final',
    reviewStatus: 'terperiksa_sumber',
    openingReflection: [
      'Ini bukan akhir dari perjalananmu. Ini adalah pengingat untuk terus berusaha mendekat kepada Allah sepanjang kehidupan.',
      'Selama 30 malam, kamu telah diajak mengenali diri, memperbaiki langkah, belajar tentang ibadah malam, menyusun doa, dan memikirkan kebiasaan yang ingin dijaga. Mungkin tidak semua berjalan sesuai rencana. Itu tidak menghapus nilai dari usaha yang telah kamu lakukan.',
      'Setelah menutup journal ini, teruslah belajar dan berusaha. Ketika merasa jauh, jangan berhenti berharap. Evaluasi diri, bertaubat, dan ambil langkah yang baik.',
    ].join('\n\n'),
    islamicInsight: [
      'QS. Fussilat ayat 30 menyebut orang-orang yang mengatakan bahwa Tuhan mereka adalah Allah kemudian beristiqamah. Ayat ini mengingatkan pentingnya keteguhan iman dan ketaatan.',
      'Istiqamah bukan berarti manusia tidak pernah mengalami kesulitan atau kekurangan. Kita terus berusaha menjaga keimanan, memperbaiki amal, dan kembali ke jalan yang benar ketika melakukan kesalahan.',
    ].join('\n\n'),
    referenceText: 'Rujukan: QS. Fussilat (41): 30.',
    referenceUrl: null,
    reflectionQuestions: [
      'Apa arti kembali mendekat kepada Allah bagiku setelah perjalanan ini?',
      'Kebiasaan baik apa yang ingin terus kujaga?',
      'Bagaimana aku ingin menjalani hubungan dengan Allah dalam kehidupan sehari-hari?',
    ],
    smallActionPrompt:
      "Tuliskan tiga komitmen: menjaga ibadah wajib, menjaga hubungan dengan Allah melalui doa atau zikir dan Al-Qur'an, serta mengusahakan ibadah sunah sesuai kemampuan.",
    personalDuaExample:
      'Ya Allah, bimbinglah aku untuk terus memperbaiki diri, menjaga ibadah, dan kembali kepada-Mu ketika melakukan kesalahan. Jadikan aku hamba yang berusaha istiqamah dalam kebaikan.',
    reminderNote:
      'Hari ke-30 bukan garis akhir. Perjalanan memperbaiki hubungan dengan Allah berlangsung sepanjang hidup.',
    phaseEvaluation: {
      title: 'My Commitment to Keep Returning',
      subtitle: 'Halaman evaluasi fase — gunakan untuk mencatat pelajaran dan langkah selanjutnya.',
      questions: [
        'Apa perubahan atau kesadaran paling berarti dari 30 malam ini?',
        'Kebiasaan ibadah apa yang ingin terus kujaga?',
        'Bagaimana aku ingin memperbaiki hubungan dengan Allah dalam keseharian?',
        'Tuliskan surat untuk dirimu di masa depan ketika membutuhkan pengingat untuk kembali memperbaiki diri.',
      ],
    },
  },
];

export function getNightContent(nightNumber: number): NightContent | undefined {
  return NIGHTS.find((n) => n.nightNumber === nightNumber);
}

export function getPhaseForNight(nightNumber: number): PhaseDefinition | undefined {
  return PHASES.find(
    (p) => nightNumber >= p.nightRange[0] && nightNumber <= p.nightRange[1]
  );
}
