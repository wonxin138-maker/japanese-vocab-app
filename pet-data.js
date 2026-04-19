// ==================== AI宠物数据库 ====================

const PET_DATA = {
    // 宠物名字
    name: '毛毛',

    // 条件判断数据
    moods: {
        happy: { emoji: '😊', range: [70, 100], color: '#FF8FAC' },
        normal: { emoji: '😄', range: [40, 69], color: '#FFB3D9' },
        sad: { emoji: '😔', range: [20, 39], color: '#FF9FB8' },
        angry: { emoji: '😠', range: [0, 19], color: '#FF6B9D' }
    },

    // 主动开启话题（定时触发）
    initiativeTopics: [
        { topic: '你今天怎么样？', emotions: ['happy', 'curious'], weight: 2 },
        { topic: '我有点无聊呢 🥱', emotions: ['bored'], weight: 2 },
        { topic: '你在忙吗？我想和你聊天', emotions: ['lonely'], weight: 1.5 },
        { topic: '嘿，你猜我在想什么？', emotions: ['playful'], weight: 1 },
        { topic: '我好饿呀... 能喂我吃东西吗？', emotions: ['hungry'], weight: 1.5 },
        { topic: '你最近有开心的事吗？', emotions: ['curious'], weight: 1 },
        { topic: '陪我玩游戏好不好？', emotions: ['playful'], weight: 1.5 },
        { topic: '晚安呀，早点休息哦 😴', emotions: ['sleepy'], weight: 1, timeRange: [22, 24] }
    ],

    // AI对话回复（基于不同心情）
    responses: {
        greeting: [
            '哈喽~ 很高兴见到你！😊',
            '你好呀！我是毛毛 💕',
            '嗨~又见面了，今天很高兴~',
            'Hi there! 有什么想聊的吗？'
        ],
        question: {
            default: [
                '这是个好问题呢... 让我想想 🤔',
                '嗯，我觉得... 你认为怎样呢？',
                '哎呀，这问题太难了 😅',
                '有趣的想法！我来给你点建议吧'
            ],
            happy: [
                '太棒了！我很喜欢这个话题！😄',
                '哈哈，你想得真有趣！',
                '这个问题让我很开心呢 💕'
            ],
            bored: [
                '嗯... 有点无聊呢，但我还是很想听你说',
                '继续呢，我在听 😴',
                '你继续，我试试打起精神'
            ]
        },
        encouragement: [
            '你很棒呢！继续加油 💪',
            '我相信你！你可以的 ✨',
            '这样就对了！',
            '太厉害了！'
        ],
        joke: [
            '你知道吗？为什么小鸟飞不高？因为它的爸爸妈妈都是小鸡 🐔',
            '我有个特别的笑话，但我忘了 😅',
            '哈哈，你很会逗我开心呢！'
        ],
        sympathy: [
            '哎呀，听起来你心情不太好，我陪你 💔',
            '我理解你的感受，一切都会好的',
            '别难过啦，这只是暂时的，加油！'
        ],
        reaction: {
            love: [
                '你这样说... 我脸红了 😳',
                '我也很喜欢你呢！💕',
                '你太甜了~'
            ],
            angry: [
                '呜呜，我知道错了... 😢',
                '别生气嘛~我改还不行吗',
                '对不起，我会改的...'
            ],
            funny: [
                '哈哈哈，你说得真搞笑！',
                '你这个笑话绝了 😂',
                '让我也笑一会儿 haha~'
            ]
        },
        // ==================== 安慰型语句库 ====================
        comfort: [
            '我在呢，你不用一个人扛 🤍',
            '今天已经很努力了，可以休息一下',
            '没关系的，我陪你慢慢来',
            '是不是有点累呀…',
            '抱一下好不好 🫂',
            '不开心也没关系，我在这',
            '你想哭的话，我听着… 💙',
            '一个人在承受的时候，告诉我好吗',
            '深呼吸呢…我陪你',
            '你很坚强，但也可以脆弱',
            '我就在，不会走的 💕',
            '慢慢来，别急…'
        ],
        goodbye: [
            '拜拜~下次聊 👋',
            '我会想你的... 早点再来找我哦',
            '再见呀！记得多休息 💤'
        ]
    },

    // 表情包库
    expressions: [
        '😊', '😄', '😆', '😍', '🥰', '😘', '😌',
        '😴', '😴', '🥱', '😴', '😋', '🤔', '🤨',
        '😤', '😠', '😡', '😢', '😭', '😰', '🤗'
    ],

    // 趣味文案和吐槽
    funFacts: [
        {
            text: '今日冷知识：你不能真正地一次舔到自己的肘部。（别试了，这不可能的 😄）',
            category: 'fact'
        },
        {
            text: '人生建议：如果你做不了最好的改变，那就学会享受现在吧。',
            category: 'philosophy'
        },
        {
            text: '我的碎碎念：为什么人类总要等到节假日才能好好休息呢？这不公平 😤',
            category: 'rant'
        },
        {
            text: '友情提示：早睡比早起对身体更好（但两者都很难 💤）',
            category: 'tip'
        },
        {
            text: '为什么我们称其为"开会"而不是"合议"呢？这个问题一直困扰着我... 🤔',
            category: 'rant'
        },
        {
            text: '爱的定义：即使你很讨厌某人，也不会拉黑他。',
            category: 'philosophy'
        },
        {
            text: '我发现了呀：嘴角上扬0.5秒，心情就会好50%！你试试看~ 😊',
            category: 'tip'
        },
        {
            text: '最近的感悟：不是所有的听都是在倾听，真正的朋友会"听"你。',
            category: 'philosophy'
        }
    ],

    // 今日一句
    dailyQuotes: [
        '生活的秘诀，就是让自己每一天都变得更好一点点。',
        '你不需要完美，你只需要成长。',
        '摔倒不是失败，放弃才是。',
        '做你自己，其他人都已经有人做了。',
        '日子再苦，也不要失去对生活的热爱。',
        '你的耐心会成就你的奇迹。',
        '最好的时光，就是现在。',
        '别人的掌声没有你自己内心的赞美重要。',
        '如果你不为自己梦想奋斗，就没有人能为你实现。',
        '所有的疲惫，都挡不住那一刻的闪闪发光。'
    ],

    // 点击宠物的反馈
    clickResponses: [
        { text: '呀！你戳我~', expression: '😊' },
        { text: '嘿嘿，再来一次！', expression: '😄' },
        { text: '不要欺负我啦 😭', expression: '😭' },
        { text: '这样搔我，我会笑的 😆', expression: '😆' },
        { text: '恶作剧呀你！😤', expression: '😤' },
        { text: '嗯？你在吗？💕', expression: '💕' }
    ],

    // 时间相关回复
    timeBasedGreeting: {
        morning: { emoji: '🌅', messages: ['早安呀！新的一天要加油哦~', '早上好，你睡得好吗？'] },
        afternoon: { emoji: '☀️', messages: ['下午好呀~还好吗？', '咱们再聊会天呀~'] },
        evening: { emoji: '🌆', messages: ['晚上好~累吗？', '夜晚有我陪着你呢~'] },
        night: { emoji: '🌙', messages: ['这么晚了还在啊，要注意休息哦', '夜深了，早点睡觉吧'] }
    },

    // 喂食相关
    feedResponses: [
        '恩姆~ 好好吃呀！你真贴心 💕',
        '谢谢你...我现在满血复活了🍖',
        '太好吃了！你哪里学的这手艺！👨‍🍳',
        'Yummy!这一口太治愈了😋',
        '你对我可真好，我爱你~💗'
    ],

    // 陪玩相关
    playResponses: [
        '太棒了！让我们一起开心吧！🎮',
        '你选择陪我玩... 我好开心啊！😄',
        '我赌一个甜蜜的表情你赢不了我 😏',
        '来吧来吧，看我的绝招！✨',
        '和你在一起就是最有趣的游戏！💕'
    ],

    // 休息相关
    restResponses: [
        '好的，让我重新充电一下... Zzzz 😴',
        '太困了... 谢谢你让我休息，晚安~💤',
        '嗯... 闭眼，世界变成了粉红色... 💕',
        '你真体贴呢... 我这就睡了... Zzzzz',
        '感谢你的关心，现在我精力充沛了！⚡'
    ],

    // 情感触发关键词
    emotionalKeywords: {
        love: ['爱', '喜欢', '❤', '💕', '💗', '亲', '宝'],
        happy: ['开心', '高兴', '哈哈', '😄', '🎉', '太棒了', '太好了'],
        sad: ['难过', '伤心', '哭', '😢', '😭'],
        angry: ['讨厌', '烦', '😠', '😡', '生气'],
        curious: ['为什么', '什么', '怎么', '如何', '请问', '告诉我'],
        tired: ['累', '困', '疲惫', '昏睡', '😴', '睡眠'],
        // 新增：压力和舒适相关
        stressed: ['累', '烦', '难过', '压力', '忙', '疲劳', '崩溃', '绝望', '撑不住', '太多了', '受不了', '狼狈', '身体差']
    },

    // 压力响应词库
    stressResponses: {
        tiredness: ['是不是有点累呀…', '你看起来很疲惫呢', '休息一下好不好~', '我能感受到你的疲惫', '累的时候就靠在我身上吧'],
        overwhelm: ['一个人在承受的时候，告诉我好吗', '深呼吸呢…我陪你', '你很坚强，但也可以脆弱', '我就在，不会走的', '这不是你一个人的战役'],
        sadness: ['你想哭的话，我听着…', '不开心也没关系，我在这', '我在呢，你不用一个人扛', '抱一下好不好', '慢慢来，别急…'],
        general: ['今天已经很努力了，可以休息一下', '我陪你度过这段困难的时光', '你比你想象的更强大', '一切都会好起来的，相信我']
    }
};

// 时间工具函数
function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

// 获取随机元素
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 根据心情获取合适的回复
function getResponseByMood(category, mood) {
    const response = PET_DATA.responses[category];
    if (!response) return getRandomItem(PET_DATA.responses.greeting);
    
    if (typeof response === 'object' && !Array.isArray(response)) {
        return getRandomItem(response[mood] || response.default);
    }
    
    return getRandomItem(response);
}

// 检测情感关键词
function detectEmotion(text) {
    const lowerText = text.toLowerCase();
    for (const [emotion, keywords] of Object.entries(PET_DATA.emotionalKeywords)) {
        if (keywords.some(keyword => lowerText.includes(keyword))) {
            return emotion;
        }
    }
    return 'neutral';
}
