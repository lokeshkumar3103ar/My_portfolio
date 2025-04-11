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
        
        // Add additional pattern to catch the relative path pattern we're now using
        content = content.replace(
          /src="\.\/src\/main\.jsx"/g,
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
        
        // Explicitly fix paths for known asset files that are having 404 issues
        [
          'vendor-DVYjdY2Z.js', 
          'main-z-9BK3RT.js', 
          'three-DzGSvVpd.js', 
          'main-D8S90uDa.css',
          'animations-23e4F__N.js',
          'registerSW.js'
        ].forEach(filename => {
          const filenameRegex = new RegExp(`(src|href)="/?${filename.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}"`, 'g');
          content = content.replace(filenameRegex, `$1="./assets/${filename}"`);
        });
        
        // Fix manifest path
        content = content.replace(
          /href="(\/)?manifest\.webmanifest"/g,
          'href="./manifest.webmanifest"'
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

        // Fix service worker path
        if (file.includes('registerSW.js')) {
          content = content.replace(/['"]\/My_portfolio\/sw\.js['"]/g, '"./sw.js"');
        }

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
      fs.writeFileSync(indexPath, content);
      logDebug(`Fixed JSX MIME type issue by replacing main.jsx reference with ${mainJsFile}`);
    } else {
      // If we couldn't find the exact bundle file, use a generic pattern
      content = content.replace(
        /<script[^>]*src=["'](?:\.\/)?(?:src\/)?main\.jsx["'][^>]*>/g,
        '<script type="module" src="./assets/main-z-9BK3RT.js"></script>'
      );
      fs.writeFileSync(indexPath, content);
      logDebug('Fixed JSX MIME type issue using known main bundle name');
    }
  }
}

// Ensure the vite.svg file is correctly copied to the dist root AND to the right location
function copyViteSvgToRoot() {
  const destPath = path.join(buildDir, 'vite.svg');
  // Copy to dist root
  const sourcePath = path.join('public', 'vite.svg');
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    logDebug('Copied vite.svg from public to dist root');
    
    // Also ensure it exists in the /My_portfolio/ path structure
    const myPortfolioDir = path.join(buildDir, 'My_portfolio');
    if (!fs.existsSync(myPortfolioDir)) {
      fs.mkdirSync(myPortfolioDir, { recursive: true });
    }
    fs.copyFileSync(sourcePath, path.join(myPortfolioDir, 'vite.svg'));
    logDebug('Copied vite.svg to My_portfolio/ directory');
  } else {
    logDebug('WARNING: vite.svg not found in public folder! Please add it there.');
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
        logDebug(`Copied ${file} from public to dist root`);
      } else if (fs.statSync(sourcePath).isDirectory()) {
        // Special handling for directories like 'images'
        const dirName = file;
        const destDirPath = path.join(buildDir, dirName);
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(destDirPath)) {
          fs.mkdirSync(destDirPath, { recursive: true });
          logDebug(`Created directory ${dirName} in dist root`);
        }
        
        // Copy all files from the directory
        const dirFiles = fs.readdirSync(sourcePath);
        dirFiles.forEach(dirFile => {
          const dirFileSrcPath = path.join(sourcePath, dirFile);
          const dirFileDestPath = path.join(destDirPath, dirFile);
          
          if (fs.statSync(dirFileSrcPath).isFile()) {
            fs.copyFileSync(dirFileSrcPath, dirFileDestPath);
            logDebug(`Copied ${dirName}/${dirFile} to dist/${dirName}/`);
          }
        });
      }
    });
  }
  
  // Ensure manifest.webmanifest is accessible
  const manifestSrc = path.join('public', 'manifest.webmanifest');
  const manifestDest = path.join(buildDir, 'manifest.webmanifest');
  
  if (fs.existsSync(manifestSrc)) {
    fs.copyFileSync(manifestSrc, manifestDest);
    logDebug('Copied manifest.webmanifest to dist root');
  } else {
    // Create a basic manifest if it doesn't exist
    const basicManifest = {
      "name": "Portfolio",
      "short_name": "Portfolio",
      "start_url": "./",
      "display": "standalone",
      "background_color": "#ffffff",
      "theme_color": "#000000",
      "icons": []
    };
    fs.writeFileSync(manifestDest, JSON.stringify(basicManifest, null, 2));
    logDebug('Created basic manifest.webmanifest in dist root');
  }
  
  // Ensure registerSW.js exists and has correct paths
  const swSrc = findFilesByExt(buildDir, 'registerSW.js')[0];
  if (swSrc) {
    let swContent = fs.readFileSync(swSrc, 'utf8');
    swContent = swContent.replace(
      /['"]\/manifest\.webmanifest['"]/g, 
      '"./manifest.webmanifest"'
    );
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
    content = content.replace(/src="\/src\/main\.jsx"/g, 'src="./assets/index.js"');
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
    
    // Check for potential imports that might fail
    const imports = [...content.matchAll(/import\s+.*?from\s+["']([^"']*)["']/g)];
    imports.forEach(match => {
      const importPath = match[1];
      if (!importPath.startsWith('./') && !importPath.startsWith('../') && !importPath.includes(':')) {
        logDebug(`  Potential problematic import: ${importPath}`);
      }
    });
  });
  
  // Check HTML files for potential issues
  const htmlFiles = findFilesByExt(buildDir, '.html');
  htmlFiles.forEach(htmlFile => {
    const content = fs.readFileSync(htmlFile, 'utf8');
    
    // Check for script or link tags with potential issues
    const scriptTags = [...content.matchAll(/<script[^>]*src=["']([^"']*)["'][^>]*>/g)];
    scriptTags.forEach(match => {
      const src = match[1];
      if (src.startsWith('/') || (!src.startsWith('./') && !src.startsWith('http') && !src.includes(':') && src !== '')) {
        logDebug(`POTENTIAL ISSUE in ${path.relative(buildDir, htmlFile)}:`);
        logDebug(`  Script src might 404: ${src}`);
      }
    });
    
    const linkTags = [...content.matchAll(/<link[^>]*href=["']([^"']*)["'][^>]*>/g)];
    linkTags.forEach(match => {
      const href = match[1];
      if (href.startsWith('/') || (!href.startsWith('./') && !href.startsWith('http') && !href.includes(':') && !href.startsWith('#'))) {
        logDebug(`POTENTIAL ISSUE in ${path.relative(buildDir, htmlFile)}:`);
        logDebug(`  Link href might 404: ${href}`);
      }
    });
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
fixJSXReference(); // Add this line to call the new function
copyViteSvgToRoot();
copyPublicAssets();
ensure404Html();
scanForPotential404Issues();

// Write debug log to file
fs.writeFileSync(debugLogPath, debugLog);
createDebugViewer();

logDebug('Path fixing complete! Debug log written to dist/debug-paths.log');
logDebug('You can view the debug log at your-site-url/path-debug.html after deployment');