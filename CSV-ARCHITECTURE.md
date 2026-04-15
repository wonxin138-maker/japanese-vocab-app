# CSV 导入功能架构设计

## 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      React App (App.jsx)                     │
│                                                              │
│  State:                                                     │
│  ├─ learnedWords[] (原有)                                   │
│  ├─ likedWords[] (原有)                                     │
│  ├─ streak (原有)                                           │
│  ├─ progress{} (原有)                                       │
│  └─ importMessage (新增)                                    │
│                                                              │
│  Functions:                                                 │
│  ├─ handleImportFile() ◀── 新增 CSV 导入入口               │
│  ├─ handleOpenLearning() (原有)                              │
│  ├─ handleQuizAnswer() (原有)                                │
│  └─ handleToggleLike() (原有)                                │
│                                                              │
│  UI Components:                                             │
│  ├─ Navbar (原有)                                           │
│  ├─ ImportSection (新增) ◀── 导入按钮 UI                    │
│  ├─ ImportMessage (新增) ◀── 提示消息                       │
│  ├─ FeedPage (修改) ◀── 使用动态词汇                       │
│  ├─ FavoritesPage (原有)                                    │
│  └─ LearningModal (原有)                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
        ▲
        │ 调用
        │
┌───────┴──────────────────────────────────────────────────────┐
│            vocabulary.js (数据管理层)                        │
│                                                              │
│  导出常量:                                                  │
│  └─ VOCABULARY_DATA (25个默认词汇)                         │
│                                                              │
│  导出函数:                                                  │
│  ├─ initializeStorage()      ◀── 初始化 localStorage        │
│  ├─ getAllVocabulary()       ◀── 新增: 获取所有词汇         │
│  ├─ getWordById(id)          ◀── 修改: 使用动态词汇         │
│  ├─ getQuizOptions()         ◀── 修改: 使用动态词汇         │
│  ├─ getUnlearnedWords()      ◀── 修改: 使用动态词汇         │
│  ├─ addImportedWords()       ◀── 新增: 添加导入词汇         │
│  ├─ shuffleArray()           (原有)                         │
│  └─ getProgress()            (原有)                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
        ▲
        │ 读取/写入
        │
┌───────┴──────────────────────────────────────────────────────┐
│              localStorage (浏览器本地存储)                   │
│                                                              │
│  Keys:                                                      │
│  ├─ allVocabulary       ◀── 新增: 所有词汇                  │
│  │   [默认词汇 + 导入词汇]                                   │
│  ├─ learnedWords[]      (原有)                              │
│  ├─ likedWords[]        (原有)                              │
│  ├─ streak              (原有)                              │
│  └─ progress{}          (原有)                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 数据流向详解

### 1. 初始化流程

```
应用启动
  │
  └─► App.jsx useEffect
       └─► initializeStorage()
            │
            ├─► 检查 localStorage['allVocabulary']
            │    │
            │    ├─ 不存在 ───► 初始化为 VOCABULARY_DATA
            │    └─ 存在 ────► 继续使用
            │
            └─► 初始化其他 keys (learnedWords, streak 等)
```

### 2. CSV 导入流程

```
用户点击导入按钮
  │
  └─► <input type="file"> 选择 CSV
       │
       └─► handleImportFile()
            │
            ├─► FileReader.readAsText(file, 'UTF-8')
            │    │
            │    ├─ 检查文件是否为空
            │    │
            │    └─► 读取为文本字符串
            │
            ├─► 解析 CSV
            │    ├─ split('\n') ───► 按行分割
            │    ├─ filter(trim) ───► 过滤空行
            │    ├─ slice(1) ───► 跳过表头
            │    │
            │    └─► 循环处理每一行
            │         ├─ split(',') ───► 按逗号分字段
            │         ├─ trim() ───► 去除空格
            │         ├─ 验证 word, reading, meaning 非空
            │         │
            │         └─► 添加到 newWords 数组
            │
            ├─► 验证数据
            │    ├─ 文件非空 ✓
            │    ├─ 至少有表头+1行 ✓
            │    ├─ 找到有效数据行 ✓
            │    │
            │    └─ 验证失败 ───► 显示错误提示
            │
            ├─► addImportedWords(newWords)
            │    │
            │    ├─► getAllVocabulary() ───► 读取现有词汇
            │    │
            │    ├─► 计算最大 ID
            │    │    maxId = Math.max(...)
            │    │
            │    ├─► 转换格式并添加 ID
            │    │    {
            │    │      id: maxId + index + 1,
            │    │      word: word,
            │    │      kana: reading,      ◀── reading → kana
            │    │      meaning: meaning,
            │    │      example: string
            │    │    }
            │    │
            │    ├─► 合并数组
            │    │    combined = [...allWords, ...wordsWithIds]
            │    │
            │    └─► localStorage.setItem('allVocabulary', JSON.stringify(combined))
            │         ▼
            │    📦 数据已保存到本地存储
            │
            ├─► setImportMessage('✅ 导入成功！已添加 X 个单词')
            │    │
            │    └─► 3秒后自动清除消息
            │
            └─► event.target.value = '' ◀── 重置 file input
                   │
                   └─► 用户可再次选择文件
```

### 3. 词汇使用流程

```
FeedPage.jsx 组件加载
  │
  └─► useEffect 初始化
       │
       └─► setVocabularyData(getAllVocabulary())
            │
            └─► getAllVocabulary()
                 │
                 ├─► 读取 localStorage['allVocabulary']
                 │    │
                 │    └─► 存在 ───► 返回解析后的数据
                 │         不存在 ──► 返回 VOCABULARY_DATA
                 │
                 └─► 返回词汇数组
                      [
                        {id: 1, word: '水', kana: 'みず', ...},
                        {id: 2, word: '火', kana: 'ひ', ...},
                        ...
                        {id: 26, word: '食べる', kana: 'たべる', ...} ◀── 导入的
                      ]

FeedPage 渲染
  │
  └─► vocabularyData.map((word) => <FeedCard />)
       │
       └─► 显示所有词汇卡片 (默认 + 导入)

用户点击卡片
  │
  └─► onOpenLearning(wordId)
       │
       └─► LearningModal 打开
            │
            └─► getWordById(wordId)
                 │
                 ├─► getAllVocabulary()
                 │    │
                 │    └─► 返回完整词汇数组
                 │
                 └─► .find(word => word.id === wordId)
                      │
                      └─► 返回对应的词汇对象
                           (无论是默认还是导入都可以)
```

## 函数调用依赖图

```
handleImportFile()
    │
    ├─► setImportMessage()       [设置文本提示]
    │
    ├─► addImportedWords()       [核心处理函数]
    │   ├─► getAllVocabulary()   [读取现有词汇]
    │   └─► localStorage.setItem()  [保存数据]
    │
    └─► event.target.value = ''  [重置输入]


getAllVocabulary()              [数据读取函数]
    │
    ├─► localStorage.getItem('allVocabulary')
    │
    └─► JSON.parse()


getWordById(id)                 [单词查询函数]
    │
    └─► getAllVocabulary()
        └─► .find(word => word.id === id)


getQuizOptions(word)            [测验选项生成]
    │
    ├─► getAllVocabulary()
    ├─► .filter()
    ├─► shuffleArray()
    └─► [返回4个选项]


getUnlearnedWords(learnedIds)   [未学习词汇]
    │
    └─► getAllVocabulary()
        └─► .filter()
```

## localStorage 数据结构

### 初始化后

```javascript
{
  // 新增 key
  allVocabulary: [
    // 默认词汇
    { id: 1, word: '水', kana: 'みず', meaning: 'Water', example: '...' },
    { id: 2, word: '火', kana: 'ひ', meaning: 'Fire', example: '...' },
    ...
    { id: 25, word: '睡眠', kana: 'すいみん', meaning: 'Sleep', example: '...' },
    
    // 导入的词汇
    { id: 26, word: '食べる', kana: 'たべる', meaning: '吃', example: '食べるの例' },
    { id: 27, word: '飲む', kana: 'のむ', meaning: '喝', example: '飲むの例' }
  ],
  
  // 原有 keys
  learnedWords: [1, 3, 5],
  likedWords: [2, 4],
  streak: 7,
  progress: {
    correctAnswers: 10,
    totalAttempts: 12,
    accuracy: 83
  }
}
```

## 错误处理流程

```
CSV 文件处理异常
    │
    ├─► 文件为空
    │   └─► "❌ 文件为空，请选择有效的CSV文件"
    │
    ├─► 缺少表头或数据行
    │   └─► "❌ CSV格式错误，请确保包含表头和至少一行数据"
    │
    ├─► 字段不完整
    │   └─► 跳过该行，继续处理下一行
    │
    ├─► 所有行都无效
    │   └─► "❌ CSV中没有找到有效的数据行"
    │
    ├─► 解析异常
    │   └─► catch 捕获
    │       └─► "❌ CSV解析失败，请检查文件格式"
    │
    └─► 全部成功
        └─► "✅ 导入成功！已添加 X 个单词"
            └─► 3秒后消息消失
                └─► 用户看到新词汇出现在 Feed 中
```

## 组件通信

```
┌─────────────────┐
│   App.jsx       │
│                 │
│ • state 状态    │
│ • 业务逻辑      │
│ • 事件处理      │
└────────┬────────┘
         │
    ┌────┴────────────────────┬─────┬──────────┐
    │                         │     │          │
┌───▼──────┐       ┌──────────▼──┐ │   ┌──────▼─────┐
│ Navbar   │       │  FeedPage   │ │   │  Learning  │
│ (显示)    │       │ (显示动态)   │ │   │  Modal     │
└──────────┘       └──────┬───────┘ │   └────────────┘
                          │        │
                      ┌───▼─────┐ │
                      │ FeedCard │ │
                      │(点击事件)│ │
                      └──────────┘ │
                                   │
                          ┌────────▼──────────┐
                          │ FavoritesPage     │
                          │ (显示动态, 有搜索) │
                          └───────────────────┘
```

## 性能优化

```
CSV 导入性能
├─► FileReader 异步读取 (不阻塞 UI)
├─► 字符串操作在内存中 (快速)
├─► 一次性 localStorage.setItem (最小化 IO)
└─► 词汇查询使用 .find() (O(n) 可接受)

React 渲染优化
├─► vocabularyData 只初始化一次
├─► useEffect 依赖项为空 (仅初始化)
├─► 词汇改变时组件自动重新渲染
└─► 无不必要的重新计算
```

## 扩展点

```
未来可扩展的功能
├─► 词汇删除功能
│   └─► deleteWord(id) → 从 allVocabulary 中移除
│
├─► 词汇编辑功能
│   └─► editWord(id, newData) → 更新 allVocabulary
│
├─► 词汇分组功能
│   └─► 添加 category 字段
│
├─► 导出功能
│   └─► exportToCSV() → 生成 CSV 文件
│
├─► 数据同步
│   └─► localStorage → 云端 → 跨设备同步
│
└─► 批量操作
    └─► 导入多个 CSV 文件
        └─► 支持词汇去重
```

---

## 总结

✅ **架构清晰**：分离 UI、状态、数据存储
✅ **易于维护**：通过 localStorage 实现解耦
✅ **易于扩展**：新增功能不需要修改核心逻辑
✅ **性能高效**：异步处理，最小化 IO
✅ **错误完善**：完整的验证和错误处理

这个设计确保了 CSV 导入功能与现有系统的无缝集成！🎉
