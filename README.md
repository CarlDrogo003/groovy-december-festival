# 🎪 Groovy December Festival Platform

> **Africa's Ultimate End-of-Year Festival Platform**

A premium, full-stack web application for managing Africa's premier end-of-year celebration - Groovy December Festival. Built with modern technologies and featuring a stunning UI/UX design that captures the vibrant spirit of African culture and celebration.

## ✨ Features

### 🎭 **Festival Management**
- **Event Showcase**: Dynamic events page with database integration
- **Vendor Registration**: Complete vendor onboarding with package selection
- **Pageant System**: Miss Groovy December pageant with contestant management
- **Contact System**: Professional contact form with database storage
- **Sponsor Management**: Partnership and sponsorship display system

### 🎨 **Premium Design System**
- **Festival Branding**: Custom purple, blue, and teal gradient color palette
- **Animations**: Smooth hover effects, micro-interactions, and transitions
- **Typography**: Professional font pairing with Inter and Poppins
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: Animated statistics cards and engaging CTAs

### 🔧 **Technical Excellence**
- **Modern Stack**: Next.js 15 with App Router and TypeScript
- **Database**: Supabase integration for real-time data management
- **Styling**: Tailwind CSS 4 for rapid, consistent styling
- **Form Handling**: Robust form validation with loading states
- **Navigation**: Seamless routing with proper Link components

## 🚀 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Custom design system with gradient animations
- **Deployment**: Ready for Vercel deployment
- **Authentication**: Supabase Auth integration

## 🏁 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CarlDrogo003/groovy-december-festival.git
   cd groovy-december-festival
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages Overview

### 🏠 **Homepage**
- Vibrant hero section with festival branding
- Interactive statistics with animated counters  
- Feature highlights with hover effects
- Call-to-action cards for different user types
- Sponsor showcase section

### 🎪 **Events**
- Dynamic event listings from database
- Event detail pages with registration forms
- Responsive grid layout with smooth animations

### 🏪 **Vendor Registration** 
- Multi-step vendor onboarding form
- Package selection (Kiosk, Booth, Outdoor Space)
- Form validation with success/error handling

### 👑 **Pageant System**
- Miss Groovy December pageant information
- Contestant registration and management
- Competition details and prize information

### 📞 **Contact**
- Professional contact form with validation
- Contact information display
- Message submission to database

## 🎨 Design Philosophy

The platform embodies the vibrant, celebratory spirit of African festivals through:

- **Color Psychology**: Purple (royalty), Blue (trust), Teal (creativity)
- **Visual Hierarchy**: Clear information architecture with stunning gradients
- **User Experience**: Intuitive navigation with delightful interactions
- **Cultural Elements**: African-inspired design elements and imagery
- **Premium Feel**: High-end animations and professional polish

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">
  <p><strong>🎪 Groovy December - Where Africa Celebrates! 🎭</strong></p>
  <p>Made with ❤️ for the African festival community</p>
</div>