@echo off
echo ========================================
echo Git Configuration Setup
echo ========================================
echo.

set /p NAME="Enter your name: "
set /p EMAIL="Enter your email: "

echo.
echo Configuring Git with:
echo Name: %NAME%
echo Email: %EMAIL%
echo.

git config --global user.name "%NAME%"
git config --global user.email "%EMAIL%"

echo.
echo ✅ Git configured successfully!
echo.
echo Now you can create your commit with:
echo git commit -m "Initial commit: Belgian Roof Insulation Calculator"
echo.
pause
