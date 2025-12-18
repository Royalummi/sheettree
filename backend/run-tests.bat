@echo off
REM Backend Test Runner for Windows
REM Run all PHPUnit tests with coverage

echo ========================================
echo SheetTree Backend Test Suite
echo ========================================
echo.

REM Check if test database exists
echo [1/4] Checking test database...
C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS sheettree_test;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Test database ready
) else (
    echo ✗ Failed to create test database
    exit /b 1
)

REM Set up test database schema
echo [2/4] Setting up test database schema...
C:\xampp\mysql\bin\mysql.exe -u root sheettree_test < database\test_database_setup.sql 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Test schema created
) else (
    echo ✗ Failed to create test schema
)

REM Run PHPUnit tests
echo [3/4] Running PHPUnit tests...
echo.
vendor\bin\phpunit --colors=always --testdox

REM Check test results
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ All tests passed!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ✗ Some tests failed
    echo ========================================
    exit /b 1
)

REM Generate coverage report (optional)
echo [4/4] Test coverage report available at: tests/coverage/html/index.html
echo.

pause
