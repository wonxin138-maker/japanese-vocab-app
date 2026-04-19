// ==================== 宠物状态管理 ====================

class PetState {
    constructor() {
        // 初始化状态
        this.mood = 75;           // 心情值 (0-100)
        this.hunger = 40;         // 饥饿值 (0-100, 越高越饿)
        this.energy = 85;         // 精力值 (0-100)
        
        // 性格特征
        this.personality = {
            sensitivity: 0.8,     // 敏感度(对用户互动的反应程度)
            kindness: 0.9,        // 友善度
            playfulness: 0.7,     // 好玩程度
            independence: 0.5     // 独立性
        };

        // 统计数据
        this.stats = {
            totalMessages: 0,      // 总聊天数
            lastInteractionTime: Date.now(),
            daysSinceCreation: 0,
            affinity: 50          // 亲密度 (0-100)
        };

        // 时间戳记录
        this.lastMoodDecayTime = Date.now();
        this.lastHungerIncreaseTime = Date.now();

        // 加载本地存储
        this.load();

        // 启动自动衰减
        this.startAutoDecay();
    }

    // 自动衰减系统（心情衰减、饥饿增加）
    startAutoDecay() {
        setInterval(() => {
            const now = Date.now();
            
            // 每5分钟减少心情 5-15点
            if (now - this.lastMoodDecayTime > 300000) {
                const moodDecay = 5 + Math.random() * 10;
                this.mood = Math.max(0, this.mood - moodDecay);
                this.lastMoodDecayTime = now;
                this.updateUI();
            }

            // 每3分钟增加饥饿 3-8点
            if (now - this.lastHungerIncreaseTime > 180000) {
                const hungerIncrease = 3 + Math.random() * 5;
                this.hunger = Math.min(100, this.hunger + hungerIncrease);
                this.lastHungerIncreaseTime = now;
                this.updateUI();
            }
        }, 60000); // 每分钟检查一次
    }

    // 更新UI显示
    updateUI() {
        document.getElementById('moodBar').style.width = this.mood + '%';
        document.getElementById('hungerBar').style.width = this.hunger + '%';
        document.getElementById('energyBar').style.width = this.energy + '%';

        // 更新情绪表情
        this.updateMoodEmoji();
    }

    // 更新心情表情
    updateMoodEmoji() {
        let moodEmoji = '😊';
        if (this.mood >= 70) {
            moodEmoji = '😊';
        } else if (this.mood >= 40) {
            moodEmoji = '😄';
        } else if (this.mood >= 20) {
            moodEmoji = '😔';
        } else {
            moodEmoji = '😠';
        }
        document.getElementById('moodEmoji').textContent = moodEmoji;

        // 根据饥饿度更新
        if (this.hunger > 50) {
            document.getElementById('hungerEmoji').textContent = '😭';
        } else if (this.hunger > 25) {
            document.getElementById('hungerEmoji').textContent = '😋';
        } else {
            document.getElementById('hungerEmoji').textContent = '😊';
        }

        // 根据精力更新
        if (this.energy < 30) {
            document.getElementById('energyEmoji').textContent = '😴';
        } else if (this.energy < 60) {
            document.getElementById('energyEmoji').textContent = '😔';
        } else {
            document.getElementById('energyEmoji').textContent = '⚡';
        }
    }

    // 获取当前心情等级
    getMoodLevel() {
        if (this.mood >= 70) return 'happy';
        if (this.mood >= 40) return 'normal';
        if (this.mood >= 20) return 'sad';
        return 'angry';
    }

    // ==================== 交互影响 ====================

    // 聊天（增加心情和亲密度）
    onChat(messageLength = 0) {
        const impact = Math.min(15, messageLength / 10);
        this.mood = Math.min(100, this.mood + 5 + impact);
        this.affinity = Math.min(100, this.affinity + 2);
        this.stats.totalMessages++;
        this.stats.lastInteractionTime = Date.now();
        this.energy = Math.max(0, this.energy - 3);
        this.updateUI();
    }

    // 喂食
    feed() {
        this.hunger = Math.max(0, this.hunger - 40);
        this.mood = Math.min(100, this.mood + 20);
        this.affinity = Math.min(100, this.affinity + 5);
        this.stats.lastInteractionTime = Date.now();
        this.updateUI();
        return '恩姆~ 好好吃呀！';
    }

    // 陪玩
    play() {
        if (this.energy < 20) {
            return { message: '我太累了... 让我休息一下吧 😴', accepted: false };
        }
        
        this.mood = Math.min(100, this.mood + 25);
        this.energy = Math.max(0, this.energy - 20);
        this.hunger = Math.min(100, this.hunger + 10);
        this.affinity = Math.min(100, this.affinity + 8);
        this.stats.lastInteractionTime = Date.now();
        this.updateUI();
        return { message: '太棒了！让我们一起开心吧！🎮', accepted: true };
    }

    // 点击宠物
    onClick() {
        if (Math.random() > 0.3) {
            this.mood = Math.min(100, this.mood + 3);
            this.affinity = Math.min(100, this.affinity + 1);
            this.stats.lastInteractionTime = Date.now();
            this.updateUI();
            return true;
        }
        return false;
    }

    // 休息
    rest() {
        this.energy = Math.min(100, this.energy + 50);
        this.mood = Math.min(100, this.mood + 10);
        this.affinity = Math.min(100, this.affinity + 3);
        this.stats.lastInteractionTime = Date.now();
        this.updateUI();
        return '好的，让我重新充电一下... Zzzz 😴';
    }

    // 长期未互动惩罚
    checkInactivity() {
        const now = Date.now();
        const timeSinceInteraction = now - this.stats.lastInteractionTime;
        const minutesSince = timeSinceInteraction / 60000;

        // 5分钟内无互动 -> 减少心情
        if (minutesSince > 5 && minutesSince < 30) {
            const decayFactor = minutesSince / 10;
            this.mood = Math.max(0, this.mood - decayFactor);
        }

        // 30分钟以上无互动 -> 宠物更加沮丧
        if (minutesSince > 30) {
            this.mood = Math.max(0, this.mood - 2);
        }

        this.updateUI();
    }

    // ==================== 持久化 ====================

    // 保存到本地存储
    save() {
        const data = {
            mood: this.mood,
            hunger: this.hunger,
            energy: this.energy,
            affinity: this.stats.affinity,
            totalMessages: this.stats.totalMessages,
            lastInteractionTime: this.stats.lastInteractionTime,
            personality: this.personality
        };
        localStorage.setItem('petState', JSON.stringify(data));
    }

    // 从本地存储加载
    load() {
        const data = localStorage.getItem('petState');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                this.mood = parsed.mood || 75;
                this.hunger = parsed.hunger || 40;
                this.energy = parsed.energy || 85;
                this.stats.affinity = parsed.affinity || 50;
                this.stats.totalMessages = parsed.totalMessages || 0;
                this.stats.lastInteractionTime = parsed.lastInteractionTime || Date.now();
                if (parsed.personality) {
                    this.personality = parsed.personality;
                }
            } catch (e) {
                console.log('加载宠物状态失败，使用默认值');
            }
        }
        this.updateUI();
    }

    // ==================== 观察者模式 ====================

    // 变化监听
    listeners = [];

    subscribe(callback) {
        this.listeners.push(callback);
    }

    notify() {
        this.listeners.forEach(callback => callback(this));
    }

    // 获取宠物信息摘要
    getInfo() {
        return {
            name: PET_DATA.name,
            mood: this.getMoodLevel(),
            moodValue: Math.round(this.mood),
            hunger: Math.round(this.hunger),
            energy: Math.round(this.energy),
            affinity: Math.round(this.stats.affinity),
            totalMessages: this.stats.totalMessages
        };
    }
}

// 创建全局宠物状态实例
const petState = new PetState();
