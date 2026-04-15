function Quiz({ word, options, selectedAnswer, showFeedback, onSelectAnswer }) {
  return (
    <div>
      {/* Question */}
      <div className="quiz-question">
        What does this mean?
        <div style={{ fontSize: '28px', marginTop: '12px', fontWeight: 700 }}>
          {word.word}
        </div>
        <div style={{ fontSize: '16px', marginTop: '8px', fontWeight: 400, color: '#666666' }}>
          ({word.kana})
        </div>
      </div>

      {/* Options */}
      <div className="quiz-options">
        {options.map((option) => {
          let optionClassName = 'quiz-option'
          let isDisabled = false

          if (showFeedback) {
            if (option.id === word.id) {
              // Correct answer
              optionClassName = 'quiz-option correct'
              isDisabled = true
            } else if (selectedAnswer && option.id === selectedAnswer.id) {
              // User's incorrect selection
              optionClassName = 'quiz-option incorrect'
              isDisabled = true
            } else {
              isDisabled = true
            }
          } else if (selectedAnswer && option.id === selectedAnswer.id) {
            // Pre-feedback selection highlighting
            optionClassName = 'quiz-option selected'
          }

          return (
            <button
              key={option.id}
              className={optionClassName}
              onClick={() => !showFeedback && onSelectAnswer(option)}
              disabled={isDisabled}
            >
              {option.meaning}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`quiz-feedback ${selectedAnswer?.id === word.id ? 'correct' : 'incorrect'}`}>
          {selectedAnswer?.id === word.id
            ? '✓ Correct! Well done!'
            : `✗ Incorrect. The correct answer is: ${word.meaning}`}
        </div>
      )}
    </div>
  )
}

export default Quiz
