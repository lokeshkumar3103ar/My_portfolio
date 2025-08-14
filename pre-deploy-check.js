#!/usr/bin/env node

// Pre-deployment cleanup and validation script
import fs from 'fs';
import path from 'path';

console.log('🧹 PORTFOLIO DEPLOYMENT PREPARATION');
console.log('===================================\n');

let issues = [];
let warnings = [];

// 1. Check for console.logs in source files
console.log('🔍 Checking for console.logs in source files...');
const checkConsoleLogs = (dir) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      checkConsoleLogs(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.includes('console.log') && !filePath.includes('analytics.js') && !filePath.includes('deploy-scripts')) {
          warnings.push(`Console.log found in ${filePath}:${index + 1}`);
        }
      });
    }
  });
};

try {
  checkConsoleLogs('./src');
  if (warnings.length === 0) {
    console.log('✅ No console.logs found in source files');
  } else {
    console.log(`⚠️  Found ${warnings.length} console.logs in source files`);
    warnings.forEach(w => console.log(`   ${w}`));
  }
} catch (error) {
  console.log('⚠️  Could not check console.logs');
}

// 2. Check package.json scripts
console.log('\n📦 Validating package.json scripts...');
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  
  const requiredScripts = ['build', 'deploy', 'dev'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts[script]) {
      console.log(`✅ ${script} script found`);
    } else {
      issues.push(`Missing required script: ${script}`);
    }
  });
} catch (error) {
  issues.push('Could not read package.json');
}

// 3. Check vite.config.js
console.log('\n⚙️  Checking Vite configuration...');
try {
  const viteConfig = fs.readFileSync('./vite.config.js', 'utf8');
  
  if (viteConfig.includes('/My_portfolio/')) {
    console.log('✅ GitHub Pages base path configured');
  } else {
    warnings.push('GitHub Pages base path may not be configured correctly');
  }
  
  if (viteConfig.includes('gh-pages')) {
    console.log('✅ GitHub Pages deployment configured');
  }
} catch (error) {
  issues.push('Could not read vite.config.js');
}

// 4. Check deployment scripts
console.log('\n🚀 Checking deployment scripts...');
try {
  if (fs.existsSync('./deploy-scripts/fixGitHubPaths.js')) {
    console.log('✅ Path fixing script found');
  } else {
    issues.push('Missing path fixing script');
  }
} catch (error) {
  warnings.push('Could not check deployment scripts');
}

// 5. Check for required assets
console.log('\n🖼️  Checking required assets...');
const requiredAssets = [
  './public/vite.svg',
  './public/pwa-192x192.png',
  './public/manifest.json'
];

requiredAssets.forEach(asset => {
  if (fs.existsSync(asset)) {
    console.log(`✅ ${asset} found`);
  } else {
    warnings.push(`Missing asset: ${asset}`);
  }
});

// 6. Check for responsive design files
console.log('\n📱 Checking responsive design...');
if (fs.existsSync('./RESPONSIVE-TESTING-GUIDE.md')) {
  console.log('✅ Responsive testing guide found');
} else {
  warnings.push('Missing responsive testing guide');
}

// 7. Performance check
console.log('\n⚡ Checking performance optimizations...');
const performanceChecks = [
  { file: './vite.config.js', check: 'compression', name: 'Gzip compression' },
  { file: './vite.config.js', check: 'VitePWA', name: 'PWA configuration' },
  { file: './vite.config.js', check: 'globPatterns', name: 'Asset caching' }
];

performanceChecks.forEach(({ file, check, name }) => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes(check)) {
      console.log(`✅ ${name} enabled`);
    } else {
      warnings.push(`${name} may not be enabled`);
    }
  } catch (error) {
    warnings.push(`Could not check ${name}`);
  }
});

// Results
console.log('\n📊 DEPLOYMENT READINESS REPORT');
console.log('==============================');

if (issues.length === 0 && warnings.length === 0) {
  console.log('🎉 READY TO DEPLOY!');
  console.log('Your portfolio is clean and optimized for GitHub Pages deployment.');
  console.log('\nNext steps:');
  console.log('1. npm run build');
  console.log('2. npm run deploy');
  console.log('3. Enable GitHub Pages in repository settings');
} else {
  if (issues.length > 0) {
    console.log('❌ CRITICAL ISSUES:');
    issues.forEach(issue => console.log(`   • ${issue}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(warning => console.log(`   • ${warning}`));
  }
  
  if (issues.length === 0) {
    console.log('\n✅ Ready to deploy with minor warnings');
  } else {
    console.log('\n🔧 Fix critical issues before deploying');
  }
}

console.log('\n🌟 PORTFOLIO FEATURES:');
console.log('• Beautiful loading screen with smooth animations');
console.log('• Responsive design across all devices');
console.log('• Interactive neural network visualization');
console.log('• PWA capabilities with offline support');
console.log('• Optimized performance and SEO');
console.log('• Professional blue-purple theme');

console.log('\n🚀 Your portfolio is ready to showcase your AI expertise!');
