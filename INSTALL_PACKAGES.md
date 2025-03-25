# Installing Required Packages

The ComTok app uses several packages that need to be installed before certain features will work correctly.

## First-time Setup (Recommended)

If this is your first time running the project, use our setup script:

```bash
npm run setup
```

This script will install all dependencies, including required Expo packages, backend packages, and verify your environment.

## Quick Installation

If you've already set up the project but need to install specific packages:

```bash
# For frontend Expo packages
npm run install-packages

# For backend packages
npm run install-backend
```

## Manual Installation

If you prefer to install packages manually, you can run:

```bash
# Frontend packages
npx expo install expo-secure-store expo-local-authentication @react-native-async-storage/async-storage axios

# Backend packages
npm install express cors dotenv sequelize mysql2 jsonwebtoken bcryptjs axios
```

## Required Packages

Here's a list of the key packages used in the application:

### Frontend (React Native/Expo)

1. `expo-secure-store` - For securely storing authentication tokens
2. `expo-local-authentication` - For biometric authentication (Face ID / Touch ID)
3. `@react-native-async-storage/async-storage` - For general data persistence
4. `axios` - For making API requests to the backend

### Backend (Node.js/Express)

1. `express` - Web framework for Node.js
2. `sequelize` - ORM for database interactions
3. `mysql2` - MySQL database driver
4. `jsonwebtoken` - For JWT authentication
5. `bcryptjs` - For password hashing
6. `cors` - For handling cross-origin requests
7. `dotenv` - For environment variable management

## After Installation

Once you've installed the packages:

1. Stop the current server (Ctrl+C in your terminal)
2. Run `npm start` to restart the development environment
3. Your app should now work without any module resolution errors

## Troubleshooting

If you encounter issues with axios or other dependencies:

1. Try installing axios specifically: `npm install axios`
2. Make sure your package.json is valid (no syntax errors)
3. Run `npm run setup` to fix common issues
4. Clear npm cache with `npm cache clean --force`
5. Delete node_modules folder and run `npm install` again
