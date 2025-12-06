@echo off
echo ================================
echo   Git Push Automation
echo ================================
echo.

REM Set colors (optional)
color 0A

REM Get current branch
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set "BRANCH=%%i"

if "%BRANCH%"=="" (
    echo ❌ Not a git repository!
    pause
    exit /b 1
)

echo 📁 Repository: %CD%
echo 🌿 Branch: %BRANCH%
echo.

REM Check for changes
git diff --quiet HEAD
if errorlevel 1 (
    echo 📦 Staging changes...
    git add .
    
    echo 💾 Committing changes...
    git commit -m "Update: %date% %time:~0,5%"
    
    echo 🚀 Pushing to GitHub...
    git push origin %BRANCH%
    
    if errorlevel 1 (
        echo ⚠️  Push failed! Setting upstream...
        git push -u origin %BRANCH%
    )
) else (
    echo ℹ️  No changes to commit.
    echo 🔄 Pulling latest changes...
    git pull origin %BRANCH%
)

echo.
echo ✅ Git operations completed!
echo 📍 GitHub: https://github.com/Maleisila/vercelapp
pause