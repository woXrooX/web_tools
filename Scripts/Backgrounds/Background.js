/*
	web_tools: canvas backgrounds, shared by every tool that draws on a canvas.

	A background is a few settings, so any look can be put together:
		color: the paper, a hex color ("#rrggbb", or "#rrggbbaa" to see through it);
		line_color: the dots, grid lines, rulers and angle lines, all drawn faintly over the paper;
		pattern: "dots", "lines" or "none";
		rulers: numbered ticks along the top and left edges, counted in grid squares from the origin;
		guides: angle lines at 30, 45 and 60 degrees through the origin, as printed on a cutting mat.
	A preset fills every setting at once; a tool then lets each one change on its own.

	The world belongs to the tool: one unit is one CSS pixel at 100%. Dots and lines sit on a
	grid with a square every 24 units, and every 5th line is a strong one.
	A camera says where the world is on the canvas: { x, y, zoom, ratio, width, height }.
	A world point p lands at p * zoom + x (and y) in CSS pixels; ratio is device pixels per
	CSS pixel; width and height are the visible size in CSS pixels.

	Settings read from storage, a file or an AI go through complete() before they are kept.
	paint(), svg() and colors() expect completed settings, so they never parse colors while drawing.

	A tool loads this file with a <script> tag before its own script.
	Adding a preset: an entry in presets. Adding a pattern: its label in patterns, and its drawing
	in paint() and svg(). Adding a detail: its label in details, a value in every preset, its
	setting in complete() and #keys, and its drawing in paint() and svg().
*/
class Background {
	/////////////////////////// Static

	/////////// Variables

	static grid = 24;
	static major = 5;
	static fallback = "dot_grid";

	/*
		Every preset draws in pure white. How faint each mark looks comes from
		#strength, not from a dimmed color, so a grid color picked by hand
		behaves the same way. Dot grid is the tools' original look: the --well
		paper of core.css, with dots as bright as the old --line dots.
	*/
	static presets = {
		dot_grid: { label: "Dot grid", color: "#08090b", line_color: "#ffffff", pattern: "dots", rulers: false, guides: false },
		blueprint_grid: { label: "Blueprint grid", color: "#164779", line_color: "#ffffff", pattern: "lines", rulers: false, guides: false },
		cutting_mat: { label: "Cutting mat", color: "#1f4c37", line_color: "#ffffff", pattern: "lines", rulers: true, guides: true }
	};

	// Labels for a tool's menu.
	static patterns = { dots: "Dots", lines: "Lines", none: "None" };
	static details = { rulers: "Rulers", guides: "Angles" };

	// Other names people and AIs write for presets and patterns.
	static #preset_aliases = { dots: "dot_grid", dot: "dot_grid", dotted: "dot_grid", blueprint: "blueprint_grid", mat: "cutting_mat", cutting: "cutting_mat", self_healing_mat: "cutting_mat" };
	static #pattern_aliases = { dot: "dots", dotted: "dots", line: "lines", lined: "lines", grid: "lines", plain: "none", blank: "none", solid: "none" };

	static #keys = ["color", "line_color", "pattern", "rulers", "guides"];

	// How strongly line_color shows in each mark. The color's own alpha multiplies it.
	static #strength = { dot: 0.11, minor: 0.12, major: 0.28, guide: 0.13, tick: 0.5 };

	// How much quiet text stands out from the paper: the contrast of --ink_faint on --well, 3.3 to 1.
	static #label_contrast = 3.3;

	/*
		In CSS pixels: lines fade out when closer than closest_line, dots thin out
		when closer than closest_dot. A dot is a disc of dot_radius; the canvas
		draws it as a small plus, dot_long by dot_short, which looks the same.
	*/
	static #closest_line = 6;
	static #closest_dot = 12;
	static #dot_radius = 1.2;
	static #dot_long = 2.5;
	static #dot_short = 1.5;
	static #guide_angles = [30, 45, 60, 120, 135, 150];

	static #reader = null;
	static #mono = '';


	/////////// APIs

	// A copy of a preset's settings, by name or alias. Any other name gives the fallback preset.
	static preset(name) {
		const preset = this.presets[this.#preset_name(name) || this.fallback];
		const settings = {};
		for (const key of this.#keys) settings[key] = preset[key];
		return settings;
	}

	/*
		Settings from anywhere, repaired: a preset name, or an object whose
		missing or unreadable fields come from the preset it names in "preset"
		(the fallback preset when it names none). The result holds every
		setting and nothing else.
	*/
	static complete(value) {
		let source = value;
		if (typeof source === "string") source = { preset: source };
		if (!source || typeof source !== "object" || Array.isArray(source)) source = {};
		const base = this.preset(source.preset);
		return {
			color: this.hex(source.color) || base.color,
			line_color: this.hex(source.line_color) || base.line_color,
			pattern: this.#pattern_name(source.pattern) || base.pattern,
			rulers: typeof source.rulers === "boolean" ? source.rulers : base.rulers,
			guides: typeof source.guides === "boolean" ? source.guides : base.guides
		};
	}

	// The name of the preset these settings are exactly, or null once any of them is changed.
	static preset_of(settings) {
		for (const name in this.presets)
			if (this.#keys.every((key) => this.presets[name][key] === settings[key])) return name;
		return null;
	}

	/*
		Colors for marks drawn straight on the background, so they read on any paper.
		knockout fills behind labels and inside handles: the paper, made opaque.
		label is for quiet text and lines, such as a surface's title: line_color
		mixed into the paper just until it stands out as much as --ink_faint does
		on --well, so it is equally quiet on every paper. When line_color is too
		close to the paper to get there, label is line_color itself.
	*/
	static colors(settings) {
		const paper = this.#rgb(settings.color);
		const line = this.#rgb(settings.line_color);
		const mix = (amount) => ({ r: paper.r + (line.r - paper.r) * amount, g: paper.g + (line.g - paper.g) * amount, b: paper.b + (line.b - paper.b) * amount, a: 1 });
		const enough = (amount) => this.#contrast(mix(amount), paper) >= this.#label_contrast;
		let low = 0;
		let high = 1;
		// Halving the gap 12 times finds the mix to well within one step of the 0 to 255 scale.
		if (enough(1)) {
			for (let step = 0; step < 12; step++) {
				const middle = (low + high) / 2;
				if (enough(middle)) high = middle;
				else low = middle;
			}
		}
		return {
			knockout: this.#hex_of({ r: paper.r, g: paper.g, b: paper.b, a: 1 }),
			label: this.#hex_of(mix(high))
		};
	}

	// Any CSS color as lowercase hex, "#rrggbb" or "#rrggbbaa", or null when it cannot be read.
	static hex(text) {
		if (typeof text !== "string" || !text.trim()) return null;
		const value = text.trim().toLowerCase();
		if (/^#[0-9a-f]{6}$/.test(value)) return value;
		/*
			The canvas does the parsing: an invalid value leaves fillStyle
			unchanged, so setting it over two different colors and comparing
			tells valid from invalid.
		*/
		if (!this.#reader) this.#reader = document.createElement("canvas").getContext("2d");
		const reader = this.#reader;
		reader.fillStyle = "#010203";
		reader.fillStyle = value;
		const first = reader.fillStyle;
		reader.fillStyle = "#040506";
		reader.fillStyle = value;
		if (reader.fillStyle !== first) return null;
		if (first.startsWith('#')) return first;
		const parts = first.match(/[\d.]+/g);
		if (!parts || parts.length < 3) return null;
		return this.#hex_of({ r: Number(parts[0]), g: Number(parts[1]), b: Number(parts[2]), a: parts.length > 3 ? Number(parts[3]) : 1 });
	}

	// Paints the background over the whole canvas of a 2D context, for the camera.
	static paint(context, settings, camera) {
		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.globalAlpha = 1;
		context.fillStyle = settings.color;
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		if (settings.pattern === "dots") this.#paint_dots(context, settings, camera);
		if (settings.pattern === "lines") this.#paint_lines(context, settings, camera);
		if (settings.guides) this.#paint_guides(context, settings, camera);
		if (settings.rulers) this.#paint_rulers(context, settings, camera);
		context.restore();
	}

	// A small sample of the settings in a canvas element shown at width x height CSS pixels. Rulers need more room, so it leaves them out.
	static preview(canvas, settings, width, height) {
		const ratio = window.devicePixelRatio || 1;
		canvas.width = Math.round(width * ratio);
		canvas.height = Math.round(height * ratio);
		const sample = Object.assign({}, settings, { rulers: false });
		this.paint(canvas.getContext("2d"), sample, { x: 3, y: 3, zoom: 0.5, ratio: ratio, width: width, height: height });
	}

	/*
		The background as SVG markup for the box { x, y, w, h } in world units,
		as it looks at 100%. Translucent colors get a separate opacity attribute,
		since some SVG editors ignore "#rrggbbaa".
	*/
	static svg(settings, box) {
		const number = this.#number;
		const left = box.x, top = box.y, right = box.x + box.w, bottom = box.y + box.h;
		const area = "x=\"" + number(left) + "\" y=\"" + number(top) + "\" width=\"" + number(box.w) + "\" height=\"" + number(box.h) + '"';
		let markup = "<rect " + area + ' ' + this.#svg_paint("fill", settings.color, 1) + "/>";
		if (settings.pattern === "dots") {
			const half = this.grid / 2;
			markup += "<defs><pattern id=\"background_dots\" x=\"" + -half + "\" y=\"" + -half + "\" width=\"" + this.grid + "\" height=\"" + this.grid + "\" patternUnits=\"userSpaceOnUse\">";
			markup += "<circle cx=\"" + half + "\" cy=\"" + half + "\" r=\"" + this.#dot_radius + "\" " + this.#svg_paint("fill", settings.line_color, this.#strength.dot) + "/></pattern></defs>";
			markup += "<rect " + area + " fill=\"url(#background_dots)\"/>";
		}
		if (settings.pattern === "lines") {
			const paths = ['', '', ''];
			for (let i = Math.ceil(left / this.grid); i * this.grid <= right; i++)
				paths[this.#level(i)] += 'M' + number(i * this.grid) + ' ' + number(top) + 'V' + number(bottom);
			for (let i = Math.ceil(top / this.grid); i * this.grid <= bottom; i++)
				paths[this.#level(i)] += 'M' + number(left) + ' ' + number(i * this.grid) + 'H' + number(right);
			for (let level = 0; level < paths.length; level++) {
				if (!paths[level]) continue;
				const fill = this.#blend(settings, this.#line_alpha(this.grid * Math.pow(this.major, level), level === 0));
				markup += "<path d=\"" + paths[level] + "\" fill=\"none\" stroke-width=\"1\" stroke=\"" + fill.color + '"' + (fill.alpha < 1 ? " stroke-opacity=\"" + number(fill.alpha) + '"' : '') + "/>";
			}
		}
		if (settings.guides) {
			const reach = Math.abs(left) + Math.abs(top) + box.w + box.h;
			let d = '';
			for (const degrees of this.#guide_angles) {
				const angle = degrees * Math.PI / 180;
				const dx = Math.cos(angle) * reach;
				const dy = Math.sin(angle) * reach;
				d += 'M' + number(-dx) + ' ' + number(dy) + 'L' + number(dx) + ' ' + number(-dy);
			}
			markup += "<path d=\"" + d + "\" fill=\"none\" stroke-width=\"1\" " + this.#svg_paint("stroke", settings.line_color, this.#strength.guide) + "/>";
		}
		if (settings.rulers) markup += this.#svg_rulers(settings, box);
		return "<g>" + markup + "</g>";
	}


	/////////// Helpers

	static #preset_name(value) {
		if (typeof value !== "string") return null;
		const key = this.#key(value);
		if (this.presets[key]) return key;
		return this.#preset_aliases[key] || null;
	}

	static #pattern_name(value) {
		if (typeof value !== "string") return null;
		const key = this.#key(value);
		if (this.patterns[key]) return key;
		return this.#pattern_aliases[key] || null;
	}

	// "Blueprint grid" and "blueprint-grid" both become "blueprint_grid".
	static #key(value) {
		return value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
	}

	// "#rrggbb" or "#rrggbbaa" to { r, g, b, a }.
	static #rgb(hex) {
		return {
			r: parseInt(hex.slice(1, 3), 16),
			g: parseInt(hex.slice(3, 5), 16),
			b: parseInt(hex.slice(5, 7), 16),
			a: hex.length > 7 ? parseInt(hex.slice(7, 9), 16) / 255 : 1
		};
	}

	static #hex_of(color) {
		const pair = (value) => Math.round(Math.max(0, Math.min(255, value))).toString(16).padStart(2, '0');
		const hex = '#' + pair(color.r) + pair(color.g) + pair(color.b);
		return color.a < 1 ? hex + pair(color.a * 255) : hex;
	}

	// Relative luminance (WCAG) of { r, g, b } on the 0 to 255 scale.
	static #luminance(color) {
		const linear = (value) => {
			const share = value / 255;
			return share <= 0.04045 ? share / 12.92 : Math.pow((share + 0.055) / 1.055, 2.4);
		};
		return 0.2126 * linear(color.r) + 0.7152 * linear(color.g) + 0.0722 * linear(color.b);
	}

	// Contrast ratio (WCAG) of two colors, from 1 to 21.
	static #contrast(first, second) {
		const one = this.#luminance(first);
		const two = this.#luminance(second);
		return (Math.max(one, two) + 0.05) / (Math.min(one, two) + 0.05);
	}

	static #smooth(t) {
		return t * t * (3 - 2 * t);
	}

	/*
		How strongly a family of lines shows, from how far apart its lines are on
		screen: nothing at 6 pixels apart, the minor strength at 24, the major
		strength at 120. Zooming changes every family's spacing smoothly, so lines
		never pop, and zoomed out the strong lines become the fine ones. The finest
		family, every grid line, stays minor however far in you zoom.
	*/
	static #line_alpha(spacing, finest) {
		const strength = this.#strength;
		const closest = this.#closest_line, fine = this.grid, strong = this.grid * this.major;
		let alpha = strength.major;
		if (spacing <= closest) alpha = 0;
		else if (spacing < fine) alpha = strength.minor * this.#smooth(Math.log(spacing / closest) / Math.log(fine / closest));
		else if (spacing < strong) alpha = strength.minor + (strength.major - strength.minor) * this.#smooth(Math.log(spacing / fine) / Math.log(this.major));
		return finest ? Math.min(alpha, strength.minor) : alpha;
	}

	// The finest family of lines at least 6 pixels apart: 0 is every grid line, 1 every 5th, 2 every 25th.
	static #first_level(zoom) {
		return Math.max(0, Math.ceil(Math.log(this.#closest_line / (this.grid * zoom)) / Math.log(this.major) - 1e-9));
	}

	// The family of line i, up to two levels above the finest: line i is also a 5th line when i is a multiple of 5.
	static #level(i) {
		let level = 0;
		for (let k = i; level < 2 && k % this.major === 0; k /= this.major) level++;
		return level;
	}

	/*
		Dots sit on grid points and keep one size on screen. Zoomed out, every
		other dot drops out whenever they would come closer than 12 pixels.
		Each dot is a plus of two small rectangles: at 2 to 3 pixels across it
		looks round, and rectangles cost far less than circles. A pattern fill
		would touch every pixel of the canvas on every frame; this costs only
		what the dots cover, which keeps panning smooth on an iPad. In a blended
		opaque color the two rectangles can overlap; over a see-through paper
		they join in one path instead, so the middle does not darken.
	*/
	static #paint_dots(context, settings, camera) {
		let spacing = this.grid * camera.zoom;
		while (spacing < this.#closest_dot) spacing *= 2;
		const long = this.#dot_long * camera.ratio;
		const short = this.#dot_short * camera.ratio;
		const reach = this.#dot_long / 2;
		const fill = this.#blend(settings, this.#strength.dot);
		const path = fill.alpha < 1 ? new Path2D() : null;
		context.globalAlpha = fill.alpha;
		context.fillStyle = fill.color;
		for (let column = Math.floor(-camera.x / spacing); column * spacing + camera.x <= camera.width + reach; column++) {
			const x = (column * spacing + camera.x) * camera.ratio;
			for (let row = Math.floor(-camera.y / spacing); row * spacing + camera.y <= camera.height + reach; row++) {
				const y = (row * spacing + camera.y) * camera.ratio;
				if (path) {
					path.rect(x - long / 2, y - short / 2, long, short);
					path.rect(x - short / 2, y - long / 2, short, long);
				}
				else {
					context.fillRect(x - long / 2, y - short / 2, long, short);
					context.fillRect(x - short / 2, y - long / 2, short, long);
				}
			}
		}
		if (path) context.fill(path);
	}

	/*
		Grid lines as thin rectangles on whole device pixels, so a 1 pixel line
		stays sharp; filled rectangles cost far less than stroked lines. Each
		family is one blended color, so lines that cross do not add up.
	*/
	static #paint_lines(context, settings, camera) {
		const first = this.#first_level(camera.zoom);
		const step = this.grid * Math.pow(this.major, first);
		const alphas = [0, 1, 2].map((level) => this.#line_alpha(step * Math.pow(this.major, level) * camera.zoom, first + level === 0));
		const columns = [[], [], []];
		const rows = [[], [], []];
		for (let i = Math.floor(-camera.x / camera.zoom / step); i * step * camera.zoom + camera.x <= camera.width; i++)
			columns[this.#level(i)].push(i * step * camera.zoom + camera.x);
		for (let i = Math.floor(-camera.y / camera.zoom / step); i * step * camera.zoom + camera.y <= camera.height; i++)
			rows[this.#level(i)].push(i * step * camera.zoom + camera.y);
		const width = Math.max(1, Math.round(camera.ratio));
		const before = Math.floor(width / 2);
		const canvas = context.canvas;
		for (let level = 0; level < alphas.length; level++) {
			if (alphas[level] <= 0) continue;
			const fill = this.#blend(settings, alphas[level]);
			context.globalAlpha = fill.alpha;
			context.fillStyle = fill.color;
			for (const at of columns[level]) context.fillRect(Math.round(at * camera.ratio) - before, 0, width, canvas.height);
			for (const at of rows[level]) context.fillRect(0, Math.round(at * camera.ratio) - before, canvas.width, width);
		}
	}

	/*
		line_color at a strength over the paper, as one opaque color, so marks
		painted twice in it look the same as once. Over a see-through paper
		there is nothing to blend with, so the strength stays an alpha.
	*/
	static #blend(settings, strength) {
		const paper = this.#rgb(settings.color);
		const line = this.#rgb(settings.line_color);
		const amount = strength * line.a;
		if (paper.a < 1) return { color: this.#hex_of({ r: line.r, g: line.g, b: line.b, a: 1 }), alpha: amount };
		const mix = (from, to) => from + (to - from) * amount;
		return { color: this.#hex_of({ r: mix(paper.r, line.r), g: mix(paper.g, line.g), b: mix(paper.b, line.b), a: 1 }), alpha: 1 };
	}

	// Angle lines through the origin, 30, 45 and 60 degrees each way, as printed on a cutting mat.
	static #paint_guides(context, settings, camera) {
		const x = camera.x * camera.ratio;
		const y = camera.y * camera.ratio;
		const reach = Math.abs(x) + Math.abs(y) + context.canvas.width + context.canvas.height;
		const path = new Path2D();
		for (const degrees of this.#guide_angles) {
			const angle = degrees * Math.PI / 180;
			const dx = Math.cos(angle) * reach;
			const dy = Math.sin(angle) * reach;
			path.moveTo(x - dx, y + dy);
			path.lineTo(x + dx, y - dy);
		}
		context.lineWidth = camera.ratio;
		context.strokeStyle = settings.line_color;
		context.globalAlpha = this.#strength.guide;
		context.stroke(path);
	}

	/*
		Rulers along the top and left edges, as on a cutting mat: a tick at every
		grid line, a long one at every strong line, and the strong lines numbered
		in grid squares from the origin. A number sits in the square just after
		its line, so the line never runs through it. When strong lines come too
		close for their numbers, only every 25th line is numbered.
	*/
	static #paint_rulers(context, settings, camera) {
		const ratio = camera.ratio;
		const first = this.#first_level(camera.zoom);
		const step = this.grid * Math.pow(this.major, first);
		const spacing = step * camera.zoom;
		const every = spacing * this.major >= 44 ? this.major : this.major * this.major;
		const width = Math.max(1, Math.round(ratio));
		const offset = width % 2 ? 0.5 : 0;
		const ticks = new Path2D();
		const numbers = [];
		for (let i = Math.floor(-camera.x / spacing); i * spacing + camera.x <= camera.width; i++) {
			const at = i * spacing + camera.x;
			const x = Math.round(at * ratio) + offset;
			ticks.moveTo(x, 0);
			ticks.lineTo(x, (i % this.major === 0 ? 10 : 5) * ratio);
			if (i % every === 0 && at > 30) numbers.push({ text: String(i * step / this.grid), x: x + 3 * ratio, y: 12 * ratio });
		}
		for (let i = Math.floor(-camera.y / spacing); i * spacing + camera.y <= camera.height; i++) {
			const at = i * spacing + camera.y;
			const y = Math.round(at * ratio) + offset;
			ticks.moveTo(0, y);
			ticks.lineTo((i % this.major === 0 ? 10 : 5) * ratio, y);
			if (i % every === 0 && at > 30) numbers.push({ text: String(i * step / this.grid), x: 13 * ratio, y: y + 3 * ratio });
		}
		context.lineWidth = width;
		context.strokeStyle = settings.line_color;
		context.globalAlpha = this.#strength.tick;
		context.stroke(ticks);
		context.globalAlpha = 1;
		context.fillStyle = this.colors(settings).label;
		context.font = 11 * ratio + "px " + this.#mono_family();
		context.textAlign = "left";
		context.textBaseline = "top";
		for (const number of numbers) context.fillText(number.text, number.x, number.y);
	}

	// The rulers for svg(), along the box's top and left edges, as they look at 100%.
	static #svg_rulers(settings, box) {
		const number = this.#number;
		let ticks = '';
		let numbers = '';
		for (let i = Math.ceil(box.x / this.grid); i * this.grid <= box.x + box.w; i++) {
			const x = i * this.grid;
			ticks += 'M' + number(x) + ' ' + number(box.y) + 'v' + (i % this.major === 0 ? 10 : 5);
			if (i % this.major === 0 && x - box.x > 30) numbers += "<text x=\"" + number(x + 3) + "\" y=\"" + number(box.y + 21) + "\">" + i + "</text>";
		}
		for (let i = Math.ceil(box.y / this.grid); i * this.grid <= box.y + box.h; i++) {
			const y = i * this.grid;
			ticks += 'M' + number(box.x) + ' ' + number(y) + 'h' + (i % this.major === 0 ? 10 : 5);
			if (i % this.major === 0 && y - box.y > 30) numbers += "<text x=\"" + number(box.x + 13) + "\" y=\"" + number(y + 12) + "\">" + i + "</text>";
		}
		const font = "font-family=\"" + this.#escape(this.#mono_family()) + "\" font-size=\"11\" fill=\"" + this.colors(settings).label + '"';
		return "<path d=\"" + ticks + "\" fill=\"none\" stroke-width=\"1\" " + this.#svg_paint("stroke", settings.line_color, this.#strength.tick) + "/><g " + font + '>' + numbers + "</g>";
	}

	// attribute="#rrggbb", plus attribute-opacity when the color or the factor fades it.
	static #svg_paint(attribute, hex, factor) {
		const color = this.#rgb(hex);
		const alpha = color.a * factor;
		const opacity = alpha < 1 ? ' ' + attribute + "-opacity=\"" + this.#number(alpha) + '"' : '';
		return attribute + "=\"" + this.#hex_of({ r: color.r, g: color.g, b: color.b, a: 1 }) + '"' + opacity;
	}

	static #number(value) {
		const rounded = Math.round(value * 1000) / 1000;
		return String(Object.is(rounded, -0) ? 0 : rounded);
	}

	static #escape(text) {
		return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
	}

	// The site's monospace font, --mono in core.css, read once.
	static #mono_family() {
		if (!this.#mono) this.#mono = getComputedStyle(document.documentElement).getPropertyValue("--mono").trim() || "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
		return this.#mono;
	}
}
