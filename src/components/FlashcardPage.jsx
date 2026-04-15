import { useState, useEffect } from 'react'
import Flashcard from './Flashcard'
import { VOCABULARY_DATA, getUnlearnedWords } from '../data/vocabulary'

function FlashcardPage({ onNavigate, learnedWords, onMarkAsKnown, onMarkAsUnknown }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [words, setWords] = useState([])
  const [isFlipped, setIsFlipped] = useState(false)

  // Get unlearned words on component mount
  useEffect(() => {
    const unlearnedWords = getUnlearnedWords(learnedWords)
    setWords(unlearnedWords)
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [learnedWords])

  // Current word
  const currentWord = words[currentIndex]

  // Handle Know button
  const handleKnow = () => {
    if (currentWord) {
      onMarkAsKnown(currentWord.id)
      moveToNext()
    }
  }

  // Handle Don't Know button
  const handleDontKnow = () => {
    if (currentWord) {
      onMarkAsUnknown(currentWord.id)
      moveToNext()
    }
  }

  // Move to next flashcard
  const moveToNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      // All words completed
      onNavigate('home')
    }
  }

  // Move to previous
  const moveToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  // Handle card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  // Empty state
  if (words.length === 0) {
    return (
      <div className="card">
        <div className="header">
          <h1 className="app-title">Flashcard Mode</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">🎓</div>
          <div className="empty-state-title">No Words to Learn!</div>
          <p className="empty-state-text">
            You've learned all available words! Go back home to check your progress.
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
        <h1 className="app-title">📚 Flashcard</h1>
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

      {/* Flashcard */}
      <div className="flashcard-container" style={{ marginBottom: '28px' }}>
        <Flashcard
          word={currentWord}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>

      {/* Info Text */}
      <div style={{
        textAlign: 'center',
        color: '#666666',
        fontSize: '12px',
        marginBottom: '24px',
        fontWeight: 500
      }}>
        ← Click the card to reveal the answer →
      </div>

      {/* Action Buttons */}
      <div className="button-group full">
        <button
          className="btn btn-success"
          onClick={handleKnow}
        >
          ✓ Know
        </button>
        <button
          className="btn btn-error"
          onClick={handleDontKnow}
        >
          ✗ Don't Know
        </button>
      </div>

      {/* Navigation */}
      <div className="button-group full" style={{ marginTop: '16px' }}>
        <button
          className="btn btn-secondary btn-small"
          onClick={moveToPrevious}
          disabled={currentIndex === 0}
          style={{ opacity: currentIndex === 0 ? 0.5 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
        >
          ← Previous
        </button>
        <button
          className="btn btn-secondary btn-small"
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        <button
          className="btn btn-secondary btn-small"
          onClick={moveToNext}
          disabled={currentIndex === words.length - 1}
          style={{ opacity: currentIndex === words.length - 1 ? 0.5 : 1, cursor: currentIndex === words.length - 1 ? 'not-allowed' : 'pointer' }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default FlashcardPage
