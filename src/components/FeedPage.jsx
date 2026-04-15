import { useState, useEffect } from 'react'
import FeedCard from './FeedCard'
import { getAllVocabulary } from '../data/vocabulary'

function FeedPage({ learnedWords, likedWords, onOpenLearning, onToggleLike }) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [vocabularyData, setVocabularyData] = useState([])

  // Load vocabulary data from localStorage
  useEffect(() => {
    setVocabularyData(getAllVocabulary())
  }, [])

  // Handle scroll
  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollLeft)
  }

  return (
    <div className="feed-page">
      {/* Header Section */}
      <div className="feed-header">
        <div className="feed-title-section">
          <h2 className="feed-title">✨ Today's Words</h2>
          <p className="feed-subtitle">Scroll to discover new vocabulary</p>
        </div>

        <div className="feed-stats-section">
          <div className="feed-stat">
            <span className="stat-icon">📚</span>
            <span className="stat-count">{learnedWords.length}</span>
            <span className="stat-label">Learned</span>
          </div>
          <div className="feed-stat">
            <span className="stat-icon">❤️</span>
            <span className="stat-count">{likedWords.length}</span>
            <span className="stat-label">Liked</span>
          </div>
        </div>
      </div>

      {/* Scrollable Feed */}
      <div className="feed-scroll-container" onScroll={handleScroll}>
        <div className="feed-cards-wrapper">
          {vocabularyData.map((word, index) => (
            <div key={word.id} className="feed-card-slot">
              <FeedCard
                wordId={word.id}
                onOpenLearning={onOpenLearning}
                onToggleLike={onToggleLike}
                isLiked={likedWords.includes(word.id)}
                isLearned={learnedWords.includes(word.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="feed-scroll-indicator">
        <div className="indicator-dots">
          {vocabularyData.map((_, index) => (
            <div
              key={index}
              className={`indicator-dot ${index === Math.floor(scrollPosition / 320) ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeedPage
