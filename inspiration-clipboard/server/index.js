import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// 测试接口
app.post("/analyze-image", (req, res) => {
  console.log("收到图片请求");

  res.json({
    tags: ["minimal", "pastel", "soft lighting"]
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});