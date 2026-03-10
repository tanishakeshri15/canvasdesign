# 🎨 Mini Design Canvas Editor

A simplified Figma-like design canvas built with React + Vite.

## Features

- **Canvas workspace** with subtle grid background (900×600)
- **Add elements**: Rectangle, Text, Image placeholder
- **Drag to move** — stays within canvas bounds
- **Resize** with 8 corner/edge handles
- **Layer panel** on the left — shows all elements, click to select, click trash to delete
- **Properties panel** on the right — edit position, size, fill color, stroke, corner radius, font size
- **Snap-to-grid** toggle (10px grid)
- **Context menu** (right-click) — duplicate, bring to front, send to back, delete
- **Keyboard shortcuts**:
  - `Delete` / `Backspace` — delete selected element
  - `Ctrl+D` / `⌘D` — duplicate selected element
  - `Escape` — deselect
  - Arrow keys — nudge (Shift+Arrow = 10px)
- **Export** button (PNG via html2canvas CDN)
- **Toast notifications** for actions

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## Project Structure

```
/src
  /components
    Canvas.jsx         — Canvas frame + element rendering loop
    Element.jsx        — Individual element (drag, resize, selection handles)
    Toolbar.jsx        — Top toolbar add buttons
    LayersPanel.jsx    — Left panel layer list
    PropertiesPanel.jsx — Right panel property inputs
  /styles
    globals.css        — CSS variables, resets
    canvas.css         — All component styles
  App.jsx              — State management, keyboard shortcuts, layout
  main.jsx             — React entry point
/public
  icon.svg
index.html
vite.config.js
package.json
```

---

## Deploy to Vercel

1. Push the project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Framework preset: **Vite** (auto-detected)
5. Click **Deploy** — done!

Or via CLI:
```bash
npm i -g vercel
vercel
```

## Deploy to Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy site**

Or drag-and-drop the `dist/` folder on netlify.com/drop after running `npm run build`.

---

## Tech Stack

- [React 18](https://react.dev)
- [Vite 5](https://vitejs.dev)
- Pure CSS (no UI libraries)
- Google Fonts: DM Sans + DM Mono
