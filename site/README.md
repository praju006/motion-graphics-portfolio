# Prajwal M — Motion Graphics Portfolio (Part 1: Hero + final.mp4 projects)

## Run it
Needs a local server (browsers block 3D textures from file://).
- Easiest: VS Code → install "Live Server" → right-click index.html → Open with Live Server
- Or: open a terminal in this folder and run  `npx serve`  (or  `python -m http.server 8000` → http://localhost:8000)

## Add your projects  (projects.js)
Put videos in assets/projects/ and edit the list:
  { title: "My Reel", tag: "Motion Graphics", year: "2026", video: "assets/projects/my-reel.mp4" }
Leave video: "" to keep the animated placeholder. Add or remove items freely — the arc adapts.

## Tweak
- Email: projects.js → SITE.email
- Colors: style.css → :root variables
- Orbiting logos: main.js → `logos` array (Ae, Pr, Claude)
- 3D depth strength: main.js → `amt:{value:.95}`
- Head image: replace assets/head.png (transparent PNG) and assets/depth.png (white = closer)

## Deploy
Drag the whole folder onto Netlify Drop / Vercel / GitHub Pages.
