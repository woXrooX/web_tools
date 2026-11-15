/*
	Uzbek, in the Latin script. Keys and placeholders follow EN.js.

	oʻ and gʻ are written with ʻ (U+02BB), and the tutuq belgisi with ʼ (U+02BC), as the alphabet has them. Search ignores both, so o'zbek typed with an apostrophe still finds them.
	Uzbek does not change a noun after a number (5 sahifa), so no text here needs plural forms.
*/
Language.add("uz", {
	name: "Oʻzbekcha",

	// Chrome has no Uzbek data and would write 12.5 and "2026 M11 15". With these, every browser writes 12,5 and 15-noyabr, 2026.
	format: {
		decimal: ',',
		group: '\u00a0',
		months: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
		date: "{day}-{month}, {year}"
	},

	shared: {
		language_picker: "Til"
	},

	/*
		Juz is "pora", as Uzbek readers call it.
		surahs: one row per surah, in mushaf order: [name, meaning, other spellings people search for]. The third field is optional.
		Names follow the Uzbek list of islom.uz and quranenc.com (translation of Muhammad Sodiq Muhammad Yusuf), written in Latin.
	*/
	hifz_tracker: {
		// Page
		title: "Hifz kuzatuvchisi",
		intro: "Qurʼonning qancha qismini yodlaganingizni koʻring va uni pora, sahifa, sura yoki oyat boʻyicha belgilang. Natijalar faqat shu brauzerda saqlanadi, hech qayerga yuborilmaydi.",
		storage_banner: "Bu brauzer natijalaringizni saqlamayapti: sahifani yopsangiz, ular yoʻqoladi. Saqlab qolish uchun zaxira nusxasini oling.",
		footnote: "Sahifalar 604 sahifali Madina mushafiga koʻra. Pora — shu mushafdagi sahifalar bloki: 1-pora — {first}, 30-pora — {last}, qolgan har bir pora esa 20 sahifa.",

		// Summary
		summary_label: "Natijalar",
		caption: "Qurʼonning yodlangan qismi",
		caption_complete: "Qurʼon toʻliq yodlangan. Mashaalloh!",
		stat_pages: "Sahifalar",
		stat_juz: "Toʻliq poralar",
		stat_surahs: "Toʻliq suralar",
		stat_week: "Shu hafta",
		stat_of: "/ {total}",
		stat_week_unit: "sahifa",
		stat_week_note: "ertadan sanaladi",
		ribbon_label: "Mushaf boʻylab yodlangan sahifalar, 1–30-poralar. Poraga oʻtish uchun ustiga bosing.",
		ribbon_tip: "{juz}-pora: {memorized} / {count} sahifa",
		legend_memorized: "Yodlangan",
		legend_learning: "Yodlanmoqda",
		legend_learning_pages: "Yodlanmoqda ({count} sahifa)",
		legend_empty: "Hali yodlanmagan",
		empty_hint: "Hali hech narsa belgilanmagan. Quyida yodlagan sahifalaringizni bittadan yoki ustidan surib, bir nechtasini birdaniga belgilang. «Suralar» boʻlimida butun suralarni yoki alohida oyatlarni belgilash mumkin.",

		// Toolbar
		view_label: "Koʻrinish",
		view_pages: "Sahifalar",
		view_surahs: "Suralar",
		brush_label: "Belgilash",
		brush_memorized: "Yodlangan",
		brush_learning: "Yodlanmoqda",
		brush_clear: "Tozalash",
		search_surahs: "Sura qidirish",
		sort_title: "Tartibni teskari qilish",
		sort_descending: "Suralarni oxiridan boshlab koʻrsatish",
		sort_ascending: "Suralarni boshidan boshlab koʻrsatish",
		undo: "Bekor qilish",
		undo_title: "Bekor qilish (Ctrl + Z)",
		filter_label: "Suralar filtri",
		filter_all: "Hammasi",
		filter_progress: "Jarayonda",
		filter_memorized: "Yodlangan",
		filter_not_started: "Boshlanmagan",
		hint_click: "Sahifani belgilash uchun ustiga bosing, bir nechtasini belgilash uchun ustidan torting. Tafsilotlar uchun sahifani oʻng tugma bilan bosing.",
		hint_tap: "Sahifani belgilash uchun unga teging, bir nechtasini belgilash uchun ustidan yon tomonga suring. Tafsilotlar uchun sahifani bosib turing.",

		// Labels
		label_page: "{page}-sahifa",
		label_pages: "{from}–{to}-sahifalar",
		label_page_inline: "{page}-sahifa",
		label_pages_inline: "{from}–{to}-sahifalar",
		label_juz: "{juz}-pora",
		label_ayah: "{surah} {ayah}",
		label_ayahs: "{surah} {from}–{to}",
		label_ayahs_across: "{first} {from} – {last} {to}",
		ayah_count: "{count} oyat",

		// Marking
		marked_memorized: "{label} yodlangan deb belgilandi",
		marked_learning: "{label} yodlanmoqda deb belgilandi",
		marked_cleared: "{label} tozalandi",
		marking_memorized: "{label} yodlangan deb belgilanmoqda",
		marking_learning: "{label} yodlanmoqda deb belgilanmoqda",
		marking_cleared: "{label} tozalanmoqda",

		// Pages
		pages_view_label: "Poralar boʻyicha sahifalar",
		page_memorized: "{page}-sahifa, yodlangan",
		page_learning: "{page}-sahifa, yodlanmoqda",
		page_none: "{page}-sahifa, yodlanmagan",
		page_part_memorized: "{page}-sahifa, qisman yodlangan",
		page_part_learning: "{page}-sahifa, qisman yodlanmoqda",
		page_info_ayahs: "{memorized} / {count} oyat yodlangan",
		juz_range: "{pages}, {ayahs}",
		juz_memorized: "{memorized} / {count} sahifa yodlangan",
		juz_clear: "Porani tozalash",
		juz_mark_learning: "Porani yodlanmoqda deb belgilash",
		juz_mark_memorized: "Porani yodlangan deb belgilash",

		// Surahs
		surah_mark: "{surah} surasini yodlangan deb belgilash",
		surah_clear: "{surah} surasini tozalash",
		surah_meta: "{meaning}, {status}",
		status_all: "barcha {count} oyat yodlangan",
		status_memorized: "{memorized} / {total} oyat yodlangan",
		status_learning: "{learning} / {total} oyat yodlanmoqda",
		status_both: "{memorized} / {total} oyat yodlangan, {learning} oyat yodlanmoqda",
		empty_search: "Qidiruvingizga mos sura topilmadi.",
		empty_progress: "Jarayondagi sura yoʻq. Qisman yodlangan yoki yodlanayotgan suralar shu yerda koʻrinadi.",
		empty_memorized: "Hali birorta sura toʻliq yodlanmagan.",
		empty_not_started: "Barcha suralar boshlangan.",

		// Surah sheet
		close: "Yopish",
		sheet_meta: "{number}-sura, {ayahs}, {origin}. {pages}, {juz}.",
		meccan: "Makkiy",
		medinan: "Madaniy",
		sheet_juz: "{juz}-pora",
		sheet_juz_range: "{from}–{to}-poralar",
		page_mark: "sahifa",
		ayah_memorized: "{ayah}-oyat, yodlangan",
		ayah_learning: "{ayah}-oyat, yodlanmoqda",
		ayah_none: "{ayah}-oyat, yodlanmagan",
		progress_all: "Barcha {count} oyat yodlangan",
		progress_none: "Boshlanmagan",
		progress_memorized: "{memorized} / {total} oyat yodlangan",
		progress_both: "{memorized} / {total} oyat yodlangan, {learning} oyat yodlanmoqda",
		fill_clear: "Barcha oyatlarni tozalash",
		fill_learning: "Hammasini yodlanmoqda deb belgilash",
		fill_memorized: "Hammasini yodlangan deb belgilash",
		sheet_hint_click: "Oyatni belgilash uchun ustiga bosing, bir nechtasini belgilash uchun ustidan torting.",
		sheet_hint_tap: "Oyatni belgilash uchun unga teging, bir nechtasini belgilash uchun ustidan yon tomonga suring.",

		// Your data
		data_label: "Maʼlumotlaringiz",
		backup_heading: "Zaxira nusxa",
		backup_text: "Natijalar faqat shu brauzerda saqlanadi. Vaqti-vaqti bilan zaxira nusxasini saqlab qoʻying. Natijalarni tiklash yoki boshqa brauzer yoxud qurilmaga koʻchirish uchun undan foydalaning.",
		backup_export: "Nusxani saqlash",
		backup_import: "Nusxadan tiklash",
		backup_last: "Oxirgi nusxa: {date}",
		backup_none: "Hali nusxa olinmagan",
		backup_exported: "Nusxa saqlandi",
		backup_imported: "Nusxadan tiklandi",
		backup_invalid: "Bu fayl Hifz kuzatuvchisi nusxasi emas",
		week_heading: "Shu hafta",
		week_text: "Yodlangan deb belgilagan sahifalaringizni sanaydi. Birinchi kundagi oʻzgarishlar hisobga olinmaydi, shuning uchun avval yodlaganlaringizni belgilash natijani oshirib koʻrsatmaydi. Eski yodlaganlaringizni keyinroq belgiladingizmi? Hisobni bugundan boshlang.",
		week_count_today: "Bugundan sanash",
		week_counting_since: "Hisob boshlangan sana: {date}",
		week_counts_today: "Hafta hisobi bugundan boshlandi",
		clear_heading: "Natijalarni tozalash",
		clear_text: "Barcha belgilarni oʻchiradi. Darhol bekor qilish mumkin.",
		clear_all: "Barcha natijalarni tozalash",
		clear_confirm: "Tozalash uchun yana bosing",
		clear_done: "Barcha natijalar tozalandi",

		// Popover and toast
		details: "Tafsilotlar",
		undone: "Bekor qilindi",

		surahs: [
			["Fotiha", "Ochuvchi"], // 1
			["Baqara", "Sigir"], // 2
			["Oli Imron", "Imron oilasi"], // 3
			["Niso", "Ayollar"], // 4
			["Moida", "Dasturxon"], // 5
			["Anʼom", "Chorvalar"], // 6
			["Aʼrof", "Jannat va doʻzax oraligʻi"], // 7
			["Anfol", "Oʻljalar"], // 8
			["Tavba", "Tavba"], // 9
			["Yunus", "Yunus paygʻambar"], // 10
			["Hud", "Hud paygʻambar"], // 11
			["Yusuf", "Yusuf paygʻambar"], // 12
			["Raʼd", "Momaqaldiroq"], // 13
			["Ibrohim", "Ibrohim paygʻambar"], // 14
			["Hijr", "Hijr vodiysi"], // 15
			["Nahl", "Asalari"], // 16
			["Isro", "Tungi sayr"], // 17
			["Kahf", "Gʻor"], // 18
			["Maryam", "Maryam onamiz"], // 19
			["Toha", "To va Ho harflari", "toho"], // 20
			["Anbiyo", "Paygʻambarlar"], // 21
			["Haj", "Haj"], // 22
			["Moʻminun", "Moʻminlar"], // 23
			["Nur", "Nur"], // 24
			["Furqon", "Haqni botildan ajratuvchi"], // 25
			["Shuʼaro", "Shoirlar"], // 26
			["Naml", "Chumolilar"], // 27
			["Qasas", "Qissalar", "qasos"], // 28
			["Ankabut", "Oʻrgimchak"], // 29
			["Rum", "Rumliklar"], // 30
			["Luqmon", "Luqmoni Hakim"], // 31
			["Sajda", "Sajda"], // 32
			["Ahzob", "Firqalar"], // 33
			["Sabaʼ", "Sabaʼ qavmi"], // 34
			["Fotir", "Yaratuvchi"], // 35
			["Yosin", "Yo va Sin harflari"], // 36
			["Soffot", "Saf tortuvchilar", "saffot"], // 37
			["Sod", "Sod harfi"], // 38
			["Zumar", "Guruhlar"], // 39
			["Gʻofir", "Magʻfirat qiluvchi"], // 40
			["Fussilat", "Batafsil bayon qilingan"], // 41
			["Shoʻro", "Maslahat"], // 42
			["Zuxruf", "Zeb-ziynat"], // 43
			["Duxon", "Tutun"], // 44
			["Josiya", "Tiz choʻkuvchilar"], // 45
			["Ahqof", "Qumtepalar"], // 46
			["Muhammad", "Paygʻambarimiz (s.a.v.)"], // 47
			["Fath", "Gʻalaba"], // 48
			["Hujurot", "Hujralar"], // 49
			["Qof", "Qof harfi"], // 50
			["Zoriyot", "Sochuvchi shamollar"], // 51
			["Tur", "Tur togʻi"], // 52
			["Najm", "Yulduz"], // 53
			["Qamar", "Oy"], // 54
			["Ar-Rahmon", "Mehribon"], // 55
			["Voqeʼa", "Voqea", "voqia"], // 56
			["Hadid", "Temir"], // 57
			["Mujodala", "Bahslashuvchi ayol"], // 58
			["Hashr", "Surgun"], // 59
			["Mumtahana", "Imtihon qilinuvchi ayol", "mumtahina"], // 60
			["Soff", "Saf", "saff"], // 61
			["Jumʼa", "Juma kuni"], // 62
			["Munofiqun", "Munofiqlar"], // 63
			["Tagʻobun", "Bir-birini aldash"], // 64
			["Taloq", "Taloq"], // 65
			["Tahrim", "Harom qilish"], // 66
			["Mulk", "Hukmronlik"], // 67
			["Qalam", "Qalam"], // 68
			["Hoqqa", "Muqarrar haqiqat", "haqqa"], // 69
			["Maʼorij", "Koʻtarilish yoʻllari"], // 70
			["Nuh", "Nuh paygʻambar"], // 71
			["Jin", "Jinlar"], // 72
			["Muzzammil", "Oʻranib olgan"], // 73
			["Muddassir", "Burkanib olgan"], // 74
			["Qiyomat", "Qayta tirilish"], // 75
			["Inson", "Inson"], // 76
			["Mursalot", "Yuborilganlar"], // 77
			["Nabaʼ", "Ulugʻ xabar"], // 78
			["Noziʼot", "Sugʻurib oluvchilar"], // 79
			["Abasa", "Qovogʻini soldi"], // 80
			["Takvir", "Oʻralish"], // 81
			["Infitor", "Yorilish"], // 82
			["Mutaffifin", "Oʻlchovdan urib qoluvchilar"], // 83
			["Inshiqoq", "Boʻlinish"], // 84
			["Buruj", "Burjlar"], // 85
			["Toriq", "Tungi yoʻlchi"], // 86
			["Aʼlo", "Eng oliy"], // 87
			["Gʻoshiya", "Oʻrab oluvchi"], // 88
			["Fajr", "Tong"], // 89
			["Balad", "Shahar"], // 90
			["Shams", "Quyosh"], // 91
			["Layl", "Tun"], // 92
			["Zuho", "Choshgoh", "duho"], // 93
			["Inshiroh", "Koʻksni kengaytirish"], // 94
			["Tin", "Anjir", "tiyn"], // 95
			["Alaq", "Laxta qon"], // 96
			["Qadr", "Qadr kechasi"], // 97
			["Bayyina", "Aniq hujjat"], // 98
			["Zalzala", "Zilzila"], // 99
			["Odiyot", "Chopqir otlar"], // 100
			["Qoriʼa", "Qoqib uruvchi"], // 101
			["Takosur", "Koʻpaytirish", "takasur"], // 102
			["Asr", "Zamon"], // 103
			["Humaza", "Gʻiybatchi"], // 104
			["Fil", "Fil"], // 105
			["Quraysh", "Quraysh qabilasi"], // 106
			["Moun", "Mayda-chuyda narsalar"], // 107
			["Kavsar", "Koʻp yaxshilik"], // 108
			["Kofirun", "Kofirlar"], // 109
			["Nasr", "Yordam"], // 110
			["Masad", "Pishiq arqon"], // 111
			["Ixlos", "Ixlos"], // 112
			["Falaq", "Tong yorugʻi"], // 113
			["Nos", "Odamlar"] // 114
		]
	}
});
