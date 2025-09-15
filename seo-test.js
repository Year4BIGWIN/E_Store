#!/usr/bin/env node

/**
 * SEO Testing Script for SmartGear E-Store
 * Run with: node seo-test.js [URL]
 */

const https = require('https');
const http = require('http');
const { JSDOM } = require('jsdom');

const testUrl = process.argv[2] || 'http://localhost:5173';

console.log(`\n🔍 Testing SEO for: ${testUrl}\n`);

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function testSEO(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function test(name, condition, recommendation = '') {
    const passed = !!condition;
    results.tests.push({ name, passed, recommendation });
    if (passed) results.passed++;
    else results.failed++;
    
    console.log(`${passed ? '✅' : '❌'} ${name}`);
    if (!passed && recommendation) {
      console.log(`   💡 ${recommendation}`);
    }
  }

  // Title Tests
  const title = document.querySelector('title');
  test('Title tag exists', title);
  test('Title length is optimal (30-60 chars)', 
    title && title.textContent.length >= 30 && title.textContent.length <= 60,
    'Title should be between 30-60 characters for optimal display in search results');

  // Meta Description Tests
  const description = document.querySelector('meta[name="description"]');
  test('Meta description exists', description);
  test('Meta description length is optimal (120-160 chars)',
    description && description.content.length >= 120 && description.content.length <= 160,
    'Meta description should be between 120-160 characters');

  // Open Graph Tests
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  
  test('Open Graph title exists', ogTitle);
  test('Open Graph description exists', ogDescription);
  test('Open Graph image exists', ogImage);
  test('Open Graph URL exists', ogUrl);

  // Twitter Card Tests
  const twitterCard = document.querySelector('meta[property="twitter:card"]');
  const twitterTitle = document.querySelector('meta[property="twitter:title"]');
  const twitterDescription = document.querySelector('meta[property="twitter:description"]');
  
  test('Twitter card exists', twitterCard);
  test('Twitter title exists', twitterTitle);
  test('Twitter description exists', twitterDescription);

  // Technical SEO Tests
  const canonical = document.querySelector('link[rel="canonical"]');
  const viewport = document.querySelector('meta[name="viewport"]');
  const robots = document.querySelector('meta[name="robots"]');
  
  test('Canonical URL exists', canonical);
  test('Viewport meta tag exists', viewport);
  test('Robots meta tag exists', robots);

  // Structured Data Tests
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  test('Structured data exists', structuredData.length > 0);
  
  if (structuredData.length > 0) {
    console.log(`   📊 Found ${structuredData.length} structured data block(s)`);
    structuredData.forEach((script, index) => {
      try {
        const data = JSON.parse(script.textContent);
        console.log(`   📋 Schema ${index + 1}: ${data['@type'] || 'Unknown type'}`);
      } catch (e) {
        console.log(`   ⚠️  Schema ${index + 1}: Invalid JSON`);
      }
    });
  }

  // Favicon Tests
  const favicon = document.querySelector('link[rel="icon"]') || 
                  document.querySelector('link[rel="shortcut icon"]');
  test('Favicon exists', favicon);

  // Language Tests
  const htmlLang = document.documentElement.lang;
  test('HTML lang attribute exists', htmlLang);

  return results;
}

async function runTests() {
  try {
    const html = await fetchHTML(testUrl);
    const results = testSEO(html);
    
    console.log('\n📊 SEO Test Results:');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Score: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
    
    if (results.failed > 0) {
      console.log('\n🔧 Recommendations:');
      results.tests
        .filter(test => !test.passed && test.recommendation)
        .forEach(test => console.log(`• ${test.recommendation}`));
    }
    
    console.log('\n🎯 Additional SEO Tips:');
    console.log('• Test your site with Google PageSpeed Insights');
    console.log('• Validate structured data with Google\'s Rich Results Test');
    console.log('• Submit your sitemap to Google Search Console');
    console.log('• Monitor Core Web Vitals regularly');
    console.log('• Ensure mobile-friendliness with Google\'s Mobile-Friendly Test');
    
  } catch (error) {
    console.error('❌ Error running SEO tests:', error.message);
    process.exit(1);
  }
}

runTests();
