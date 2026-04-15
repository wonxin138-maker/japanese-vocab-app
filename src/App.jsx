import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import FeedPage from './components/FeedPage'
import FavoritesPage from './components/FavoritesPage'
import LearningModal from './components/LearningModal'
import BatchLearningPage from './components/BatchLearningPage'
import QuizModePage from './components/QuizModePage'
import { initializeStorage, addImportedWords } from './data/vocabulary'

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
  const [importMessage, setImportMessage] = useState('')
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0)

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

  // Handle CSV file import
  const handleImportFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Clear message after 3 seconds
    const clearTimer = setTimeout(() => setImportMessage(''), 3000)

    // Check if file is empty
    if (file.size === 0) {
      setImportMessage('❌ 文件为空，请选择有效的CSV文件')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result
        if (typeof text !== 'string') {
          setImportMessage('❌ 文件读取失败')
          return
        }

        // Split by newline and filter empty lines
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length < 2) {
          setImportMessage('❌ CSV格式错误，请确保包含表头和至少一行数据')
          return
        }

        // Skip header row
        const dataLines = lines.slice(1)
        const newWords = []

        // Parse each line
        for (const line of dataLines) {
          const parts = line.split(',').map(p => p.trim())
          
          if (parts.length < 3) {
            // Skip invalid rows
            continue
          }

          const [word, reading, meaning] = parts
          
          // Skip rows with missing data
          if (!word || !reading || !meaning) {
            continue
          }

          newWords.push({
            word,
            reading,
            meaning
          })
        }

        if (newWords.length === 0) {
          setImportMessage('❌ CSV中没有找到有效的数据行')
          return
        }

        // Add imported words to vocabulary
        addImportedWords(newWords)
        setImportMessage(`✅ 导入成功！已添加 ${newWords.length} 个单词`)
        
        // Reset file input
        event.target.value = ''
      } catch (error) {
        console.error('CSV parsing error:', error)
        setImportMessage('❌ CSV解析失败，请检查文件格式')
      }
    }

    // Read file as UTF-8 text
    reader.readAsText(file, 'UTF-8')
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
      case 'batch':
        return (
          <BatchLearningPage
            currentBatchIndex={currentBatchIndex}
            onBatchIndexChange={setCurrentBatchIndex}
            onBatchComplete={() => {
              setStreak(streak + 1)
            }}
          />
        )
      case 'quiz':
        return (
          <QuizModePage
            onClose={() => setCurrentPage('feed')}
            onAnswer={handleQuizAnswer}
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
      
      {/* Import Message */}
      {importMessage && (
        <div className="import-message">
          {importMessage}
        </div>
      )}

      {/* Import Button */}
      <div className="import-section">
        <label className="import-button">
          📥 导入日语词库
          <input
            type="file"
            accept=".csv"
            onChange={handleImportFile}
            style={{ display: 'none' }}
          />
        </label>
        <span className="import-hint">上传 CSV 文件（格式：word,reading,meaning）</span>
      </div>
      
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
