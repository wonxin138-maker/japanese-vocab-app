import { useState } from 'react'
import { getWordById } from '../data/vocabulary'

function ReviewPage({ reviewWords, onNavigate, onMoveFromReview, onMarkAsKnown }) {
  const [expandedId, setExpandedId] = useState(null)

  // Get full word objects
  const wordsToReview = reviewWords.map(id => getWordById(id)).filter(Boolean)

  // Handle move word back to learning
  const handleMoveToLearning = (wordId) => {
    onMoveFromReview(wordId)
  }

  // Handle mark as known from review
  const handleMarkAsKnown = (wordId) => {
    onMarkAsKnown(wordId)
  }

  // Empty state
  if (wordsToReview.length === 0) {
    return (
      <div className="card">
        <div className="header">
          <h1 className="app-title">Review</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">✨</div>
          <div className="empty-state-title">No Words to Review!</div>
          <p className="empty-state-text">
            Great job! Keep learning with flashcards to add words to your review list.
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
        <h1 className="app-title">🔄 Review</h1>
        <p className="app-subtitle">
          {wordsToReview.length} word{wordsToReview.length !== 1 ? 's' : ''} to review
        </p>
      </div>

      {/* Words List */}
      <div className="review-list">
        {wordsToReview.map((word) => (
          <div key={word.id} className="review-item">
            <div className="review-item-word">
              <div className="review-item-japanese">{word.word} ({word.kana})</div>
              <div className="review-item-english">{word.meaning}</div>
            </div>
            <div className="review-item-actions">
              <button
                className="review-btn review-btn-move"
                onClick={() => handleMarkAsKnown(word.id)}
                title="Mark as known"
              >
                ✓
              </button>
              <button
                className="review-btn review-btn-remove"
                onClick={() => handleMoveToLearning(word.id)}
                title="Remove from review"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div style={{
        marginTop: '20px',
        padding: '14px',
        background: 'linear-gradient(135deg, #FFE5F0 0%, #FFF8F0 100%)',
        borderRadius: '12px',
        fontSize: '12px',
        color: '#666666',
        textAlign: 'center',
        border: '1px solid rgba(255, 182, 217, 0.2)'
      }}>
        <div style={{ marginBottom: '8px' }}>✓ Mark as known when you've learned it</div>
        <div>✕ Remove from review if you want to skip for now</div>
      </div>

      {/* Navigation */}
      <div className="button-group full" style={{ marginTop: '24px' }}>
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

export default ReviewPage
