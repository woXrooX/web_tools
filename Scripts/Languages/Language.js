/*
	web_tools: the language layer, shared by every translated tool.

	This folder holds this file and one file per language, named by its code in capitals: EN.js, UZ.js, RU.js.
	Each language file calls Language.add(code, data), and data holds:
	name: the language's name in itself, for the picker;
	format: number signs and month names, only for a language some browsers have no data for (see UZ.js);
	shared: texts any tool may use;
	a section per tool, named after the tool's folder (hifz_tracker), so two tools never clash over a key.

	A translated tool loads this file, then EN.js and the other language files, then its own script, which calls Language.start("<tool folder>").
	A key is looked up in the tool's section, then in shared: in the current language first, then in English. A key found nowhere shows itself, so a gap is visible instead of breaking the page.

	A value is one text, or forms by number: { one, few, many, other }, the categories of Intl.PluralRules. The {count} value picks the form, so Russian gets 1 страница, 2 страницы, 5 страниц.
	{name} in a text is filled from the values passed in. Numbers are written the way the language writes them: 12.5 reads 12,5 in Russian and Uzbek.
	Numbers and dates come from Intl, unless the language brings its own format: Chrome has no Uzbek data and would show 12.5 and "2026 M11 15".

	Markup: data-text="key" sets an element's text; data-text-aria-label, data-text-title and data-text-placeholder set those attributes. Placeholders in markup come from the element's own data attributes (data-total="604" fills {total}).
	The English in the markup is only what shows before the script runs; start() warns in the console when it no longer matches EN.js.

	The choice is stored for the whole site under "web_tools.language", so every translated tool opens in the same language.
*/
class Language {
	/////////////////////////// Static

	/////////// Variables

	static key = "web_tools.language";
	static fallback = "en";
	static current = "en";

	static #languages = {};
	static #tool = '';
	static #attributes = ["aria-label", "title", "placeholder"];
	static #listeners = [];
	static #plural_rules = new Map();
	static #number_formats = new Map();
	static #warned = new Set();
	static #select = null;
	static #choice = null;

	/*
		Material Symbols, Rounded style, filled, by Google. Apache License 2.0:
		https://github.com/google/material-design-icons
		language and expand_more, on the 960 x 960 grid (viewBox 0 -960 960 960).
	*/
	static #globe = "M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z";
	static #chevron = "M480-362q-8 0-15-2.5t-13-8.5L268-557q-11-11-11-28t11-28q11-11 28-11t28 11l156 156 156-156q11-11 28-11t28 11q11 11 11 28t-11 28L508-373q-6 6-13 8.5t-15 2.5Z";


	/////////// APIs

	// Called by each language file. A second call for the same language adds its sections to the first.
	static add(code, data) {
		this.#languages[code] = { ...this.#languages[code], ...data };
	}

	// The languages that have texts for this tool, in the order their files were loaded.
	static codes() {
		return Object.keys(this.#languages).filter((code) => !this.#tool || this.#languages[code][this.#tool]);
	}

	// tool is the tool's folder name, which is also its section in every language file.
	// Picks the language (the saved choice, then the browser's, then English), translates the page and puts the picker in the site bar.
	static start(tool) {
		const source = document.documentElement.lang || this.fallback;
		this.#tool = tool || '';
		this.#use(this.#pick());
		this.#check_markup(source);
		this.#build_picker();
		this.apply();
		// Another tab changed the language: follow it.
		window.addEventListener("storage", (event) => {
			if (event.key === this.key) this.set(event.newValue, false);
		});
	}

	static set(code, save = true) {
		if (!this.codes().includes(code) || code === this.current) return;
		this.#use(code);
		if (save) this.#write(code);
		this.apply();
		this.#show_choice();
		for (const listener of this.#listeners) {
			listener(code);
		}
	}

	// Called after each change of language, once the markup is translated, so the tool can redo the text its script builds.
	static on_change(listener) {
		this.#listeners.push(listener);
	}

	// The text for a key in the current language, with its {placeholders} filled from values.
	static text(key, values = {}) {
		return this.#render(this.current, key, values);
	}

	// Like text, for a sentence that holds markup: a placeholder whose value is an element gets that element.
	static fill(element, key, values = {}) {
		const template = this.#template(this.current, key, values);
		const parts = [];
		let last = 0;
		for (const match of template.matchAll(/\{(\w+)\}/g)) {
			const value = values[match[1]];
			parts.push(template.slice(last, match.index));
			if (value instanceof Node) parts.push(value);
			else parts.push(value === undefined ? match[0] : this.#format(this.current, value));
			last = match.index + match[0].length;
		}
		parts.push(template.slice(last));
		element.replaceChildren(...parts);
	}

	// Translates the marked-up elements under root.
	static apply(root = document) {
		this.#each_marked(root, (element, attribute, key) => {
			const text = this.text(key, element.dataset);
			if (attribute) element.setAttribute(attribute, text);
			else element.textContent = text;
		});
	}

	// A value that is not a text, such as a list, from a language or else from English.
	static value(key, code = this.current) {
		return this.#lookup(code, key);
	}

	static number(value, options) {
		return this.#number(this.current, value, options);
	}

	// Day, month and year: "Nov 15, 2026", "15 нояб. 2026 г.", "15-noyabr, 2026".
	static date(value) {
		const format = this.#languages[this.current]?.format;
		if (!format || !format.months)
			return new Intl.DateTimeFormat(this.current, { day: "numeric", month: "short", year: "numeric" }).format(value);
		// Strings, so the year is not written as a grouped number.
		const parts = { day: String(value.getDate()), month: format.months[value.getMonth()], year: String(value.getFullYear()) };
		return this.#substitute(this.current, format.date, parts);
	}

	// For translators: the keys English has and a language lacks, in this tool's section and in shared. In the console: Language.missing("uz").
	static missing(code) {
		const missing = [];
		for (const section of [this.#tool, "shared"]) {
			const english = this.#languages[this.fallback]?.[section] || {};
			const texts = this.#languages[code]?.[section] || {};
			for (const key of Object.keys(english)) {
				if (!Object.hasOwn(texts, key)) missing.push(`${section}.${key}`);
			}
		}
		return missing;
	}


	/////////// Helpers

	static #use(code) {
		this.current = code;
		document.documentElement.lang = code;
	}

	static #render(code, key, values) {
		return this.#substitute(code, this.#template(code, key, values), values);
	}

	static #substitute(code, pattern, values) {
		return pattern.replace(/\{(\w+)\}/g, (match, name) => {
			if (values[name] === undefined) return match;
			return this.#format(code, values[name]);
		});
	}

	static #template(code, key, values) {
		const entry = this.#lookup(code, key);
		if (entry === undefined) {
			this.#warn(`no text for "${key}"`);
			return key;
		}
		if (typeof entry === "string") return entry;
		return entry[this.#plural(code, Number(values.count))] ?? entry.other;
	}

	// The tool's section, then shared: in the language asked for, then in English.
	static #lookup(code, key) {
		for (const language of [this.#languages[code], this.#languages[this.fallback]]) {
			if (!language) continue;
			for (const texts of [language[this.#tool], language.shared]) {
				if (texts && Object.hasOwn(texts, key)) return texts[key];
			}
		}
		return undefined;
	}

	static #format(code, value) {
		return typeof value === "number" ? this.#number(code, value) : String(value);
	}

	// Intl objects are slow to make and every number needs one, so the plain one is made once per language.
	static #number(code, value, options) {
		if (!this.#number_formats.has(code)) this.#number_formats.set(code, new Intl.NumberFormat(code));
		const intl = options ? new Intl.NumberFormat(code, options) : this.#number_formats.get(code);
		const format = this.#languages[code]?.format;
		if (!format || !format.decimal) return intl.format(value);
		return intl.formatToParts(value).map((part) => {
			if (part.type === "decimal") return format.decimal;
			if (part.type === "group") return format.group;
			return part.value;
		}).join('');
	}

	static #plural(code, count) {
		if (!this.#plural_rules.has(code)) this.#plural_rules.set(code, new Intl.PluralRules(code));
		return this.#plural_rules.get(code).select(count);
	}

	// Every translated spot under root: the element, the attribute (null for its text) and the key.
	static #each_marked(root, callback) {
		for (const element of root.querySelectorAll("[data-text]")) {
			callback(element, null, element.dataset.text);
		}
		for (const attribute of this.#attributes) {
			for (const element of root.querySelectorAll(`[data-text-${attribute}]`)) {
				callback(element, attribute, element.getAttribute(`data-text-${attribute}`));
			}
		}
	}

	// The saved choice first, then the first of the browser's languages this tool has, then English.
	static #pick() {
		const codes = this.codes();
		const saved = this.#read();
		if (codes.includes(saved)) return saved;
		for (const tag of navigator.languages || [navigator.language]) {
			const code = String(tag).toLowerCase().split('-')[0];
			if (codes.includes(code)) return code;
		}
		return this.fallback;
	}

	static #read() {
		try {
			return localStorage.getItem(this.key);
		} catch {
			return null;
		}
	}

	static #write(code) {
		try {
			localStorage.setItem(this.key, code);
		} catch {
			// Blocked storage: the choice lasts until the page is closed.
		}
	}

	// The English in the markup must say what EN.js says, or a change made in one place is lost in the other.
	static #check_markup(source) {
		if (!this.#languages[source]) return;
		const clean = (text) => String(text).replace(/\s+/g, ' ').trim();
		this.#each_marked(document, (element, attribute, key) => {
			const shown = attribute ? element.getAttribute(attribute) : element.textContent;
			if (clean(shown) !== clean(this.#render(source, key, element.dataset)))
				this.#warn(`the page and ${source.toUpperCase()}.js differ for "${key}"`);
		});
	}

	static #warn(message) {
		if (this.#warned.has(message)) return;
		this.#warned.add(message);
		console.warn(`Language: ${message}`);
	}

	// A native select lies invisible over the label, so every device opens its own picker. With one language there is nothing to pick.
	static #build_picker() {
		const bar = document.querySelector(".site_bar");
		const codes = this.codes();
		if (!bar || this.#select || codes.length < 2) return;
		const picker = document.createElement("label");
		const select = document.createElement("select");
		const choice = document.createElement("span");
		picker.className = "site_language";
		choice.setAttribute("aria-hidden", "true");
		select.dataset.textAriaLabel = "language_picker";
		for (const code of codes) {
			const option = new Option(this.#name(code), code);
			option.lang = code;
			select.append(option);
		}
		select.addEventListener("change", () => this.set(select.value));
		picker.append(this.#icon(this.#globe), choice, this.#icon(this.#chevron), select);
		bar.append(picker);
		this.#select = select;
		this.#choice = choice;
		this.#show_choice();
	}

	static #show_choice() {
		if (!this.#select) return;
		this.#select.value = this.current;
		this.#choice.textContent = this.#name(this.current);
	}

	// The language's name in itself, so anyone can find their own language whatever language the page is in.
	static #name(code) {
		return this.#languages[code]?.name || code;
	}

	static #icon(path) {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
		svg.setAttribute("viewBox", "0 -960 960 960");
		svg.setAttribute("aria-hidden", "true");
		shape.setAttribute('d', path);
		svg.append(shape);
		return svg;
	}
}
