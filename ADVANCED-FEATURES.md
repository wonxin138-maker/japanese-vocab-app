# 🚀 AI宠物 - 高级扩展指南

## 1️⃣ 集成 OpenAI API

### 配置步骤

**A. 获取API Key**
1. 访问 [platform.openai.com](https://platform.openai.com)
2. 登录/注册
3. 左侧菜单 → API keys → Create new secret key
4. 复制KEY，妥善保管

**B. 创建后端代理** (必要！不能在前端暴露密钥)

创建 `api-proxy.js` (Node.js Express服务)：

```javascript
require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body
        
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个治愈的AI宠物，名叫毛毛。性格温柔可爱，喜欢和用户聊天。'
                    },
                    ...history,
                    { role: 'user', content: message }
                ],
                temperature: 0.8,  // 更有个性
                max_tokens: 100
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        
        res.json({
            reply: response.data.choices[0].message.content
        })
    } catch (error) {
        console.error('API Error:', error)
        res.status(500).json({ error: error.message })
    }
})

app.listen(3000, () => {
    console.log('AI宠物API服务运行在 http://localhost:3000')
})
```

**C. 修改前端代码**

在 `pet-chat.js` 中重写 `generateResponse`:

```javascript
class PetChatAI {
    constructor() {
        this.conversationHistory = []
        this.apiUrl = 'http://localhost:3000/api/chat'  // 本地代理
    }

    async generateResponse(userMessage) {
        this.messageCount++
        
        // 转换历史记录格式
        const history = this.conversationHistory.slice(-10).map(msg => ({
            role: msg.role || 'user',
            content: msg.user || msg.assistant
        }))

        try {
            // 调用API
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: history
                })
            })

            if (!response.ok) throw new Error('API调用失败')
            
            const data = await response.json()
            const aiResponse = data.reply

            // 保存对话
            this.conversationHistory.push({
                user: userMessage,
                assistant: aiResponse,
                timestamp: Date.now()
            })

            return aiResponse

        } catch (error) {
            console.error('API Error:', error)
            // 降级方案：使用本地规则
            return this._fallbackResponse(userMessage)
        }
    }

    _fallbackResponse(message) {
        // 回退到原本的本地逻辑
        const emotion = detectEmotion(message)
        return getResponseByMood('greeting', emotion)
    }
}
```

### 成本注意

```
费用模型 (按输入/输出token计费)
─────────────────────────────────
gpt-3.5-turbo:    $0.0015 / 1K输入
                  $0.002 / 1K输出
(平均每条回复成本: ~$0.0001)

每日成本估算:
100条消息 × $0.0001 = $0.01 (几乎免费✓)
```

---

## 2️⃣ 添加成长/等级系统

### 实现思路

修改 `pet-state.js`，添加 `PetGrowthSystem`:

```javascript
class PetGrowthSystem {
    constructor() {
        this.level = 1
        this.experience = 0
        this.levelThreshold = 100  // 每级需要100经验
        this.achievements = new Map()
        this.evolutionStage = 'baby'  // baby → teen → adult
    }

    // 获取经验
    gainExp(amount, source = '') {
        this.experience += amount
        
        // 记录日志
        console.log(`+${amount}经验 来自 ${source}`)
        
        // 检查升级
        while (this.experience >= this.levelThreshold) {
            this.levelUp()
        }
        
        this.notifyUpdate()
    }

    levelUp() {
        this.level++
        this.experience -= this.levelThreshold
        this.levelThreshold = Math.floor(100 * Math.pow(1.1, this.level - 1))
        
        console.log(`🎉 毛毛升级到了 LV${this.level}！`)
        
        // 触发进化
        this.checkEvolution()
    }

    checkEvolution() {
        if (this.level >= 10 && this.evolutionStage === 'baby') {
            this.evolve('teen')
        } else if (this.level >= 30 && this.evolutionStage === 'teen') {
            this.evolve('adult')
        }
    }

    evolve(newStage) {
        const messages = {
            teen: '毛毛进化了！变得更聪明了~ ✨',
            adult: '毛毛成长为大宠物了！ 🎊'
        }
        this.evolutionStage = newStage
        console.log(messages[newStage])
        
        // 触发外观变化
        this.updateAppearance()
    }

    updateAppearance() {
        // 根据进化阶段修改SVG
        const svgElement = document.querySelector('.pet-svg')
        
        if (this.evolutionStage === 'teen') {
            svgElement.style.transform = 'scale(1.1)'
        } else if (this.evolutionStage === 'adult') {
            svgElement.style.transform = 'scale(1.2)'
        }
    }

    unlockAchievement(id, name) {
        if (!this.achievements.has(id)) {
            this.achievements.set(id, {
                id, name,
                unlockedAt: Date.now()
            })
            console.log(`🏆 解锁成就: ${name}`)
        }
    }

    save() {
        return {
            level: this.level,
            experience: this.experience,
            achievementIds: Array.from(this.achievements.keys())
        }
    }
}

// 修改体验获取方式
petState.growth = new PetGrowthSystem()

// 在不同交互中增加经验
const oldOnChat = petState.onChat.bind(petState)
petState.onChat = function(length) {
    oldOnChat(length)
    petState.growth.gainExp(5, '聊天')  // +5经验
    
    if (arguments.length > 50) {
        petState.growth.gainExp(5, '长消息')
    }
}
```

### 成就系统配置

```javascript
const ACHIEVEMENTS = [
    {
        id: 'first_chat',
        name: '初次对话',
        description: '和毛毛聊天一次',
        icon: '💬',
        condition: () => petState.stats.totalMessages >= 1
    },
    {
        id: 'chatterbox',
        name: '长舌鸟',
        description: '和毛毛聊天50次',
        icon: '🗣️',
        condition: () => petState.stats.totalMessages >= 50
    },
    {
        id: 'feeder',
        name: '贴心小帮手',
        description: '喂食毛毛10次',
        icon: '🍖',
        condition: () => petState.feedCount >= 10
    },
    {
        id: 'affinity_100',
        name: '最亲密的伙伴',
        description: '达到100亲密度',
        icon: '💕',
        condition: () => petState.stats.affinity >= 100
    },
    {
        id: 'midnight_owl',
        name: '夜猫子',
        description: '在午夜12点后和毛毛聊天',
        icon: '🌙',
        condition: () => new Date().getHours() >= 22 || new Date().getHours() < 5
    }
];

// 检查成就
function checkAchievements() {
    ACHIEVEMENTS.forEach(ach => {
        if (ach.condition() && !petState.growth.achievements.has(ach.id)) {
            petState.growth.unlockAchievement(ach.id, ach.name)
            showNotification(`🏆 ${ach.name} - ${ach.description}`, 'success')
        }
    })
}

// 定期检查 (每次聊天后)
```

### UI展示

```html
<!-- 在 pet.html 中添加 -->
<div class="growth-info">
    <div class="level-badge">
        <span class="level-num" id="petLevel">1</span>
        <span class="level-text">级</span>
    </div>
    <div class="exp-bar">
        <div class="exp-fill" id="expBar"></div>
        <span class="exp-text" id="expText">0/100</span>
    </div>
    <div class="evolution-badge" id="evolutionBadge">幼体</div>
</div>
```

```css
.growth-info {
    display: flex;
    gap: 10px;
    padding: 10px;
    background: linear-gradient(135deg, #FFE8D6, #FFF0E8);
    border-radius: 12px;
}

.level-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: white;
    border-radius: 50%;
    font-weight: bold;
    color: #FF8FAC;
}

.exp-bar {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
}

.exp-fill {
    flex: 1;
    height: 8px;
    background: linear-gradient(90deg, #FFB84D, #FFD699);
    border-radius: 4px;
}
```

---

## 3️⃣ 实现每日任务系统

```javascript
class DailyTaskSystem {
    constructor() {
        this.tasks = [
            {
                id: 'daily_chat',
                name: '聊天嘀咕',
                desc: '和毛毛聊天3次',
                target: 3,
                reward: 50,
                progress: 0,
                completed: false
            },
            {
                id: 'daily_feed',
                name: '贴心喂食',
                desc: '喂食毛毛2次',
                target: 2,
                reward: 40,
                progress: 0,
                completed: false
            },
            {
                id: 'daily_play',
                name: '欢乐陪玩',
                desc: '和毛毛玩1次',
                target: 1,
                reward: 60,
                progress: 0,
                completed: false
            }
        ]
        this.lastResetDate = new Date().toDateString()
    }

    updateProgress(taskId, incrementBy = 1) {
        const task = this.tasks.find(t => t.id === taskId)
        if (!task || task.completed) return

        task.progress = Math.min(task.target, task.progress + incrementBy)
        
        if (task.progress >= task.target) {
            this.completeTask(task)
        }
    }

    completeTask(task) {
        task.completed = true
        petState.growth.gainExp(task.reward, task.name)
        showNotification(`📋 完成任务: ${task.name} +${task.reward}经验`, 'success')
    }

    checkReset() {
        const today = new Date().toDateString()
        if (today !== this.lastResetDate) {
            this.resetAllTasks()
            this.lastResetDate = today
        }
    }

    resetAllTasks() {
        this.tasks.forEach(task => {
            task.progress = 0
            task.completed = false
        })
        showNotification('📅 每日任务已刷新！', 'info')
    }

    getCompletionRate() {
        const completed = this.tasks.filter(t => t.completed).length
        return (completed / this.tasks.length * 100).toFixed(0)
    }
}

const dailyTasks = new DailyTaskSystem()

// 集成到交互中
const oldFeed = petState.feed.bind(petState)
petState.feed = function() {
    const result = oldFeed()
    dailyTasks.updateProgress('daily_feed')
    dailyTasks.checkReset()
    return result
}
```

---

## 4️⃣ 添加小游戏：数字猜谜

```javascript
class GuessNumberGame {
    constructor(petState) {
        this.petState = petState
        this.targetNumber = Math.floor(Math.random() * 100) + 1
        this.attempts = 0
        this.maxAttempts = 7
        this.isPlaying = false
    }

    startGame() {
        this.targetNumber = Math.floor(Math.random() * 100) + 1
        this.attempts = 0
        this.isPlaying = true
        
        return '我想到了一个1-100之间的数字，你能猜出来吗？ 🤔'
    }

    guess(number) {
        if (!this.isPlaying) return null

        this.attempts++
        const num = parseInt(number)

        if (isNaN(num)) {
            return '请输入有效的数字呢~'
        }

        if (num === this.targetNumber) {
            this.isPlaying = false
            this.petState.growth.gainExp(100, '赢得猜谜游戏')
            return `太厉害了！你在${this.attempts}次内猜中了！ 🎉`
        } else if (num < this.targetNumber) {
            if (this.attempts >= this.maxAttempts) {
                this.isPlaying = false
                return `答案是${this.targetNumber}，可惜了呢... 下次加油哦 😔`
            }
            return `太小了呢，还有${this.maxAttempts - this.attempts}次机会~ 📉`
        } else {
            if (this.attempts >= this.maxAttempts) {
                this.isPlaying = false
                return `答案是${this.targetNumber}，可惜了呢... 下次加油哦 😔`
            }
            return `太大了呢，还有${this.maxAttempts - this.attempts}次机会~ 📈`
        }
    }

    giveUp() {
        if (!this.isPlaying) return null
        this.isPlaying = false
        return `答案是${this.targetNumber}，你下次一定能猜出来的！ 💕`
    }
}

const game = new GuessNumberGame(petState)

// 在聊天中集成游戏
if (userMessage.includes('玩游戏') || userMessage.includes('猜数字')) {
    const gameResponse = game.startGame()
    petState.play()  // 状态变化
    return gameResponse
}

// 检测游戏中的猜测
if (game.isPlaying) {
    return game.guess(userMessage)
}
```

---

## 5️⃣ 数据分析仪表板

```javascript
class Analytics {
    constructor() {
        this.data = {
            dailyInteractions: [],
            moodHistory: [],
            messagePatterns: {},
            eventLog: []
        }
    }

    recordInteraction(type, value) {
        this.data.eventLog.push({
            timestamp: Date.now(),
            type,
            value
        })
    }

    generateReport() {
        const today = new Date().toDateString()
        const todayEvents = this.data.eventLog.filter(e => 
            new Date(e.timestamp).toDateString() === today
        )

        return {
            totalInteractions: todayEvents.length,
            chatMessages: todayEvents.filter(e => e.type === 'chat').length,
            feedCount: todayEvents.filter(e => e.type === 'feed').length,
            playCount: todayEvents.filter(e => e.type === 'play').length,
            averageMood: this.getAverageMood(),
            mostActiveHour: this.getMostActiveHour(),
            affinity: petState.stats.affinity
        }
    }

    getAverageMood() {
        if (this.data.moodHistory.length === 0) return 0
        const sum = this.data.moodHistory.reduce((a, b) => a + b, 0)
        return (sum / this.data.moodHistory.length).toFixed(1)
    }

    getMostActiveHour() {
        const hourMap = {}
        this.data.eventLog.forEach(e => {
            const hour = new Date(e.timestamp).getHours()
            hourMap[hour] = (hourMap[hour] || 0) + 1
        })
        return Object.keys(hourMap).reduce((a, b) => 
            hourMap[a] > hourMap[b] ? a : b
        )
    }

    exportData() {
        return JSON.stringify(this.data, null, 2)
    }

    showDashboard() {
        const report = this.generateReport()
        console.table(report)
        return `
📊 今日数据统计:
- 总互动: ${report.totalInteractions}次
- 聊天: ${report.chatMessages}次
- 喂食: ${report.feedCount}次
- 陪玩: ${report.playCount}次
- 平均心情: ${report.averageMood}
- 最活跃时段: ${report.mostActiveHour}点
- 当前亲密度: ${report.affinity}
        `
    }
}

const analytics = new Analytics()
```

---

## 6️⃣ 云同步模块 (Firebase示例)

```javascript
class CloudSync {
    constructor(userId) {
        this.userId = userId
        this.firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            projectId: "your-project",
            // ...其他配置
        }
        this.initFirebase()
    }

    initFirebase() {
        // 初始化Firebase
        firebase.initializeApp(this.firebaseConfig)
        this.db = firebase.firestore()
    }

    async savePet(petData) {
        try {
            await this.db.collection('users').doc(this.userId).set({
                petState: petData,
                lastSync: new Date(),
                affinity: petData.stats.affinity,
                level: petData.growth?.level || 1
            }, { merge: true })
            console.log('✅ 数据已保存到云端')
        } catch (error) {
            console.error('云端保存失败:', error)
        }
    }

    async loadPet() {
        try {
            const doc = await this.db.collection('users').doc(this.userId).get()
            if (doc.exists) {
                return doc.data().petState
            }
        } catch (error) {
            console.error('云端加载失败:', error)
        }
        return null
    }

    async listAllPets() {
        const pets = await this.db.collection('users').doc(this.userId)
            .collection('pets').get()
        return pets.docs.map(doc => doc.data())
    }

    // 启用多个设备间的实时同步
    enableRealtimeSync() {
        this.db.collection('users').doc(this.userId)
            .onSnapshot(doc => {
                if (doc.exists && doc.data().petState) {
                    petState = doc.data().petState
                    petState.updateUI()
                }
            })
    }
}

const cloudSync = new CloudSync(userId)
// 每30秒同步一次
setInterval(() => cloudSync.savePet(petState), 30000)
```

---

## 7️⃣ 生成完整扩展模板

创建文件 `extensions/plugin-template.js`:

```javascript
/**
 * AI宠物插件模板
 * 使用这个模板创建自己的扩展功能
 */

class PetPlugin {
    constructor(name, version) {
        this.name = name
        this.version = version
        this.isActive = false
    }

    // 初始化插件
    init() {
        console.log(`🔌 插件 ${this.name} v${this.version} 已加载`)
        this.isActive = true
        this.setupHooks()
    }

    // 设置钩子（生命周期）
    setupHooks() {
        // 在聊天前触发
        petState.subscribe(() => {
            this.onStateChange()
        })
    }

    // 插件的核心逻辑
    onStateChange() {
        // 你的逻辑..
    }

    // 处理命令 (如果需要)
    handleCommand(cmd, args) {
        switch(cmd) {
            case 'status':
                return this.getStatus()
            default:
                return '未知命令'
        }
    }

    getStatus() {
        return `${this.name} v${this.version} 运行正常`
    }

    // 卸载插件
    unload() {
        this.isActive = false
        console.log(`🔌 插件 ${this.name} 已卸载`)
    }
}

// 使用示例
class MusicPlugin extends PetPlugin {
    constructor() {
        super('Music Player', '1.0')
        this.playlist = []
    }

    onStateChange() {
        if (petState.getMoodLevel() === 'sad') {
            this.playCheerfulMusic()
        }
    }

    playCheerfulMusic() {
        console.log('🎵 播放治愈音乐...')
    }
}

// 注册插件
const musicPlugin = new MusicPlugin()
musicPlugin.init()
```

---

## 总结

这些高级功能可以：
- ✅ 单独使用
- ✅ 组合使用  
- ✅ 按需加载
- ✅ 热插拔扩展

**建议优先级：**
1. OpenAI API集成 → 大幅提升AI质量
2. 等级系统 → 增加长期粘性
3. 每日任务 → 提升活跃度
4. 小游戏 → 增加趣味性
5. 云同步 → 多设备支持

**下一步？选择一个感兴趣的功能开始实现吧！** 🚀

