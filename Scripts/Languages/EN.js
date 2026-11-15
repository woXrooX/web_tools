/*
	English, for every translated tool. It has every key, and the other languages fall back to it for any key they leave out, so it is always loaded.

	Language.add(code, data): the code stays in lowercase, because it goes into <html lang> and Intl; only the file name is in capitals.
	name is the language's name in itself, shown in the picker. shared holds texts any tool may use. Every other section belongs to one tool and is named after its folder.

	Keep the keys and translate the values.
	A word in braces, like {count}, is filled in by the tool: a number, a surah name, a date. Keep it, and move it to wherever the sentence puts it.
	A value that changes with a number lists its forms by plural category: one, few, many, other (the names Intl.PluralRules uses). The {count} value picks one. English needs one and other; Russian needs all four; Uzbek needs a single text.

	To add a language: copy this file to <CODE>.js, change the code and the name, translate every value, then add its script tag to every translated tool, after EN.js.
	If Chrome writes its dates like "2026 M11 15", it has no data for the language: give it a format like the one in UZ.js.
	To translate another tool: add a section named after its folder, here and in every other language file.
*/
Language.add("en", {
	name: "English",

	shared: {
		// The language picker in the site bar
		language_picker: "Language"
	},

	// Surah names and meanings in English live in Quran.surahs in hifz_tracker/index.html, so this section has no surahs list.
	hifz_tracker: {
		// Page
		title: "Hifz tracker",
		intro: "See how much of the Qur'an you have memorized, and mark it by juz, page, surah or ayah. Progress stays in this browser. Nothing is uploaded.",
		storage_banner: "This browser is not saving your progress, so it will be lost when you close the page. Export a backup to keep it.",
		footnote: "Pages follow the 604-page Madani mushaf. A juz is its block of pages there: juz 1 is {first}, juz 30 is {last}, and every other juz is 20 pages.",

		// Summary
		summary_label: "Progress",
		caption: "of the Qur'an memorized",
		caption_complete: "of the Qur'an memorized. Masha'Allah.",
		stat_pages: "Pages",
		stat_juz: "Juz complete",
		stat_surahs: "Surahs complete",
		stat_week: "This week",
		stat_of: "of {total}",
		stat_week_unit: { one: "page", other: "pages" },
		stat_week_note: "counts from tomorrow",
		ribbon_label: "Memorized pages across the mushaf, juz 1 to 30. Tap a juz to jump to it.",
		ribbon_tip: "Juz {juz}: {memorized} of {count} pages",
		legend_memorized: "Memorized",
		legend_learning: "Learning",
		legend_learning_pages: { one: "Learning ({count} page)", other: "Learning ({count} pages)" },
		legend_empty: "Not yet",
		empty_hint: "Nothing marked yet. Mark the pages you have memorized below, one at a time or several at once by swiping or dragging across them. Under Surahs you can mark whole surahs or single ayahs.",

		// Toolbar
		view_label: "View",
		view_pages: "Pages",
		view_surahs: "Surahs",
		brush_label: "Mark as",
		brush_memorized: "Memorized",
		brush_learning: "Learning",
		brush_clear: "Clear",
		search_surahs: "Search surahs",
		sort_title: "Reverse the order",
		sort_descending: "Show surahs from 114 to 1",
		sort_ascending: "Show surahs from 1 to 114",
		undo: "Undo",
		undo_title: "Undo (Ctrl + Z)",
		filter_label: "Filter surahs",
		filter_all: "All",
		filter_progress: "In progress",
		filter_memorized: "Memorized",
		filter_not_started: "Not started",
		hint_click: "Click a page to mark it, or drag across pages to mark several. Right-click a page for details.",
		hint_tap: "Tap a page to mark it, or swipe sideways across pages to mark several. Press and hold a page for details.",

		// Labels. The inline forms go in the middle of a sentence.
		label_page: "Page {page}",
		label_pages: "Pages {from}–{to}",
		label_page_inline: "page {page}",
		label_pages_inline: "pages {from}–{to}",
		label_juz: "Juz {juz}",
		label_ayah: "{surah} {ayah}",
		label_ayahs: "{surah} {from}–{to}",
		label_ayahs_across: "{first} {from} to {last} {to}",
		ayah_count: { one: "{count} ayah", other: "{count} ayahs" },

		// Marking. {label} is one of the labels above; while marking, page labels are the inline form.
		marked_memorized: "{label} marked memorized",
		marked_learning: "{label} marked learning",
		marked_cleared: "{label} cleared",
		marking_memorized: "Marking {label} as memorized",
		marking_learning: "Marking {label} as learning",
		marking_cleared: "Clearing {label}",

		// Pages
		pages_view_label: "Pages by juz",
		page_memorized: "Page {page}, memorized",
		page_learning: "Page {page}, learning",
		page_none: "Page {page}, not memorized",
		page_part_memorized: "Page {page}, partly memorized",
		page_part_learning: "Page {page}, partly learning",
		page_info_ayahs: { one: "{memorized} of {count} ayah memorized", other: "{memorized} of {count} ayahs memorized" },
		juz_range: "{pages}, {ayahs}",
		juz_memorized: "{memorized} of {count} pages memorized",
		juz_clear: "Clear juz",
		juz_mark_learning: "Mark juz learning",
		juz_mark_memorized: "Mark juz memorized",

		// Surahs
		surah_mark: "Mark {surah} memorized",
		surah_clear: "Clear {surah}",
		surah_meta: "{meaning}, {status}",
		status_all: "all {count} ayahs memorized",
		status_memorized: "{memorized} of {total} memorized",
		status_learning: "{learning} of {total} learning",
		status_both: "{memorized} of {total} memorized, {learning} learning",
		empty_search: "No surah matches your search.",
		empty_progress: "Nothing in progress. Surahs you have partly memorized or are learning show up here.",
		empty_memorized: "No surah is fully memorized yet.",
		empty_not_started: "Every surah has been started.",

		// Surah sheet
		close: "Close",
		sheet_meta: "Surah {number}, {ayahs}, {origin}. {pages} in {juz}.",
		meccan: "Meccan",
		medinan: "Medinan",
		sheet_juz: "juz {juz}",
		sheet_juz_range: "juz {from}–{to}",
		page_mark: "page",
		ayah_memorized: "Ayah {ayah}, memorized",
		ayah_learning: "Ayah {ayah}, learning",
		ayah_none: "Ayah {ayah}, not memorized",
		progress_all: "All {count} ayahs memorized",
		progress_none: "Not started",
		progress_memorized: "{memorized} of {total} memorized",
		progress_both: "{memorized} of {total} memorized, {learning} learning",
		fill_clear: "Clear all ayahs",
		fill_learning: "Mark all learning",
		fill_memorized: "Mark all memorized",
		sheet_hint_click: "Click an ayah to mark it, or drag across ayahs to mark several.",
		sheet_hint_tap: "Tap an ayah to mark it, or swipe sideways across ayahs to mark several.",

		// Your data
		data_label: "Your data",
		backup_heading: "Backup",
		backup_text: "Progress is saved in this browser only. Export a backup now and then. Import it to restore your progress or to move it to another browser or device.",
		backup_export: "Export backup",
		backup_import: "Import backup",
		backup_last: "Last backup {date}",
		backup_none: "No backup yet",
		backup_exported: "Backup exported",
		backup_imported: "Backup imported",
		backup_invalid: "That file is not a Hifz tracker backup",
		week_heading: "This week",
		week_text: "Counts pages you mark memorized. Changes on your first day are not counted, so marking what you already knew does not inflate it. Marked older memorization later? Count from today.",
		week_count_today: "Count from today",
		week_counting_since: "Counting since {date}",
		week_counts_today: "This week counts from today",
		clear_heading: "Clear progress",
		clear_text: "Removes every mark. You can undo it right after.",
		clear_all: "Clear all progress",
		clear_confirm: "Press again to clear",
		clear_done: "All progress cleared",

		// Popover and toast
		details: "Details",
		undone: "Undone"
	}
});
