# 🖼️ Visual Layout Guide

This file shows what you'll see when you open the app!

---

## 📱 App Layout Overview

```
┌─────────────────────────────────────────┐
│ 📚 Learn Japanese    🔥 0   ✓ 0%       │ ← NAVBAR (sticky at top)
│ [ Feed ]  [ Favorites ]                 │
├─────────────────────────────────────────┤
│                                         │
│ Today's Words                           │ ← Feed Header
│ Scroll to discover...                   │
│ Learned: 0  Liked: 0                    │
│                                         │
│ ┌──────────┐  ┌──────────┐  ┌────────┐ │
│ │ 日本     │  │ 猫       │  │ 本     │ │ ← Vocabulary Cards
│ │ にほん   │  │ ねこ     │  │ ほん   │ │   (Horizontal Scroll)
│ │ Japan   │  │ Cat      │  │ Book   │ │
│ │         │  │          │  │        │ │
│ │ 🤍 📖   │  │ ❤️ 📖   │  │ 🤍 📖  │ │ ← Love & Learn buttons
│ └──────────┘  │ ✓Learned │  │        │ │   (appear on hover)
│               └──────────┘  └────────┘ │
│ ···· (scroll indicator dots) ········· │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Navbar Details

### Main Navbar
```
┌─────────────────────────────────────┐
│ 📚 Brand     [Streak]  [Accuracy]    │
│ Learn      🔥 5        ✓ 80%         │
├──────────────────┬──────────────────┤
│ [ ● Feed ]       │ [ Favorites ]    │
│    (active)      │                  │
└──────────────────┴──────────────────┘
```

### Badges
- **Streak Badge (🔥)**: Red/pink background, shows current streak
- **Accuracy Badge (✓)**: Green background, shows percentage correct
- **Active Tab**: Highlighted pink/blue color

---

## 🃏 Feed Card Details

### Single Card (Unclicked)
```
┌────────────────────────┐
│                        │  ← Pink gradient background
│   日本 (Japan)         │  ← Large kanji/word
│   にほん               │  ← Kana pronunciation
│                        │
│   Japan                │  ← English meaning
│                        │
│   日本です。(It's Japan│  ← Example sentence (italic)
│                        │
│   Click to learn →     │  ← Hover text
└────────────────────────┘
```

### Card on Hover (Interactive)
```
┌────────────────────────┐
│      (Card lifts up)    │  ← Hover effect
│   日本 (Japan)         │
│   にほん               │
│                        │ ← Buttons appear
│   Japan                │
│ 🤍 Like    📖 Learn     │  ← Action buttons
│                        │
│   日本です。           │
│                        │
└────────────────────────┘
```

### Card After Learning
```
┌────────────────────────┐
│                        │
│   日本 (Japan)         │
│   にほん               │
│ ✓ Learned              │  ← Badge appears
│   Japan                │
│ ❤️ Like    📖 Learn     │
│                        │
│   日本です。           │
│                        │
└────────────────────────┘
```

---

## 🎓 Learning Modal Layout

### Quiz Phase
```
                Modal Opens ↓
┌──────────────────────────────────────┐
│                    [X]                │  ← Close button
├──────────────────────────────────────┤
│                                      │
│   What is the meaning?               │  ← Question
│                                      │
│   日本 (にほん)                       │  ← Word + kana
│                                      │
│   🔥 Streak: 5                       │  ← Streak display
│                                      │
│   ┌──────────┐  ┌──────────┐        │
│   │  Japan   │  │  China   │        │  ← 4 options
│   └──────────┘  └──────────┘        │     (2x2 grid)
│   ┌──────────┐  ┌──────────┐        │
│   │  Korea   │  │  Thailand│        │
│   └──────────┘  └──────────┘        │
│                                      │
│              ✓ Correct!              │  ← Feedback
│              Great job! Keep it up! │     (after answer)
│                                      │
│     [ Next: Flashcard Review ]      │  ← Next button
│                                      │
└──────────────────────────────────────┘
```

### Quiz Feedback States

**Correct Answer (Green)**
```
┌────────────────┐
│ ✓ Correct!     │  ← Green button
│ Great work!    │
│ 😊              │
└────────────────┘
```

**Incorrect Answer (Red)**
```
┌────────────────┐
│ ✗ Incorrect    │  ← Red button
│ Oops! Try      │
│ 😅              │
│                │
│ ✓ Answer: China│  ← Correct shown in green
└────────────────┘
```

### Flashcard Phase
```
┌──────────────────────────────────────┐
│                    [X]                │
├──────────────────────────────────────┤
│                                      │
│   日本 (にほん)                       │  ← Word & kana
│   ─────────────────                  │  ← Divider
│   Japan                              │  ← Meaning
│                                      │
│   Example:                           │  ← Context
│   ┌──────────────────────────────┐  │
│   │ 日本が好きです。             │  │
│   │ (I like Japan.)              │  │
│   └──────────────────────────────┘  │
│                                      │
│   ✓ Already Learned                 │  ← Status
│                                      │
│     [ ← Back ]   [ Done → ]          │  ← Navigation
│                                      │
└──────────────────────────────────────┘
```

---

## ⭐ Favorites Page Layout

### Favorites Grid
```
┌─────────────────────────────────────┐
│ ⭐ Your Favorites                   │ ← Header
│ 3 words                             │
│                                     │
│ [🔍 Search]          [Clear] ✕    │ ← Search bar
│                                     │
│ ┌─────────┐ ┌─────────┐ ┌────────┐ │
│ │ 日本    │ │ 猫      │ │ 本     │ │ ← Grid layout
│ │ Japan  │ │ Cat     │ │ Book   │ │
│ │ ❤️      │ │ ❤️      │ │ ❤️     │ │
│ └─────────┘ └─────────┘ └────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### Search Results
```
Search: "Japan"  ↓

┌─────────────────────────────────────┐
│ Search results for "Japan"          │
│                                     │
│ ┌─────────┐ ┌─────────┐            │
│ │ 日本    │ │ 日本人  │            │
│ │ Japan  │ │ Person │            │
│ │ ❤️      │ │ ❤️      │            │
│ └─────────┘ └─────────┘            │
│                                     │
└─────────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────────┐
│                                     │
│            ❤️                       │
│                                     │
│   No Favorites Yet                  │
│                                     │
│   Like words to add them here!      │
│                                     │
└─────────────────────────────────────┘
```

### No Search Results
```
┌─────────────────────────────────────┐
│                                     │
│            🔍                       │
│                                     │
│   No Results Found                  │
│                                     │
│   Try searching for something else  │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### Main Colors (Used Throughout)
```
┌──────────────────┬──────────────┐
│ Primary Pink     │ #FFB6D9      │ ← Like buttons, "Done"
├──────────────────┼──────────────┤
│ Soft Blue        │ #D4E8F5      │ ← Learn buttons, options
├──────────────────┼──────────────┤
│ Success Green    │ #A8D8B8      │ ← Correct answers, badges
├──────────────────┼──────────────┤
│ Error Red        │ #F5A9A9      │ ← Wrong answers
├──────────────────┼──────────────┤
│ Cream Background │ #FFF8F0      │ ← Main background
└──────────────────┴──────────────┘
```

### Backgrounds
- Card Gradient 1: Pink → Light Pink (beautiful fade)
- Card Gradient 2: Blue → Light Blue (alternative)
- Modal Background: White/Cream with shadow
- Page Background: Very light cream

---

## 📊 Interactive Elements

### Button States

**Default State**
```
┌──────────────────┐
│ 📖 Learn         │  ← Blue background
│ (clickable)      │
└──────────────────┘
```

**Hover State**
```
┌──────────────────┐
│ 📖 Learn         │  ← Pink highlight
│ (lifts slightly) │
└──────────────────┘
```

**Active/Pressed**
```
┌──────────────────┐
│ 📖 Learn         │  ← Scales down
│ (pressed in)     │
└──────────────────┘
```

### Input Field (Search)
```
┌─────────────────────────────────┐
│ 🔍 [type to search...]           │  ← Placeholder text
│ ─────────────────────────────────│
│                                  │
```

---

## 📱 Mobile Layout

### Mobile Feed (Stacked)
```
┌──────────────────┐
│ 📚 Learn         │  ← Navbar adapted
│ 🔥 0  ✓ 0%       │
├──────────────────┤
│ Today's Words    │
│                  │
│ ┌──────────────┐ │
│ │ 日本         │ │  ← Cards smaller
│ │ Japan       │ │
│ │ 🤍 📖       │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ 猫           │ │
│ │ Cat         │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ 本           │ │
│ │ Book        │ │
│ └──────────────┘ │
│ scroll dots      │
└──────────────────┘
```

### Mobile Modal (Full Width)
```
┌──────────────────┐
│         [X]      │  ← Close
├──────────────────┤
│ What is the      │
│ meaning?         │
│                  │
│ 日本 にほん      │
│                  │
│ ┌──────────────┐ │
│ │ Japan        │ │  ← Single column
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ China        │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ Korea        │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ Thailand     │ │
│ └──────────────┘ │
│                  │
├──────────────────┤
│ [ Next ]         │
└──────────────────┘
```

---

## 🔄 User Flow Diagram

```
START
  ↓
┌─────────────────┐
│ Open App        │
│ See Feed        │
└────────┬────────┘
         ↓
    ┌───────────────┐
    │ Click Card    │
    └───────┬───────┘
            ↓
    ┌───────────────────┐
    │ Learning Modal    │
    │ - Quiz (Choose)   │
    │ - Flashcard       │
    └───────┬───────────┘
            ↓
    ┌───────────────┐
    │ Click Done    │
    │ Streak ↑ 🔥   │
    │ Word Learned  │
    │ Back to Feed  │
    └───────┬───────┘
            ↓
    ┌───────────────┐
    │ Like Word?    │
    │ Click Heart   │
    │ ❤️ Saved      │
    └───────┬───────┘
            ↓
    ┌───────────────────┐
    │ View Progress?    │
    │ Check Navbar     │
    │ 🔥 Streak        │
    │ ✓ Accuracy       │
    └───────┬───────────┘
            ↓
    ┌───────────────┐
    │ More Words?   │
    │ Go to Feed    │
    │ Or Favorites  │
    └───────┬───────┘
            ↓
    ┌───────────────┐
    │ Continue      │
    │ Learning!     │
    └───────────────┘
```

---

## ✨ Animation Preview

### Card Hover (Fade In + Lift)
```
Normal          →    Hover
┌──────────┐        ┌──────────┐
│          │        │          │  ← Moves up 8px
│   Card   │        │   Card   │
│          │        │          │
└──────────┘        └──────────┘
(Fades in full & lifts slightly)
```

### Correct Answer (Pulse)
```
Frame 1         Frame 2         Frame 3
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Answer  │ → │ Answer  │ → │ Answer  │
└─────────┘     └─────────┘     └─────────┘
Green           (Pulses 2x)     (Settles)
Appears
```

### Wrong Answer (Shake)
```
    ◄─────► shake animation
┌─────────┐
│ Answer  │  Wiggles side-to-side
└─────────┘
Red
Appears
```

### Modal Slide Up
```
Bottom → Top

[Modal]
[Modal]
  ↑
  (Slides up smoothly)
  ↑
  [Show]
```

---

## 📍 Key Positions

### Standard Desktop (1200px+)
```
Total Height: ~900px
├── Navbar: 80px (sticky)
├── Feed Header: 100px
├── Cards: 380px (with scroll dots)
├── Scrollbar: 12px
├── Bottom Padding: 50px
└── Total Visible: 622px
```

### Tablet (768-1199px)
```
Total Height: ~700px
├── Navbar: 70px (adjusted)
├── Feed Header: 80px
├── Cards: 320px
├── Scrollbar: 10px
└── Bottom Padding: 40px
```

### Mobile (480-767px)
```
Total Height: ~600px
├── Navbar: 60px (compact)
├── Feed Header: 70px
├── Cards: 260px (smaller)
├── Scrollbar: 8px
└── Bottom Padding: 20px
```

### Small Mobile (<480px)
```
Total Height: ~500px
├── Navbar: 50px (very compact)
├── Feed Header: 60px
├── Cards: 240px (very small)
├── Scrollbar: 6px
└── Bottom Padding: 15px
```

---

## 🎯 Interactive Checklist During Learning

```
┌─ FEED PAGE ─────────────────┐
│ [ ] Scroll through all 25   │
│ [ ] Like at least 3 words   │
│ [ ] Learn all 25 words      │
└─────────────────────────────┘
         ↓
┌─ QUIZ PHASE ────────────────┐
│ [ ] Answer correctly        │
│ [ ] Build 5-word streak     │
│ [ ] Get above 80% accuracy  │
└─────────────────────────────┘
         ↓
┌─ FLASHCARD PHASE ──────────┐
│ [ ] Review all words        │
│ [ ] Remember examples       │
│ [ ] Feel confident 😊       │
└─────────────────────────────┘
         ↓
┌─ FAVORITES ─────────────────┐
│ [ ] Like favorites          │
│ [ ] Search successfully     │
│ [ ] Discover patterns       │
└─────────────────────────────┘
         ↓
    SUCCESS! 🎉
```

---

## 🌟 What Every Element Does

| Element | What It Does |
|---------|-------------|
| **Card Click** | Opens learning modal |
| **Heart Icon** | Likes/unlikes word (saves to favorites) |
| **Learn Button** | Same as card click (opens modal) |
| **Quiz Option** | Selects answer (instant feedback) |
| **Next Button** | Goes from quiz to flashcard |
| **Back Button** | Goes from flashcard back to quiz |
| **Done Button** | Closes modal, returns to feed |
| **Favorites Tab** | Shows grid of liked words |
| **Search Box** | Filters favorites by text |
| **Streak Badge** | Shows current streak (🔥) |
| **Accuracy Badge** | Shows percentage correct (✓%) |
| **Scroll Dots** | Show position in feed |
| **X Button** | Closes learning modal |

---

## 💡 Visual Tips

- Cards have **soft rounded corners** (24px) for friendliness
- Buttons **lift on hover** for tactile feedback
- **Gradients** create visual interest without being loud
- **Shadows** add depth (3D effect)
- **Color coding** helps: Pink = important, Blue = secondary, Green = success, Red = error
- **Animations** are smooth (300ms mostly) so they feel responsive
- **Spacing** is generous so nothing feels cramped

---

## 📸 Screenshot Description

If you were to take a screenshot of the app, you'd see:

1. **Top:** Beautiful sticky navbar with app name and stats
2. **Middle:** Horizontally scrolling vocabulary cards with gradients
3. **Cards:** Show Japanese word, pronunciation, meaning, example
4. **Buttons:** Heart for like, book for learn
5. **Colors:** Soft pastels (pink, blue, cream)
6. **Feel:** Modern, smooth, aesthetic

When you click a card:
1. Modal slides up from bottom
2. Shows quiz question with 4 options
3. You click answer
4. Instant color feedback (green/red)
5. Shows correct answer if wrong
6. "Next" button appears
7. Click "Next" → Flashcard appears
8. Click "Done" → Back to feed
9. Your streak increases! 🔥

Click Favorites tab:
1. Shows grid of liked words
2. Each card is clickable to learn
3. Search bar filters in real-time
4. Empty state if no favorites yet

---

This is what you're going to see in just a few minutes after you run `npm run dev`! 🚀

Enjoy the beautiful design! 🎨✨
