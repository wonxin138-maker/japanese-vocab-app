import { useState, useEffect } from 'react'
import { getWordById, getQuizOptions } from '../data/vocabulary'

function LearningModal({ wordId, isOpen, onClose, onAnswer, isLearned, streak }) {
  const word = getWordById(wordId)
  const [quizOptions, setQuizOptions] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [phase, setPhase] = useState('quiz')

  // Initialize quiz options when modal opens or word changes
  useEffect(() => {
    if (word && isOpen) {
      try {
        const options = getQuizOptions(word)
        setQuizOptions(options)
        setSelectedAnswer(null)
        setShowFeedback(false)
        setPhase('quiz')
      } catch (error) {
        console.error('Error generating quiz options:', error)
        setQuizOptions([word])  // Fallback: just show the correct word
      }
    }
  }, [word?.id, isOpen])

  if (!isOpen || !word) {
    return null
  }

  // Handle answer selection
  const handleSelectAnswer = (selectedWord) => {
    setSelectedAnswer(selectedWord)
    const correct = selectedWord.id === word.id
    setIsCorrect(correct)
    setShowFeedback(true)
    onAnswer(correct)
  }

  // Move to next phase
  const handleContinue = () => {
    if (phase === 'quiz') {
      setPhase('flashcard')
    } else {
      onClose()
    }
  }

  return (
    <div className={`learning-modal-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose}>
      <div className="learning-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* Streak indicator */}
        {streak > 0 && (
          <div className="modal-streak">
            🔥 {streak} Streak!
          </div>
        )}

        {/* Content */}
        {phase === 'quiz' ? (
          <div className="modal-content quiz-phase">
            {/* Question */}
            <div className="quiz-question-section">
              <div className="quiz-label">What is the meaning?</div>
              <div className="quiz-word-display">
                <div className="quiz-word">{word.word}</div>
                <div className="quiz-kana">{word.kana}</div>
              </div>
            </div>

            {/* Options */}
            <div className="quiz-options-grid">
              {quizOptions.map((option) => {
                let optionClassName = 'quiz-option-btn'

                if (showFeedback) {
                  if (option.id === word.id) {
                    optionClassName += ' correct'
                  } else if (selectedAnswer && option.id === selectedAnswer.id) {
                    optionClassName += ' incorrect'
                  } else {
                    optionClassName += ' disabled'
                  }
                } else if (selectedAnswer && option.id === selectedAnswer.id) {
                  optionClassName += ' selected'
                }

                return (
                  <button
                    key={option.id}
                    className={optionClassName}
                    onClick={() => !showFeedback && handleSelectAnswer(option)}
                    disabled={showFeedback}
                  >
                    {option.meaning}
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className={`feedback-message ${isCorrect ? 'success' : 'error'}`}>
                {isCorrect ? (
                  <>
                    <span className="feedback-icon">🎉</span>
                    <div>Correct! Well done!</div>
                  </>
                ) : (
                  <>
                    <span className="feedback-icon">📚</span>
                    <div>The correct answer is: <strong>{word.meaning}</strong></div>
                  </>
                )}
              </div>
            )}

            {/* Continue button */}
            {showFeedback && (
              <button className="modal-btn-primary" onClick={handleContinue}>
                Next: Flashcard Review
              </button>
            )}
          </div>
        ) : (
          <div className="modal-content flashcard-phase">
            {/* Flashcard Review */}
            <div className="modal-flashcard">
              <div className="flashcard-display">
                <div className="flashcard-kanji">{word.word}</div>
                <div className="flashcard-kana">{word.kana}</div>
                <div className="flashcard-divider"></div>
                <div className="flashcard-meaning">{word.meaning}</div>
              </div>

              {/* Example sentence */}
              <div className="example-section">
                <div className="example-title">📖 Example:</div>
                <div className="example-text">{word.example}</div>
              </div>

              {/* Status */}
              {isLearned && (
                <div className="learned-status">
                  ✓ You've already learned this word!
                </div>
              )}

              {/* Buttons */}
              <div className="modal-button-group">
                <button
                  className="modal-btn-secondary"
                  onClick={onClose}
                >
                  ← Back
                </button>
                <button
                  className="modal-btn-primary"
                  onClick={onClose}
                >
                  Done! ✓
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LearningModal
