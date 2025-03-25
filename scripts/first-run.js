const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

console.log('===============================================')
console.log('Welcome to ComTok - First Run Setup')
console.log('===============================================')
console.log('This script will help you set up the ComTok app for first use.')
console.log('It will:')
console.log(' 1. Install all required dependencies')
console.log(' 2. Verify environment settings')
console.log(' 3. Prepare the app for development')
console.log('===============================================')
console.log('')

// Check if package.json is valid
function checkPackageJson() {
  try {
    const packageJsonPath = path.resolve(__dirname, '..', 'package.json')
    const content = fs.readFileSync(packageJsonPath, 'utf8')
    JSON.parse(content)
    return true
  } catch (error) {
    console.error('❌ Error parsing package.json:', error.message)
    return false
  }
}

// Install a specific npm package
async function installPackage(packageName) {
  console.log(`Installing ${packageName}...`)
  try {
    execSync(`npm install ${packageName}`, {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
    })
    return true
  } catch (error) {
    console.error(`❌ Error installing ${packageName}:`, error.message)
    return false
  }
}

// Main setup function
async function setup() {
  // Step 1: Check package.json
  console.log('📋 Checking package.json integrity...')
  if (!checkPackageJson()) {
    console.error('❌ Your package.json file is corrupted.')
    console.error('Please fix the file or replace it with the correct version.')
    process.exit(1)
  }
  console.log('✅ package.json is valid')

  // Step 2: Install dependencies
  console.log('\n📦 Installing core dependencies...')
  try {
    execSync('npm install', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
    })
    console.log('✅ Core dependencies installed successfully')
  } catch (error) {
    console.error('❌ Error installing core dependencies:', error.message)

    // Try installing axios specifically as it's often a problem
    console.log('\n🔄 Trying to install axios package specifically...')
    const axiosInstalled = await installPackage('axios')
    if (!axiosInstalled) {
      console.error(
        '❌ Could not install axios. Some features may not work properly.'
      )
    }
  }

  // Step 3: Install required Expo packages
  console.log('\n📱 Installing required Expo packages...')
  try {
    execSync('npm run install-packages', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
    })
    console.log('✅ Expo packages installed successfully')
  } catch (error) {
    console.error('❌ Error installing Expo packages:', error.message)
    console.log('Continuing setup process...')
  }

  // Step 4: Install backend packages
  console.log('\n🖥️ Installing backend packages...')
  try {
    execSync('npm run install-backend', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
    })
    console.log('✅ Backend packages installed successfully')
  } catch (error) {
    console.error('❌ Error installing backend packages:', error.message)
    console.log('Continuing setup process...')
  }

  // Step 5: Setup completed
  console.log('\n🎉 ComTok setup completed successfully!')
  console.log('You can now start the development servers with:')
  console.log('npm start')
}

// Run the setup
setup().catch((error) => {
  console.error('❌ Setup failed:', error.message)
})
