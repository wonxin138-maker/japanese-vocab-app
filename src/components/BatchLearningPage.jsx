import { useState, useEffect } from 'react'
import { getAllVocabulary } from '../data/vocabulary'

function BatchLearningPage({ onBatchComplete, currentBatchIndex, onBatchIndexChange }) {
  const [vocabularyData, setVocabularyData] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isClicking, setIsClicking] = useState(false)
  const BATCH_SIZE = 10

  // Load vocabulary data from localStorage - only on mount
  useEffect(() => {
    const allWords = getAllVocabulary()
    setVocabularyData(allWords)
    setCurrentWordIndex(0)
  }, [])

  // Reset word index when changing batches
  useEffect(() => {
    setCurrentWordIndex(0)
    setIsClicking(false)
  }, [currentBatchIndex])

  // Get current batch of words
  const startIndex = currentBatchIndex * BATCH_SIZE
  const endIndex = startIndex + BATCH_SIZE
  const currentBatch = vocabularyData.slice(startIndex, endIndex)
  const currentWord = currentBatch[currentWordIndex]

  // Check if batch is complete
  const isBatchComplete = currentWordIndex >= currentBatch.length

  // Handle next word with debounce to prevent multiple clicks
  const handleNextWord = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    if (isClicking) return // Prevent multiple rapid clicks
    
    setIsClicking(true)
    setTimeout(() => setIsClicking(false), 300)

    if (currentWordIndex < currentBatch.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
    } else {
      // Show completion screen instead of immediately switching
      setCurrentWordIndex(currentBatch.length)
    }
  }

  // Handle next batch
  const handleNextBatch = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    if (isClicking) return
    
    setIsClicking(true)
    setTimeout(() => setIsClicking(false), 300)
    
    onBatchIndexChange(currentBatchIndex + 1)
  }

  // Handle restart
  const handleRestart = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    if (isClicking) return
    
    setIsClicking(true)
    setTimeout(() => setIsClicking(false), 300)
    
    onBatchIndexChange(0)
  }

  // Get motivational messages
  const getMotivationalMessage = () => {
    const messages = [
      '太棒了！你已经完成这一组学习了🎉',
      '你真的很厉害！继续加油💪',
      '完美！许多努力和毅力的结果✨',
      '太厉害了！你做了一项伟大的工作！🌟',
      '继续保持，你的学习热情令人印象深刻！🔥'
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  // Check if all words are completed
  if (vocabularyData.length === 0) {
    return (
      <div className="batch-learning-page">
        <div className="batch-empty">
          <p className="batch-empty-icon">📚</p>
          <p className="batch-empty-text">没有可用的词汇。请先导入 CSV 或使用默认词汇</p>
        </div>
      </div>
    )
  }

  // Check if passed the last batch
  if (vocabularyData.length <= startIndex) {
    return (
      <div className="batch-learning-page">
        <div className="batch-complete-celebration">
          <div className="celebration-content">
            <p className="celebration-emoji">🎊</p>
            <h2 className="celebration-title">你已经学完全部单词啦！</h2>
            <p className="celebration-subtitle">一共学习了 {vocabularyData.length} 个单词 👏</p>
            <p className="celebration-subtitle">再来一遍巩固一下吧 👇</p>
            <button 
              className="btn-restart" 
              onClick={handleRestart}
              disabled={isClicking}
            >
              🔄 从头再来
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show completion screen
  if (isBatchComplete && currentBatch.length > 0) {
    return (
      <div className="batch-learning-page">
        <div className="batch-completion-screen">
          <div className="completion-card">
            {/* Celebration Section */}
            <div className="completion-celebration">
              <p className="celebration-icon">🎉</p>
              <h2 className="completion-title">{getMotivationalMessage()}</h2>
              <p className="completion-stats">
                你在第 <span className="stats-number">{currentBatchIndex + 1}</span> 组学习了 <span className="stats-number">{currentBatch.length}</span> 个单词
              </p>
            </div>

            {/* Next Batch Button */}
            <button
              className="btn-next-batch"
              onClick={handleNextBatch}
              disabled={isClicking}
            >
              👉 继续挑战下一组 {BATCH_SIZE} 个
            </button>

            {/* Progress Info */}
            <div className="batch-progress-info">
              <p className="progress-text">
                进度: 第 {currentBatchIndex + 1} 组 / {Math.ceil(vocabularyData.length / BATCH_SIZE)} 组
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show word card
  return (
    <div className="batch-learning-page">
      <div className="batch-learning-container">
        {/* Header with Progress */}
        <div className="batch-header">
          <div className="batch-progress">
            <p className="batch-progress-label">第 {currentBatchIndex + 1} 组学习</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentWordIndex + 1) / currentBatch.length) * 100}%`
                }}
              />
            </div>
            <p className="batch-progress-count">
              {currentWordIndex + 1} / {currentBatch.length}
            </p>
          </div>
        </div>

        {/* Word Card */}
        {currentWord && (
          <div className="batch-word-card">
            <div className="word-card-content">
              {/* Japanese Word (Large) */}
              <div className="word-japanese">
                {currentWord.word || currentWord.kana}
              </div>

              {/* Reading (Gray) */}
              <div className="word-reading">
                {currentWord.reading || currentWord.kana}
              </div>

              {/* Meaning */}
              <div className="word-meaning">
                {currentWord.meaning}
              </div>

              {/* Example (if available) */}
              {currentWord.example && (
                <div className="word-example">
                  <p className="example-label">例句：</p>
                  <p className="example-text">{currentWord.example}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="batch-navigation">
          <button
            className="btn-next-word"
            onClick={handleNextWord}
            disabled={isClicking}
          >
            {currentWordIndex === currentBatch.length - 1 ? '✅ 完成这组' : '➜ 下一个'}
          </button>
        </div>

        {/* Batch Info */}
        <div className="batch-info">
          <p className="batch-info-text">
            总共 {currentBatch.length} 个单词 | 第 {currentWordIndex + 1} 个
          </p>
        </div>
      </div>
    </div>
  )
}

export default BatchLearningPage
