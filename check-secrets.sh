#!/bin/bash

# 🔍 GitHub Secrets 验证脚本
# 帮助检查Vercel部署所需的GitHub Secrets配置

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# 检查GitHub仓库
check_github_repo() {
    log_info "检查GitHub仓库配置..."
    
    if ! git remote -v | grep -q "github.com"; then
        log_error "当前目录不是GitHub仓库或未配置GitHub远程地址"
        return 1
    fi
    
    local repo_url=$(git remote get-url origin)
    log_success "GitHub仓库: $repo_url"
    
    # 提取仓库信息
    if [[ $repo_url =~ github\.com[:/]([^/]+)/([^/]+)(\.git)?$ ]]; then
        GITHUB_OWNER="${BASH_REMATCH[1]}"
        GITHUB_REPO="${BASH_REMATCH[2]}"
        GITHUB_REPO="${GITHUB_REPO%.git}" # 移除.git后缀
        log_info "仓库所有者: $GITHUB_OWNER"
        log_info "仓库名称: $GITHUB_REPO"
    else
        log_error "无法解析GitHub仓库信息"
        return 1
    fi
    
    return 0
}

# 检查GitHub Actions workflow文件
check_workflow_file() {
    log_info "检查GitHub Actions workflow文件..."
    
    if [ ! -f ".github/workflows/deploy.yml" ]; then
        log_error "GitHub Actions workflow文件不存在: .github/workflows/deploy.yml"
        log_info "文件应该已存在，请检查项目结构"
        return 1
    fi
    
    log_success "GitHub Actions workflow文件存在"
    
    # 检查workflow文件中的secrets引用
    if grep -q "VERCEL_TOKEN" ".github/workflows/deploy.yml" && \
       grep -q "VERCEL_ORG_ID" ".github/workflows/deploy.yml" && \
       grep -q "VERCEL_PROJECT_ID" ".github/workflows/deploy.yml"; then
        log_success "Workflow文件包含所需的secrets引用"
    else
        log_warning "Workflow文件可能缺少必要的secrets引用"
    fi
    
    return 0
}

# 检查Vercel配置
check_vercel_config() {
    log_info "检查Vercel项目配置..."
    
    # 检查前端目录中的配置
    local vercel_config_paths=(".vercel/project.json" "frontend/.vercel/project.json")
    local config_found=false
    local config_path=""
    
    for path in "${vercel_config_paths[@]}"; do
        if [ -f "$path" ]; then
            config_found=true
            config_path="$path"
            break
        fi
    done
    
    if [ "$config_found" = true ]; then
        log_success "找到Vercel项目配置文件: $config_path"
        
        # 读取配置信息
        if command -v jq &> /dev/null; then
            local org_id=$(jq -r '.orgId' "$config_path" 2>/dev/null)
            local project_id=$(jq -r '.projectId' "$config_path" 2>/dev/null)
            
            if [ "$org_id" != "null" ] && [ "$project_id" != "null" ]; then
                log_success "Organization ID: $org_id"
                log_success "Project ID: $project_id"
                
                printf "\n${YELLOW}📋 请将以下值添加到GitHub Secrets:${NC}\n"
                printf "VERCEL_ORG_ID = $org_id\n"
                printf "VERCEL_PROJECT_ID = $project_id\n\n"
            else
                log_warning "无法读取Vercel配置中的ID信息"
            fi
        else
            log_warning "未安装jq，无法解析Vercel配置文件"
            log_info "你可以手动查看 $config_path 文件获取orgId和projectId"
            
            # 显示文件内容作为fallback
            printf "\n${BLUE}配置文件内容:${NC}\n"
            cat "$config_path"
            printf "\n\n"
        fi
    else
        log_warning "未找到Vercel项目配置文件"
        log_info "请在项目根目录或frontend目录运行 'vercel link' 来链接项目到Vercel"
    fi
}

# 检查Vercel CLI
check_vercel_cli() {
    log_info "检查Vercel CLI..."
    
    if command -v vercel &> /dev/null; then
        local vercel_version=$(vercel --version)
        log_success "Vercel CLI已安装: $vercel_version"
        
        # 检查是否已登录
        if vercel whoami &> /dev/null; then
            local user=$(vercel whoami)
            log_success "已登录Vercel: $user"
        else
            log_warning "未登录Vercel，请运行 'vercel login'"
        fi
    else
        log_warning "Vercel CLI未安装"
        log_info "安装命令: npm install -g vercel"
    fi
}

# 生成GitHub Secrets设置链接
generate_secrets_link() {
    if [ -n "$GITHUB_OWNER" ] && [ -n "$GITHUB_REPO" ]; then
        local secrets_url="https://github.com/$GITHUB_OWNER/$GITHUB_REPO/settings/secrets/actions"
        printf "\n${BLUE}🔗 GitHub Secrets 设置链接:${NC}\n"
        printf "$secrets_url\n\n"
    fi
}

# 显示设置指南
show_setup_guide() {
    printf "\n${YELLOW}📚 完整设置指南:${NC}\n\n"
    
    printf "1. 获取Vercel Token:\n"
    printf "   - 访问: https://vercel.com/account/tokens\n"
    printf "   - 点击 'Create Token'\n"
    printf "   - 复制生成的token\n\n"
    
    printf "2. 链接Vercel项目 (如果未链接):\n"
    printf "   vercel link\n\n"
    
    printf "3. 在GitHub中添加Secrets:\n"
    if [ -n "$GITHUB_OWNER" ] && [ -n "$GITHUB_REPO" ]; then
        printf "   访问: https://github.com/$GITHUB_OWNER/$GITHUB_REPO/settings/secrets/actions\n"
    else
        printf "   访问: GitHub仓库 → Settings → Secrets and variables → Actions\n"
    fi
    printf "   添加以下三个secrets:\n"
    printf "   - VERCEL_TOKEN (从步骤1获取)\n"
    printf "   - VERCEL_ORG_ID (从.vercel/project.json获取)\n"
    printf "   - VERCEL_PROJECT_ID (从.vercel/project.json获取)\n\n"
    
    printf "4. 测试部署:\n"
    printf "   git add .\n"
    printf "   git commit -m \"Test deployment\"\n"
    printf "   git push origin main\n\n"
    
    printf "5. 查看部署状态:\n"
    if [ -n "$GITHUB_OWNER" ] && [ -n "$GITHUB_REPO" ]; then
        printf "   访问: https://github.com/$GITHUB_OWNER/$GITHUB_REPO/actions\n"
    else
        printf "   访问: GitHub仓库 → Actions 标签页\n"
    fi
}

# 主函数
main() {
    printf "\n${BLUE}🔍 GitHub Secrets 配置检查${NC}\n"
    printf "检查Vercel自动部署所需的配置...\n\n"
    
    # 检查各项配置
    check_github_repo || exit 1
    check_workflow_file || exit 1
    check_vercel_cli
    check_vercel_config
    
    # 生成链接和指南
    generate_secrets_link
    show_setup_guide
    
    printf "${GREEN}🎉 配置检查完成！${NC}\n"
    printf "请按照上述指南配置GitHub Secrets，然后推送代码测试自动部署。\n\n"
}

# 执行主函数
main "$@" 