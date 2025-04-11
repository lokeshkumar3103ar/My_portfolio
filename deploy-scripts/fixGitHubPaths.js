// Script to ensure asset paths work correctly on GitHub Pages
import fs from 'fs';
import path from 'path';

// Get the build directory (dist)
const buildDir = path.resolve('dist');

// Function to fix paths in HTML and CSS files
function fixPaths(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      fixPaths(filePath);
    } else {
      // Fix paths in HTML files
      if (file.endsWith('.html')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove problematic script tag loading main.jsx directly
        content = content.replace(
          /<script type="module" src=["']\.?\/src\/main\.jsx["']><\/script>/g,
          ''
        );
        
        // Fix script module paths with more comprehensive patterns
        content = content.replace(
          /src="\/src\/main\.jsx"/g,
          'src="./assets/index.js"'
        );
        
        // Also catch variations of the main.jsx path that might be causing 404s
        content = content.replace(
          /src="src\/main\.jsx"/g,
          'src="./assets/index.js"'
        );
        
        // Handle favicon path first - explicitly set it to GitHub Pages path with relative path
        // Changed from absolute path to relative path to fix 404 errors
        content = content.replace(
          /<link[^>]*rel=["']icon["'][^>]*href=["'][^"']*["'][^>]*>/g,
          '<link rel="icon" type="image/svg+xml" href="./vite.svg" />'
        );
        
        // Fix all other absolute paths for assets
        content = content.replace(
          /src="\//g,
          'src="./'
        );
        
        // Fix asset paths that don't start with ./ or http
        content = content.replace(
          /src="(?!\.\/|http)([^"]*)"/g,
          'src="./$1"'
        );
        
        // Fix all absolute paths for href attributes, except for the favicon
        content = content.replace(
          /href="\/(?!vite\.svg)/g,
          'href="./'
        );
        
        // Fix href paths that don't start with ./, http, #
        content = content.replace(
          /href="(?!\.\/|http|#)([^"]*)"/g,
          'href="./$1"'
        );
        
        // Make sure paths starting with ./ don't get duplicated
        content = content.replace(
          /href="\.\/\.\//g,
          'href="./'
        );
        content = content.replace(
          /src="\.\/\.\//g,
          'src="./'
        );
        
        // Write the modified content back
        fs.writeFileSync(filePath, content);
        console.log(`Fixed paths in: ${filePath}`);
      }
      
      // Fix paths in CSS files
      if (file.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace absolute paths with relative paths
        content = content.replace(/url\(\s*\/(?!\/)/g, 'url(../');
        
        // Fix paths that don't start with anything
        content = content.replace(/url\(\s*(?!['"]?(?:https?:|data:|#|\.\/|\.\.\/|\/))(['"]?)([^'")]*)/g, 'url($1../$2');
        
        // Fix double-dot paths that might be generated incorrectly
        content = content.replace(/url\(\.\.\/\.\.\/\)/g, 'url(../)');
        
        // Write the modified content back
        fs.writeFileSync(filePath, content);
        console.log(`Fixed CSS paths in: ${filePath}`);
      }
      
      // Fix paths in JS files
      if (file.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Look for asset imports or fetch calls with absolute paths
        content = content.replace(/from "\//g, 'from "./');
        content = content.replace(/from '\//g, "from './");
        content = content.replace(/import "\//g, 'import "./');
        content = content.replace(/import '\//g, "import './");
        content = content.replace(/fetch\("\//g, 'fetch("./');
        content = content.replace(/fetch\('\//g, "fetch('./");
        
        // Fix image and other asset imports
        content = content.replace(/['"]\/assets\//g, '"./assets/');
        content = content.replace(/['"]\/images\//g, '"./images/');
        content = content.replace(/['"]\/src\//g, '"./');
        
        // Fix direct asset references not using relative paths
        content = content.replace(/['"](?!\.\/|http|\.\.\/|\/)(assets\/[^'"]*)['"]/g, '"./assets/$1"');
        
        // Write the modified content back
        fs.writeFileSync(filePath, content);
        console.log(`Fixed JS paths in: ${filePath}`);
      }
    }
  });
}

// Ensure the vite.svg file is correctly copied to the dist root AND to the right location
function copyViteSvgToRoot() {
  const destPath = path.join(buildDir, 'vite.svg');
  // Copy to dist root
  const sourcePath = path.join('public', 'vite.svg');
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log('Copied vite.svg from public to dist root');
    
    // Also ensure it exists in the /My_portfolio/ path structure
    const myPortfolioDir = path.join(buildDir, 'My_portfolio');
    if (!fs.existsSync(myPortfolioDir)) {
      fs.mkdirSync(myPortfolioDir, { recursive: true });
    }
    fs.copyFileSync(sourcePath, path.join(myPortfolioDir, 'vite.svg'));
    console.log('Copied vite.svg to My_portfolio/ directory');
  } else {
    console.warn('WARNING: vite.svg not found in public folder! Please add it there.');
  }
}

// Copy all public assets to dist root to ensure they're accessible
function copyPublicAssets() {
  const publicDir = path.join('public');
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    files.forEach(file => {
      const sourcePath = path.join(publicDir, file);
      const destPath = path.join(buildDir, file);
      
      if (fs.statSync(sourcePath).isFile() && !fs.existsSync(destPath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${file} from public to dist root`);
      }
    });
  }
}

// Create a better 404.html if needed
function ensure404Html() {
  const notFoundPath = path.join(buildDir, '404.html');
  if (!fs.existsSync(notFoundPath)) {
    const indexContent = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');
    fs.writeFileSync(notFoundPath, indexContent);
    console.log('Created 404.html from index.html');
  } else {
    // Make sure the existing 404.html has proper paths
    let content = fs.readFileSync(notFoundPath, 'utf8');
    content = content.replace(/src="\/src\/main\.jsx"/g, 'src="./assets/index.js"');
    fs.writeFileSync(notFoundPath, content);
    console.log('Updated paths in existing 404.html');
  }
}

console.log('Fixing asset paths for GitHub Pages deployment...');
fixPaths(buildDir);
copyViteSvgToRoot();
copyPublicAssets();
ensure404Html();
console.log('Path fixing complete!');