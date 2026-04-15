function Flashcard({ word, isFlipped, onFlip }) {
  return (
    <div
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={onFlip}
    >
      {!isFlipped ? (
        <>
          <div className="flashcard-label">Japanese</div>
          <div className="flashcard-word">{word.word}</div>
          <div className="flashcard-kana">{word.kana}</div>
          <div className="flashcard-hint">Click to reveal meaning</div>
        </>
      ) : (
        <>
          <div className="flashcard-label">Meaning</div>
          <div className="flashcard-meaning">{word.meaning}</div>
          <div className="flashcard-example">{word.example}</div>
          <div className="flashcard-hint">Click to go back</div>
        </>
      )}
    </div>
  )
}

export default Flashcard
