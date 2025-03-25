# ComTok

ComTok is a community-focused social platform for Filipinos to connect and share information about their local provinces and cities. Think of it as a Reddit-style application but focused on geographic locations throughout the Philippines.

![ComTok Banner](https://images.unsplash.com/photo-1529686342540-1b43aec0df75?q=80&w=1000)

## 📱 Features

- **Location-based Communities**: Browse and participate in discussions organized by provinces and cities
- **User Authentication**: Secure login with email/password, biometric support, and OTP verification
- **Content Creation**: Create posts about specific locations with rich media support
- **Interactive Comments**: Engage in threaded discussions with voting systems
- **Follow System**: Follow locations or users to customize your feed
- **Notifications**: Stay updated on interactions with your content
- **User Profiles**: Personalized profiles showing activity and contributions
- **Responsive Design**: Works seamlessly on mobile and web interfaces

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- MySQL (v8.0 or higher)
- Expo CLI (for mobile development)

### First-time Setup

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/comtok.git
   cd comtok
   ```

2. Run the setup script

   ```bash
   npm run setup
   ```

   This script will install all dependencies and prepare your development environment.

3. Configure your database

   - Create a database named `comtok_db`
   - Update `.env` file with your database credentials

4. Start the development servers
   ```bash
   npm start
   ```
   This will start both the backend server and the Expo development server.

### Alternative Setup

If you prefer to set things up manually:

1. Install dependencies

   ```bash
   npm install
   ```

2. Install required Expo packages

   ```bash
   npm run install-packages
   ```

3. Install backend packages

   ```bash
   npm run install-backend
   ```

4. Start the development environment
   ```bash
   npm start
   ```

## 🏗️ Project Structure
