// Built-in vocabulary data
export const VOCABULARY_DATA = [
  {
    id: 1,
    word: '水',
    kana: 'みず',
    meaning: 'Water',
    example: '水を飲みます。(I drink water.)'
  },
  {
    id: 2,
    word: '火',
    kana: 'ひ',
    meaning: 'Fire',
    example: '火は熱いです。(Fire is hot.)'
  },
  {
    id: 3,
    word: '木',
    kana: 'き',
    meaning: 'Tree',
    example: '大きい木があります。(There is a big tree.)'
  },
  {
    id: 4,
    word: '花',
    kana: 'はな',
    meaning: 'Flower',
    example: '花は美しいです。(Flowers are beautiful.)'
  },
  {
    id: 5,
    word: '月',
    kana: 'つき',
    meaning: 'Moon',
    example: '月がきれいです。(The moon is beautiful.)'
  },
  {
    id: 6,
    word: '星',
    kana: 'ほし',
    meaning: 'Star',
    example: 'たくさんの星があります。(There are many stars.)'
  },
  {
    id: 7,
    word: '山',
    kana: 'やま',
    meaning: 'Mountain',
    example: '高い山に登りました。(I climbed a high mountain.)'
  },
  {
    id: 8,
    word: '川',
    kana: 'かわ',
    meaning: 'River',
    example: '川は流れています。(The river is flowing.)'
  },
  {
    id: 9,
    word: '本',
    kana: 'ほん',
    meaning: 'Book',
    example: '本を読みます。(I read a book.)'
  },
  {
    id: 10,
    word: '猫',
    kana: 'ねこ',
    meaning: 'Cat',
    example: '猫はかわいいです。(Cats are cute.)'
  },
  {
    id: 11,
    word: '犬',
    kana: 'いぬ',
    meaning: 'Dog',
    example: '犬が好きです。(I like dogs.)'
  },
  {
    id: 12,
    word: '米',
    kana: 'こめ',
    meaning: 'Rice',
    example: '毎日米を食べます。(I eat rice everyday.)'
  },
  {
    id: 13,
    word: '好き',
    kana: 'すき',
    meaning: 'Like',
    example: '私は日本が好きです。(I like Japan.)'
  },
  {
    id: 14,
    word: '新しい',
    kana: 'あたらしい',
    meaning: 'New',
    example: '新しい車を買いました。(I bought a new car.)'
  },
  {
    id: 15,
    word: '古い',
    kana: 'ふるい',
    meaning: 'Old',
    example: '古い建物があります。(There is an old building.)'
  },
  {
    id: 16,
    word: '大きい',
    kana: 'おおきい',
    meaning: 'Big',
    example: 'これは大きい問題です。(This is a big problem.)'
  },
  {
    id: 17,
    word: '小さい',
    kana: 'ちいさい',
    meaning: 'Small',
    example: '小さい子どもです。(Small child.)'
  },
  {
    id: 18,
    word: 'おいしい',
    kana: 'おいしい',
    meaning: 'Delicious',
    example: 'これはとてもおいしいです。(This is very delicious.)'
  },
  {
    id: 19,
    word: '友達',
    kana: 'ともだち',
    meaning: 'Friend',
    example: '友達と遊びます。(I play with my friend.)'
  },
  {
    id: 20,
    word: '学校',
    kana: 'がっこう',
    meaning: 'School',
    example: '学校に行きます。(I go to school.)'
  },
  {
    id: 21,
    word: '先生',
    kana: 'せんせい',
    meaning: 'Teacher',
    example: '先生は親切です。(Teacher is kind.)'
  },
  {
    id: 22,
    word: '家',
    kana: 'いえ',
    meaning: 'House',
    example: '家に帰ります。(I go back home.)'
  },
  {
    id: 23,
    word: '食べる',
    kana: 'たべる',
    meaning: 'Eat',
    example: 'パンを食べます。(I eat bread.)'
  },
  {
    id: 24,
    word: '飲む',
    kana: 'のむ',
    meaning: 'Drink',
    example: 'コーヒーを飲みます。(I drink coffee.)'
  },
  {
    id: 25,
    word: '睡眠',
    kana: 'すいみん',
    meaning: 'Sleep',
    example: 'よく睡眠をとります。(I sleep well.)'
  }
]

// Initialize localStorage with default data
export const initializeStorage = () => {
  if (!localStorage.getItem('vocabulary')) {
    localStorage.setItem('vocabulary', JSON.stringify(VOCABULARY_DATA))
  }
  if (!localStorage.getItem('learnedWords')) {
    localStorage.setItem('learnedWords', JSON.stringify([]))
  }
  if (!localStorage.getItem('likedWords')) {
    localStorage.setItem('likedWords', JSON.stringify([]))
  }
  if (!localStorage.getItem('streak')) {
    localStorage.setItem('streak', JSON.stringify(0))
  }
  if (!localStorage.getItem('progress')) {
    localStorage.setItem('progress', JSON.stringify({
      correctAnswers: 0,
      totalAttempts: 0,
      accuracy: 0
    }))
  }
}

// Get a word by id
export const getWordById = (id) => {
  return VOCABULARY_DATA.find(word => word.id === id)
}

// Get progress from localStorage
export const getProgress = () => {
  return JSON.parse(localStorage.getItem('progress') || '{}')
}

// Get all words available for flashcard learning
export const getUnlearnedWords = (learnedWords) => {
  return VOCABULARY_DATA.filter(word => !learnedWords.includes(word.id))
}

// Shuffle array function
export const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Get random quiz options
export const getQuizOptions = (correctWord, count = 4) => {
  const otherWords = VOCABULARY_DATA.filter(w => w.id !== correctWord.id)
  const shuffled = shuffleArray(otherWords)
  const options = [correctWord, ...shuffled.slice(0, count - 1)]
  return shuffleArray(options)
}
