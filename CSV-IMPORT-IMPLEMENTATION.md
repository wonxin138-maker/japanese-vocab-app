# CSV 导入功能实现说明

## 功能概述

在现有日语背单词 App 基础上，增加了 **CSV 词库导入功能**，用户可以上传自己的 CSV 文件快速添加词汇。

## 核心修改

### 1. 📝 App.jsx 主组件修改

**新增状态：**
```javascript
const [importMessage, setImportMessage] = useState('')
```
用于显示导入结果提示信息

**新增函数：handleImportFile()**
- 读取上传的 CSV 文件（UTF-8 编码）
- 解析 CSV 格式：`word,reading,meaning`
- 验证数据完整性（防止乱码/格式错误）
- 调用 `addImportedWords()` 添加到词库
- 显示成功/失败提示消息

**新增 UI：**
```jsx
<div className="import-section">
  <label className="import-button">
    📥 导入日语词库
    <input type="file" accept=".csv" onChange={handleImportFile} />
  </label>
  <span className="import-hint">上传 CSV 文件（格式：word,reading,meaning）</span>
</div>
```

**导入消息显示：**
```jsx
{importMessage && (
  <div className="import-message">
    {importMessage}
  </div>
)}
```

### 2. 📊 vocabulary.js 数据管理修改

**修改 initializeStorage()：**
- 改用 `allVocabulary` 作为 localStorage 的键
- 初始化时将默认词库存储到 localStorage

**新增 getAllVocabulary()：**
```javascript
export const getAllVocabulary = () => {
  const stored = localStorage.getItem('allVocabulary')
  if (stored) return JSON.parse(stored)
  return VOCABULARY_DATA
}
```
从 localStorage 读取所有词汇（包含默认+导入的）

**更新 getWordById()：**
- 改为从 `getAllVocabulary()` 读取词汇

**更新 getQuizOptions()：**
- 改为从 `getAllVocabulary()` 读取词汇

**更新 getUnlearnedWords()：**
- 改为从 `getAllVocabulary()` 读取词汇

**新增 addImportedWords()：**
```javascript
export const addImportedWords = (newWords) => {
  const allWords = getAllVocabulary()
  const maxId = Math.max(...allWords.map(w => w.id), 0)
  
  // 为导入的词汇分配 ID
  const wordsWithIds = newWords.map((word, index) => ({
    id: maxId + index + 1,
    word: word.word,
    kana: word.reading,
    meaning: word.meaning,
    example: `${word.word}の例`
  }))
  
  // 合并并保存
  const combined = [...allWords, ...wordsWithIds]
  localStorage.setItem('allVocabulary', JSON.stringify(combined))
  return combined
}
```

### 3. 📱 FeedPage.jsx 组件修改

**改为动态加载词汇：**
```javascript
import { getAllVocabulary } from '../data/vocabulary'

function FeedPage(...) {
  const [vocabularyData, setVocabularyData] = useState([])
  
  useEffect(() => {
    setVocabularyData(getAllVocabulary())
  }, [])
  
  // 使用 vocabularyData 替代导入的 VOCABULARY_DATA
  {vocabularyData.map((word) => ...)}
}
```

### 4. 🎨 styles.css 样式新增

**导入按钮样式：**
```css
.import-section { }      /* 容器 */
.import-button { }       /* 导入按钮 */
.import-hint { }         /* 提示文本 */
.import-message { }      /* 成功/失败消息 */
```

**响应式设计：**
- 桌面：按钮和提示文本横排
- 移动：按钮全宽，提示文本居中

## 使用流程

```
用户点击导入按钮
    ↓
选择 CSV 文件
    ↓
FileReader 读取文件（UTF-8）
    ↓
解析 CSV（按行分割，按逗号分割字段）
    ↓
验证格式和数据完整性
    ↓
转换为词汇对象（添加 ID）
    ↓
调用 addImportedWords() 保存到 localStorage
    ↓
显示"✅ 导入成功"提示
    ↓
3秒后消息消失
    ↓
词汇立即出现在 Feed 页面
```

## 数据流向

```
CSV 文件 (word, reading, meaning)
    ↓
handleImportFile() 解析
    ↓
addImportedWords() 处理 ID
    ↓
localStorage['allVocabulary'] 存储
    ↓
getAllVocabulary() 返回所有词汇
    ↓
FeedPage/LearningModal 使用
```

## CSV 格式示例

```csv
word,reading,meaning
食べる,たべる,吃
飲む,のむ,喝
行く,いく,去
来る,くる,来
見る,みる,看
```

## 错误处理

| 场景 | 处理 |
|------|------|
| 文件为空 | ❌ 文件为空，请选择有效的CSV文件 |
| 缺少表头/数据 | ❌ CSV格式错误，请确保包含表头和至少一行数据 |
| 无效数据行 | 自动跳过，继续处理有效行 |
| 字段缺失 | ❌ CSV中没有找到有效的数据行 |
| 解析异常 | ❌ CSV解析失败，请检查文件格式 |
| 成功 | ✅ 导入成功！已添加 X 个单词 |

## 主要特性

✅ **UTF-8 编码支持**
- 正确显示日文、假名、中文没有乱码

✅ **格式验证**
- 检查文件完整性
- 验证 CSV 格式
- 跳过无效行

✅ **自动 ID 分配**
- 新词汇自动获得唯一 ID
- 从最大现有 ID 开始递增

✅ **本地存储**
- 所有导入词汇保存到 localStorage
- 浏览器刷新后数据持久化

✅ **即时反馈**
- 成功/失败消息实时显示
- 3 秒后自动隐藏

✅ **无缝集成**
- 导入的词汇与原有词汇完全兼容
- 可以参与学习、收藏、测验等所有功能

## 技术亮点

1. **UTF-8 编码处理**
   ```javascript
   reader.readAsText(file, 'UTF-8')
   ```

2. **CSV 解析算法**
   ```javascript
   const lines = text.split('\n').filter(line => line.trim())
   const dataLines = lines.slice(1)  // 跳过表头
   const parts = line.split(',').map(p => p.trim())
   ```

3. **数据验证**
   ```javascript
   if (!word || !reading || !meaning) continue  // 跳过无效行
   ```

4. **动态 ID 分配**
   ```javascript
   const maxId = Math.max(...allWords.map(w => w.id), 0)
   id: maxId + index + 1
   ```

5. **localStorage 动态管理**
   ```javascript
   const allWords = getAllVocabulary()  // 读取
   localStorage.setItem('allVocabulary', JSON.stringify(combined))  // 写入
   ```

## 兼容性

✅ 与现有功能完全兼容：
- 原有 25 个默认词汇完全保留
- 学习进度、收藏、streak 等功能不受影响
- 导入的词汇与默认词汇无差别

## 文件清单

| 文件 | 修改内容 |
|------|---------|
| src/App.jsx | 新增导入功能、状态管理、UI |
| src/data/vocabulary.js | 新增 getAllVocabulary、addImportedWords，修改其他函数 |
| src/components/FeedPage.jsx | 改为动态加载词汇 |
| src/styles.css | 新增导入相关样式 |
| sample-vocabulary.csv | 新增示例 CSV 文件 |
| CSV-IMPORT-GUIDE.md | 新增使用指南文档 |

## 测试清单

- [x] CSV 文件成功读取（UTF-8）
- [x] CSV 格式验证正确
- [x] 日文字符正确显示（无乱码）
- [x] 导入的词汇出现在 Feed 中
- [x] 导入的词汇可以学习
- [x] 导入的词汇可以收藏
- [x] 浏览器刷新后数据保留
- [x] 错误提示正确显示
- [x] 移动端样式正确

## 性能考虑

- FileReader 异步读取，不阻塞 UI
- CSV 解析在内存中进行，性能高效
- localStorage 操作仅在导入完成后执行一次

## 安全性考虑

- 文件仅在本地处理，不上传到服务器
- 数据完全私密，存储在浏览器本地
- 清除浏览器缓存后数据才会删除

---

## 快速开始

1. 点击"📥 导入日语词库"按钮
2. 选择格式为 `word,reading,meaning` 的 CSV 文件
3. 见到"✅ 导入成功"提示后，新词汇立即可用
4. 刷新页面后数据仍然保留

祝学习愉快！🗾✨
