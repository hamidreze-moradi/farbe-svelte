![Farbe.film YouTube Thumbnail](https://images.prismic.io/prismic-main/aN0wJJ5xUNkB1XnE_farbe-course.png?auto=format,compress)

# 🎨 Farbe – SvelteKit 3D eCommerce website

A **SvelteKit** website integrated with **Prismic CMS**, inspired by the official Nuxt starter template:

> Inspired by:
> [https://github.com/prismicio-community/nuxt-starter-prismic-farbe](https://github.com/prismicio-community/nuxt-starter-prismic-farbe)

This project demonstrates how to build a content-driven website using **SvelteKit** while managing all content through **Prismic**.

---

## ✨ Features

- ⚡ Built with **SvelteKit**
- 🧠 Headless CMS using **Prismic**
- 🧩 Dynamic pages powered by Prismic UIDs
- 🔍 Preview mode support
- 🏗 Clean and scalable project structure
- 🚀 Ready for production deployment

---

## 🛠 Tech Stack

| Category         | Technology                     |
| ---------------- | ------------------------------ |
| Framework        | SvelteKit                      |
| CMS              | [Prismic](https://prismic.io/) |
| Build Tool       | Vite                           |
| Language         | TypeScript / JavaScript        |
| Package Manager  | pnpm / npm                     |
| Content Modeling | Prismic Slice Machine          |

---

## 📁 Project Structure

```
farbe-svelte/
├─ customtypes/                # Prismic custom content models
├─ src/
│   ├─ lib/
│   │   └─ prismicio.ts        # Prismic client configuration
│   ├─ routes/
│   │   ├─ +layout.svelte      # Global layout
│   │   ├─ [[preview=preview]]/
│   │   │   └─ +page.svelte    # Homepage with preview support
│   │   └─ [uid]/+page.svelte  # Dynamic pages (UID-based)
│   └─ app.html                # Base HTML template
├─ static/                     # Static assets
├─ slicemachine.config.json    # Prismic Slice Machine config
├─ svelte.config.js
├─ vite.config.ts
├─ package.json
└─ README.md
```

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

Using **pnpm** (recommended):

```bash
pnpm install
```

Or with npm:

```bash
npm install
```

---

### 2️⃣ Run development server

```bash
pnpm dev
# or
npm run dev
```

The site will be available at:

```
http://localhost:5173
```

---

### 3️⃣ Build for production

```bash
pnpm build
# or
npm run build
```

---

## 🧠 Prismic Integration

This project uses **Prismic** as a headless CMS.

- Content is created and managed in the Prismic dashboard
- Pages fetch content using `@prismicio/client`
- Rendering helpers come from `@prismicio/svelte`
- Preview mode is supported via route parameters

### Key configuration file:

```ts
src / lib / prismicio.ts;
```

This file initializes and exports the Prismic client used across the app.

---

## 📄 Routing & Pages

SvelteKit routing is filesystem-based:

| Route                 | Description                  |
| --------------------- | ---------------------------- |
| `/`                   | Homepage (Prismic document)  |
| `/[uid]`              | Dynamic pages fetched by UID |
| `[[preview=preview]]` | Enables Prismic preview mode |

This allows creating unlimited pages directly from Prismic without manual route definitions.

---

## 🧩 Slice Machine

The `customtypes/` directory contains Prismic content models.

Slice Machine enables:

- Modular content blocks
- Flexible page layouts
- Easy collaboration between developers and content editors

---

## 📝 Inspiration & Credits

This project is inspired by the official Nuxt + Prismic Farbe starter:

🔗 [https://github.com/prismicio-community/nuxt-starter-prismic-farbe](https://github.com/prismicio-community/nuxt-starter-prismic-farbe)

The goal of this repository is to provide a **SvelteKit equivalent** of that architecture and workflow.

---

## 📌 Notes & Recommendations

- Add environment variables for Prismic repository & access tokens
- Extend slices for more dynamic layouts
- Deploy easily on Vercel, Netlify, or similar platforms
- Consider adding SEO metadata per page via Prismic

---

## 📜 License

This project is open-source and intended for educational and experimental use.
