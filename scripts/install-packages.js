const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

console.log('====================================')
console.log('ComTok - Installing Required Packages')
console.log('====================================')

// Check if the project has the required expo package
const checkExpoInstalled = () => {
  try {
    const packageJsonPath = path.resolve(__dirname, '..', 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    return !!packageJson.dependencies.expo
  } catch (error) {
    console.error('Error checking package.json:', error.message)
    return false
  }
}

// First, make sure expo is installed
if (!checkExpoInstalled()) {
  console.log('Installing expo core package first...')
  try {
    execSync('npm install expo@latest', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
    })
  } catch (error) {
    console.error('\n❌ Error installing expo package:', error.message)
    console.error('Please install it manually with: npm install expo@latest')
    process.exit(1)
  }
}

// List of packages to install
const packages = [
  'expo-secure-store',
  'expo-local-authentication',
  '@react-native-async-storage/async-storage',
  'axios',
]

console.log('\nInstalling packages:')
packages.forEach((pkg) => console.log(` - ${pkg}`))
console.log('')

try {
  // Execute the command to install the packages using expo CLI
  execSync(`npx expo install ${packages.join(' ')}`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
  })

  console.log('\n✅ All packages installed successfully!')
  console.log('You can now run the app with: npm start')
} catch (error) {
  console.error('\n❌ Error installing packages with expo. Trying with npm...')

  try {
    execSync(`npm install ${packages.join(' ')}`, {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
    })
    console.log('\n✅ All packages installed successfully with npm!')
    console.log('You can now run the app with: npm start')
  } catch (secondError) {
    console.error('\n❌ Installation failed. Please try installing manually:')
    console.error(`npm install ${packages.join(' ')}`)
  }
}
