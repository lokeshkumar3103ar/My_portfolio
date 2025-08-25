# Frontend Performance & Bundle Analysis Notes

## Purpose
This guide covers essential tools and steps to analyze, optimize, and test your Vite/React project's bundle for best performance and resource efficiency.

---

## 1. Vite Bundle Visualizer (`rollup-plugin-visualizer`)

**Purpose:**
- Visualize your final JS bundle as a treemap.
- Identify large dependencies and code for optimization.

**Setup:**
1. Install the plugin:
   ```sh
   npm install --save-dev rollup-plugin-visualizer
   ```
2. Edit `vite.config.js`:
   ```js
   import { visualizer } from 'rollup-plugin-visualizer';
   export default {
     plugins: [
       // ...other plugins
       visualizer({ open: true }),
     ],
   };
   ```
3. Add script to `package.json`:
   ```json
   "scripts": {
     "analyze": "vite build"
   }
   ```
4. Run:
   ```sh
   npm run analyze
   ```
   The report opens in your browser after build.

**How to Test:**
- Look for large blocks (big dependencies/files).
- Consider code-splitting or lazy loading for heavy modules.
- Remove or refactor unused code.

---

## 2. Vite Plugin Inspect (`vite-plugin-inspect`)

**Purpose:**
- Debug Vite plugin transforms.
- See how your code is processed and bundled.

**Setup:**
1. Install:
   ```sh
   npm install vite-plugin-inspect --save-dev
   ```
2. Edit `vite.config.js`:
   ```js
   import Inspect from 'vite-plugin-inspect';
   export default {
     plugins: [
       // ...other plugins
       Inspect(),
     ],
   };
   ```
3. Start dev server:
   ```sh
   npm run dev
   ```
4. Visit `http://localhost:5173/__inspect/` (or your Vite port).

**How to Test:**
- Browse the inspect UI for plugin graphs and module info.
- Spot unnecessary transforms or large modules.

---

## 3. Source Map Explorer

**Purpose:**
- Visualize which files and dependencies are in your final JS bundle using source maps.

**Setup:**
1. Install:
   ```sh
   npm install --save-dev source-map-explorer
   ```
2. Enable source maps in `vite.config.js`:
   ```js
   export default {
     build: {
       sourcemap: true,
     },
   };
   ```
3. Build your app:
   ```sh
   npm run build
   ```
4. Run:
   ```sh
   npx source-map-explorer dist/assets/*.js
   ```
   This opens a visual breakdown of your bundle.

**How to Test:**
- Identify large or duplicate dependencies.
- Remove or optimize unused code/files.

---

## General Optimization Tips
- Remove unused npm packages and files.
- Optimize images (compress, use webp).
- Use code-splitting and lazy loading for heavy components.
- Minimize third-party dependencies.
- Test performance with Lighthouse or WebPageTest.

---

## References
- [Vite Docs: Visualizing Build](https://vitejs.dev/guide/build.html#visualizing-the-bundle)
- [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer)
- [vite-plugin-inspect](https://github.com/vitejs/vite-plugin-inspect)
- [source-map-explorer](https://www.npmjs.com/package/source-map-explorer)
