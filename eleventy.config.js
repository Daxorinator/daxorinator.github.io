import fs from "node:fs";
import path from "node:path";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import Image, { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import EleventyNavigationPlugin from "@11ty/eleventy-navigation";
import EleventySyntaxHighlightPlugin from "@11ty/eleventy-plugin-syntaxhighlight";
import EleventyRssPlugin from "@11ty/eleventy-plugin-rss";

import { DateTime } from "luxon";
import markdownItAnchor from "markdown-it-anchor";
import { PurgeCSS } from "purgecss";
import CleanCSS from "clean-css";

export default async function(eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/robots.txt` ends up in `_site/robots.txt`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
	});

	// Process CSS: purge unused styles and minify
	eleventyConfig.on("eleventy.after", async ({ dir }) => {
		const cssInput = path.resolve("_includes/css/index.css");
		const cssOutputDir = path.join(dir.output, "css");
		const cssOutputFile = path.join(cssOutputDir, "index.css");

		const rawCSS = fs.readFileSync(cssInput, "utf-8");

		const purged = await new PurgeCSS().purge({
			content: [
				"content/**/*.{njk,md,html}",
				"_includes/**/*.njk",
			],
			css: [{ raw: rawCSS }],
		});

		const minified = new CleanCSS().minify(purged[0].css);

		fs.mkdirSync(cssOutputDir, { recursive: true });
		fs.writeFileSync(cssOutputFile, minified.styles);
	});

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// Official plugins
	eleventyConfig.addPlugin(EleventyNavigationPlugin);
	eleventyConfig.addPlugin(EleventyRenderPlugin)
	eleventyConfig.addPlugin(EleventyRssPlugin);
	
	eleventyConfig.addPlugin(EleventySyntaxHighlightPlugin, {
		preAttributes: { tabindex: 0 }
	});

	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// output image formats
		formats: ["avif", "webp", "jpeg"],

		// output image widths
		widths: ["auto"],

		// optional, attributes assigned on <img> nodes override these values
		htmlOptions: {
			imgAttributes: {
				loading: "lazy",
				decoding: "async",
			},
			pictureAttributes: {}
		},
	});

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return all the tags used in a collection
	eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "nav", "post", "posts", "projects"].indexOf(tag) === -1);
	});

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary("md", mdLib => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1,2,3,4],
			slugify: eleventyConfig.getFilter("slugify")
		});
	});

	eleventyConfig.addShortcode("image", async function (src, alt, widths = [300, 600, 900], sizes = "(min-width: 60em) 900px, 100vw") {
		if (alt === undefined) {
			throw new Error(`Missing \`alt\` on image from: ${src}`);
		}

		// Resolve relative paths from the template file's directory
		const inputDir = path.dirname(this.page.inputPath);
		const resolvedSrc = src.startsWith("./") ? path.join(inputDir, src) : src;

		return Image(resolvedSrc, {
			widths,
			formats: ["avif", "webp", "jpeg"],
			returnType: "html",
			htmlOptions: {
				imgAttributes: {
					alt,
					sizes,
					loading: "lazy",
					decoding: "async",
					"eleventy:ignore": "",
				}
			}
		});
	});

	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if(data.draft) {
			return false;
		}
	});

	return {
		templateFormats: [
			"md",
			"njk",
			"html",
		],

		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",

		dir: {
			input: "content",         // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
			output: "_site"
		},

		pathPrefix: "/",
	};
};
