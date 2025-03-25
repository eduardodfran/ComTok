const { execSync } = require('child_process')
const path = require('path')

console.log('====================================')
console.log('ComTok - Installing Backend Packages')
console.log('====================================')

// List of backend packages to install
const packages = [
  'express',
  'cors',
  'dotenv',
  'sequelize',
  'mysql2',
  'jsonwebtoken',
  'bcryptjs',
  'axios',
]

console.log('Installing backend packages:')
packages.forEach((pkg) => console.log(` - ${pkg}`))
console.log('')

try {
  // Execute the command to install the packages
  execSync(`npm install ${packages.join(' ')}`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
  })

  console.log('\n✅ All backend packages installed successfully!')
  console.log('You can now run the server with: npm run start:server')
} catch (error) {
  console.error('\n❌ Error installing backend packages:', error.message)
  console.error('Please try installing them manually with:')
  console.error(`npm install ${packages.join(' ')}`)
}
