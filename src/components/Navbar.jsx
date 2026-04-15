function Navbar({ currentPage, onNavigate, streak, accuracy }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-logo">🗾</span>
          <h1 className="navbar-title">Japanese Vocab</h1>
        </div>

        <div className="navbar-stats">
          {streak > 0 && (
            <div className="stat-badge streakBadge">
              <span>🔥</span> {streak}
            </div>
          )}
          {accuracy > 0 && (
            <div className="stat-badge accuracyBadge">
              <span>✓</span> {accuracy}%
            </div>
          )}
        </div>

        <div className="navbar-nav">
          <button
            className={`nav-btn ${currentPage === 'feed' ? 'active' : ''}`}
            onClick={() => onNavigate('feed')}
          >
            📚 Feed
          </button>
          <button
            className={`nav-btn ${currentPage === 'favorites' ? 'active' : ''}`}
            onClick={() => onNavigate('favorites')}
          >
            ⭐ Favorites
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
