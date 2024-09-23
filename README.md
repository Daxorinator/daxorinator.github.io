# daxorinator.github.io / override.online

My blog and website, built with the [Eleventy](https://www.11ty.dev/) site generator.

## Features
* Ultra cool CSS powered by nes.css!
* Cutting edge 8-bit icons
* Almost 100% scores on PageSpeed Insights

## Getting Started
### 0. Why?
I certainly won't stop you - but why *are* you trying to set up my site locally?
I wouldn't call this an example of "good usage of 11ty".

### 1. Clone this Repository

```
git clone https://github.com/Daxorinator/daxorinator.github.io.git
```

### 2. Navigate to the directory

```
cd daxorinator.github.io
```

### 3. Install dependencies

```
npm install
```

### 4. Run Eleventy

Generate a production-ready build:

```
npx @11ty/eleventy
```

Or build and host locally on a local development server:

```
npx @11ty/eleventy --serve
```

### Implementation Notes

- `content/blog/` has my blog posts. They need the `post` tag to be included in the blog posts [collection](https://www.11ty.dev/docs/collections/).
- Content can be in _any template format_ (blog posts needn’t exclusively be markdown, for example). I use a mixture of Nunjucks and Markdown because Nunjucks is similar enough to Jinja2 and basically the same as Liquid.
- The `public` folder input directory will be copied to the output folder (via `addPassthroughCopy` in the `eleventy.config.js` file). This means `./public/css/*` will live at `./_site/css/*`, and other files such as my CV can be added to the `public` folder and used in links.
- This project uses three [Eleventy Layouts](https://www.11ty.dev/docs/layouts/):
	- `_includes/layouts/base.njk`: the top level HTML structure
	- `_includes/layouts/home.njk`: the home page template (wrapped into `base.njk`)
	- `_includes/layouts/post.njk`: the blog post template (wrapped into `base.njk`)
- `_includes/postslist.njk` is a Nunjucks include and is a reusable component used to display a list of all the posts.
- `_includes/projectslist.njk` is also a reuseable component and displays a list of all my projects using the projects collection.