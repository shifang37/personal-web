# 上传静态文件到阿里云服务器（需要本机已装 OpenSSH 客户端，Win10+ 自带）
#
# 用法：
#   .\deploy\upload.ps1 -Server 1.2.3.4
#   .\deploy\upload.ps1 -Server 1.2.3.4 -User ubuntu -Path /var/www/shifang37.com
#
# 前提：服务器上已经建好目标目录，且当前用户有写权限，例如
#   mkdir -p /var/www/shifang37.com && chown -R $USER /var/www/shifang37.com
#
# 注意：本文件保存为 UTF-8 with BOM，Windows PowerShell 5.1 才能正确读取中文。

[CmdletBinding()]
param(
    [Parameter(Mandatory, HelpMessage = "服务器公网 IP 或域名")]
    [string]$Server,

    [string]$User = "root",

    [string]$Path = "/var/www/shifang37.com",

    [string]$KeyFile
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$target = "${User}@${Server}:${Path}/"

# 只上传网站实际需要的文件，README / docs / 部署脚本不用上去
$files = @("index.html", "robots.txt", "assets")
$missing = $files | Where-Object { -not (Test-Path (Join-Path $projectRoot $_)) }
if ($missing) {
    throw "项目里找不到这些文件：$($missing -join ', ')（请在 personal-web 目录下运行本脚本）"
}

$scpArgs = @("-r")
if ($KeyFile) { $scpArgs += @("-i", $KeyFile) }

Write-Host "上传到 $target ..." -ForegroundColor Cyan

Push-Location $projectRoot
try {
    foreach ($item in $files) {
        & scp @scpArgs $item $target
        if ($LASTEXITCODE -ne 0) { throw "上传 $item 失败（exit $LASTEXITCODE）" }
        Write-Host "  [ok] $item" -ForegroundColor Green
    }
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "完成。如果服务器上已配好 Nginx，直接刷新页面即可。" -ForegroundColor Green
Write-Host "首次部署还需要：nginx -t && systemctl reload nginx" -ForegroundColor DarkGray
