#!/bin/bash

# 🧪 部署测试脚本 - 验证部署流程但不实际部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="wish-lighthouse"
FRONTEND_DIR="frontend"

log_info() {
    printf "${BLUE}ℹ️  $1${NC}\n"
}

log_success() {
    printf "${GREEN}✅ $1${NC}\n"
}

log_warning() {
    printf "${YELLOW}⚠️  $1${NC}\n"
}

log_error() {
    printf "${RED}❌ $1${NC}\n"
}

# 检查依赖
check_dependencies() {
    log_info "检查必要依赖..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装"
        return 1
    fi
    log_success "Node.js: $(node --version)"
    
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装"
        return 1
    fi
    log_success "npm: $(npm --version)"
    
    if ! command -v git &> /dev/null; then
        log_error "Git 未安装"
        return 1
    fi
    log_success "Git: $(git --version)"
    
    if command -v vercel &> /dev/null; then
        log_success "Vercel CLI: $(vercel --version)"
    else
        log_warning "Vercel CLI 未安装（实际部署时会自动安装）"
    fi
    
    return 0
}

# 检查项目结构
check_project_structure() {
    log_info "检查项目结构..."
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        log_error "前端目录 '$FRONTEND_DIR' 不存在"
        return 1
    fi
    log_success "前端目录存在"
    
    if [ ! -f "$FRONTEND_DIR/package.json" ]; then
        log_error "前端 package.json 不存在"
        return 1
    fi
    log_success "前端 package.json 存在"
    
    if [ ! -f "$FRONTEND_DIR/vite.config.ts" ]; then
        log_warning "vite.config.ts 不存在，可能影响构建"
    else
        log_success "Vite 配置存在"
    fi
    
    if [ ! -f "$FRONTEND_DIR/vercel.json" ]; then
        log_warning "vercel.json 不存在，将在部署时创建"
    else
        log_success "Vercel 配置存在"
    fi
    
    return 0
}

# 测试构建
test_build() {
    log_info "测试前端项目构建..."
    
    cd "$FRONTEND_DIR"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        log_info "安装依赖..."
        npm ci
    fi
    
    # 测试构建
    log_info "执行构建测试..."
    if npm run build; then
        log_success "构建成功！"
        
        # 检查构建输出
        if [ -d "dist" ]; then
            log_success "构建输出目录存在"
            local dist_size=$(du -sh dist | cut -f1)
            log_info "构建大小: $dist_size"
        else
            log_warning "构建输出目录不存在"
        fi
    else
        log_error "构建失败"
        cd ..
        return 1
    fi
    
    cd ..
    return 0
}

# 获取当前分支和环境信息
get_deployment_info() {
    log_info "获取部署信息..."
    
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    local env="preview"
    
    case "$current_branch" in
        "main"|"master")
            env="production"
            ;;
        "dev"|"develop"|"development")
            env="preview"
            ;;
        *)
            env="preview"
            ;;
    esac
    
    printf "\n"
    log_info "=== 部署信息预览 ==="
    printf "🌿 Git 分支: $current_branch\n"
    printf "🌍 目标环境: $env\n"
    printf "📦 项目名称: $PROJECT_NAME\n"
    printf "📁 前端目录: $FRONTEND_DIR\n"
    printf "🕒 测试时间: $(date '+%Y-%m-%d %H:%M:%S')\n"
    printf "\n"
}

# 验证 Git 状态
check_git_status() {
    log_info "检查 Git 状态..."
    
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "有未提交的更改"
        git status --short
    else
        log_success "工作目录干净"
    fi
    
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    local commit_hash=$(git rev-parse --short HEAD)
    log_info "当前分支: $current_branch"
    log_info "当前提交: $commit_hash"
}

# 主函数
main() {
    printf "\n"
    log_info "🧪 开始部署流程验证"
    printf "\n"
    
    # 检查依赖
    if ! check_dependencies; then
        log_error "依赖检查失败"
        exit 1
    fi
    
    # 检查项目结构
    if ! check_project_structure; then
        log_error "项目结构检查失败"
        exit 1
    fi
    
    # 检查 Git 状态
    check_git_status
    
    # 获取部署信息
    get_deployment_info
    
    # 测试构建
    if ! test_build; then
        log_error "构建测试失败"
        exit 1
    fi
    
    printf "\n"
    log_success "🎉 所有检查通过！项目准备就绪，可以部署"
    printf "\n"
    log_info "💡 使用 './deploy.sh' 开始实际部署"
    printf "\n"
}

# 执行主函数
main "$@" 