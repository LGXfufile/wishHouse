# 心愿灯塔 (Wish Lighthouse) 🌟

一个美观现代的在线祈福网站，让用户分享愿望、支持他人并创建美丽的愿望卡片。

## 🚀 快速启动

### 方法一：使用启动脚本（推荐）
```bash
./start.sh
```

### 方法二：分别启动
```bash
# 启动后端
node simple-server.js

# 新开终端，启动前端
cd frontend && npm run dev
```

### 访问地址
- **前端网站**: http://localhost:3001
- **后端API**: http://localhost:5000

## 🎉 功能特色

### 核心功能
- ✨ **愿望发布** - 用户可以发布文字愿望，选择分类（健康、事业、爱情等）
- 🏠 **愿望展示墙** - 浏览和支持他人的愿望
- 👤 **个人中心** - 管理自己的愿望和查看统计数据
- 🌐 **国际化支持** - 支持中英文切换
- 📱 **响应式设计** - 完美适配PC和移动设备

### 技术特色
- 🎨 **现代UI设计** - 使用Tailwind CSS和Framer Motion
- ⚡ **高性能** - React + TypeScript + Vite
- 🛡️ **类型安全** - 全面的TypeScript支持
- 🌍 **SEO友好** - 针对搜索引擎优化

## 🛠️ 技术栈

### 前端
- **React 18** - 现代React框架
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **Framer Motion** - 流畅动画
- **React Router** - 客户端路由
- **React Hook Form** - 表单管理
- **React Query** - 数据获取和缓存
- **React i18next** - 国际化

### 后端
- **Node.js** - JavaScript运行时
- **Express** - Web框架
- **CORS** - 跨域资源共享

## 📦 安装依赖

### 前置要求
- Node.js 18+ 
- npm 或 yarn

### 1. 克隆项目
```bash
git clone <repository-url>
cd wish-lighthouse
```

### 2. 安装依赖
```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend && npm install
```

## 🌟 使用指南

### 创建愿望
1. 访问首页 http://localhost:3001
2. 滚动到"许下心愿"部分
3. 填写愿望内容（10-500字符）
4. 选择愿望分类
5. 选择是否匿名发布
6. 点击提交

### 浏览愿望墙
1. 点击导航栏的"Wish Wall"（愿望墙）
2. 使用分类过滤器筛选愿望
3. 选择排序方式（最新/最热门）
4. 点击"Light Up"（点亮）支持他人愿望

### 管理个人愿望
1. 点击"My Wishes"（我的愿望）查看个人统计
2. 查看所有发布的愿望
3. 查看收到的点亮数量

### 语言切换
点击右上角的语言切换按钮，支持中英文切换

## 🔧 开发指南

### 项目结构
```
wish-lighthouse/
├── frontend/                 # React前端应用
│   ├── src/
│   │   ├── components/      # React组件
│   │   ├── pages/          # 页面组件
│   │   ├── types/          # TypeScript类型定义
│   │   ├── hooks/          # 自定义Hooks
│   │   ├── i18n/           # 国际化配置
│   │   └── App.tsx         # 主应用组件
│   ├── public/             # 静态资源
│   └── package.json
├── simple-server.js          # 简单的Express后端
├── start.sh                 # 启动脚本
└── README.md
```

### API端点
```
GET  /api/wishes           # 获取愿望列表
POST /api/wishes           # 创建新愿望
POST /api/wishes/:id/like  # 点亮/取消点亮愿望
GET  /health              # 健康检查
```

### 开发模式特性
- **热重载**: 前端支持热重载，修改代码立即生效
- **API代理**: 前端自动代理API请求到后端
- **Mock数据**: 后端使用内存中的模拟数据
- **错误处理**: 完善的错误处理和日志记录

## 🚀 部署

### 生产环境准备
1. 设置真实的数据库（MongoDB）
2. 配置环境变量
3. 构建前端项目
4. 部署到云服务器

### 推荐部署平台
- **Vercel** (前端) + **Railway/Render** (后端)
- **Netlify** (前端) + **Heroku** (后端)
- **AWS/阿里云** (全栈)

## 🤝 贡献

欢迎提交Issue和Pull Request！

### 开发流程
1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 🐛 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查看端口占用
   lsof -i :3001
   lsof -i :5000
   
   # 杀死进程
   pkill -f "node"
   ```

2. **API请求失败**
   - 确认后端服务器正在运行
   - 检查浏览器开发者工具的网络面板
   - 查看控制台错误信息

3. **前端页面空白**
   - 检查浏览器控制台错误
   - 确认所有依赖已正确安装
   - 尝试清除浏览器缓存

## 📝 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [React](https://reactjs.org/) - UI库
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [Lucide React](https://lucide.dev/) - 图标库
- [Express](https://expressjs.com/) - 后端框架

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

💌 有任何问题或建议，欢迎联系我们！

## 🎯 当前状态

✅ **Demo已可用** - 在 http://localhost:3001 查看完整功能
✅ **API正常工作** - 所有核心功能已实现
✅ **国际化支持** - 中英文切换
✅ **响应式设计** - 适配各种设备
✅ **现代化UI** - 美观的渐变和动画效果 # wishHouse
