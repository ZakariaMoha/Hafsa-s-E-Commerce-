# Quick Start: Google Sheets Setup for Hafsa's Boutique
# 
# Run this script to get step-by-step guidance on setting up Google Sheets integration
#
# Usage:
#   .\scripts\setup-google-sheet.ps1
#

Write-Host "`n📊 Hafsa's Boutique - Google Sheet Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "This script will guide you through setting up Google Sheets for order tracking.`n"

Write-Host "=== QUICK START ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Create a Google Sheet (if you don't have one)"
Write-Host "   👉 https://sheets.google.com" -ForegroundColor Blue
Write-Host ""
Write-Host "2️⃣  Deploy the Apps Script"
Write-Host "   👉 https://script.google.com (create new project)" -ForegroundColor Blue
Write-Host "   📋 Copy code from: scripts/google_sheet_webapp.gs" -ForegroundColor Blue
Write-Host "   🚀 Deploy as 'Web app' with 'Anyone' access" -ForegroundColor Blue
Write-Host ""
Write-Host "3️⃣  Get your webhook URL from the deployment"
Write-Host ""
Write-Host "4️⃣  Update your .env file with:" -ForegroundColor Yellow
Write-Host "   VITE_GOOGLE_SHEET_WEBHOOK=https://script.google.com/macros/d/{ID}/userweb" -ForegroundColor Green
Write-Host ""
Write-Host "5️⃣  Run the dev server" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "6️⃣  Test by placing an order" -ForegroundColor Yellow
Write-Host "   Check if it appears in your Google Sheet!" -ForegroundColor Green
Write-Host ""

$continue = Read-Host "Open Google Sheets now? (y/n)"
if ($continue -eq 'y' -or $continue -eq 'Y') {
    Start-Process "https://sheets.google.com"
}

Write-Host "`n✅ For detailed setup instructions, see: GOOGLE_SHEETS_SETUP.md" -ForegroundColor Green
