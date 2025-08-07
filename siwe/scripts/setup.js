const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up SIWE Hello World Project...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  fs.copyFileSync(path.join(__dirname, '..', '.env.example'), envPath);
  console.log('✅ .env file created. Please add your private key to the .env file.');
} else {
  console.log('✅ .env file already exists.');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('\n📦 Installing dependencies...');
  console.log('Please run: npm install');
} else {
  console.log('✅ Dependencies already installed.');
}

// Check frontend dependencies
const frontendNodeModulesPath = path.join(__dirname, '..', 'frontend', 'node_modules');
if (!fs.existsSync(frontendNodeModulesPath)) {
  console.log('\n📦 Frontend dependencies not installed.');
  console.log('Please run: cd frontend && npm install');
} else {
  console.log('✅ Frontend dependencies already installed.');
}

console.log('\n📋 Next steps:');
console.log('1. Add your private key to the .env file');
console.log('2. Run: npm install (if not done already)');
console.log('3. Run: cd frontend && npm install (if not done already)');
console.log('4. Run: npm run compile');
console.log('5. Run: npm test');
console.log('6. Run: npm run deploy');
console.log('7. Update the contract address in frontend/app/page.js');
console.log('8. Run: cd frontend && npm run dev');
console.log('\n�� Happy coding!'); 