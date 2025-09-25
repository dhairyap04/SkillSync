# SkillSync - Career Development & Mentorship Platform

A modern, responsive React TypeScript application built with TailwindCSS for career development and mentorship. SkillSync connects students with expert mentors, tracks skill development, and provides personalized learning resources.

## 🚀 Features

### Core Functionality

- **User Authentication** - Secure login/signup with role-based access (Student/Mentor)
- **Skills Tracking** - Visual progress tracking with evidence and goal setting
- **Mentorship Matching** - AI-powered mentor discovery and connection system
- **Resource Library** - Curated learning resources with personalized recommendations
- **Real-time Messaging** - Built-in chat system for mentor-student communication
- **Goal Management** - Kanban-style goal tracking with milestone management
- **Profile Management** - Comprehensive user profiles with social links and achievements

### Design & UX

- **Modern UI/UX** - Clean, professional design with smooth animations
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Accessibility** - WCAG AA compliant with keyboard navigation and screen reader support
- **Dark/Light Mode** - Theme switching capability (ready for implementation)
- **Micro-interactions** - Engaging animations and transitions throughout

### Technical Features

- **TypeScript** - Full type safety and better developer experience
- **TailwindCSS** - Utility-first CSS framework for rapid development
- **Framer Motion** - Smooth animations and page transitions
- **React Hook Form** - Efficient form handling with validation
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing with protected routes

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Input, Card, etc.)
│   ├── layout/          # Layout components (Header, Sidebar, Footer)
│   ├── animations/      # Animation components
│   ├── accessibility/   # Accessibility components
│   └── responsive/      # Responsive utilities
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── skills/         # Skills management
│   ├── mentors/        # Mentor discovery
│   ├── resources/      # Learning resources
│   ├── messages/       # Chat interface
│   ├── profile/        # User profile
│   └── goals/          # Goal tracking
├── hooks/              # Custom React hooks
├── store/              # State management
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
└── App.tsx             # Main application component
```

## 🎨 Design System

### Color Palette

- **Primary**: Deep blue (#1E40AF) and vibrant teal (#0D9488)
- **Secondary**: Warm orange (#F59E0B) for CTAs and highlights
- **Neutrals**: Clean whites, light grays, and dark charcoal
- **Success**: Fresh green (#10B981) for positive actions

### Typography

- **Font Family**: Inter (clean, readable sans-serif)
- **Hierarchy**: Consistent heading sizes and spacing
- **Accessibility**: WCAG AA compliant contrast ratios

### Components

- **Atomic Design**: Atoms, molecules, organisms structure
- **Consistent Spacing**: 4px base unit system
- **Shadow System**: Soft, medium, and strong shadow variants
- **Border Radius**: Consistent rounded corners (8px, 12px, 16px)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/skillsync-frontend.git
   cd skillsync-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile** (320px - 768px): Stack layout, hamburger menu, touch-friendly buttons
- **Tablet** (768px - 1024px): Optimized layouts with sidebar navigation
- **Desktop** (1024px+): Full sidebar navigation, multi-column layouts

## ♿ Accessibility Features

- **Keyboard Navigation**: Full tab order with focus indicators
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color combinations
- **Focus Management**: Focus traps for modals and dropdowns
- **Announcements**: Live regions for dynamic content updates

## 🎭 Animation System

Built with Framer Motion for smooth, performant animations:

- **Page Transitions**: Smooth fade-ins and slide animations
- **Hover Effects**: Subtle scale and shadow changes
- **Loading States**: Skeleton screens and progress indicators
- **Micro-interactions**: Button presses, form validation, success states

## 🔐 Authentication Flow

1. **Landing Page** - Public access with signup/login CTAs
2. **Role Selection** - Choose between Student or Mentor
3. **Profile Setup** - Complete profile information
4. **Dashboard Access** - Role-based dashboard with relevant features

## 📊 State Management

Using Zustand for lightweight, type-safe state management:

- **Auth Store** - User authentication and profile data
- **UI Store** - Theme, sidebar state, notifications
- **Data Stores** - Skills, goals, mentors, resources (ready for API integration)

## 🎯 Key Pages

### Landing Page

- Hero section with value proposition
- Features showcase
- Testimonials carousel
- Statistics and social proof

### Student Dashboard

- Progress overview cards
- Recent skills and goals
- Upcoming mentor sessions
- Quick action buttons

### Mentor Dashboard

- Student management
- Session scheduling
- Impact metrics
- Pending requests

### Skills Tracking

- Visual progress bars
- Evidence management
- Goal association
- Category filtering

### Mentor Discovery

- Advanced search and filters
- Compatibility matching
- Profile previews
- Connection requests

## 🔮 Future Enhancements

- **Real-time Features**: WebSocket integration for live chat
- **Video Calls**: Integrated video calling for mentor sessions
- **AI Recommendations**: Machine learning for personalized content
- **Mobile App**: React Native version
- **Analytics Dashboard**: Detailed progress analytics
- **Certification System**: Skill verification and badges
- **Community Features**: Forums and discussion boards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern SaaS applications
- Icons by [Lucide](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)
- Color palette inspired by modern design systems

---

Built with ❤️ for career development and mentorship
