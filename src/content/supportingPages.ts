import type { DuaCategoryId } from '../types/journal';

export interface DuaCategoryInfo {
  id: DuaCategoryId;
  label: string;
  description: string;
}

export const SUPPORTING_PAGES_HUB_INTRO = {
  title: 'Halaman Pendukung',
  subtitle: 'Lembar ini dapat digunakan berulang kali sesuai kebutuhan.',
  helper: 'Halaman pendukung tidak harus diisi setiap malam. Pilih lembar yang paling membantu perjalananmu.',
};

export const SPIRITUAL_BASELINE_CONTENT = {
  title: 'My Spiritual Baseline',
  subtitle: 'Kenali titik awalmu. Tidak ada skor dan tidak ada penilaian benar atau salah.',
  intro:
    'Sebelum memulai 30 malam, gunakan halaman ini untuk mencatat kondisi dan kebiasaanmu saat ini. Jawaban ini hanya untuk dirimu sendiri.',
  sections: [
    {
      heading: 'HUBUNGAN DENGAN ALLAH',
      questions: [
        'Apa yang paling ingin kuperbaiki dalam ibadahku?',
        'Kapan aku biasanya menyediakan waktu untuk berdoa atau berzikir?',
      ],
    },
    {
      heading: 'KEBIASAAN IBADAH',
      questions: [
        'Bagaimana aku menjaga salat wajib saat ini?',
        'Adakah ibadah sunah yang ingin mulai kuusahakan?',
      ],
    },
    {
      heading: 'KONDISI DIRI',
      questions: [
        'Apa yang paling banyak memenuhi pikiranku?',
        'Dukungan apa yang kubutuhkan agar bisa menjalani perubahan dengan sehat?',
      ],
    },
    {
      heading: 'NIAT PERJALANAN',
      questions: [
        'Mengapa aku memilih memulai journal ini?',
        'Apa yang ingin kupelajari selama 30 malam?',
      ],
    },
  ],
  reminder:
    'Jawaban ini bukan ukuran kedekatanmu dengan Allah. Ini hanya catatan awal untuk membantu refleksi pribadi.',
};

export const PERSONAL_DUA_JOURNAL_INTRO = {
  title: 'My Personal Dua Journal',
  subtitle: 'Ruang untuk mencatat doa dan permohonan pribadi.',
};

export const DUA_CATEGORIES: DuaCategoryInfo[] = [
  {
    id: 'hubungan-dengan-allah',
    label: 'Hubunganku dengan Allah',
    description: 'Doa pribadi seputar kedekatan, keikhlasan, dan ketenangan bersama Allah.',
  },
  {
    id: 'keluarga-dan-orang-tercinta',
    label: 'Keluarga dan Orang-Orang Tercinta',
    description: 'Doa kebaikan, perlindungan, dan kasih sayang bagi keluarga serta orang-orang tercinta.',
  },
  {
    id: 'pekerjaan-rezeki-pendidikan',
    label: 'Pekerjaan, Rezeki, Pendidikan, dan Masa Depan',
    description: 'Doa untuk keberkahan ikhtiar dalam pekerjaan, rezeki, pendidikan, dan masa depan.',
  },
  {
    id: 'ampunan-dan-perbaikan-diri',
    label: 'Ampunan, Perbaikan Diri, dan Akhlak',
    description: 'Doa memohon ampunan, perbaikan diri, dan kebaikan akhlak.',
  },
  {
    id: 'kebaikan-untuk-orang-lain',
    label: 'Kebaikan untuk Orang Lain dan Umat',
    description: 'Doa kebaikan untuk sesama, orang lain, dan umat.',
  },
];

export const DUA_LOG_INTRO = {
  title: 'My Dua Log',
  subtitle:
    'Catat doa, ikhtiar, dan refleksi. Halaman ini bukan alat untuk menilai kapan doa akan dikabulkan.',
};

export const TAHAJUD_TRACKER_INTRO = {
  title: 'My Tahajud & Night Worship Tracker',
  subtitle: 'Gunakan untuk mencatat kebiasaan, bukan mengukur iman atau membandingkan diri.',
  helper:
    "Tandai sesuai pengalamanmu. 'Tidak terbangun' bukan kegagalan moral. Gunakan catatan untuk memahami pola tidur dan memperbaiki persiapan bila diperlukan.",
};

export const NIGHT_PREP_CHECKLIST_INTRO = {
  title: 'My Night Preparation Checklist',
  subtitle: 'Persiapan sederhana dapat membantu, tetapi tidak menjamin kita selalu terbangun.',
  noteHeading: 'CATATAN UNTUK DIRIKU',
};

export const NIGHT_PREP_CHECKLIST_ITEMS: Array<{ id: string; label: string; helper: string }> = [
  {
    id: 'prep-1',
    label: 'Menyelesaikan aktivitas penting sebelum waktu tidur.',
    helper: 'Menyelesaikan urusan harian secukupnya sebelum beristirahat.',
  },
  {
    id: 'prep-2',
    label: 'Mengurangi penggunaan ponsel atau layar menjelang tidur.',
    helper: 'Memberi jeda dari layar sebelum beristirahat.',
  },
  {
    id: 'prep-3',
    label: 'Menyiapkan tempat dan perlengkapan ibadah.',
    helper: 'Menempatkan perlengkapan ibadah agar mudah dijangkau.',
  },
  {
    id: 'prep-4',
    label: 'Mengatur alarm sesuai waktu yang memungkinkan.',
    helper: 'Memilih waktu yang realistis sesuai kondisi dan kebutuhan tubuh.',
  },
  {
    id: 'prep-5',
    label: 'Memastikan waktu istirahat tetap cukup.',
    helper: 'Menjaga kesehatan tetap menjadi tanggung jawab terhadap diri.',
  },
  {
    id: 'prep-6',
    label: 'Meluruskan niat dan berdoa sebelum tidur.',
    helper: 'Meniatkan kebaikan sebelum tidur dan bangun bila dimudahkan.',
  },
  {
    id: 'prep-7',
    label: 'Menyiapkan rencana cadangan jika tubuh membutuhkan istirahat.',
    helper: 'Jika tidak terbangun, lanjutkan rutinitas pada kesempatan berikutnya tanpa menyalahkan diri.',
  },
];

export const GRATITUDE_JOURNAL_INTRO = {
  title: 'Gratitude Journal',
  subtitle: 'Melatih diri menyadari nikmat dan meresponsnya dengan kebaikan.',
  promptHeading: 'Tiga hal yang kusyukuri hari ini:',
  goodDeedHeading: 'Satu cara menggunakan nikmat tersebut untuk kebaikan:',
};

export const WEEKLY_MUHASABAH_CONTENT = {
  title: 'My Weekly Muhasabah',
  subtitle: 'Evaluasi dengan jujur, tanpa menghakimi diri sendiri.',
  prompts: [
    {
      heading: 'IBADAH',
      question: 'Bagaimana aku menjaga salat wajib dan ibadah lain pekan ini?',
    },
    {
      heading: 'AKHLAK',
      question: 'Bagaimana aku berbicara dan memperlakukan orang lain?',
    },
    {
      heading: 'WAKTU',
      question: 'Kebiasaan apa yang menggunakan waktuku secara berlebihan?',
    },
    {
      heading: 'SYUKUR',
      question: 'Nikmat apa yang paling kusadari pekan ini?',
    },
    {
      heading: 'PERBAIKAN',
      question: 'Apa satu tindakan yang ingin kulakukan pada pekan berikutnya?',
    },
  ],
};

export const SUSTAINABLE_ROUTINE_CONTENT = {
  title: 'My Sustainable Spiritual Routine',
  subtitle: 'Susun kebiasaan yang realistis untuk dijaga setelah 30 malam.',
  columns: {
    moment: 'Waktu / momen',
    habit: 'Kebiasaan yang ingin kujaga',
    realisticWay: 'Cara membuatnya realistis',
  },
  commitmentHeading: 'KOMITMEN PRIBADIKU',
};

export const FINAL_REFLECTION_CONTENT = {
  title: 'My Final Reflection',
  subtitle: 'Apa yang ingin kubawa setelah menutup journal ini?',
  prompts: {
    learnedLessons: 'Hal paling berarti yang kupelajari selama 30 malam:',
    habitsToMaintain: 'Kebiasaan baik yang ingin terus kujaga:',
    areasStillGrowing: 'Hal yang masih ingin kuperbaiki:',
    trustedSupport: 'Orang atau sumber tepercaya yang dapat membantuku belajar:',
    nextSevenDaysStep: 'Satu langkah yang akan kulakukan dalam tujuh hari ke depan:',
  },
};

export const LETTER_TO_FUTURE_SELF_CONTENT = {
  title: 'A Letter to My Future Self',
  subtitle: 'Tulis pesan untuk dirimu ketika suatu hari membutuhkan pengingat untuk memulai kembali.',
  salutation: 'Untuk diriku di masa depan,',
  closingLines: ['Dengan harapan dan doa,', 'Diriku yang sedang belajar memperbaiki diri.'],
};

export const TAHAJUD_ACTIVITY_OPTIONS: Array<{ id: string; label: string }> = [
  { id: 'tahajud', label: 'Salat malam / Tahajud' },
  { id: 'quran', label: "Membaca Al-Qur'an" },
  { id: 'zikir', label: 'Zikir' },
  { id: 'doa', label: 'Doa pribadi' },
  { id: 'istigfar', label: 'Istigfar' },
  { id: 'lainnya', label: 'Ibadah malam lainnya' },
];

export const ROUTINE_MOMENT_OPTIONS: string[] = [
  'Setelah Subuh',
  'Siang',
  'Sore',
  'Sebelum Tidur',
  'Malam',
  'Fleksibel',
];

export const ROUTINE_FREQUENCY_OPTIONS: string[] = [
  'Setiap hari bila memungkinkan',
  '3–4 kali seminggu',
  'Akhir pekan / hari tenang',
  'Saat membutuhkan jeda',
];

export const TAHAJUD_INTRO_GUIDE = {
  badge: 'Panduan pengantar untuk menemani pembaca belajar. Bukan pengganti pembelajaran fikih.',
  reviewStatus:
    'Materi diperiksa berdasarkan sumber rujukan; bukan fatwa atau pengesahan lembaga/ulama',
  title: 'Panduan Ringkas: Mengenal Tahajud',
  apaItuTahajud:
    'Tahajud adalah salat sunah malam yang dalam pengertian fikih yang umum diajarkan di Indonesia dilakukan setelah tidur dan setelah salat Isya, hingga sebelum masuk waktu Subuh. QS. Al-Isra ayat 79 menyebut ibadah tahajud pada sebagian malam.',
  waktuPelaksanaan:
    'Waktunya berada pada malam hari setelah salat Isya dan setelah tidur, sampai sebelum waktu Subuh. Sepertiga malam terakhir dikenal memiliki keutamaan untuk berdoa dan memohon ampunan. Untuk menghitung waktu malam dan rincian praktik di daerahmu, ikuti jadwal salat tepercaya serta bimbingan guru agama.',
  tataCaraDasar: [
    'Pastikan salat Isya telah dilaksanakan dan kamu telah tidur terlebih dahulu.',
    'Bangun, bersihkan diri, dan berwudu.',
    'Berniat di dalam hati untuk melaksanakan salat tahajud.',
    "Laksanakan dua rakaat seperti salat sunah pada umumnya: membaca Al-Fatihah dan ayat atau surah Al-Qur'an yang dihafal, lalu menyempurnakan rukuk, iktidal, sujud, duduk di antara dua sujud, dan rakaat kedua hingga salam.",
    'Salat malam dapat dilakukan dua rakaat demi dua rakaat. Jumlah rakaat disesuaikan dengan kemampuan dan tuntunan yang dipelajari.',
    "Setelah salat, kamu dapat berzikir, membaca Al-Qur'an, beristigfar, dan berdoa. Pengaturan salat witir mengikuti tuntunan yang kamu pelajari.",
  ],
  halYangPerluDiingat: [
    'Salat wajib lima waktu tetap menjadi prioritas dan tidak digantikan oleh tahajud.',
    'Tidak ada surah tertentu yang wajib dibaca dalam salat tahajud.',
    'Jangan memaksakan diri hingga mengabaikan kesehatan, pekerjaan, keluarga, atau kewajiban lain.',
    'Jika tidak terbangun, jangan jadikan itu alasan untuk putus asa. Perbaiki persiapan dan coba kembali pada kesempatan lain.',
    'Perbedaan rincian fikih dapat ditanyakan kepada ustaz/ustazah atau lembaga keagamaan yang kamu percaya.',
  ],
  rujukanDasar:
    'QS. Al-Isra (17): 79; Sahih Muslim 749a; panduan NU Online tentang tata cara salat tahajud; layanan tanya jawab fikih Kementerian Agama RI.',
};

export const GENTLE_GOODBYE_CONTENT = {
  title: 'A GENTLE GOODBYE',
  subtitle: 'Untuk Kamu yang Telah Sampai di Halaman Terakhir',
  manuscriptStatus: 'final' as const,
  paragraphs: [
    'Terima kasih telah menyediakan waktu untuk dirimu sendiri.',
    'Terima kasih telah berani melihat kembali hal-hal yang ingin kamu perbaiki. Terima kasih telah memberi ruang untuk belajar, berdoa, dan memulai kembali.',
    'Mungkin selama 30 malam ini tidak semuanya berjalan sesuai rencana. Ada malam ketika kamu berhasil bangun untuk tahajud, dan ada malam ketika tubuhmu membutuhkan istirahat. Ada hari ketika kamu merasa bersemangat, dan ada hari ketika langkah terasa berat.',
    'Jangan jadikan journal ini sebagai ukuran seberapa dekat dirimu dengan Allah. Jadikan ia pengingat untuk terus belajar dan berusaha memperbaiki diri.',
    'Ketika suatu hari kamu merasa jauh, bukalah kembali halaman-halaman ini. Ingat niat yang pernah kamu tuliskan. Evaluasi dirimu, mohon ampunan kepada Allah, lalu ambil langkah baik yang mampu kamu lakukan.',
    'Journal ini memiliki halaman terakhir. Namun, perjalanan untuk terus berusaha mendekat kepada Allah tidak berhenti di sini.',
  ],
  closingCallout: 'KEEP COMING BACK.',
  signOff: ['Dengan hangat,', 'RUANG PULANG'],
};
