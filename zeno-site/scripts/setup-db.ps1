# ============================================================
# Zeno Site — 数据库初始化脚本
# 使用方法：在 zeno-site 目录下运行：
#   .\scripts\setup-db.ps1
# ============================================================

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Zeno Site — 数据库初始化" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 读取 .env.local
$envFile = Join-Path $PSScriptRoot ".." ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "❌ 找不到 .env.local 文件，请先确认文件存在" -ForegroundColor Red
    exit 1
}

# 检查是否已替换密码
$content = Get-Content $envFile -Raw
if ($content -match "\[YOUR-PASSWORD\]") {
    Write-Host "⚠️  检测到 .env.local 中还有未替换的 [YOUR-PASSWORD]" -ForegroundColor Yellow
    Write-Host ""
    $password = Read-Host "请输入你的 Supabase 数据库密码（在 Supabase Dashboard → Settings → Database 找到）" -AsSecureString
    $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
    )

    # 替换 .env.local 中的密码占位符
    $newContent = $content -replace "\[YOUR-PASSWORD\]", $plainPassword
    Set-Content $envFile $newContent -Encoding UTF8
    Write-Host "✅ 密码已写入 .env.local" -ForegroundColor Green
}

Write-Host ""
Write-Host "▶ 正在运行 prisma db push（将 schema 同步到 Supabase）..." -ForegroundColor Cyan
Write-Host ""

# 运行 prisma db push
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ 数据库表创建成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Yellow
    Write-Host "  1. 在 Vercel → Settings → Environment Variables 添加（如还未添加）："
    Write-Host "     DATABASE_URL  = postgresql://postgres.qnoujcvfpgegbfhajzmn:<密码>@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"
    Write-Host "     DIRECT_URL    = postgresql://postgres:<密码>@db.qnoujcvfpgegbfhajzmn.supabase.co:5432/postgres"
    Write-Host "     AUTH_SECRET   = UoQsnKAnl4CAjrPunwFvG3ZKKEA72QqsLad+ZYDBrTU="
    Write-Host "     ADMIN_SESSION_SECRET = B8ci9pmFG0Eb9r8mB46lvDDJhGHnsUIYSv0/OfwhqHg="
    Write-Host "     NEXTAUTH_URL  = https://zenoaihome.com （Production）"
    Write-Host "     ADMIN_PASSWORD = 你自定义的管理员密码"
    Write-Host "     NEXT_PUBLIC_SITE_URL = https://zenoaihome.com"
    Write-Host "  2. 在 Vercel 触发 Redeploy"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ prisma db push 失败，请检查连接字符串是否正确" -ForegroundColor Red
    Write-Host "   确认密码无误后重新运行此脚本" -ForegroundColor Red
    Write-Host ""
}
