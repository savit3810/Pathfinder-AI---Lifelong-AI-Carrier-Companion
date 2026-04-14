@echo off
echo ==========================================
echo    PathFinder AI - GitHub Push Helper
echo ==========================================
echo.
echo This script will push the structured files to:
echo https://github.com/savit3810/Pathfinder-AI---Lifelong-AI-Carrier-Companion
echo.
echo IMPORTANT: This will replace the file list on GitHub with the correct folder structure.
echo.
set /p confirm="Do you want to proceed? (y/n): "
if /i "%confirm%" neq "y" exit

echo.
echo Attempting to push using bash...
bash.exe -c "git push -u origin main --force"

if %errorlevel% neq 0 (
    echo.
    echo PUSH FAILED.
    echo This usually means you need to login or use a Personal Access Token.
    echo Please ensure you are logged in to GitHub in your browser or terminal.
) else (
    echo.
    echo SUCCESS! Your GitHub repository has been updated with the correct structure.
)

echo.
pause
