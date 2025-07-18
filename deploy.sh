#!/bin/bash

# 🚀 Vercel 自动部署脚本
# 支持多分支部署：main → Production，dev → Preview
# 新增功能：Git分支检查、远程推送、状态验证

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="wish-lighthouse"
FRONTEND_DIR="frontend"

# 日志函数
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "${PURPLE}🔄 $1${NC}"
}

# 检查Git仓库状态
check_git_status() {
    log_step "检查Git仓库状态..."
    
    # 检查是否在Git仓库中
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "当前目录不是Git仓库"
        exit 1
    fi
    
    # 检查工作目录是否干净
    if ! git diff-index --quiet HEAD --; then
        log_warning "工作目录有未提交的更改"
        git status --porcelain
        echo ""
        read -p "是否要提交这些更改？(y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            commit_changes
        else
            log_warning "跳过提交，继续部署（注意：未提交的更改不会被部署）"
        fi
    else
        log_success "工作目录干净，没有未提交的更改"
    fi
}

# 提交更改
commit_changes() {
    log_step "提交当前更改..."
    
    git add .
    
    # 获取提交信息
    local commit_msg
    read -p "请输入提交信息 (默认: Deploy updates): " commit_msg
    commit_msg=${commit_msg:-"Deploy updates"}
    
    git commit -m "$commit_msg"
    log_success "更改已提交"
}

# 获取当前分支
get_current_branch() {
    local branch=$(git rev-parse --abbrev-ref HEAD)
    echo "$branch"
}

# 检查远程分支
check_remote_branch() {
    local branch=$1
    
    log_step "检查远程分支状态..."
    
    # 检查远程仓库连接
    if ! git remote -v | grep -q origin; then
        log_error "没有配置origin远程仓库"
        exit 1
    fi
    
    # 获取远程更新
    log_info "获取远程仓库更新..."
    git fetch origin
    
    # 检查远程分支是否存在
    if git ls-remote --heads origin "$branch" | grep -q "refs/heads/$branch"; then
        log_info "远程分支 origin/$branch 存在"
        
        # 检查本地分支是否领先或落后
        local ahead=$(git rev-list --count "origin/$branch..$branch" 2>/dev/null || echo "0")
        local behind=$(git rev-list --count "$branch..origin/$branch" 2>/dev/null || echo "0")
        
        if [ "$behind" -gt 0 ]; then
            log_warning "本地分支落后远程 $behind 个提交"
            read -p "是否要拉取远程更新？(y/N): " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git pull origin "$branch"
                log_success "已拉取远程更新"
            fi
        fi
        
        if [ "$ahead" -gt 0 ]; then
            log_info "本地分支领先远程 $ahead 个提交，需要推送"
            return 1  # 需要推送
        else
            log_success "本地分支与远程同步"
            return 0  # 不需要推送
        fi
    else
        log_warning "远程分支 origin/$branch 不存在，将创建新分支"
        return 1  # 需要推送
    fi
}

# 推送到远程仓库
push_to_remote() {
    local branch=$1
    
    log_step "推送分支 '$branch' 到远程仓库..."
    
    # 检查是否有远程跟踪分支
    if ! git rev-parse --abbrev-ref "$branch@{upstream}" > /dev/null 2>&1; then
        log_info "设置远程跟踪分支..."
        git push -u origin "$branch"
    else
        git push origin "$branch"
    fi
    
    log_success "成功推送到远程仓库"
    
    # 显示推送信息
    local commit_hash=$(git rev-parse --short HEAD)
    local commit_msg=$(git log -1 --pretty=format:"%s")
    log_info "最新提交: $commit_hash - $commit_msg"
}

# 验证远程推送
verify_remote_push() {
    local branch=$1
    
    log_step "验证远程推送状态..."
    
    # 再次获取远程状态
    git fetch origin
    
    # 检查本地和远程是否同步
    local local_commit=$(git rev-parse HEAD)
    local remote_commit=$(git rev-parse "origin/$branch" 2>/dev/null || echo "")
    
    if [ "$local_commit" = "$remote_commit" ]; then
        log_success "本地分支与远程仓库完全同步"
        return 0
    else
        log_error "推送验证失败，本地与远程不同步"
        return 1
    fi
}

# 检查依赖
check_dependencies() {
    log_step "检查必要依赖..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装，请先安装 Node.js"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装，请先安装 npm"
        exit 1
    fi
    
    # 检查 git
    if ! command -v git &> /dev/null; then
        log_error "Git 未安装，请先安装 Git"
        exit 1
    fi
    
    # 检查 Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI 未安装，正在安装..."
        npm install -g vercel
        log_success "Vercel CLI 安装完成"
    fi
    
    log_success "所有依赖检查通过"
}

# 获取部署环境
get_deployment_env() {
    local branch=$1
    case "$branch" in
        "main"|"master")
            echo "production"
            ;;
        "dev"|"develop"|"development")
            echo "preview"
            ;;
        *)
            echo "preview"
            ;;
    esac
}

# 获取部署标志
get_deployment_flags() {
    local env=$1
    local branch=$2
    
    case "$env" in
        "production")
            echo "--prod"
            ;;
        "preview")
            echo "--target preview"
            ;;
        *)
            echo "--target preview"
            ;;
    esac
}

# 构建前端项目
build_frontend() {
    log_step "构建前端项目..."
    
    cd "$FRONTEND_DIR"
    
    # 检查 package.json 是否存在
    if [ ! -f "package.json" ]; then
        log_error "前端目录中没有找到 package.json"
        exit 1
    fi
    
    # 安装依赖
    log_info "安装前端依赖..."
    npm ci
    
    # 构建项目
    log_info "构建项目..."
    npm run build
    
    log_success "前端项目构建完成"
    cd ..
}

# Vercel 登录检查
check_vercel_auth() {
    log_step "检查 Vercel 认证状态..."
    
    if ! vercel whoami &> /dev/null; then
        log_warning "未登录 Vercel，请先登录"
        vercel login
    fi
    
    local user=$(vercel whoami)
    log_success "已登录 Vercel，用户：$user"
}

# 链接 Vercel 项目
link_vercel_project() {
    log_step "检查 Vercel 项目链接..."
    
    cd "$FRONTEND_DIR"
    
    # 检查是否已经链接
    if [ ! -f ".vercel/project.json" ]; then
        log_warning "项目未链接到 Vercel，正在链接..."
        vercel link --yes
        log_success "项目已成功链接到 Vercel"
    else
        log_success "项目已链接到 Vercel"
        
        # 显示项目信息
        if [ -f ".vercel/project.json" ]; then
            local project_info=$(cat .vercel/project.json)
            log_info "项目配置: $project_info"
        fi
    fi
    
    cd ..
}

# 部署到 Vercel
deploy_to_vercel() {
    local branch=$1
    local env=$2
    local flags=$3
    
    log_step "开始部署到 Vercel..."
    log_info "分支：$branch"
    log_info "环境：$env"
    log_info "参数：$flags"
    
    cd "$FRONTEND_DIR"
    
    # 设置环境变量
    export VERCEL_ORG_ID=${VERCEL_ORG_ID:-""}
    export VERCEL_PROJECT_ID=${VERCEL_PROJECT_ID:-""}
    
    # 执行部署
    local deploy_cmd="vercel $flags --yes"
    
    if [ "$env" = "production" ]; then
        log_info "🚀 部署到生产环境..."
    else
        log_info "🔄 部署到预览环境..."
    fi
    
    # 执行部署命令
    local deployment_output
    local deployment_url
    deployment_output=$(eval "$deploy_cmd" 2>&1)
    
    if [ $? -eq 0 ]; then
        # 提取部署URL - 查找包含vercel.app的URL，并清理可能的额外文字
        deployment_url=$(printf "%s" "$deployment_output" | grep -o 'https://[^[:space:]]*\.vercel\.app' | tail -1)
        
        # 如果没有找到vercel.app的URL，尝试查找Production行中的URL
        if [ -z "$deployment_url" ]; then
            deployment_url=$(printf "%s" "$deployment_output" | grep "Production:" | grep -o 'https://[^[:space:]]*\.vercel\.app' | head -1)
        fi
        
        log_success "部署成功！"
        
        if [ -n "$deployment_url" ]; then
            log_success "部署地址：$deployment_url"
            
            # 在终端中显示可点击的链接
            echo ""
            echo "🌐 点击访问部署地址："
            echo "   $deployment_url"
            echo ""
        else
            log_success "部署完成，请检查 Vercel Dashboard 获取部署地址"
        fi
        
        # 如果是生产环境，还显示自定义域名
        if [ "$env" = "production" ]; then
            log_success "生产环境地址：https://$PROJECT_NAME.vercel.app"
        fi
    else
        log_error "部署失败"
        printf "%s\n" "$deployment_output"
        exit 1
    fi
    
    cd ..
}

# 设置 Vercel 项目配置
setup_vercel_config() {
    log_info "检查 Vercel 项目配置..."
    
    cd "$FRONTEND_DIR"
    
    # 如果没有 vercel.json，创建一个
    if [ ! -f "vercel.json" ]; then
        log_info "创建 vercel.json 配置文件..."
        cat > vercel.json << EOF
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "devCommand": "npm run dev",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-url.com/api/\$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
EOF
        log_success "vercel.json 配置文件已创建"
    fi
    
    cd ..
}

# 创建环境变量配置
setup_env_vars() {
    local env=$1
    
    log_info "设置环境变量..."
    
    cd "$FRONTEND_DIR"
    
    # 根据环境设置不同的 API URL
    case "$env" in
        "production")
            vercel env add VITE_API_URL production << EOF || true
https://your-production-api.com
EOF
            ;;
        "preview")
            vercel env add VITE_API_URL preview << EOF || true
https://your-staging-api.com
EOF
            ;;
    esac
    
    cd ..
}

# 显示部署信息
show_deployment_info() {
    local branch=$1
    local env=$2
    local commit_hash=$(git rev-parse --short HEAD)
    local commit_msg=$(git log -1 --pretty=format:"%s")
    
    printf "\n"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_info "🚀 部署信息总览"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    printf "🌿 Git 分支：%s\n" "$branch"
    printf "🌍 部署环境：%s\n" "$env"
    printf "📦 项目名称：%s\n" "$PROJECT_NAME"
    printf "📁 前端目录：%s\n" "$FRONTEND_DIR"
    printf "🔖 提交哈希：%s\n" "$commit_hash"
    printf "💬 提交信息：%s\n" "$commit_msg"
    printf "🕒 部署时间：%s\n" "$(date '+%Y-%m-%d %H:%M:%S')"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    printf "\n"
}

# 主函数
main() {
    printf "\n"
    echo "🚀🚀🚀 Vercel 自动部署流程启动 🚀🚀🚀"
    printf "\n"
    
    # 1. 检查依赖
    check_dependencies
    
    # 2. 检查Git状态
    check_git_status
    
    # 3. 获取当前分支
    local current_branch
    current_branch=$(get_current_branch)
    log_info "当前分支: $current_branch"
    
    # 4. 检查远程分支状态
    local need_push=false
    if ! check_remote_branch "$current_branch"; then
        need_push=true
    fi
    
    # 5. 推送到远程（如果需要）
    if [ "$need_push" = true ]; then
        push_to_remote "$current_branch"
        verify_remote_push "$current_branch"
    fi
    
    # 6. 确定部署环境
    local deployment_env
    deployment_env=$(get_deployment_env "$current_branch")
    
    # 7. 获取部署参数
    local deployment_flags
    deployment_flags=$(get_deployment_flags "$deployment_env" "$current_branch")
    
    # 8. 显示部署信息
    show_deployment_info "$current_branch" "$deployment_env"
    
    # 9. 检查 Vercel 认证
    check_vercel_auth
    
    # 10. 链接 Vercel 项目
    link_vercel_project
    
    # 11. 构建前端项目
    build_frontend
    
    # 12. 部署到 Vercel
    deploy_to_vercel "$current_branch" "$deployment_env" "$deployment_flags"
    
    printf "\n"
    echo "🎉🎉🎉 部署流程完成！🎉🎉🎉"
    echo ""
    log_success "分支 '$current_branch' 已成功部署到 '$deployment_env' 环境"
    echo ""
    echo "📝 后续操作建议："
    echo "   1. 访问部署地址验证功能"
    echo "   2. 检查 Vercel Dashboard 查看详细日志"
    echo "   3. 如有问题，查看构建日志进行调试"
    printf "\n"
}

# 帮助信息
show_help() {
    echo "🚀 Vercel 自动部署脚本"
    echo "功能：Git分支检查、远程推送、自动部署"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项："
    echo "  -h, --help     显示帮助信息"
    echo "  -b, --branch   指定分支（可选，默认使用当前分支）"
    echo "  -e, --env      指定环境（production/preview）"
    echo "  --skip-push    跳过Git推送步骤"
    echo "  --force-push   强制推送到远程"
    echo ""
    echo "示例："
    echo "  $0                    # 自动检测分支并部署"
    echo "  $0 -b main            # 部署 main 分支到生产环境"
    echo "  $0 -b dev             # 部署 dev 分支到预览环境"
    echo "  $0 -e production      # 强制部署到生产环境"
    echo "  $0 --skip-push        # 跳过Git推送，直接部署"
    echo ""
    echo "分支映射："
    echo "  main/master → production 环境"
    echo "  dev/develop → preview 环境"
    echo "  其他分支    → preview 环境"
    echo ""
    echo "流程步骤："
    echo "  1. 检查系统依赖"
    echo "  2. 检查Git仓库状态"
    echo "  3. 检查并推送到远程分支"
    echo "  4. Vercel认证和项目链接"
    echo "  5. 构建前端项目"
    echo "  6. 部署到对应环境"
}

# 处理命令行参数
SKIP_PUSH=false
FORCE_PUSH=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -b|--branch)
            FORCE_BRANCH="$2"
            shift 2
            ;;
        -e|--env)
            FORCE_ENV="$2"
            shift 2
            ;;
        --skip-push)
            SKIP_PUSH=true
            shift
            ;;
        --force-push)
            FORCE_PUSH=true
            shift
            ;;
        *)
            log_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
done

# 如果指定了强制分支或环境，覆盖自动检测
if [ -n "$FORCE_BRANCH" ]; then
    current_branch="$FORCE_BRANCH"
fi

if [ -n "$FORCE_ENV" ]; then
    deployment_env="$FORCE_ENV"
fi

# 执行主函数
main 