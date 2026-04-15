import { useState, useEffect } from 'react'
import Quiz from './Quiz'
import { VOCABULARY_DATA, getUnlearnedWords, getQuizOptions, shuffleArray } from '../data/vocabulary'

function QuizPage({ onNavigate, learnedWords, onAnswer }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [words, setWords] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [quizOptions, setQuizOptions] = useState([])

  // Get unlearned words on component mount
  useEffect(() => {
    const unlearnedWords = getUnlearnedWords(learnedWords)
    const shuffledWords = shuffleArray(unlearnedWords)
    setWords(shuffledWords)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setCorrectCount(0)

    // Generate options for first word
    if (shuffledWords.length > 0) {
      setQuizOptions(getQuizOptions(shuffledWords[0]))
    }
  }, [learnedWords])

  // Update quiz options when current word changes
  useEffect(() => {
    if (words.length > 0 && currentIndex < words.length) {
      setQuizOptions(getQuizOptions(words[currentIndex]))
      setSelectedAnswer(null)
      setShowFeedback(false)
    }
  }, [currentIndex, words])

  const currentWord = words[currentIndex]

  // Handle answer selection
  const handleSelectAnswer = (selectedWord) => {
    setSelectedAnswer(selectedWord)
    setShowFeedback(true)

    const isCorrect = selectedWord.id === currentWord.id
    if (isCorrect) {
      setCorrectCount(correctCount + 1)
    }

    // Call parent handler
    onAnswer(isCorrect)
  }

  // Move to next question
  const moveToNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Quiz completed
      onNavigate('home')
    }
  }

  // Empty state
  if (words.length === 0) {
    return (
      <div className="card">
        <div className="header">
          <h1 className="app-title">Quiz Mode</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-title">No Words to Quiz!</div>
          <p className="empty-state-text">
            You need to learn some words first. Go back to flashcards!
          </p>
        </div>
        <div className="button-group full">
          <button
            className="btn btn-primary"
            onClick={() => onNavigate('home')}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="header">
        <h1 className="app-title">❓ Quiz</h1>
        <p className="app-subtitle">
          {currentIndex + 1} of {words.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '6px',
        background: '#E8F4F8',
        borderRadius: '4px',
        marginBottom: '28px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${((currentIndex + 1) / words.length) * 100}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #FFB6D9 0%, #D4E8F5 100%)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Quiz */}
      <div className="quiz-container">
        <Quiz
          word={currentWord}
          options={quizOptions}
          selectedAnswer={selectedAnswer}
          showFeedback={showFeedback}
          onSelectAnswer={handleSelectAnswer}
        />
      </div>

      {/* Score */}
      <div style={{
        textAlign: 'center',
        fontSize: '14px',
        color: '#666666',
        marginTop: '20px',
        padding: '12px',
        background: '#E8F4F8',
        borderRadius: '12px'
      }}>
        Correct: {correctCount} / {currentIndex + (showFeedback ? 1 : 0)}
      </div>

      {/* Navigation */}
      {showFeedback && (
        <div className="button-group full" style={{ marginTop: '24px' }}>
          <button
            className="btn btn-primary"
            onClick={moveToNext}
          >
            {currentIndex === words.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}

      <div className="button-group" style={{ marginTop: '16px', justifyContent: 'center' }}>
        <button
          className="btn btn-secondary btn-small"
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
      </div>
    </div>
  )
}

export default QuizPage
