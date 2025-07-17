#!/bin/bash

# 🚀 Vercel 自动部署脚本
# 支持多分支部署：main → Production，dev → Preview

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# 检查依赖
check_dependencies() {
    log_info "检查必要依赖..."
    
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

# 获取当前分支
get_current_branch() {
    local branch=$(git rev-parse --abbrev-ref HEAD)
    echo "$branch"
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
    log_info "构建前端项目..."
    
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
    log_info "检查 Vercel 认证状态..."
    
    if ! vercel whoami &> /dev/null; then
        log_warning "未登录 Vercel，请先登录"
        vercel login
    fi
    
    local user=$(vercel whoami)
    log_success "已登录 Vercel，用户：$user"
}

# 链接 Vercel 项目
link_vercel_project() {
    log_info "检查 Vercel 项目链接..."
    
    cd "$FRONTEND_DIR"
    
    # 检查是否已经链接
    if [ ! -f ".vercel/project.json" ]; then
        log_warning "项目未链接到 Vercel，正在链接..."
        vercel link --yes
        log_success "项目已成功链接到 Vercel"
    else
        log_success "项目已链接到 Vercel"
    fi
    
    cd ..
}

# 部署到 Vercel
deploy_to_vercel() {
    local branch=$1
    local env=$2
    local flags=$3
    
    log_info "开始部署到 Vercel..."
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
        deploy_cmd="$deploy_cmd --prod"
    else
        log_info "🔄 部署到预览环境..."
    fi
    
    # 执行部署命令
    local deployment_output
    local deployment_url
    deployment_output=$(eval "$deploy_cmd" 2>&1)
    
    if [ $? -eq 0 ]; then
        # 提取部署URL - 查找包含vercel.app的URL
        deployment_url=$(printf "%s" "$deployment_output" | grep -o 'https://[^[:space:]]*\.vercel\.app[^[:space:]]*' | tail -1)
        
        # 如果没有找到vercel.app的URL，尝试查找Production行中的URL
        if [ -z "$deployment_url" ]; then
            deployment_url=$(printf "%s" "$deployment_output" | grep "Production:" | grep -o 'https://[^[:space:]]*' | head -1)
        fi
        
        log_success "部署成功！"
        
        if [ -n "$deployment_url" ]; then
            log_success "部署地址：$deployment_url"
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
    
    printf "\n"
    log_info "=== 部署信息 ==="
    printf "🌿 Git 分支：$branch\n"
    printf "🌍 部署环境：$env\n"
    printf "📦 项目名称：$PROJECT_NAME\n"
    printf "📁 前端目录：$FRONTEND_DIR\n"
    printf "🕒 部署时间：$(date '+%Y-%m-%d %H:%M:%S')\n"
    printf "\n"
}

# 主函数
main() {
    printf "\n"
    log_info "🚀 开始 Vercel 自动部署流程"
    printf "\n"
    
    # 检查依赖
    check_dependencies
    
    # 获取当前分支
    local current_branch
    current_branch=$(get_current_branch)
    
    # 确定部署环境
    local deployment_env
    deployment_env=$(get_deployment_env "$current_branch")
    
    # 获取部署参数
    local deployment_flags
    deployment_flags=$(get_deployment_flags "$deployment_env" "$current_branch")
    
    # 显示部署信息
    show_deployment_info "$current_branch" "$deployment_env"
    
    # 检查 Vercel 认证
    check_vercel_auth
    
    # 链接 Vercel 项目
    link_vercel_project
    
    # 设置 Vercel 配置
    setup_vercel_config
    
    # 设置环境变量
    setup_env_vars "$deployment_env"
    
    # 构建前端项目
    build_frontend
    
    # 部署到 Vercel
    deploy_to_vercel "$current_branch" "$deployment_env" "$deployment_flags"
    
    printf "\n"
    log_success "🎉 部署流程完成！"
    printf "\n"
}

# 帮助信息
show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项："
    echo "  -h, --help     显示帮助信息"
    echo "  -b, --branch   指定分支（可选，默认使用当前分支）"
    echo "  -e, --env      指定环境（production/preview）"
    echo ""
    echo "示例："
    echo "  $0                    # 自动检测分支并部署"
    echo "  $0 -b main            # 部署 main 分支到生产环境"
    echo "  $0 -b dev             # 部署 dev 分支到预览环境"
    echo "  $0 -e production      # 强制部署到生产环境"
    echo ""
    echo "分支映射："
    echo "  main/master → production"
    echo "  dev/develop → preview"
    echo "  其他分支    → preview"
}

# 处理命令行参数
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