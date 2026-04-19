# 🎨 设计灵感剪切板 - Express 服务器

> AI 术语生成服务，为上传的设计图片自动生成相关术语。

## 📋 快速开始

### 1️⃣ 安装依赖

```bash
npm install
```

### 2️⃣ 启动服务器

```bash
npm start
```

输出：
```
╔════════════════════════════════════════════════╗
║  🎨 设计灵感剪切板 - AI 术语服务               ║
╠════════════════════════════════════════════════╣
║  ✅ 服务器启动成功                             ║
║  📍 端口: 3000                                 ║
║  🌐 地址: http://localhost:3000               ║
╚════════════════════════════════════════════════╝
```

### 3️⃣ 测试服务

#### 获取随机术语
```bash
curl http://localhost:3000/random-tags
```

响应：
```json
{
  "success": true,
  "tags": ["minimal", "pastel", "soft lighting", "calm", "matte"],
  "count": 5
}
```

#### 分析单张图片
```bash
curl -X POST http://localhost:3000/analyze-image \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/png;base64,iVBORw0KGgo..."}'
```

响应：
```json
{
  "success": true,
  "tags": ["minimal", "warm tone", "soft lighting"],
  "count": 3,
  "timestamp": "2026-04-16T10:30:00.000Z"
}
```

#### 批量分析图片
```bash
curl -X POST http://localhost:3000/analyze-images \
  -H "Content-Type: application/json" \
  -d '{"images":["data:image/png;base64,iVBORw0KGgo...","data:image/jpeg;base64,/9j/4AAQSkZJRg..."]}'
```

---

## 🌐 API 端点

### GET `/`
**健康检查** - 验证服务器状态

**响应：**
```json
{
  "status": "ok",
  "message": "设计灵感剪切板 - AI 标签服务",
  "endpoint": "POST /analyze-image",
  "version": "1.0.0"
}
```

---

### GET `/random-tags`
**获取随机术语** - 不需要图片数据

**响应：**
```json
{
  "success": true,
  "tags": ["pastel", "minimal", "cozy", "soft lighting", "smooth"],
  "count": 5
}
```

---

### POST `/analyze-image`
**分析单张图片** - 生成设计术语

**请求体：**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}
```

**响应成功 (200)：**
```json
{
  "success": true,
  "tags": ["minimal", "pastel", "soft lighting", "calm", "smooth"],
  "count": 5,
  "timestamp": "2026-04-16T10:30:00.000Z"
}
```

**响应失败 (400)：**
```json
{
  "success": false,
  "error": "Invalid image format. Expected data:image/... base64"
}
```

---

### POST `/analyze-images`
**批量分析图片** - 分析多张图片

**请求体：**
```json
{
  "images": [
    "data:image/png;base64,iVBORw0KGgo...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ]
}
```

**响应：**
```json
{
  "success": true,
  "results": [
    {
      "index": 0,
      "success": true,
      "tags": ["minimal", "pastel", "soft lighting"]
    },
    {
      "index": 1,
      "success": true,
      "tags": ["vintage", "warm tone", "dramatic"]
    }
  ],
  "timestamp": "2026-04-16T10:30:00.000Z"
}
```

---

## 🎨 术语词库

服务器包含 **5 个分类**、**50+ 术语**：

### 颜色 (Colors)
pastel, warm tone, muted color, gradient, vibrant, monochrome, saturated, desaturated, cool tone, earth tone

### 风格 (Styles)
minimal, 3D, flat, glassmorphism, skeuomorphic, geometric, organic, vintage, futuristic, retro

### 情绪 (Moods)
cozy, calm, cute, playful, dreamy, serene, energetic, luxurious, nostalgic, modern

### 材质 (Materials)
matte, soft shadow, grainy, smooth, textured, metallic, velvet, glossy, frosted, rough

### 光影 (Lighting)
soft lighting, ambient, diffused, dramatic, golden hour, neon, backlighting, sidelight, harsh, rim light

---

## 🛠️ 开发模式

使用 nodemon 自动重启服务器：

```bash
npm run dev
```

---

## 📦 依赖项

- **express** (^4.18.2) - Web 框架
- **cors** (^2.8.5) - 跨域支持
- **nodemon** (^3.0.1) - 开发工具（自动重启）

---

## 🔌 与前端集成

在 `step3.html` 中修改 `generateAITags()` 函数：

```javascript
async function generateAITags(imageData) {
    const response = await fetch('http://localhost:3000/analyze-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData })
    });

    const result = await response.json();
    return result.tags;
}
```

然后在页面中：
1. 打开 `step3.html`
2. 点击 "AI Tag: ON" 按钮激活 AI 模式
3. 上传图片 → 服务器生成术语 → 前端显示

---

## 📝 环境配置

默认配置：
- **端口**: 3000
- **CORS**: 允许所有源
- **最大请求体**: 10mb

修改端口（在 `server.js` 中）：
```javascript
const PORT = process.env.PORT || 3000;
```

---

## 🐛 故障排除

### ❌ `Port 3000 already in use`
换一个端口：
```bash
PORT=3001 npm start
```

### ❌ `Cannot find module 'express'`
重新安装依赖：
```bash
npm install
```

### ❌ CORS 错误
检查请求头中是否有 `Content-Type: application/json`

---

## 📊 性能参数

- 单张图片分析: **< 1 秒**
- 批量分析 (10 张): **< 2 秒**
- 支持单张最大: **10 MB**

---

## 🎯 下一步

1. ✅ 集成真实 AI 模型（TensorFlow.js / Azure Vision API）
2. ✅ 添加图片缓存
3. ✅ 实现用户认证
4. ✅ 数据库存储历史记录

---

## 📄 许可证

MIT License

---

## 💡 示例：JavaScript 客户端

```javascript
// 发送单张图片
async function analyzeImage(imageBase64) {
    const response = await fetch('http://localhost:3000/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 })
    });
    const data = await response.json();
    console.log('生成的术语:', data.tags);
    return data.tags;
}

// 使用
const canvas = document.querySelector('canvas');
const imageBase64 = canvas.toDataURL('image/png');
await analyzeImage(imageBase64);
```

---

**需要帮助？** 查看 API 文档或提交 Issue。
