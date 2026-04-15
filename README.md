# 🗾 Japanese Vocabulary Learner - Redesigned

A beautiful, addictive web app combining Duolingo-style learning with Xiaohongshu (RED) feed aesthetics. Learn Japanese vocabulary through an elegant, scrollable feed of vocabulary cards with interactive flashcards and quizzes.

## ✨ Key Features

- **Xiaohongshu-Style Feed**: Horizontal scrolling cards displaying vocabulary beautifully
- **Interactive Cards**: Click to reveal meanings, like/save functionality
- **Duolingo-Style Learning**: Quiz mode with instant feedback and streak tracking
- **Flashcard Review**: Multi-phase learning (quiz + flashcard review)
- **Streak Counter** 🔥: Track consecutive correct answers
- **Favorites System**: Save liked words and access them separately
- **Korean Aesthetic**: Soft pastels, rounded corners, smooth animations
- **Progress Tracking**: Real-time accuracy percentage and learning stats
- **Mobile-Optimized**: Responsive design works on all devices

## 🎨 Design Highlights

### Color Palette
- **Primary Pink**: `#FFB6D9` - Interactive elements
- **Light Pink**: `#FFE5F0` - Card backgrounds
- **Soft Blue**: `#D4E8F5` - Alternate cards
- **Cream**: `#FFF8F0` - Backgrounds
- Clean shadows and soft transitions

### User Experience
- **Smooth Animations**: Hover effects, card lifts, transitions
- **Addictive Scrolling**: Infinite horizontal feed
- **Modal Learning**: Focused learning experience
- **Visual Feedback**: Instant quiz results, streak display
- **Clean Layout**: Lots of whitespace, easy navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- npm

### Installation

```bash
# Navigate to project folder
cd path/to/japanese-vocab-learner

# Install dependencies  
npm install

# Start development server
npm run dev
```

The app opens automatically at `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 📖 How It Works

### Home Page - Feed
1. **Scroll horizontally** through vocabulary cards
2. **View statistics**: Words learned, favorites count
3. **Interact with cards**:
   - **❤️ Like Button**: Save words to favorites
   - **📖 Learn Button**: Opens learning modal
   - **Click Card**: Also opens learning modal

### Learning Mode - Two Phases

#### Phase 1: Quiz
- See Japanese word (kanji + kana)
- Choose correct meaning from 4 options
- Get instant feedback (✓ correct/✗ incorrect)
- Streak counter shows continuous correct answers 🔥

#### Phase 2: Flashcard
- Review the word, meaning, and example sentence
- Perfect the learning with context
- Option to mark as done or go back

### Favorites Page
- View all liked words in a clean grid
- **Search functionality**: Find words quickly
- Click any card to learn
- Like/unlike to manage favorites

### Streak System
- Earns on each correct quiz answer
- Displays prominently in learning modal
- Tracked in navbar while learning
- Motivation boost for continuous learning

## 🗂️ Project Structure

```
src/
├── main.jsx                    # React entry point
├── App.jsx                    # Main app with state management
├── styles.css                 # Complete styling (Xiaohongshu-inspired)
├── components/
│   ├── Navbar.jsx             # Top nav with stats
│   ├── FeedPage.jsx           # Main feed with horizontal scroll
│   ├── FeedCard.jsx           # Individual vocabulary card
│   ├── LearningModal.jsx      # Quiz + flashcard learning mode
│   ├── FavoritesPage.jsx      # Grid view of liked words
│   └── (old components)       # Previous UI components (optional)
└── data/
    └── vocabulary.js          # 25+ vocabulary words + utilities
```

## 🔧 Technologies

- **React 18**: Hooks (useState, useEffect) for state management
- **Vite**: Fast build tool and HMR dev server
- **CSS3**: Modern styling with gradients, animations, flexbox/grid
- **LocalStorage API**: No backend required

## 💾 Data Persistence

All data saved in browser LocalStorage:
- `learnedWords`: IDs of words learned
- `likedWords`: IDs of favorite words
- `streak`: Current streak count
- `progress`: Accuracy and attempt tracking
- `vocabulary`: Full word database

**To reset**: Clear browser storage (DevTools → Application → Local Storage)

## 📚 Vocabulary Database

Includes 25 essential Japanese words with:
- Kanji writing
- Kana pronunciation
- English meaning
- Example sentences

Easily add more words to `src/data/vocabulary.js`:

```javascript
{
  id: 26,
  word: '音楽',
  kana: 'おんがく',
  meaning: 'Music',
  example: '音楽が好きです。(I like music.)'
}
```

## 🎯 User Flow

```
Feed (Scroll, Like, Stats)
    ↓
Click Card → Learning Modal
    ↓
Quiz Phase → Answer → Feedback
    ↓
Flashcard Phase → Review → Done
    ↓
Back to Feed (Stats Updated)
```

Or access **Favorites** from navbar to revisit liked words.

## 📱 Responsive Design

- **Desktop**: Full horizontal scroll feed with sidebar stats
- **Tablet**: Optimized spacing and card sizes
- **Mobile**: Staggered cards, full-width modals

All animations and transitions work smoothly across devices.

## 🎨 Aesthetic Features

- **Gradient Backgrounds**: Soft pastel transitions
- **Rounded Cards**: 20px+ border-radius for softness
- **Subtle Shadows**: 3D depth without heaviness
- **Smooth Transitions**: 300ms cubic-bezier easing
- **Hover Effects**: Scale and lift animations
- **Icon-Based UI**: Emoji and unicode for warmth

## 🎓 Learning Tips

1. **Start with Feed**: Explore words at your own pace
2. **Like Favorites**: Save words you find interesting
3. **Quiz Regularly**: Test yourself with modal quizzes
4. **Build Streaks**: Maintain consistency for motivation
5. **Review Favorites**: Revisit liked words to reinforce

## 🐛 Troubleshooting

**Cards not scrolling?**
- Use mouse wheel or trackpad scroll
- Drag horizontally on mobile

**Data not saving?**
- Check LocalStorage is enabled
- Try incognito mode (data won't persist)

**Performance issues?**
- Clear browser cache
- Try a different browser

## 🌟 Future Enhancements

- Sound pronunciation for each word
- Spaced repetition algorithm
- Kanji breakdown and stroke order
- Leaderboards and achievements
- Dark mode toggle
- Multiple language translations
- Offline mode (PWA)
- Export/import word lists

## 📄 License

Open source - modify and use freely!

---

**Ready to start learning?** Run `npm run dev` and immerse yourself in Japanese! 🗾✨

