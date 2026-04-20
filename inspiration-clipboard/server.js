/**
 * AI 图片标签服务（最终稳定版）
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ════════════════════════════════════════
// fallback 随机分组标签（永不失败）
// ════════════════════════════════════════
function generateFallbackTags() {
    return {
        subject: ['图像', '设计'],
        color: ['柔和色调', '暖色调'],
        style: ['极简风', '几何风'],
        mood: ['平静', '温馨'],
        lighting: ['柔光', '环境光'],
        material: ['光滑', '哑光']
    };
}

function generateFallbackTagsArray() {
    const groups = generateFallbackTags();
    const tags = [];
    Object.values(groups).forEach(arr => {
        if (Array.isArray(arr)) tags.push(...arr);
    });
    return tags;
}

// ════════════════════════════════════════
// ⭐ 超强解析器（防所有模型发疯）
// ════════════════════════════════════════
function parseTags(text) {
    if (!text) return null;

    // 如果是数组（兼容旧格式）
    if (Array.isArray(text)) {
        text = text.map(i => i.text || "").join("");
    }

    // 去 markdown
    text = text.replace(/```json|```/g, "").trim();

    // 尝试 JSON 对象（分组格式）
    try {
        const match = text.match(/\{[\s\S]*\}/s);
        if (match) {
            const parsed = JSON.parse(match[0]);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                const normalized = {
                    subject: Array.isArray(parsed.subject) ? parsed.subject : [],
                    color: Array.isArray(parsed.color) ? parsed.color : [],
                    style: Array.isArray(parsed.style) ? parsed.style : [],
                    mood: Array.isArray(parsed.mood) ? parsed.mood : [],
                    lighting: Array.isArray(parsed.lighting) ? parsed.lighting : [],
                    material: Array.isArray(parsed.material) ? parsed.material : []
                };
                return normalized;
            }
        }
    } catch {}

    // 旧格式兼容：尝试数组
    try {
        const match = text.match(/\[.*\]/s);
        if (match) {
            return JSON.parse(match[0]);
        }
    } catch {}

    return null;
}

// ════════════════════════════════════════
// ⭐ Qwen 图像分析（国内稳定）
// ════════════════════════════════════════
async function qwenAnalyze(imageBase64) {
    const base64Data = imageBase64.split(',')[1];

    const res = await fetch(
        "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.DASHSCOPE_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen-vl-plus",
                input: {
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    image: `data:image/png;base64,${base64Data}`
                                },
                                {
                                    text: `你是一名专业的设计分析师。

请分析这张图片，并输出"设计标签分组"。

要求：
* 必须使用中文
* 每个标签为简短词组（2-6个字）
* 必须符合图像内容
* 不要英文

分类定义：
* subject：主体（人物、动物、物体等）
* color：颜色（色调、配色方案等）
* style：风格（极简、复古、现代等）
* mood：情绪（温馨、可爱、梦幻等）
* lighting：光影（柔光、逆光、强光等）
* material：材质（哑光、光泽、毛绒等）

严格规则：
* 只返回 JSON 对象
* 不要解释
* 不要 markdown
* JSON 格式：
{
  "subject": ["标签1", "标签2"],
  "color": ["标签1", "标签2"],
  "style": ["标签1"],
  "mood": ["标签1"],
  "lighting": ["标签1"],
  "material": ["标签1"]
}

每个分类返回 1-4 个标签。`
                                }
                            ]
                        }
                    ]
                }
            })
        }
    );

    const data = await res.json();

    console.log("🔥 Qwen full response:", JSON.stringify(data, null, 2));

    // 多种返回格式兼容
    let text =
        data.output?.text?.[0]?.text ||
        data.output?.text ||
        data.output?.choices?.[0]?.message?.content ||
        "";

    console.log("🤖 Qwen raw:", text);

    return parseTags(text);
}

// ════════════════════════════════════════
// ⭐ 主控制（带容灾）
// ════════════════════════════════════════
async function generateTagsFromImage(imageBase64) {
    try {
        const result = await qwenAnalyze(imageBase64);

        // 检查是否是分组格式（对象）
        if (result && typeof result === 'object' && !Array.isArray(result)) {
            // 验证至少有一个分类有标签
            const hasContent = Object.values(result).some(arr => 
                Array.isArray(arr) && arr.length > 0
            );
            if (hasContent) {
                return result;
            }
        }

        throw new Error("AI empty or invalid format");

    } catch (error) {
        console.error("❌ AI失败 → fallback:", error.message);
        return generateFallbackTags();
    }
}

// ════════════════════════════════════════
// 风格分析生成
// ════════════════════════════════════════

// 默认风格分析文本
const DEFAULT_STYLE_ANALYSIS = "该图像呈现出柔和的视觉风格，整体色彩协调，构图简洁，具有良好的审美表现。";

// 本地模板风格分析
function analyzeStyleFromGroups(groups) {
    const templates = [
        (color, style, mood, lighting, material) => 
            `这是一幅具有${color}特色的${style}作品。整体氛围${mood}，采用了${lighting}的光线处理，营造出${material}的视觉质感。`,
        
        (color, style, mood, lighting, material) => 
            `作品融合了${color}的调性和${style}的设计语言。通过${lighting}的光影效果和${material}的材质表现，打造出${mood}的艺术氛围。`,
        
        (color, style, mood, lighting, material) => 
            `这件作品展现了${style}风格的魅力，${color}的色彩搭配增强了整体的${mood}感受。${lighting}的处理和${material}质感完美结合，创造出独特的视觉体验。`,
        
        (color, style, mood, lighting, material) => 
            `从${color}的配色到${style}的布局，再到${lighting}和${material}的细节处理，每一个元素都在诠释${mood}的主题。`,
        
        (color, style, mood, lighting, material) => 
            `${style}的设计理念与${color}的视觉语言完美契合，营造出${mood}的格调。${lighting}的运用和${material}的质地进一步强化了这种美学表达。`
    ];

    // 从 groups 中获取标签
    const subject = groups.subject?.[0] || '设计作品';
    const color = groups.color?.[0] || '柔和色调';
    const style = groups.style?.[0] || '现代风格';
    const mood = groups.mood?.[0] || '平静';
    const lighting = groups.lighting?.[0] || '柔光';
    const material = groups.material?.[0] || '光滑';

    // 随机选择一个模板
    const template = templates[Math.floor(Math.random() * templates.length)];
    const analysis = template(color, style, mood, lighting, material);

    return analysis;
}

// AI 风格分析（Qwen）
async function analyzeStyleViaAI(groups) {
    try {
        // 构造标签描述
        const groupsText = Object.entries(groups)
            .map(([key, values]) => {
                const keyName = {
                    subject: '主体',
                    color: '颜色',
                    style: '风格',
                    mood: '情绪',
                    lighting: '光影',
                    material: '材质'
                }[key] || key;
                return `${keyName}：${Array.isArray(values) ? values.join('、') : '无'}`;
            })
            .join('\n');

        const prompt = `你是一名资深设计分析师。

请基于以下标签，对图像的视觉风格进行专业分析：

${groupsText}

请描述：

* 调色板（颜色风格）
* 光影表现
* 风格特征
* 材质表现
* 情绪氛围
* 构图方式

要求：

* 输出为一段完整中文文字
* 不要分点
* 不要JSON
* 不要markdown
* 语气自然、专业
* 300字左右`;

        const res = await fetch(
            "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.DASHSCOPE_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "qwen-plus",
                    input: {
                        messages: [
                            {
                                role: "user",
                                content: prompt
                            }
                        ]
                    }
                })
            }
        );

        const data = await res.json();

        console.log("🎨 Qwen Style Analysis response:", JSON.stringify(data, null, 2));

        // 提取返回文本
        let text =
            data.output?.text ||
            data.output?.choices?.[0]?.message?.content ||
            data.output?.completion ||
            "";

        if (text && typeof text === 'string' && text.trim().length > 0) {
            return text.trim();
        }

        throw new Error("Empty AI response");

    } catch (error) {
        console.error("❌ AI 风格分析失败:", error.message);
        return DEFAULT_STYLE_ANALYSIS;
    }
}

// ════════════════════════════════════════
// 路由
// ════════════════════════════════════════

// 健康检查
app.get('/api', (req, res) => {
    res.json({
        status: 'ok',
        message: 'AI 标签服务（最终稳定版）'
    });
});

// 单张图片
app.post('/analyze-image', async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                error: 'Missing image'
            });
        }

        const groups = await generateTagsFromImage(image);
        const flatTags = [];
        Object.values(groups).forEach(arr => {
            if (Array.isArray(arr)) flatTags.push(...arr);
        });

        res.json({
            success: true,
            tags: flatTags,
            groups: groups,
            count: flatTags.length
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            groups: generateFallbackTags()
        });
    }
});

// 批量
app.post('/analyze-images', async (req, res) => {
    try {
        const { images } = req.body;

        const results = await Promise.all(
            images.map(async (img, index) => {
                try {
                    const tags = await generateTagsFromImage(img);
                    return { index, success: true, tags };
                } catch {
                    return { index, success: false };
                }
            })
        );

        res.json({ success: true, results });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 生成灵感总结
async function generateSummaryViaAI(tags, notes = '', type = 'week') {
    try {
        console.log(`📝 开始生成${type === 'day' ? '日' : '周'}总结`, { tags, notes, type });
        
        let tagsText = '';
        if (Array.isArray(tags)) {
            tagsText = tags.join('、');
        } else {
            tagsText = Object.values(tags).flat().join('、');
        }

        console.log('📝 标签文本:', tagsText);

        const prompt = type === 'day' 
            ? `你是一名资深设计评论家。根据以下灵感标签，生成一份短小精悍的"今日灵感总结"（200字左右）：

标签：${tagsText}

要求：
* 用第一人称
* 归纳今日设计灵感的核心主题
* 提取关键的视觉元素和设计趋势
* 给出下一步的创作方向建议
* 输出纯文本，无markdown`
            : `你是一名资深设计评论家。根据以下灵感标签和周笔记，生成一份"本周灵感总结"（300-400字）：

标签：${tagsText}

周笔记：${notes || '无笔记'}

要求：
* 综合分析本周的设计灵感主题
* 提取共同的视觉语言和风格特征
* 总结本周的设计趋势和收获
* 给出下周的创作方向和建议
* 输出纯文本，无markdown`;

        const res = await fetch(
            "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.DASHSCOPE_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "qwen-plus",
                    input: {
                        messages: [
                            {
                                role: "user",
                                content: prompt
                            }
                        ]
                    }
                })
            }
        );

        const data = await res.json();
        
        console.log("📝 Qwen Summary API response:", JSON.stringify(data, null, 2));
        
        // 多种返回格式兼容
        let text = 
            data.output?.text?.[0]?.text ||
            data.output?.text ||
            data.output?.choices?.[0]?.message?.content ||
            data.output?.completion ||
            "";

        console.log('📝 提取的文本:', text);

        if (text && typeof text === 'string' && text.trim().length > 0) {
            return text.trim();
        }

        throw new Error("Empty AI response");

    } catch (error) {
        console.error("❌ AI 总结生成失败:", error.message);
        return type === 'day' 
            ? "无法生成总结，请稍后重试。" 
            : "本周设计灵感丰富多彩，涵盖了多种视觉风格和设计理念。建议继续探索这些主题，为下周的创作积累更多灵感。";
    }
}

// 风格分析
app.post('/analyze-style', async (req, res) => {
    try {
        const { groups } = req.body;

        if (!groups || typeof groups !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Missing or invalid groups',
                text: DEFAULT_STYLE_ANALYSIS
            });
        }

        // 调用 AI 进行风格分析
        const analysis = await analyzeStyleViaAI(groups);

        res.json({
            success: true,
            text: analysis
        });

    } catch (error) {
        console.error('风格分析错误:', error);
        res.json({
            success: true,
            text: DEFAULT_STYLE_ANALYSIS
        });
    }
});

// 生成灵感总结
app.post('/generate-summary', async (req, res) => {
    try {
        const { tags, notes, type = 'week' } = req.body;

        console.log('📝 收到总结请求:', { tagsCount: tags?.length, type });

        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            console.log('❌ 标签为空');
            return res.json({
                success: false,
                text: '暂无标签数据'
            });
        }

        const summary = await generateSummaryViaAI(tags, notes, type);

        console.log('✅ 总结生成成功:', summary.substring(0, 50) + '...');

        res.json({
            success: true,
            text: summary
        });

    } catch (error) {
        console.error('❌ 总结生成错误:', error.message);
        const fallbackText = req.body.type === 'day' 
            ? "无法生成总结，请稍后重试。"
            : "本周设计灵感丰富多彩，涵盖了多种视觉风格和设计理念。建议继续探索这些主题，为下周的创作积累更多灵感。";
        res.json({
            success: true,
            text: fallbackText
        });
    }
});

// 随机标签
app.get('/random-tags', (req, res) => {
    const groups = generateFallbackTags();
    const flatTags = generateFallbackTagsArray();
    res.json({
        success: true,
        tags: flatTags,
        groups: groups
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not found'
    });
});

// ════════════════════════════════════════
// 启动
// ════════════════════════════════════════
app.listen(PORT, () => {
    console.log(`
🚀 AI 标签服务已启动（最终稳定版）
📍 http://localhost:${PORT}

✔ 国内直连（Qwen）
✔ 自动解析 JSON
✔ 永不空结果（fallback）
✔ 抗模型发疯
`);
});