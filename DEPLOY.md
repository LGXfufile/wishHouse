# 🚀 Vercel 部署指南

本文档详细说明如何使用自动化脚本将心愿灯塔项目部署到 Vercel。

## 📋 目录
- [GitHub Secrets 配置](#github-secrets-配置)
- [快速开始](#快速开始)
- [部署脚本功能](#部署脚本功能)
- [环境配置](#环境配置)
- [分支策略](#分支策略)
- [GitHub Actions](#github-actions)
- [故障排除](#故障排除)

## 🔐 GitHub Secrets 配置

### 首次设置（必需）

为了让GitHub Actions自动部署到Vercel，你需要在GitHub仓库中配置以下Secrets：

#### 1. 获取 Vercel Token

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击右上角头像 → **Settings**
3. 左侧菜单选择 **Tokens**
4. 点击 **Create Token**
5. 输入Token名称（如：`GitHub Actions Deploy`）
6. 选择过期时间（建议选择较长时间）
7. 点击 **Create** 并**立即复制Token**（只显示一次）

#### 2. 获取 Organization ID 和 Project ID

**方法一：通过Vercel CLI获取（推荐）**

```bash
# 1. 安装Vercel CLI
npm install -g vercel

# 2. 登录Vercel
vercel login

# 3. 在项目根目录链接项目
cd /path/to/your/project
vercel link

# 4. 查看项目配置
cat .vercel/project.json
```

项目配置文件内容示例：
```json
{
  "orgId": "team_abc123xyz789", 
  "projectId": "prj_abc123xyz789def456"
}
```

**方法二：从Vercel Dashboard获取**

1. 在 [Vercel Dashboard](https://vercel.com/dashboard) 找到你的项目
2. 点击项目名称进入项目详情
3. 点击 **Settings** 标签
4. 在 **General** 页面可以找到：
   - **Project ID**: 在页面顶部显示
   - **Team ID** (Organization ID): 在项目信息中显示

#### 3. 在GitHub中添加Secrets

1. 进入你的GitHub仓库
2. 点击 **Settings** 标签
3. 左侧菜单选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret** 添加以下三个secrets：

| Secret Name | Value | 说明 |
|-------------|-------|------|
| `VERCEL_TOKEN` | 步骤1获取的Token | Vercel API访问令牌 |
| `VERCEL_ORG_ID` | 从project.json获取的orgId | 组织/团队ID |
| `VERCEL_PROJECT_ID` | 从project.json获取的projectId | 项目ID |

#### 4. 验证配置

添加完Secrets后，推送任何代码到`main`或`dev`分支，GitHub Actions将自动触发部署。

你可以在GitHub仓库的 **Actions** 标签中查看部署进度和日志。

### 🚨 重要提示

- ✅ **Token安全**: 绝不要将Vercel Token提交到代码仓库中
- ✅ **权限检查**: 确保Token有足够权限访问目标项目
- ✅ **过期管理**: 定期检查和更新即将过期的Token
- ✅ **团队项目**: 如果是团队项目，确保Organization ID正确

## 🚀 快速开始

### 1. 准备工作

确保你已经：
- ✅ 安装了 Node.js 18+
- ✅ 安装了 Git
- ✅ 有 Vercel 账号
- ✅ 项目已推送到 GitHub
- ✅ **已完成上述GitHub Secrets配置**

### 2. 测试部署准备

在实际部署前，建议先运行测试脚本：

```bash
# 给脚本执行权限
chmod +x test-deploy.sh

# 运行部署前检查
./test-deploy.sh
```

测试脚本会检查：
- ✅ 依赖安装状态
- ✅ 项目结构完整性
- ✅ Git 状态和分支信息
- ✅ 前端项目构建

### 3. 本地部署

```bash
# 给脚本执行权限
chmod +x deploy.sh

# 自动检测分支并部署
./deploy.sh

# 查看帮助
./deploy.sh --help
```

### 4. 手动指定分支/环境

```bash
# 部署指定分支
./deploy.sh -b main

# 强制部署到生产环境
./deploy.sh -e production

# 部署 dev 分支到预览环境
./deploy.sh -b dev -e preview
```

## 🛠️ 部署脚本功能

### ✅ 核心功能

1. **自动分支识别**
   - `main/master` → 生产环境
   - `dev/develop` → 预览环境  
   - 其他分支 → 预览环境

2. **依赖检查**
   - Node.js、npm、Git 状态检查
   - 自动安装 Vercel CLI

3. **构建和部署**
   - 自动安装依赖 (`npm ci`)
   - 构建前端项目 (`npm run build`)
   - 部署到对应环境

4. **环境配置**
   - 自动创建 `vercel.json` 配置
   - 设置环境变量
   - 配置路由重写和安全头

5. **用户体验**
   - 彩色日志输出
   - 详细的部署信息
   - 错误处理和回滚

### 📁 文件结构

```
wish-lighthouse/
├── deploy.sh              # 主部署脚本
├── test-deploy.sh          # 部署测试脚本
├── frontend/
│   ├── vercel.json        # Vercel 配置
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions 工作流
└── DEPLOY.md             # 部署文档
```

## ⚙️ 环境配置

### 1. Vercel 项目设置

首次部署时，脚本会自动创建 `vercel.json`：

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-url.com/api/$1"
    }
  ]
}
```

### 2. 环境变量配置

在 Vercel Dashboard 中设置：

**生产环境变量：**
- `VITE_API_URL`: `https://your-production-api.com`
- `VITE_APP_NAME`: `Wish Lighthouse`
- `VITE_APP_VERSION`: `1.0.0`

**预览环境变量：**
- `VITE_API_URL`: `https://your-staging-api.com`
- `VITE_APP_NAME`: `Wish Lighthouse (Preview)`

### 3. 本地环境变量

创建 `.env.local` 文件：

```bash
# Vercel 项目配置（可选）
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

## 🌿 分支策略

### 推荐的 Git 工作流

```
main (生产)     ←─ merge ←─ release/v1.0
  ↑
dev (开发)      ←─ merge ←─ feature/new-feature
  ↑
feature/*       ←─ 开发新功能
hotfix/*        ←─ 紧急修复
```

### 部署映射

| 分支 | 环境 | URL | 用途 |
|------|------|-----|------|
| `main` | Production | `https://wish-lighthouse.vercel.app` | 生产环境 |
| `dev` | Preview | `https://wish-lighthouse-dev-*.vercel.app` | 开发测试 |
| `feature/*` | Preview | `https://wish-lighthouse-*.vercel.app` | 功能预览 |

## 🤖 GitHub Actions

### 自动化工作流

GitHub Actions 会在以下情况自动触发：

1. **推送到 main/dev 分支** → 自动部署
2. **创建 Pull Request** → 部署预览环境
3. **更新 PR** → 更新预览部署

### 必需的 GitHub Secrets

在 GitHub 仓库设置中添加：

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id  
VERCEL_PROJECT_ID=your_project_id
```

### 获取 Vercel Token

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入 Settings → Tokens
3. 创建新的 Token
4. 复制并添加到 GitHub Secrets

## 🔧 故障排除

### 常见问题

#### 1. Vercel CLI 未安装
```bash
# 手动安装
npm install -g vercel

# 或使用脚本自动安装
./deploy.sh
```

#### 2. 权限错误
```bash
# 给脚本执行权限
chmod +x deploy.sh
chmod +x test-deploy.sh
```

#### 3. TypeScript 构建错误
```bash
# 如果遇到 "declared but never used" 错误
# 已在 tsconfig.json 中修复，设置了：
# "noUnusedLocals": false
# "noUnusedParameters": false

# 手动清理重新构建
cd frontend
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

#### 4. Vercel 项目未链接
```bash
# 脚本会自动处理，或手动链接
cd frontend
vercel link --yes
```

#### 5. 构建失败
```bash
# 检查 Node.js 版本
node --version  # 需要 18+

# 清理缓存重试
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 6. API 连接问题
- 检查 `vercel.json` 中的 API 重写规则
- 确认后端服务器正常运行
- 验证环境变量设置

#### 7. 部署卡住
```bash
# 检查 Vercel 状态
vercel whoami

# 重新登录
vercel logout
vercel login
```

#### 8. 颜色输出异常
```bash
# 如果看到 "-e" 输出，说明 echo 命令有问题
# 已修复为使用 printf 命令
```

### 调试技巧

#### 1. 查看部署日志
```bash
# Vercel CLI 详细日志
vercel --debug

# 查看构建日志
vercel logs your-deployment-url
```

#### 2. 本地测试构建
```bash
cd frontend
npm run build
npm run preview
```

#### 3. 验证配置
```bash
# 检查 vercel.json 语法
cat frontend/vercel.json | jq .

# 验证环境变量
vercel env ls
```

## 📊 部署监控

### 性能指标

监控这些关键指标：
- 🚀 **构建时间**: < 2 分钟
- 📱 **首屏加载**: < 3 秒  
- 🌐 **全球延迟**: < 100ms
- 📈 **成功率**: > 99%

### 日志查看

```bash
# 查看最近部署
vercel ls

# 查看特定部署日志  
vercel logs [deployment-url]

# 实时日志
vercel logs --follow
```

## 🎯 最佳实践

### 1. 部署前检查
- ✅ 代码已通过测试
- ✅ 依赖项已更新
- ✅ 环境变量已配置
- ✅ API 端点可访问

### 2. 分支管理
- 🌿 使用语义化分支名
- 🔀 通过 PR 合并到 main
- 🏷️ 为发布创建标签
- 📝 编写清晰的提交信息

### 3. 监控和维护
- 📊 定期检查部署状态
- 🔔 设置错误告警
- 🔄 定期更新依赖
- 📝 维护部署文档

## 🆘 获取帮助

### 资源链接
- [Vercel 官方文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

### 联系支持
- 📧 Email: support@example.com
- 💬 Slack: #deployment-help
- 📖 Wiki: [内部部署文档]

---

✨ **部署愉快！** 如有问题，请查看故障排除部分或联系团队支持。 