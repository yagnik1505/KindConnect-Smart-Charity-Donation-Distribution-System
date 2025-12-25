# KindConnect Frontend

Smart Charity Donation Distribution System - Frontend Application

## Features

- 🎯 **Landing Page** - Introduction to KindConnect platform
- 👤 **User Authentication** - Login/Register for Donors and NGOs
- 💝 **Donor Dashboard** - Create and track donations
- 🏢 **NGO Dashboard** - Post needs and manage requests
- 📊 **Real-time Tracking** - Monitor donation status
- 🎨 **Modern UI** - Beautiful, responsive design

## Tech Stack

- React 18
- React Router v6
- Vite
- Lucide React Icons
- Axios for API calls

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── DonorDashboard.jsx
│   │   └── NGODashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Usage

1. **Development**: Run `npm run dev` and open http://localhost:3000
2. **Login as Donor**: Navigate donations, create new donations
3. **Login as NGO**: Post needs, view matched donations
4. **Track Impact**: Monitor real-time donation status

## API Integration

Update the API endpoint in `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://your-api-gateway:8000',
    changeOrigin: true
  }
}
```

## License

KindConnect © 2025
