// ==================== 主控制逻辑 ====================

class PetApp {
    constructor() {
        this.elements = this._initElements();
        this.isInitialized = false;
        this.proactiveTopicInterval = null;
    }

    /**
     * 初始化DOM元素引用
     */
    _initElements() {
        return {
            pet: document.getElementById('pet'),
            chatHistory: document.getElementById('chatHistory'),
            chatInput: document.getElementById('chatInput'),
            sendBtn: document.getElementById('sendBtn'),
            expressionBubble: document.getElementById('expressionBubble'),
            surpriseBtn: document.getElementById('surpriseBtn'),
            feedBtn: document.getElementById('feedBtn'),
            playBtn: document.getElementById('playBtn'),
            restBtn: document.getElementById('restBtn'),
            notification: document.getElementById('notification')
        };
    }

    /**
     * 初始化应用
     */
    init() {
        if (this.isInitialized) return;

        // 绑定事件
        this._bindEvents();

        // 启动主动话题系统
        this._startProactiveTopics();

        // 定期检查长期未互动
        setInterval(() => {
            petState.checkInactivity();
        }, 60000);

        this.isInitialized = true;
        console.log('🎉 AI宠物应用已启动！');
    }

    /**
     * 绑定事件
     */
    _bindEvents() {
        // 宠物点击
        this.elements.pet.addEventListener('click', () => this._handlePetClick());

        // 聊天发送
        this.elements.sendBtn.addEventListener('click', () => this._handleSendMessage());
        this.elements.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this._handleSendMessage();
            }
        });

        // 功能按钮
        this.elements.surpriseBtn.addEventListener('click', () => this._handleSurprise());
        this.elements.feedBtn.addEventListener('click', () => this._handleFeed());
        this.elements.playBtn.addEventListener('click', () => this._handlePlay());
        this.elements.restBtn.addEventListener('click', () => this._handleRest());
    }

    // ==================== 交互处理 ====================

    /**
     * 宠物点击事件
     */
    _handlePetClick() {
        if (petState.onClick()) {
            // ==================== 检测压力并选择反应 ====================
            const lastMessages = this._getRecentMessages(2);
            let hasStress = false;
            let response = null;

            // 检查最近的消息中是否有压力关键词
            for (const msg of lastMessages) {
                const stressLevel = chatAI._detectStress(msg);
                if (stressLevel > 0) {
                    hasStress = true;
                    const comfortMsg = chatAI._getComfortResponse(msg, stressLevel);
                    response = { 
                        expression: '🤍',
                        text: comfortMsg 
                    };
                    break;
                }
            }

            // 如果没有检测到压力，使用普通点击反应
            if (!hasStress) {
                response = getRandomItem(PET_DATA.clickResponses);
            }

            this._showExpression(response.expression);
            this._showPetMessage(response.text);
            
            // ==================== 动画触发（支持Three.js和CSS版本）====================
            if (hasStress) {
                // 压力模式
                if (typeof triggerPetComfort === 'function') {
                    triggerPetComfort();  // Three.js版本
                } else {
                    // CSS版本备用
                    this.elements.pet.style.animation = 'none';
                    setTimeout(() => {
                        this.elements.pet.style.animation = 'cat-breathe 1.5s ease-in-out';
                    }, 10);
                }
            } else {
                // 普通模式
                if (typeof triggerPetBounce === 'function') {
                    triggerPetBounce();  // Three.js版本
                } else {
                    // CSS版本备用
                    this.elements.pet.classList.add('shake');
                    setTimeout(() => this.elements.pet.classList.remove('shake'), 300);
                }
            }
        }
    }

    /**
     * 获取最近的消息
     */
    _getRecentMessages(count = 2) {
        const history = chatAI.conversationHistory;
        const recent = [];
        for (let i = Math.max(0, history.length - count); i < history.length; i++) {
            if (history[i].user) {
                recent.push(history[i].user);
            }
        }
        return recent;
    }

    /**
     * 发送聊天消息
     */
    _handleSendMessage() {
        const message = this.elements.chatInput.value.trim();
        
        if (!message) return;

        // 显示用户消息
        this._addChatBubble(message, 'user');

        // 宠物状态变化
        petState.onChat(message.length);

        // 清除输入框
        this.elements.chatInput.value = '';

        // 生成AI回复
        setTimeout(() => {
            const response = chatAI.generateResponse(message);
            this._addChatBubble(response, 'pet');
            
            // 偶现表情
            if (Math.random() > 0.5) {
                const emotion = detectEmotion(message);
                this._triggerEmotionAnimation(emotion);
            }
        }, 300 + Math.random() * 700);
    }

    /**
     * 惊喜按钮
     */
    _handleSurprise() {
        const surpriseTypes = [
            {
                name: '表情包',
                action: () => {
                    const expressions = PET_DATA.expressions;
                    const emoji = getRandomItem(expressions);
                    this._showExpression(emoji);
                    this.elements.pet.classList.add('happy');
                    setTimeout(() => this.elements.pet.classList.remove('happy'), 500);
                }
            },
            {
                name: '有趣文案',
                action: () => {
                    const fact = getRandomItem(PET_DATA.funFacts);
                    this._showPetMessage(fact.text);
                    petState.mood = Math.min(100, petState.mood + 10);
                    petState.updateUI();
                }
            },
            {
                name: '今日一句',
                action: () => {
                    const quote = getRandomItem(PET_DATA.dailyQuotes);
                    this._showPetMessage('📜 ' + quote);
                    petState.mood = Math.min(100, petState.mood + 15);
                    petState.updateUI();
                }
            },
            {
                name: '逗你一笑',
                action: () => {
                    const joke = getRandomItem(PET_DATA.responses.joke);
                    this._showPetMessage(joke);
                    petState.mood = Math.min(100, petState.mood + 12);
                    this.elements.pet.classList.add('happy');
                    setTimeout(() => this.elements.pet.classList.remove('happy'), 500);
                }
            }
        ];

        const surprise = getRandomItem(surpriseTypes);
        this._showNotification(`🎁 ${surprise.name}来了！`, 'info');
        surprise.action();
    }

    /**
     * 喂食
     */
    _handleFeed() {
        if (petState.hunger < 10) {
            this._showNotification('毛毛现在已经吃饱了呢~ 😋', 'info');
            return;
        }

        const message = petState.feed();
        this._addChatBubble(message, 'pet');
        
        // 吃东西动画
        this.elements.pet.classList.add('jump');
        setTimeout(() => this.elements.pet.classList.remove('jump'), 500);
        
        this._showExpression('😋');
        this._showNotification('毛毛吃饱了~', 'success');
    }

    /**
     * 陪玩
     */
    _handlePlay() {
        const result = petState.play();
        
        if (!result.accepted) {
            this._showPetMessage(result.message);
            return;
        }

        this._addChatBubble(result.message, 'pet');
        
        // 玩耍动画
        this.elements.pet.classList.add('spin');
        setTimeout(() => this.elements.pet.classList.remove('spin'), 600);
        
        this._showExpression('😄');
        this._showNotification('毛毛和你玩得很开心！', 'success');
    }

    /**
     * 休息
     */
    _handleRest() {
        const message = petState.rest();
        this._addChatBubble(message, 'pet');
        
        // 睡觉动画
        this.elements.pet.classList.add('jump');
        setTimeout(() => this.elements.pet.classList.remove('jump'), 500);
        
        this._showExpression('💤');
        this._showNotification('毛毛在补充精力呢~', 'info');
    }

    // ==================== UI辅助方法 ====================

    /**
     * 添加聊天气泡
     */
    _addChatBubble(message, sender) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        if (sender === 'user') {
            bubble.classList.add('user-message');
        } else {
            bubble.classList.add('pet-message');
        }

        const time = new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });

        bubble.innerHTML = `
            <p>${this._escapeHtml(message)}</p>
            <span class="chat-time">${time}</span>
        `;

        this.elements.chatHistory.appendChild(bubble);
        this.elements.chatHistory.scrollTop = this.elements.chatHistory.scrollHeight;
    }

    /**
     * 显示宠物消息
     */
    _showPetMessage(message) {
        this._addChatBubble(message, 'pet');
    }

    /**
     * 显示表情气泡
     */
    _showExpression(emoji) {
        this.elements.expressionBubble.textContent = emoji;
        this.elements.expressionBubble.style.opacity = '1';
        
        setTimeout(() => {
            this.elements.expressionBubble.style.opacity = '0';
        }, 500);
    }

    /**
     * 触发情感动画
     */
    _triggerEmotionAnimation(emotion) {
        const animations = {
            love: 'happy',
            happy: 'happy',
            angry: 'shake',
            sad: null,
            curious: null
        };

        const animation = animations[emotion];
        if (animation) {
            this.elements.pet.classList.add(animation);
            setTimeout(() => this.elements.pet.classList.remove(animation), 500);
        }
    }

    /**
     * 显示通知
     */
    _showNotification(message, type = 'info') {
        const notification = this.elements.notification;
        notification.textContent = message;
        notification.className = `notification show ${type}`;

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    /**
     * HTML转义（防止XSS）
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ==================== 主动话题系统 ====================

    /**
     * 启动主动话题系统
     */
    _startProactiveTopics() {
        // 每10-20分钟随机触发一次主动话题
        this.proactiveTopicInterval = setInterval(() => {
            const topic = chatAI.getInitiativeTopic();
            if (topic) {
                this._addChatBubble(topic, 'pet');
                this._showExpression(getRandomItem(PET_DATA.expressions));
            }
        }, 600000 + Math.random() * 600000); // 10-20分钟
    }

    /**
     * 停止主动话题系统
     */
    _stopProactiveTopics() {
        if (this.proactiveTopicInterval) {
            clearInterval(this.proactiveTopicInterval);
        }
    }

    // ==================== 数据管理 ====================

    /**
     * 保存数据
     */
    save() {
        petState.save();
        console.log('💾 宠物数据已保存');
    }

    /**
     * 重置应用
     */
    reset() {
        if (confirm('确定要重置宠物吗？所有数据都会被清除。')) {
            localStorage.removeItem('petState');
            petState.mood = 75;
            petState.hunger = 40;
            petState.energy = 85;
            petState.stats.affinity = 50;
            petState.stats.totalMessages = 0;
            petState.updateUI();
            this.elements.chatHistory.innerHTML = '';
            this._showNotification('宠物已重置！', 'info');
        }
    }

    /**
     * 获取宠物信息
     */
    getInfo() {
        return petState.getInfo();
    }
}

// ==================== 应用启动 ====================

const app = new PetApp();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    petState.updateUI();
});

// 页面卸载时保存数据
window.addEventListener('beforeunload', () => {
    app.save();
});

// 定期自动保存
setInterval(() => {
    app.save();
}, 30000); // 每30秒自动保存一次

// ==================== 控制台快捷命令 ====================

// 在控制台可用的命令：
// app.getInfo() - 获取宠物信息
// app.save() - 保存数据
// app.reset() - 重置宠物
// petState.mood = 100; petState.updateUI() - 设置心情值
// chatAI.generateResponse('你好') - 测试AI回复

console.log('%c🎉 欢迎使用AI宠物应用！', 'font-size: 20px; color: #FF8FAC; font-weight: bold;');
console.log('%c💡 快捷命令: app.getInfo() | app.save() | app.reset()', 'font-size: 12px; color: #999;');
