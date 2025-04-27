// Script to ensure asset paths work correctly on GitHub Pages
import fs from 'fs';
import path from 'path';

// Get the build directory (dist)
const buildDir = path.resolve('dist');

// Create a debug log file to track all path transformations
const debugLogPath = path.join(buildDir, 'debug-paths.log');
let debugLog = `GitHub Pages Path Fixing Debug Log - ${new Date().toISOString()}\n`;
debugLog += `====================================================\n\n`;

// Helper function to log debug information
function logDebug(message) {
  console.log(message);
  debugLog += `${message}\n`;
}

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
        const originalContent = content; // Store original for comparison
        
        // Remove any references to My_portfolio
        content = content.replace(/\.\/My_portfolio\//g, './');
        content = content.replace(/\/My_portfolio\//g, './');
        
        // Remove problematic script tag loading main.jsx directly
        content = content.replace(
          /<script type="module" src=["']\.?\/src\/main\.jsx["']><\/script>/g,
          ''
        );
        
        // Fix script module paths with more comprehensive patterns
        content = content.replace(
          /src=["'](?:\/|\.\/)?src\/main\.jsx["']/g,
          'src="./assets/main-DX4RbL6C.js"'
        );
        
        // Also catch variations of the main.jsx path that might be causing 404s
        content = content.replace(
          /src="src\/main\.jsx"/g,
          'src="./assets/main-DX4RbL6C.js"'
        );
        
        // Add additional pattern to catch the relative path pattern we're now using
        content = content.replace(
          /src="\.\/src\/main\.jsx"/g,
          'src="./assets/main-DX4RbL6C.js"'
        );
        
        // Handle favicon path - explicitly set it to relative path
        content = content.replace(
          /<link[^>]*rel=["']icon["'][^>]*href=["'][^"']*["'][^>]*>/g,
          '<link rel="icon" type="image/svg+xml" href="./vite.svg" />'
        );
        
        // Fix all absolute paths for assets
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
        
        // Fix asset references in script tags - specifically targeting common build patterns
        content = content.replace(
          /<script[^>]*src="(?!http|\.\/)(assets\/[^"]*\.js)"[^>]*><\/script>/g,
          '<script src="./$1"></script>'
        );
        
        // Fix links to CSS files
        content = content.replace(
          /<link[^>]*href="(?!http|\.\/)(assets\/[^"]*\.css)"[^>]*>/g,
          '<link rel="stylesheet" href="./$1">'
        );
        
        // Extract all resource paths for debugging
        if (content !== originalContent) {
          logDebug(`Fixed paths in: ${filePath}`);
          
          // Extract all src and href attributes for debugging
          const srcMatches = [...content.matchAll(/src=["']([^"']*)["']/g)];
          const hrefMatches = [...content.matchAll(/href=["']([^"']*)["']/g)];
          
          logDebug(`  Resources in ${path.basename(filePath)}:`);
          srcMatches.forEach(match => {
            logDebug(`    src: ${match[1]}`);
          });
          
          hrefMatches.forEach(match => {
            logDebug(`    href: ${match[1]}`);
          });
        }
        
        // Write the modified content back
        fs.writeFileSync(filePath, content);
      }
      
      // Fix paths in CSS files
      if (file.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content; // Store original for comparison
        
        // Remove any references to My_portfolio
        content = content.replace(/\.\/My_portfolio\//g, './');
        content = content.replace(/\/My_portfolio\//g, './');
        
        // Replace absolute paths with relative paths
        content = content.replace(/url\(\s*\/(?!\/)/g, 'url(../');
        
        // Fix paths that don't start with anything
        content = content.replace(/url\(\s*(?!['"]?(?:https?:|data:|#|\.\/|\.\.\/|\/))(['"]?)([^'")]*)/g, 'url($1../$2');
        
        // Fix double-dot paths that might be generated incorrectly
        content = content.replace(/url\(\.\.\/\.\.\/\)/g, 'url(../)');
        
        // Log extracted URLs for debugging
        if (content !== originalContent) {
          logDebug(`Fixed CSS paths in: ${filePath}`);
          
          // Extract all url() references for debugging
          const urlMatches = [...content.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)];
          logDebug(`  CSS Resources in ${path.basename(filePath)}:`);
          urlMatches.forEach(match => {
            logDebug(`    url: ${match[1]}`);
          });
        }
        
        // Write the modified content back
        fs.writeFileSync(filePath, content);
      }
      
      // Fix paths in JS files
      if (file.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content; // Store original for comparison
        
        // Remove any references to My_portfolio
        content = content.replace(/\.\/My_portfolio\//g, './');
        content = content.replace(/\/My_portfolio\//g, './');
        
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

        // Fix resume.pdf path in JS files
        content = content.replace(/['"]\/resume\.pdf['"]/g, '"./resume.pdf"');

        // Fix texture file paths in vendor JS (likely Three.js)
        if (file.includes('vendor') && file.endsWith('.js')) {
          const texturePaths = ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'];
          texturePaths.forEach(texturePath => {
            content = content.replace(
              new RegExp(`['"]${texturePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g'),
              '"./textures' + texturePath + '"'
            );
          });
        }

        // Fix service worker path - remove My_portfolio references
        content = content.replace(/['"]\/My_portfolio\/sw\.js['"]/g, '"./sw.js"');

        // Additional fix for service workers and manifest
        content = content.replace(/"\/manifest.webmanifest"/g, '"./manifest.webmanifest"');
        content = content.replace(/"\/sw.js"/g, '"./sw.js"');
        
        // Log important paths for debugging
        if (content !== originalContent) {
          logDebug(`Fixed JS paths in: ${filePath}`);
          
          // Extract potential asset paths for debugging (basic heuristic)
          const assetMatches = [
            ...content.matchAll(/["'](\.\/[^"']*\.(png|jpg|jpeg|svg|webp|gif))["']/g),
            ...content.matchAll(/["'](\.\/assets\/[^"']*)["']/g),
            ...content.matchAll(/["'](\.\/images\/[^"']*)["']/g),
            ...content.matchAll(/fetch\(["']([^"']*)["']/g)
          ];
          
          if (assetMatches.length > 0) {
            logDebug(`  JS Resources in ${path.basename(filePath)}:`);
            assetMatches.forEach(match => {
              logDebug(`    resource: ${match[1]}`);
            });
          }
        }
        
        // Write the modified content back
        fs.writeFileSync(filePath, content);
      }
    }
  });
}

// Fix problematic reference to main.jsx in index.html to use properly built module
function fixJSXReference() {
  const indexPath = path.join(buildDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Find the actual bundled main JS file in the assets directory
    const assetsDir = path.join(buildDir, 'assets');
    let mainJsFile = '';
    
    if (fs.existsSync(assetsDir)) {
      const assetFiles = fs.readdirSync(assetsDir);
      // Look for files that might be the main bundle (main-*.js)
      const mainBundle = assetFiles.find(file => 
        file.startsWith('main-') && file.endsWith('.js')
      );
      
      if (mainBundle) {
        mainJsFile = mainBundle;
        logDebug(`Found main bundle file: ${mainBundle}`);
      } else {
        // Fallback to any index-*.js file if main-*.js wasn't found
        const indexBundle = assetFiles.find(file => 
          file.startsWith('index-') && file.endsWith('.js')
        );
        if (indexBundle) {
          mainJsFile = indexBundle;
          logDebug(`Found index bundle file: ${indexBundle}`);
        }
      }
    }
    
    if (mainJsFile) {
      // Replace any direct references to main.jsx with the proper bundled file
      content = content.replace(
        /<script[^>]*src=["'](?:\.\/)?(?:src\/)?main\.jsx["'][^>]*>/g,
        `<script type="module" src="./assets/${mainJsFile}"></script>`
      );
      
      // Remove any references to My_portfolio
      content = content.replace(/\.\/My_portfolio\//g, './');
      
      fs.writeFileSync(indexPath, content);
      logDebug(`Fixed JSX MIME type issue by replacing main.jsx reference with ${mainJsFile}`);
    }
  }
}

// Ensure the vite.svg file is correctly copied to the dist root
function copyViteSvgToRoot() {
  const destPath = path.join(buildDir, 'vite.svg');
  // Copy to dist root
  const sourcePath = path.join('public', 'vite.svg');
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    logDebug('Copied vite.svg from public to dist root');
  } else {
    logDebug('WARNING: vite.svg not found in public folder! Please add it there.');
  }
}

// Copy all public assets to dist root to ensure they're accessible
function copyPublicAssets() {
  const publicDir = path.join('public');
  if (fs.existsSync(publicDir)) {
    // Make sure the images directory exists in dist
    const imagesDir = path.join(buildDir, 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Create textures directory for Three.js cubemap textures
    const texturesDir = path.join(buildDir, 'textures');
    if (!fs.existsSync(texturesDir)) {
      fs.mkdirSync(texturesDir, { recursive: true });
    }
    
    // Copy image files from public/images to dist/images
    const publicImagesDir = path.join(publicDir, 'images');
    if (fs.existsSync(publicImagesDir)) {
      const imageFiles = fs.readdirSync(publicImagesDir);
      imageFiles.forEach(file => {
        if (file.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
          const src = path.join(publicImagesDir, file);
          const dest = path.join(imagesDir, file);
          fs.copyFileSync(src, dest);
          logDebug(`Copied images/${file} to dist/images/`);
        }
      });
    }
    
    // Copy other important files from public to dist root
    const importantFiles = ['manifest.json', 'manifest.webmanifest', 'resume.pdf', '404.html'];
    importantFiles.forEach(file => {
      const src = path.join(publicDir, file);
      if (fs.existsSync(src)) {
        const dest = path.join(buildDir, file);
        fs.copyFileSync(src, dest);
        logDebug(`Copied ${file} to dist root`);
      }
    });
  }
  
  // Ensure manifest.webmanifest is accessible
  const manifestSrc = path.join('public', 'manifest.webmanifest');
  const manifestDest = path.join(buildDir, 'manifest.webmanifest');
  
  if (fs.existsSync(manifestSrc)) {
    fs.copyFileSync(manifestSrc, manifestDest);
    logDebug('Copied manifest.webmanifest to dist root');
  }
  
  // Ensure registerSW.js exists and has correct paths
  const swSrc = findFilesByExt(buildDir, 'registerSW.js')[0];
  if (swSrc) {
    let swContent = fs.readFileSync(swSrc, 'utf8');
    swContent = swContent.replace(
      /['"]\/manifest\.webmanifest['"]/g, 
      '"./manifest.webmanifest"'
    );
    // Remove My_portfolio references
    swContent = swContent.replace(/\.\/My_portfolio\//g, './');
    swContent = swContent.replace(/\/My_portfolio\//g, './');
    
    fs.writeFileSync(swSrc, swContent);
    logDebug('Updated paths in registerSW.js');
  }
}

// Create a better 404.html if needed
function ensure404Html() {
  const notFoundPath = path.join(buildDir, '404.html');
  if (!fs.existsSync(notFoundPath)) {
    const indexContent = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');
    fs.writeFileSync(notFoundPath, indexContent);
    logDebug('Created 404.html from index.html');
  } else {
    // Make sure the existing 404.html has proper paths
    let content = fs.readFileSync(notFoundPath, 'utf8');
    content = content.replace(/src="\/src\/main\.jsx"/g, 'src="./assets/main-DX4RbL6C.js"');
    // Remove My_portfolio references
    content = content.replace(/\.\/My_portfolio\//g, './');
    content = content.replace(/\/My_portfolio\//g, './');
    fs.writeFileSync(notFoundPath, content);
    logDebug('Updated paths in existing 404.html');
  }
}

// Function to create a simple HTML page to view the debug log
function createDebugViewer() {
  const viewerPath = path.join(buildDir, 'path-debug.html');
  const viewerContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Path Debug Log</title>
  <style>
    body { font-family: monospace; background: #f3f3f3; padding: 20px; }
    pre { background: #fff; padding: 15px; border: 1px solid #ddd; overflow-x: auto; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>Portfolio Deployment Path Debug Log</h1>
  <p>This file shows all path transformations applied during deployment.</p>
  <pre id="log-content"></pre>
  
  <script>
    fetch('./debug-paths.log')
      .then(response => response.text())
      .then(text => {
        document.getElementById('log-content').textContent = text;
      })
      .catch(err => {
        document.getElementById('log-content').textContent = 'Error loading log: ' + err.message;
      });
  </script>
</body>
</html>
  `;
  
  fs.writeFileSync(viewerPath, viewerContent);
  logDebug('Created path-debug.html viewer');
}

// Add function to scan the built files for potential 404 issues
function scanForPotential404Issues() {
  logDebug('\n=== POTENTIAL 404 ISSUE SCAN ===\n');
  
  // Check for common problematic patterns in JS files
  const jsFiles = findFilesByExt(buildDir, '.js');
  jsFiles.forEach(jsFile => {
    const content = fs.readFileSync(jsFile, 'utf8');
    
    // Check for absolute paths without dot prefix
    const absolutePaths = [...content.matchAll(/["'](\/[^"']*\.[a-z]{2,4})["']/gi)];
    if (absolutePaths.length > 0) {
      logDebug(`POTENTIAL ISSUE in ${path.relative(buildDir, jsFile)}:`);
      absolutePaths.forEach(match => {
        logDebug(`  Absolute path that might 404: ${match[1]}`);
      });
    }
    
    // Check specifically for My_portfolio references
    const portfolioRefs = [...content.matchAll(/["'](\.\/My_portfolio\/[^"']*)["']/gi)];
    if (portfolioRefs.length > 0) {
      logDebug(`FOUND MY_PORTFOLIO REFS in ${path.relative(buildDir, jsFile)}:`);
      portfolioRefs.forEach(match => {
        logDebug(`  My_portfolio reference that might cause 404: ${match[1]}`);
      });
    }
  });
  
  // Check HTML files for potential issues
  const htmlFiles = findFilesByExt(buildDir, '.html');
  htmlFiles.forEach(htmlFile => {
    const content = fs.readFileSync(htmlFile, 'utf8');
    
    // Check specifically for My_portfolio references in HTML
    const portfolioRefs = [...content.matchAll(/["'](\.\/My_portfolio\/[^"']*)["']/gi)];
    if (portfolioRefs.length > 0) {
      logDebug(`FOUND MY_PORTFOLIO REFS in ${path.relative(buildDir, htmlFile)}:`);
      portfolioRefs.forEach(match => {
        logDebug(`  My_portfolio reference that might cause 404: ${match[1]}`);
      });
    }
  });
  
  logDebug('\n=== END OF 404 ISSUE SCAN ===\n');
}

// Helper to find files by extension
function findFilesByExt(directory, extension) {
  let results = [];
  
  const items = fs.readdirSync(directory);
  items.forEach(item => {
    const itemPath = path.join(directory, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      results = results.concat(findFilesByExt(itemPath, extension));
    } else if (item.endsWith(extension)) {
      results.push(itemPath);
    }
  });
  
  return results;
}

// Main execution
logDebug('Fixing asset paths for GitHub Pages deployment...');
fixPaths(buildDir);
fixJSXReference();
copyViteSvgToRoot();
copyPublicAssets();
ensure404Html();
scanForPotential404Issues();

// Write debug log to file
fs.writeFileSync(debugLogPath, debugLog);
createDebugViewer();

logDebug('Path fixing complete! Debug log written to dist/debug-paths.log');
logDebug('You can view the debug log at your-site-url/path-debug.html after deployment');