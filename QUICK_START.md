# 🚀 Quick Start Guide - Redesigned App

## Installation (1 minute)

```bash
# Install dependencies
npm install

# Start dev server (auto-opens http://localhost:5173)
npm run dev
```

## First Look

### 🧭 Navigation Bar (Top)
![No image yet, but imagine:]
- **Left**: Logo + Title
- **Center**: Streak 🔥 and Accuracy % badges
- **Right**: Feed | Favorites tabs

### 🎯 Feed Page (Main)
- 📜 **Horizontal scroll** with vocabulary cards
- 📊 **Stats** showing: Words learned, Liked count
- 🎨 **Beautiful gradient** cards with pastel colors
- ❤️ **Like button** to save words
- 📖 **Learn button** to open quiz

### 💚 Favorites Page
- ⚡ Quick access to liked words
- 🔍 Search by kanji/kana/meaning
- 🎴 Grid layout - same cards as feed
- Click any card to learn

## 5-Minute Learning Session

1. **Open Feed** (should be default)
2. **Scroll right** to browse vocabulary cards
3. **Click any card** → Opens Learning Modal

### Learning Modal - Two Phases

**Phase 1: Quiz** (1-2 minutes)
   - See Japanese word + 4 meanings
   - Click the correct answer
   - 🎉 Correct → Streak increases!
   - 📚 Incorrect → Shows correct answer
   - Button: "Next: Flashcard Review"

**Phase 2: Flashcard** (30 seconds)
   - View word + kana + meaning together
   - See example sentence for context
   - "Done!" button returns to feed

### ✨ Result
- ✓ Word marked as learned
- 🔥 Streak counter increments (if correct)
- 📊 Accuracy % updates
- ♥️ You can still like the word after learning!

## Key Features Explained

### 🔥 Streak System
- Earned when you answer **correctly** in quiz phase
- Shows in top navbar in real-time
- Displayed with 🎉 Animation when you learn a word
- Motivates continuous daily practice

### ❤️ Like/Save System
- Click heart icon on any card
- ❤️ Red heart = Liked/Saved
- 🤍 White heart = Not liked
- Access all liked words in **Favorites** tab
- Persist across browser sessions

### 📊 Progress Tracking
- **Streak**: Number in navbar
- **Accuracy**: Percentage in navbar
- **Learned Count**: Badge count in feed header
- **Liked Count**: Badge count in feed header

### 🔍 Search Favorites
- Type in search box in Favorites tab
- Searches across: Kanji, Kana, English meaning
- Results update instantly
- Clear search to see all liked words

## Tips for Best Experience

### 🎯 Learning Strategy
1. **Scroll the feed** - Explore what's available
2. **Like interesting words** - Build your favorites
3. **Quiz mode** - For each word you want to learn
4. **Check streak** - Stay motivated!
5. **Review favorites** - Reinforce learned words

### 💡 Pro Tips
- **New words daily**: Vocabulary updates in feed
- **Build streaks**: Aim for 7+ day streaks 🔥
- **Like before learning**: Bookmark favorites first
- **Mobile friendly**: Scroll works on touch devices
- **Data persists**: Close app, come back later - data saved!

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close Modal | `Esc` key |
| Select Quiz Answer | Click or Tap |
| Next Phase | Click Button |

## Common Issues & Fixes

### 🔴 Cards not scrolling?
- Scroll mouse wheel while hovering over feed
- Drag directly on mobile/tablet
- Try different scroll direction

### 🔴 Data not saving?
- Check browser allows LocalStorage
- Try refreshing page
- Clear cache if issues persist

### 🔴 Modal won't open?
- Make sure you clicked the card (not just passed by)
- Try refresh page
- Check console for errors (F12)

### 🔴 Streak not showing?
- Only shows after first correct answer
- Look in navbar when learning modal open
- Gets reset per browser (not cloud-synced)

## Customization

### Add More Words
Edit `src/data/vocabulary.js`:
```javascript
{
  id: 26,
  word: '勉強',
  kana: 'べんきょう', 
  meaning: 'Study',
  example: '毎日勉強します。(I study every day.)'
}
```

### Change Colors
Edit `src/styles.css` CSS variables:
```css
:root {
  --primary-pink: #FFB6D9;  /* Change this */
  --soft-blue: #D4E8F5;     /* Or this */
  /* etc... */
}
```

### Modify Card Size
Edit `.feed-card-slot` in `styles.css`:
```css
.feed-card-slot {
  width: 300px;    /* Change this for bigger/smaller */
  height: 380px;   /* Adjust height too */
}
```

## Mobile Usage

### 📱 Best Practices
1. **Landscape mode** for better scrolling
2. **Use 2 fingers** to scroll if needed
3. **Tap buttons** instead of hover
4. **Full screen** for immersive learning

### 📐 Responsive Breakpoints
- **Phone** (< 480px): Single column, optimized
- **Tablet** (480-768px): 1-2 columns
- **Desktop** (> 768px): Full 3-column layout

## Data & Privacy

### 🔐 What's Stored?
- ✓ Learned words list
- ✓ Liked words list
- ✓ Current streak
- ✓ Accuracy percentage
- ✗ NOT sent to servers (fully local)

### 🗑️ Reset Progress
1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage"
4. Delete all entries
5. Refresh page

## Next Steps

### 🎓 After Learning 10 Words
- You'll have a streak going 🔥
- You'll know your accuracy rate
- You'll have favorites saved ♥️
- You're building momentum!

### 🌟 Advanced Usage
1. **Set daily goals**: Learn 5-10 words/day
2. **Build streaks**: Challenge yourself to 30-day streak 🔥
3. **Master favorites**: Focus on words you liked
4. **Test yourself**: Retake quizzes on same words
5. **Share progress**: Screenshot your streak!

## Troubleshooting Advanced

### Dev Console (F12)
- Check console for error messages
- Network tab if loading issues
- Application tab for LocalStorage data

### Performance
- App should be instant
- If slow, try clearing cache
- Try different browser if persists

---

**Happy Learning!** The redesigned app is now ready to make Japanese learning fun, addictive, and beautiful! 🗾✨

Start by clicking a card and let the learning begin! 📚
