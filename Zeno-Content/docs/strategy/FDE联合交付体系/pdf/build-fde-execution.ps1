param(
    [string]$OutputName = "FDE联合交付体系-V0.1-实战启动包.pdf"
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $scriptDir "..\..\..\..\..")).Path
$tempDir = Join-Path $repoRoot "tmp\pdfs\fde-execution"
$outputDir = Join-Path $repoRoot "output\pdf"
$combinedMarkdown = Join-Path $tempDir "fde-execution-combined.md"
$tempCss = Join-Path $tempDir "fde-handbook.css"
$htmlOutput = Join-Path $tempDir "fde-execution.html"
$pdfOutput = Join-Path $outputDir $OutputName

New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

$modules = @(
    @{ Label = "MODULE 01 · 线索启动"; File = "05-FDE首次项目启动包.md" },
    @{ Label = "MODULE 02 · 项目范围"; File = "06-FDE项目SOW最小模板.md" },
    @{ Label = "MODULE 03 · 成本测算"; File = "07-FDE项目成本测算表.md" },
    @{ Label = "MODULE 04 · 30天启动"; File = "08-FDE首支小队30天启动计划.md" }
)

$content = [System.Text.StringBuilder]::new()
foreach ($module in $modules) {
    $sourcePath = Join-Path (Split-Path $scriptDir -Parent) $module.File
    $source = [System.IO.File]::ReadAllText($sourcePath, [System.Text.Encoding]::UTF8)
    $source = [System.Text.RegularExpressions.Regex]::Replace(
        $source,
        "\A\uFEFF?---\r?\n.*?\r?\n---\r?\n",
        "",
        [System.Text.RegularExpressions.RegexOptions]::Singleline
    )

    [void]$content.AppendLine("<div class=`"chapter-marker`">$($module.Label)</div>")
    [void]$content.AppendLine()
    [void]$content.AppendLine($source.Trim())
    [void]$content.AppendLine()
    [void]$content.AppendLine()
}

[System.IO.File]::WriteAllText(
    $combinedMarkdown,
    $content.ToString(),
    [System.Text.UTF8Encoding]::new($false)
)

Copy-Item -LiteralPath (Join-Path $scriptDir "fde-handbook.css") -Destination $tempCss -Force

$pandoc = (Get-Command pandoc.exe -ErrorAction Stop).Source
$template = Join-Path $scriptDir "fde-execution-template.html"

& $pandoc `
    -f "gfm+raw_html+yaml_metadata_block" `
    -t html5 `
    --standalone `
    --toc `
    --toc-depth=2 `
    --template $template `
    --css "fde-handbook.css" `
    --metadata "title=FDE 实战启动包" `
    --metadata "subtitle=从线索判断到首次真实项目的执行模板" `
    --metadata "author=广西赞诺数智科技有限公司" `
    --metadata "date=2026-08-21" `
    $combinedMarkdown `
    -o $htmlOutput

if ($LASTEXITCODE -ne 0) {
    throw "Pandoc failed with exit code $LASTEXITCODE"
}

$weasyprint = Get-Command weasyprint.exe -ErrorAction SilentlyContinue
if ($weasyprint) {
    $weasyprintPath = $weasyprint.Source
} else {
    $weasyprintPath = "G:\Hermes智能体\hermes-agent\venv\Scripts\weasyprint.exe"
}

if (-not (Test-Path -LiteralPath $weasyprintPath)) {
    throw "WeasyPrint was not found. Install it or update the fallback path in this script."
}

& $weasyprintPath $htmlOutput $pdfOutput
if ($LASTEXITCODE -ne 0) {
    throw "WeasyPrint failed with exit code $LASTEXITCODE"
}

Write-Output $pdfOutput
