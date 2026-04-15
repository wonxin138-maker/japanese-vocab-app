import { useState } from 'react'
import FeedCard from './FeedCard'
import { getWordById } from '../data/vocabulary'

function FavoritesPage({ likedWords, onOpenLearning, onToggleLike }) {
  const [filteredWords, setFilteredWords] = useState(likedWords)
  const [searchTerm, setSearchTerm] = useState('')

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value)
    if (value === '') {
      setFilteredWords(likedWords)
    } else {
      const filtered = likedWords.filter((wordId) => {
        const word = getWordById(wordId)
        if (!word) return false
        return (
          word.word.includes(value) ||
          word.kana.includes(value) ||
          word.meaning.toLowerCase().includes(value.toLowerCase())
        )
      })
      setFilteredWords(filtered)
    }
  }

  return (
    <div className="favorites-page">
      {/* Header */}
      <div className="favorites-header">
        <h2 className="favorites-title">⭐ Your Favorites</h2>
        <p className="favorites-subtitle">
          {likedWords.length} word{likedWords.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {/* Search Bar */}
      {likedWords.length > 0 && (
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search favorites..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      )}

      {/* Empty State */}
      {likedWords.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤍</div>
          <div className="empty-title">No Favorites Yet</div>
          <p className="empty-text">
            Like words in the feed to save them here!
          </p>
        </div>
      ) : filteredWords.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No Results</div>
          <p className="empty-text">
            Try a different search term
          </p>
        </div>
      ) : (
        /* Grid of Favorites */
        <div className="favorites-grid">
          {filteredWords.map((wordId) => (
            <div key={wordId} className="favorites-card-slot">
              <FeedCard
                wordId={wordId}
                onOpenLearning={onOpenLearning}
                onToggleLike={onToggleLike}
                isLiked={true}
                isLearned={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage
