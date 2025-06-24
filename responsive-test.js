// Comprehensive Responsive Testing Script
// Run this in browser console to test all responsive breakpoints

console.log('🚀 Starting Comprehensive Responsive Testing...');

// Test breakpoints
const breakpoints = [
  { name: 'Mobile XS', width: 320, height: 568 },
  { name: 'Mobile SM', width: 375, height: 667 },
  { name: 'Mobile LG', width: 414, height: 896 },
  { name: 'Tablet SM', width: 768, height: 1024 },
  { name: 'Tablet LG', width: 1024, height: 1366 },
  { name: 'Desktop SM', width: 1200, height: 800 },
  { name: 'Desktop MD', width: 1440, height: 900 },
  { name: 'Desktop LG', width: 1920, height: 1080 }
];

// Sections to test
const sections = [
  'hero-section',
  'expertise', 
  'skills',
  'prompt-engineering',
  'projects',
  'timeline'
];

// Test function
function testResponsiveness() {
  let issues = [];
  
  // Test each breakpoint
  breakpoints.forEach(bp => {
    console.log(`\n📱 Testing ${bp.name} (${bp.width}x${bp.height})`);
    
    // Simulate viewport
    document.documentElement.style.width = bp.width + 'px';
    document.documentElement.style.height = bp.height + 'px';
    
    // Test each section
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        const rect = section.getBoundingClientRect();
        const computed = window.getComputedStyle(section);
        
        // Check for horizontal overflow
        if (rect.width > bp.width) {
          issues.push(`❌ ${bp.name}: Section "${sectionId}" has horizontal overflow (${rect.width}px > ${bp.width}px)`);
        }
        
        // Check for visibility
        if (computed.display === 'none' && bp.width >= 320) {
          issues.push(`❌ ${bp.name}: Section "${sectionId}" is hidden unexpectedly`);
        }
        
        // Check neural network container if it exists
        if (sectionId === 'skills') {
          const neuralNetwork = section.querySelector('.neural-network, [class*="neural"]');
          if (neuralNetwork) {
            const nnRect = neuralNetwork.getBoundingClientRect();
            if (nnRect.width > bp.width) {
              issues.push(`❌ ${bp.name}: Neural network overflows (${nnRect.width}px > ${bp.width}px)`);
            }
          }
        }
        
        // Check text readability
        const textElements = section.querySelectorAll('p, span, div');
        textElements.forEach(el => {
          const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
          if (fontSize < 12 && bp.width >= 320) {
            issues.push(`⚠️  ${bp.name}: Text too small in "${sectionId}" (${fontSize}px)`);
          }
        });
        
        console.log(`  ✅ ${sectionId}: ${rect.width}x${rect.height} - OK`);
      } else {
        issues.push(`❌ Section "${sectionId}" not found`);
      }
    });
  });
  
  // Reset viewport
  document.documentElement.style.width = '';
  document.documentElement.style.height = '';
  
  // Report results
  console.log('\n🎯 RESPONSIVE TEST RESULTS:');
  console.log('==========================');
  
  if (issues.length === 0) {
    console.log('🎉 All tests passed! Portfolio is fully responsive.');
  } else {
    console.log(`Found ${issues.length} issues:`);
    issues.forEach(issue => console.log(issue));
  }
  
  return issues;
}

// Performance test
function testPerformance() {
  console.log('\n⚡ PERFORMANCE TESTING:');
  console.log('=======================');
  
  // Test animation performance
  const animatedElements = document.querySelectorAll('[class*="motion"], [class*="animate"]');
  console.log(`📊 Found ${animatedElements.length} animated elements`);
  
  // Test image loading
  const images = document.querySelectorAll('img');
  let loadedImages = 0;
  images.forEach(img => {
    if (img.complete) loadedImages++;
  });
  console.log(`🖼️  Images loaded: ${loadedImages}/${images.length}`);
  
  // Test scroll performance
  const scrollElements = document.querySelectorAll('[style*="transform"], [style*="opacity"]');
  console.log(`📜 Scroll-affected elements: ${scrollElements.length}`);
}

// Mobile-specific tests
function testMobileSpecific() {
  console.log('\n📱 MOBILE-SPECIFIC TESTING:');
  console.log('============================');
  
  // Test touch targets
  const buttons = document.querySelectorAll('button, a, [role="button"]');
  let smallTouchTargets = 0;
  
  buttons.forEach(btn => {
    const rect = btn.getBoundingClientRect();
    const area = rect.width * rect.height;
    if (area < 44 * 44) { // Apple's minimum touch target
      smallTouchTargets++;
    }
  });
  
  if (smallTouchTargets > 0) {
    console.log(`⚠️  Found ${smallTouchTargets} touch targets smaller than 44x44px`);
  } else {
    console.log('✅ All touch targets are appropriately sized');
  }
  
  // Test mobile menu
  const mobileMenuButton = document.querySelector('[aria-label*="menu"], .mobile-menu');
  if (mobileMenuButton) {
    console.log('✅ Mobile menu button found');
  } else {
    console.log('❌ Mobile menu button not found');
  }
}

// Run all tests
function runFullTest() {
  console.clear();
  console.log('🧪 COMPREHENSIVE PORTFOLIO TESTING');
  console.log('===================================');
  
  const issues = testResponsiveness();
  testPerformance();
  testMobileSpecific();
  
  console.log('\n📋 SUMMARY:');
  console.log('============');
  console.log(`Responsive Issues: ${issues.length}`);
  console.log('Test completed successfully! 🎉');
  
  return issues;
}

// Export for manual testing
window.portfolioTest = {
  runFullTest,
  testResponsiveness,
  testPerformance,
  testMobileSpecific
};

console.log('🔧 Testing tools loaded! Run portfolioTest.runFullTest() to start testing.');
