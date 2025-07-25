# 🌳 Grow Your Mind Garden

> **A beautiful productivity application designed to help students focus, grow, and achieve their goals through gamified learning and mindful productivity.**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🔐 **User Authentication**
- Secure login and signup system
- User-specific data storage
- Personalized experience for each student

### ⏰ **Focus Timer (Pomodoro Technique)**
- Customizable focus sessions (10, 25, 50, 90 minutes or custom)
- Background timer persistence across tabs
- Beautiful tree growth visualization
- Session categorization (Small 🌱, Medium 🌳, Large 🏔️)
- Focus streak tracking and achievements

### 🌲 **Virtual Forest**
- Watch your forest grow with each completed session
- Different tree sizes based on session length
- Visual representation of your productivity journey
- Motivational achievement system

### ✅ **Smart Task Tracker**
- Add and manage daily tasks
- Priority levels and categories
- Completion tracking with timestamps
- Delete functionality with confirmations
- Limit completed tasks display (top 7)

### 📝 **Notes Management**
- Create and organize personal notes
- Click to view full note content
- Delete notes with confirmation dialogs
- User-specific note storage

### 📊 **Analytics & Export**
- Detailed focus session history
- CSV export for data analysis
- Daily, weekly, and streak statistics
- Session type breakdown and insights

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayush-patel9/grow-your-mind-garden-clean.git
   cd grow-your-mind-garden-clean
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom gradients and animations
- **UI Components**: Radix UI primitives
- **State Management**: React Context API
- **Data Persistence**: LocalStorage with user-specific keys
- **Icons**: Lucide React
- **Development**: ESLint, PostCSS

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Radix)
│   ├── Dashboard.tsx    # Main dashboard layout
│   ├── FocusTimer.tsx   # Pomodoro timer component
│   ├── TaskTracker.tsx  # Task management
│   ├── NotesModule.tsx  # Notes functionality
│   ├── TreeGrowth.tsx   # Forest visualization
│   ├── Header.tsx       # Navigation header
│   └── LoginPage.tsx    # Authentication
├── contexts/            # React Context providers
│   ├── UserContext.tsx  # User authentication state
│   └── TimerContext.tsx # Global timer state
├── hooks/               # Custom React hooks
│   └── useLocalStorage.ts # User-aware localStorage
├── lib/                 # Utility functions
└── assets/              # Static assets
```

## 🎯 Key Features Explained

### Focus Timer System
The application implements a sophisticated Pomodoro timer that:
- Runs in the background even when switching tabs
- Categorizes sessions by duration (Small: <15min, Medium: 15-45min, Large: 45+min)
- Provides visual feedback through animated tree growth
- Tracks streaks and displays achievements

### User Data Management
- Each user's data is stored separately using prefixed localStorage keys
- Seamless switching between user accounts
- No data mixing between different users

### Forest Visualization
- Each completed focus session grows a tree in your virtual forest
- Tree size depends on session length
- Tooltips show session details
- Motivational visual progress tracking

## 🤝 Contributing

We welcome contributions from students and developers! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Write meaningful commit messages
- Test your changes thoroughly

## 📧 Support & Contact

For questions, suggestions, or support:
- **Email**: patelayush0907@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/Ayush-patel9/grow-your-mind-garden-clean/issues)

## 🎓 For Students

This application is specifically designed to help students:
- Build consistent study habits
- Track productivity and progress
- Gamify the learning experience
- Maintain focus during study sessions
- Organize tasks and notes efficiently

## 🔮 Future Enhancements

- [ ] Cloud synchronization across devices
- [ ] Study group collaboration features
- [ ] Advanced analytics and insights
- [ ] Mobile app companion
- [ ] Integration with calendar applications
- [ ] Dark/light theme toggle
- [ ] Sound notifications and ambient sounds

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the student community
- Inspired by the Pomodoro Technique and gamification principles
- Special thanks to the open-source community for the amazing tools and libraries

---

**Made with 🌱 by [Ayush Patel](https://github.com/Ayush-patel9) | Helping students grow their minds, one focus session at a time.**
