import { useState } from 'react'
import { getWordById } from '../data/vocabulary'

function FeedCard({ wordId, onOpenLearning, onToggleLike, isLiked, isLearned }) {
  const word = getWordById(wordId)
  const [isHovered, setIsHovered] = useState(false)

  if (!word) return null

  return (
    <div
      className="feed-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenLearning(wordId)}
    >
      {/* Card Background with gradient */}
      <div className={`feed-card-background ${isLearned ? 'learned' : ''}`}>
        {/* Upper section - Japanese word */}
        <div className="feed-card-top">
          {isLearned && <div className="learned-badge">✓ Learned</div>}
          <div className="feed-word-large">{word.word}</div>
          <div className="feed-kana">{word.kana}</div>
        </div>

        {/* Middle section - Meaning */}
        <div className="feed-card-middle">
          <div className="feed-meaning">{word.meaning}</div>
        </div>

        {/* Lower section - Example */}
        <div className="feed-card-bottom">
          <div className="example-label">例：</div>
          <div className="feed-example">{word.example}</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className={`feed-card-actions ${isHovered ? 'visible' : ''}`}>
        <button
          className={`action-btn like-btn ${isLiked ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleLike(wordId)
          }}
          title="Like this word"
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
        <button
          className="action-btn learn-btn"
          onClick={(e) => {
            e.stopPropagation()
            onOpenLearning(wordId)
          }}
          title="Learn this word"
        >
          📖 Learn
        </button>
      </div>

      {/* Click to learn indicator */}
      {!isHovered && (
        <div className="feed-card-cta">
          Click to learn
        </div>
      )}
    </div>
  )
}

export default FeedCard
