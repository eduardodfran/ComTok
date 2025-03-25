const concurrently = require('concurrently')
const path = require('path')
const fs = require('fs')

// Check if required packages are installed
function checkRequiredPackages() {
  try {
    const packageJsonPath = path.resolve(__dirname, '..', 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    const requiredPackages = [
      'expo-secure-store',
      'expo-local-authentication',
      '@react-native-async-storage/async-storage',
    ]

    const missingPackages = requiredPackages.filter((pkg) => {
      return !packageJson.dependencies[pkg]
    })

    if (missingPackages.length > 0) {
      console.warn(
        `⚠️ Warning: Some required packages are missing: ${missingPackages.join(
          ', '
        )}`
      )
      console.warn('You may encounter errors when running the app.')
      console.warn('Run "npm run install-packages" to install them.')
      console.warn('')
    }

    return missingPackages.length === 0
  } catch (error) {
    console.error('Error checking required packages:', error.message)
    return false
  }
}

// Define the commands to run
const commands = [
  {
    command: 'node server/index.js',
    name: 'SERVER',
    prefixColor: 'blue',
  },
  {
    command: 'expo start',
    name: 'EXPO',
    prefixColor: 'green',
  },
]

// Options for concurrently
const options = {
  prefix: 'name',
  killOthers: ['failure', 'success'],
  restartTries: 3,
  cwd: path.resolve(__dirname, '..'),
}

// Check for required packages
checkRequiredPackages()

// Run the commands
try {
  console.log('🚀 Starting development server...')
  console.log('📱 Expo: Mobile app frontend')
  console.log('🖥️ Server: Express backend API')
  console.log('--------------------------------------')

  const result = concurrently(commands, options)

  // Handle success/failure through event listeners
  result.result.then(
    () => console.log('✅ All processes exited successfully'),
    (error) => console.error('❌ One or more processes failed:', error)
  )
} catch (error) {
  console.error('❌ Failed to start development environment:', error.message)
  console.error('Please make sure all dependencies are installed by running:')
  console.error('npm run install-packages')
}
