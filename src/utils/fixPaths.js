/**
 * Utility functions to fix paths for GitHub Pages deployment
 */

/**
 * Fixes JSX MIME type references in HTML files
 * @param {string} htmlContent - The HTML content to fix
 * @returns {string} - Fixed HTML content
 */
export const fixJSXReference = (htmlContent) => {
  // Fix JSX MIME type references
  const fixed = htmlContent.replace(
    /<script type="module" crossorigin src="\/assets\//g,
    '<script type="module" crossorigin src="./assets/'
  );
  
  // Fix CSS references
  return fixed.replace(
    /<link rel="stylesheet" href="\/assets\//g,
    '<link rel="stylesheet" href="./assets/'
  );
};

/**
 * Fixes asset paths in CSS or other files
 * @param {string} content - The content to fix
 * @returns {string} - Fixed content
 */
export const fixAssetPaths = (content) => {
  return content.replace(/url\(\//g, 'url(./');
};

/**
 * Ensures manifest.json is properly referenced
 * @param {string} htmlContent - The HTML content to fix
 * @returns {string} - Fixed HTML content
 */
export const fixManifestReference = (htmlContent) => {
  return htmlContent.replace(
    /<link rel="manifest" href="\/manifest.json">/,
    '<link rel="manifest" href="./manifest.json">'
  );
};
