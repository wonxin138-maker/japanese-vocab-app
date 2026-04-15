import { useState, useEffect, useCallback } from 'react'
import { getAllVocabulary, getQuizOptions } from '../data/vocabulary'

function QuizModePage({ onClose, onAnswer }) {
  const [allWords, setAllWords] = useState([])
  const [sessionIndex, setSessionIndex] = useState(0) // Which 10-word session (0, 1, 2...)
  const [indexInSession, setIndexInSession] = useState(0) // Which word in current session (0-9)
  const [options, setOptions] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [sessionCompleted, setSessionCompleted] = useState(false)

  const WORDS_PER_SESSION = 10

  // Funny celebration messages
  const celebrationMessages = [
    { title: '🎉 太棒了！', subtitle: '你已经背完10个单词了！怎么做到的？👑' },
    { title: '🔥 厉害了！', subtitle: '10个单词？小意思！你根本停不下来！💪' },
    { title: '✨ 天哪！', subtitle: '你已经坚持10题了！我都替你骄傲！🌟' },
    { title: '🚀 绝了！', subtitle: '10个单词搞定！你就是天选之人！🧠' },
    { title: '💎 完美！', subtitle: '又完成一轮10题！你是背单词天才吗？🤩' },
    { title: '🎊 超强！', subtitle: '10个单词全拿下！你要不要去参加比赛？🏆' },
    { title: '⭐ 神了！', subtitle: '坚持10题了！再这样下去你要成学霸了！📚' }
  ]

  // Load vocabulary once
  useEffect(() => {
    const words = getAllVocabulary()
    setAllWords(words)
  }, [])

  // Get current session words (10 words)
  const getCurrentSessionWords = useCallback(() => {
    const startIdx = sessionIndex * WORDS_PER_SESSION
    const endIdx = startIdx + WORDS_PER_SESSION
    return allWords.slice(startIdx, endIdx)
  }, [sessionIndex, allWords])

  // Generate new options when indexInSession changes
  useEffect(() => {
    if (allWords.length === 0) return

    const sessionWords = getCurrentSessionWords()
    if (sessionWords.length === 0) {
      // No more words available
      setSessionCompleted(true)
      return
    }

    const currentWord = sessionWords[indexInSession]
    const opts = getQuizOptions(currentWord, 4)

    setOptions(opts)
    setSelectedAnswer(null)
    setFeedback(null)
  }, [indexInSession, allWords, getCurrentSessionWords])

  const sessionWords = getCurrentSessionWords()
  const currentWord = sessionWords[indexInSession]

  const handleSelectOption = useCallback(
    (option) => {
      if (feedback) return

      const isCorrect = option.id === currentWord.id
      setSelectedAnswer(option)

      if (isCorrect) {
        setFeedback('correct')
        onAnswer(true)
      } else {
        setFeedback('incorrect')
        onAnswer(false)
      }
    },
    [feedback, currentWord, onAnswer]
  )

  const handleNextQuestion = () => {
    if (indexInSession + 1 >= WORDS_PER_SESSION || indexInSession + 1 >= sessionWords.length) {
      // Session completed
      setSessionCompleted(true)
    } else {
      // Move to next question
      setIndexInSession(indexInSession + 1)
    }
  }

  const handleContinueChallenge = () => {
    setSessionIndex(sessionIndex + 1)
    setIndexInSession(0)
    setSessionCompleted(false)
  }

  // Loading state
  if (allWords.length === 0) {
    return (
      <div className="quiz-mode-page">
        <div className="quiz-container" style={{ textAlign: 'center', padding: '40px' }}>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  // Completion state
  if (sessionCompleted) {
    const celebMsg = celebrationMessages[sessionIndex % celebrationMessages.length]
    const nextSessionExists = (sessionIndex + 1) * WORDS_PER_SESSION < allWords.length

    return (
      <div className="quiz-mode-page">
        <div className="quiz-container">
          <div className="completion-screen">
            <div className="completion-icon">🎉</div>
            <h1 className="completion-title">{celebMsg.title}</h1>
            <p className="completion-subtitle">{celebMsg.subtitle}</p>

            <div className="session-stats">
              <p>已完成第 {sessionIndex + 1} 轮（每轮 10 题）</p>
              <p>总共背了 {(sessionIndex + 1) * WORDS_PER_SESSION} 个单词</p>
            </div>

            <div className="completion-actions">
              {nextSessionExists && (
                <button className="btn-primary" onClick={handleContinueChallenge}>
                  继续挑战下一轮 →
                </button>
              )}
              <button className="btn-secondary" onClick={onClose}>
                {nextSessionExists ? '暂停休息' : '返回首页'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No words in this session
  if (sessionWords.length === 0) {
    return (
      <div className="quiz-mode-page">
        <div className="quiz-container">
          <div className="completion-screen">
            <div className="completion-icon">🎉</div>
            <h1 className="completion-title">恭喜！</h1>
            <p className="completion-subtitle">你已经学完所有单词了！太牛了！🏆</p>
            <div className="completion-actions">
              <button className="btn-primary" onClick={onClose}>
                返回首页
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-mode-page">
      <div className="quiz-header">
        <button className="quiz-close-btn" onClick={onClose}>
          ← 关闭
        </button>
        <div className="quiz-progress">
          第 {sessionIndex + 1} 轮 · {indexInSession + 1} / {WORDS_PER_SESSION}
        </div>
      </div>

      <div className="quiz-container">
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((indexInSession + 1) / WORDS_PER_SESSION) * 100}%` }}
          />
        </div>

        <div className="quiz-question-section">
          <div className="quiz-label">选择日语词汇的意思</div>
          <div className="quiz-word-card">
            <div className="quiz-word">{currentWord.word}</div>
            <div className="quiz-kana">（{currentWord.kana}）</div>
          </div>
        </div>

        <div className="quiz-options-grid">
          {options && options.length > 0 ? (
            options.map((option) => {
              let btnClass = 'quiz-option-btn'
              let isDisabled = feedback !== null

              if (feedback) {
                if (option.id === currentWord.id) {
                  btnClass += ' correct'
                } else if (selectedAnswer && option.id === selectedAnswer.id && feedback === 'incorrect') {
                  btnClass += ' incorrect'
                } else if (option.id !== currentWord.id) {
                  btnClass += ' disabled'
                }
              }

              return (
                <button
                  key={option.id}
                  className={btnClass}
                  onClick={() => handleSelectOption(option)}
                  disabled={isDisabled}
                >
                  {option.meaning}
                </button>
              )
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
              正在加载选项...
            </div>
          )}
        </div>

        {feedback === 'correct' && (
          <div className="quiz-feedback success">
            <div className="feedback-text">✅ 回答正确！🎉</div>
            <button className="btn-next-question" onClick={handleNextQuestion}>
              下一题 →
            </button>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="quiz-feedback error">
            <div className="feedback-text">❌ 再试试～</div>
            <div className="correct-answer">
              正确答案是：<strong>{currentWord.meaning}</strong>
            </div>
            <button className="btn-next-question" onClick={handleNextQuestion}>
              下一题 →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizModePage


