# Token Portfolio

A modern, responsive cryptocurrency portfolio tracker built with React, TypeScript, and Vite. Track
your token holdings, view real-time prices, and manage your watchlist with an intuitive interface.

![Token Portfolio](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.6-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.13-38B2AC?logo=tailwind-css)

## ✨ Features

- **📊 Portfolio Overview**: Real-time portfolio valuation with interactive donut chart
- **📈 Watchlist Management**: Add, remove, and track your favorite tokens
- **💰 Real-time Prices**: Live price updates from CoinGecko API with 24h change indicators
- **📱 Responsive Design**: Optimized for both desktop and mobile devices
- **🔗 Wallet Integration**: Connect your wallet using RainbowKit and Wagmi
- **💾 Data Persistence**: Watchlist and holdings persist across sessions
- **🎨 Modern UI**: Beautiful interface with dark theme and smooth animations
- **⚡ Performance**: Optimized rendering with React Query and Redux Toolkit

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/haroonwaves/token-portfolio
   cd token-portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   # Create .env.local file
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser** Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

### Core Framework

- **React 19.1.1** - UI library with latest features
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 7.1.6** - Fast build tool and dev server

### State Management

- **Redux Toolkit 2.9.0** - Predictable state container
- **React Redux 9.2.0** - React bindings for Redux

### Styling & UI

- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Recharts 2.15.4** - Composable charting library

### Blockchain Integration

- **Wagmi 2.17.1** - React hooks for Ethereum
- **RainbowKit 2.2.8** - Wallet connection UI
- **Ethers 6.15.0** - Ethereum library

### Data Fetching

- **TanStack Query 5.89.0** - Data synchronization
- **Axios 1.12.2** - HTTP client

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting

## 📁 Project Structure

```
src/
├── api/                # API integration (CoinGecko)
├── components/         # React components
│   ├── modal/          # Modal components
│   ├── portfolio/      # Portfolio-related components
│   ├── ui/             # Reusable UI components
│   └── watchlist/      # Watchlist components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── store/              # Redux store and slices
└── assets/             # Static assets
```

## 🎯 Key Components

### Portfolio Dashboard

- **Total Value Display**: Real-time portfolio valuation
- **Interactive Chart**: Donut chart showing token allocation
- **Last Updated**: Timestamp of latest price update

### Watchlist Management

- **Token Table**: Sortable table with price, change, and sparkline
- **Add Tokens**: Search and add tokens from CoinGecko
- **Edit Holdings**: Update token quantities
- **Pagination**: Navigate through large token lists

### Wallet Integration

- **Multi-wallet Support**: Connect various wallet types
- **Network Switching**: Support for multiple networks
- **Account Management**: Display connected wallet info

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run typecheck    # Run TypeScript compiler
npm run validate     # Run all checks (typecheck + lint + format)

# Build
npm run build        # Build for production
```

## 🚀 Deployment

### Cloudflare Pages

1. Push your changes to the main branch
2. Cloudflare Pages will automatically build and deploy your site

## 🔒 Environment Variables

Create a `.env.local` file:

```env
# WalletConnect Project ID (optional)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here


```

## 🙏 Acknowledgments

- [CoinGecko](https://coingecko.com) for providing the cryptocurrency API
- [RainbowKit](https://rainbowkit.com) for wallet connection UI
- [Radix UI](https://radix-ui.com) for accessible components
- [Tailwind CSS](https://tailwindcss.com) for styling utilities

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/haroonwaves/token-portfolio/issues) page
2. Create a new issue with detailed information

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
