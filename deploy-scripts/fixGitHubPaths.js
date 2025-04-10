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
      // Fix paths in HTML and CSS files
      if (file.endsWith('.html') || file.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace absolute paths (those starting with /) with relative paths
        // but avoid replacing URLs or paths that already include /portfolio/
        content = content.replace(/src="\//g, 'src="./');
        content = content.replace(/href="\//g, 'href="./');
        content = content.replace(/url\(\//g, 'url(./');
        
        // Write the modified content back
        fs.writeFileSync(filePath, content);
        console.log(`Fixed paths in: ${filePath}`);
      }
    }
  });
}

console.log('Fixing asset paths for GitHub Pages deployment...');
fixPaths(buildDir);
console.log('Path fixing complete!');