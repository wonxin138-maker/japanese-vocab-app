import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import FeedPage from './components/FeedPage'
import FavoritesPage from './components/FavoritesPage'
import LearningModal from './components/LearningModal'
import { initializeStorage } from './data/vocabulary'

function App() {
  const [currentPage, setCurrentPage] = useState('feed')
  const [selectedWordId, setSelectedWordId] = useState(null)
  const [isLearningOpen, setIsLearningOpen] = useState(false)
  const [learnedWords, setLearnedWords] = useState([])
  const [likedWords, setLikedWords] = useState([])
  const [streak, setStreak] = useState(0)
  const [progress, setProgress] = useState({
    correctAnswers: 0,
    totalAttempts: 0,
    accuracy: 0
  })

  // Initialize data from localStorage on mount
  useEffect(() => {
    initializeStorage()
    const savedLearnedWords = JSON.parse(localStorage.getItem('learnedWords') || '[]')
    const savedLikedWords = JSON.parse(localStorage.getItem('likedWords') || '[]')
    const savedStreak = JSON.parse(localStorage.getItem('streak') || '0')
    const savedProgress = JSON.parse(localStorage.getItem('progress') || '{}')

    setLearnedWords(savedLearnedWords)
    setLikedWords(savedLikedWords)
    setStreak(savedStreak)
    setProgress(savedProgress)
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('learnedWords', JSON.stringify(learnedWords))
  }, [learnedWords])

  useEffect(() => {
    localStorage.setItem('likedWords', JSON.stringify(likedWords))
  }, [likedWords])

  useEffect(() => {
    localStorage.setItem('streak', JSON.stringify(streak))
  }, [streak])

  useEffect(() => {
    localStorage.setItem('progress', JSON.stringify(progress))
  }, [progress])

  // Open learning modal for a word
  const handleOpenLearning = (wordId) => {
    setSelectedWordId(wordId)
    setIsLearningOpen(true)
  }

  // Close learning modal
  const handleCloseLearning = () => {
    setIsLearningOpen(false)
    setSelectedWordId(null)
  }

  // Handle quiz answer
  const handleQuizAnswer = (isCorrect) => {
    if (isCorrect) {
      setStreak(streak + 1)
      if (!learnedWords.includes(selectedWordId)) {
        setLearnedWords([...learnedWords, selectedWordId])
      }
    }

    const newProgress = {
      correctAnswers: progress.correctAnswers + (isCorrect ? 1 : 0),
      totalAttempts: progress.totalAttempts + 1
    }
    newProgress.accuracy = Math.round((newProgress.correctAnswers / newProgress.totalAttempts) * 100)
    setProgress(newProgress)
  }

  // Toggle like/favorite
  const handleToggleLike = (wordId) => {
    if (likedWords.includes(wordId)) {
      setLikedWords(likedWords.filter(id => id !== wordId))
    } else {
      setLikedWords([...likedWords, wordId])
    }
  }

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'feed':
        return (
          <FeedPage
            learnedWords={learnedWords}
            likedWords={likedWords}
            onOpenLearning={handleOpenLearning}
            onToggleLike={handleToggleLike}
          />
        )
      case 'favorites':
        return (
          <FavoritesPage
            likedWords={likedWords}
            onOpenLearning={handleOpenLearning}
            onToggleLike={handleToggleLike}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="app-wrapper">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        streak={streak}
        accuracy={progress.accuracy}
      />
      
      <div className="app-content">
        {renderPage()}
      </div>

      {isLearningOpen && (
        <LearningModal
          wordId={selectedWordId}
          isOpen={isLearningOpen}
          onClose={handleCloseLearning}
          onAnswer={handleQuizAnswer}
          isLearned={learnedWords.includes(selectedWordId)}
          streak={streak}
        />
      )}
    </div>
  )
}

export default App
