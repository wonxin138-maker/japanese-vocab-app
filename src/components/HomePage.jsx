import { useState } from 'react'

function HomePage({ progress, onNavigate, learnedCount, reviewCount }) {
  const [showStats, setShowStats] = useState(false)

  return (
    <div className="card">
      <div className="header">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗾</div>
        <h1 className="app-title">Japanese Vocab</h1>
        <p className="app-subtitle">Learn through flashcards and quizzes</p>
      </div>

      {/* Progress Summary */}
      <div className="progress-summary">
        <div className="progress-box">
          <div className="progress-label">Learned Today</div>
          <div>
            <span className="progress-value">{learnedCount}</span>
            <span className="progress-unit">words</span>
          </div>
        </div>
        <div className="progress-box blue">
          <div className="progress-label">Accuracy</div>
          <div>
            <span className="progress-value">{progress.accuracy || 0}</span>
            <span className="progress-unit">%</span>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      {progress.totalAttempts > 0 && (
        <div className="progress-summary">
          <div className="progress-box">
            <div className="progress-label">Total Attempts</div>
            <div>
              <span className="progress-value">{progress.totalAttempts}</span>
            </div>
          </div>
          <div className="progress-box blue">
            <div className="progress-label">Correct</div>
            <div>
              <span className="progress-value">{progress.correctAttempts}</span>
            </div>
          </div>
        </div>
      )}

      {reviewCount > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #FFE5F0 0%, #FFF8F0 100%)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'center',
          border: '2px solid rgba(255, 182, 217, 0.3)'
        }}>
          <div className="progress-label">Words to Review</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#2C2C2C' }}>
            {reviewCount}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="button-group full">
        <button
          className="btn btn-primary"
          onClick={() => onNavigate('flashcard')}
        >
          📚 Flashcard
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onNavigate('quiz')}
        >
          ❓ Quiz
        </button>
      </div>

      {reviewCount > 0 && (
        <div className="button-group full">
          <button
            className="btn btn-secondary"
            onClick={() => onNavigate('review')}
            style={{ marginTop: '0' }}
          >
            🔄 Review ({reviewCount})
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div style={{
        marginTop: '32px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#666666',
        lineHeight: '1.6'
      }}>
        <p>💡 Click on flashcards to reveal the meaning</p>
        <p>Mark as "Know" to move to learned, or "Don't know" to add to review list</p>
      </div>
    </div>
  )
}

export default HomePage
