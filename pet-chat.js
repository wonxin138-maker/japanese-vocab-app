// ==================== AI对话系统 ====================

class PetChatAI {
    constructor() {
        this.conversationHistory = [];
        this.messageCount = 0;
        this.lastProactiveTime = Date.now();
    }

    // ==================== 核心对话逻辑 ====================

    /**
     * 生成AI回复
     * @param {string} userMessage 用户消息
     * @returns {string} AI回复
     */
    generateResponse(userMessage) {
        this.messageCount++;
        const emotion = detectEmotion(userMessage);
        const mood = petState.getMoodLevel();
        const hunger = petState.hunger;
        const energy = petState.energy;

        // 保存对话历史
        this.conversationHistory.push({
            user: userMessage,
            timestamp: Date.now(),
            emotion: emotion
        });

        // 限制历史记录长度
        if (this.conversationHistory.length > 20) {
            this.conversationHistory.shift();
        }

        // 根据不同情况生成回复
        const response = this._selectResponse(userMessage, emotion, mood, hunger, energy);
        
        return response;
    }

    /**
     * 选择合适的回复
     */
    _selectResponse(message, emotion, mood, hunger, energy) {
        const lowerMsg = message.toLowerCase();

        // 问候类
        if (this._isGreeting(lowerMsg)) {
            return this._getGreeting(mood);
        }

        // 结束对话
        if (this._isGoodbye(lowerMsg)) {
            return getRandomItem(PET_DATA.responses.goodbye);
        }

        // ==================== 新增：压力检测（优先级高） ====================
        const stressLevel = this._detectStress(message);
        if (stressLevel > 0) {
            return this._getComfortResponse(message, stressLevel);
        }

        // 表达爱意
        if (emotion === 'love') {
            return getRandomItem(PET_DATA.responses.reaction.love);
        }

        // 表达生气
        if (emotion === 'angry') {
            return getRandomItem(PET_DATA.responses.reaction.angry);
        }

        // 表达开心
        if (emotion === 'happy') {
            const response = getResponseByMood('encouraging', mood);
            return response;
        }

        // 表达伤心
        if (emotion === 'sad') {
            return getRandomItem(PET_DATA.responses.sympathy);
        }

        // 提问类
        if (this._isQuestion(lowerMsg)) {
            if (emotion === 'curious') {
                return this._generateIntelligentAnswer(message, mood);
            }
            return getResponseByMood('question', mood);
        }

        // 根据不同状态生成回复
        if (hunger > 60) {
            return '呜呜... 我饿死了... 能喂我吃点东西吗？ 🍖';
        }

        if (energy < 30) {
            return '我好累呀... 能让我休息一会儿吗？ 😴';
        }

        // 默认聊天回复
        return this._getDefaultResponse(mood, message);
    }

    /**
     * 检查是否是问候
     */
    _isGreeting(message) {
        const greetingKeywords = ['你好', '早安', '晚安', '嗨', 'hello', 'hi', '早上好'];
        return greetingKeywords.some(keyword => message.includes(keyword));
    }

    /**
     * 检查是否是结束对话
     */
    _isGoodbye(message) {
        const goodbyeKeywords = ['拜拜', '再见', '祝你好', '要去', '先走', 'bye', 'goodbye'];
        return goodbyeKeywords.some(keyword => message.includes(keyword));
    }

    /**
     * 检查是否是问题
     */
    _isQuestion(message) {
        const questionPatterns = ['为什么', '什么', '怎么', '如何', '吗？', '吗\\?', '呢？', '呢\\?'];
        return questionPatterns.some(pattern => message.includes(pattern));
    }

    /**
     * 获取问候回复
     */
    _getGreeting(mood) {
        const hour = new Date().getHours();
        let greeting;

        if (hour >= 5 && hour < 12) {
            greeting = '早安呀！新的一天要加油哦~ 🌅';
        } else if (hour >= 12 && hour < 17) {
            greeting = '下午好~还在忙吗？';
        } else if (hour >= 17 && hour < 21) {
            greeting = '晚上好！累吗？';
        } else {
            greeting = '这么晚了，要早点休息哦~ 🌙';
        }

        // 根据心情调整
        if (mood === 'happy') {
            greeting = greeting.replace('呀', '呀~我好开心啦！');
        } else if (mood === 'angry') {
            greeting = greeting.replace('好', '最近有点不太开心呢');
        }

        return greeting;
    }

    /**
     * 生成智能答案
     */
    _generateIntelligentAnswer(question, mood) {
        const keywords = ['为什么', '什么', '怎么', '如何'];
        
        // 特定问题的知识库
        const knowledgeBase = {
            '为什么天空是蓝色的': '这是因为阳光中的蓝色光波在大气中散射，所以我们看到蓝天~',
            '什么是幸福': '幸福就是和喜欢的人一起做喜欢的事，比如现在和你聊天 💕',
            '怎样才能开心': '可以听音乐、运动、或者和朋友聊天呀！我就陪你聊天 😊',
            '如何缓解压力': '深呼吸、听音乐、运动或者和朋友倾诉，都能缓解压力哦~'
        };

        // 查找匹配的问题
        for (const [q, a] of Object.entries(knowledgeBase)) {
            if (question.includes(q.split(/[：、]/)[0])) {
                return a;
            }
        }

        // 如果没有找到，给出通用回答
        const responses = [
            '这是个很好的问题呢！你怎么看呢？',
            '让我想想... 🤔 我的想法是...',
            '这个问题很有意思，我们一起来思考一下吧！',
            '你问了个让我思考的问题呢，我觉得...'
        ];

        return getRandomItem(responses);
    }

    /**
     * 获取默认回复
     */
    _getDefaultResponse(mood, userMessage) {
        const defaultResponses = {
            happy: [
                '你说的真棒！我喜欢和你聊天 💕',
                '哈哈，你想法真有趣~',
                '继续说，我很感兴趣呢！'
            ],
            normal: [
                '嗯嗯，我有听呢~',
                '是吗？很有意思呀',
                '讲得真不错~'
            ],
            sad: [
                '我有点走神了，抱歉... 能再说一遍吗？',
                '嗯... 我在听... 🥺',
                '你说的我都听进去了...'
            ],
            angry: [
                '呃... 可能我现在心情不太好... 对不起...',
                '我可能现在脾气不太好，别介意呀...',
                '嗯？哦，我听着呢...'
            ]
        };

        const responses = defaultResponses[mood] || defaultResponses.normal;
        return getRandomItem(responses);
    }

    // ==================== 主动开启话题 ====================

    /**
     * 获取主动话题
     */
    getInitiativeTopic() {
        const now = Date.now();
        const timeSinceLastTopic = (now - this.lastProactiveTime) / 1000 / 60; // 分钟

        // 至少5分钟才触发一次
        if (timeSinceLastTopic < 5) {
            return null;
        }

        // 50%概率触发
        if (Math.random() > 0.5) {
            return null;
        }

        const mood = petState.getMoodLevel();
        const hunger = petState.hunger;

        // 根据状态选择话题
        let candidates = [...PET_DATA.initiativeTopics];

        // 饥饿则提及食物
        if (hunger > 60) {
            candidates = candidates.filter(t => t.topic.includes('饿'));
        }

        // 心情不好则提及陪伴
        if (mood === 'sad' || mood === 'angry') {
            candidates = candidates.filter(t => !t.topic.includes('无聊'));
        }

        // 根据权重选择
        let selected = getRandomItem(candidates);
        
        // 检查时间范围条件
        if (selected.timeRange) {
            const hour = new Date().getHours();
            if (hour < selected.timeRange[0] || hour >= selected.timeRange[1]) {
                selected = PET_DATA.initiativeTopics[0]; // 使用备选
            }
        }

        this.lastProactiveTime = now;
        return selected.topic;
    }

    // ==================== 工具函数 ====================

    /**
     * 获取对话历史
     */
    getHistory() {
        return this.conversationHistory;
    }

    /**
     * 清除对话历史
     */
    clearHistory() {
        this.conversationHistory = [];
        this.messageCount = 0;
    }

    // ==================== 新增：压力检测和安慰系统 ====================

    /**
     * 检测用户的压力水平
     * @param {string} text 用户输入文本
     * @returns {number} 压力级别（0=无, 1=轻微, 2=中等, 3=严重）
     */
    _detectStress(text) {
        const lowerText = text.toLowerCase();
        const stressKeywords = PET_DATA.emotionalKeywords.stressed || [];
        
        let stressCount = 0;
        for (const keyword of stressKeywords) {
            if (lowerText.includes(keyword)) {
                stressCount++;
            }
        }

        // 根据关键词数量判断压力级别
        if (stressCount === 0) return 0;
        if (stressCount === 1) return 1;
        if (stressCount === 2) return 2;
        return 3;
    }

    /**
     * 生成安慰响应
     * @param {string} text 用户输入
     * @param {number} stressLevel 压力级别
     * @returns {string} 安慰的回复
     */
    _getComfortResponse(text, stressLevel) {
        // 判断压力类型
        const lowerText = text.toLowerCase();
        
        // 关键词类别匹配
        if (lowerText.includes('累') || lowerText.includes('困') || lowerText.includes('疲')) {
            return getRandomItem(PET_DATA.stressResponses.tiredness);
        }
        
        if (lowerText.includes('烦') || lowerText.includes('受不了') || lowerText.includes('崩溃')) {
            return getRandomItem(PET_DATA.stressResponses.overwhelm);
        }
        
        if (lowerText.includes('难过') || lowerText.includes('伤心') || lowerText.includes('哭')) {
            return getRandomItem(PET_DATA.stressResponses.sadness);
        }

        // 压力级别分类
        if (stressLevel >= 3) {
            return getRandomItem(PET_DATA.stressResponses.overwhelm);
        }
        
        if (stressLevel === 2) {
            return getRandomItem(PET_DATA.stressResponses.sadness);
        }

        // 默认安慰
        return getRandomItem(PET_DATA.stressResponses.general);
    }

    /**
     * 获取统计信息
     */
    getStats() {
        return {
            totalMessages: this.messageCount,
            historyLength: this.conversationHistory.length
        };
    }
}

// 创建全局AI助手实例
const chatAI = new PetChatAI();
