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
        
        // Fix script module paths - both in src and href attributes
        content = content.replace(
          /src="\/src\/main.jsx"/g,
          'src="./assets/index.js"'
        );
        
        content = content.replace(
          /src="\/assets\//g,
          'src="./assets/'
        );
        
        // Fix all absolute paths for href attributes 
        content = content.replace(
          /href="\//g,
          'href="./'
        );
        
        // Make sure paths starting with ./ don't get duplicated
        content = content.replace(
          /href="\.\/\.\//g,
          'href="./'
        );
        
        // Write the modified content back
        fs.writeFileSync(filePath, content);
        console.log(`Fixed paths in: ${filePath}`);
      }
      
      // Fix paths in CSS files
      if (file.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace absolute paths with relative paths
        content = content.replace(/url\(\//g, 'url(../');
        
        // Fix double-dot paths that might be generated incorrectly
        content = content.replace(/url\(\.\.\/\.\.\/\)/g, 'url(../)')
        
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
        content = content.replace(/fetch\("\//g, 'fetch("./');
        content = content.replace(/fetch\('\//g, "fetch('./");
        
        // Write the modified content back
        fs.writeFileSync(filePath, content);
        console.log(`Fixed JS paths in: ${filePath}`);
      }
    }
  });
}

// Ensure the vite.svg file is correctly copied to the dist root
function copyViteSvgToRoot() {
  const sourcePath = path.join(buildDir, 'vite.svg');
  // If vite.svg isn't in the dist root, try to find it in the public folder
  if (!fs.existsSync(sourcePath)) {
    const publicPath = path.resolve('public', 'vite.svg');
    if (fs.existsSync(publicPath)) {
      fs.copyFileSync(publicPath, path.join(buildDir, 'vite.svg'));
      console.log('Copied vite.svg from public to dist root');
    }
  }
}

// Create a better 404.html if needed
function ensure404Html() {
  const notFoundPath = path.join(buildDir, '404.html');
  if (!fs.existsSync(notFoundPath)) {
    const indexContent = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');
    fs.writeFileSync(notFoundPath, indexContent);
    console.log('Created 404.html from index.html');
  }
}

console.log('Fixing asset paths for GitHub Pages deployment...');
fixPaths(buildDir);
copyViteSvgToRoot();
ensure404Html();
console.log('Path fixing complete!');