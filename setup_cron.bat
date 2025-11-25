@echo off
echo Windows Task Scheduler ile Cron Job Kurulumu
echo.

REM Task oluştur (her saat başı çalışsın)
schtasks /create /tn "14luk-PriceCollector" /tr "C:\xampp\php\php.exe C:\xampp\htdocs\backend\cron\collect_prices_direct.php" /sc hourly /ru SYSTEM

echo.
echo Task oluşturuldu: 14luk-PriceCollector
echo Her saat başı çalışacak
echo.

REM Task'ı test et
echo Test ediliyor...
schtasks /run /tn "14luk-PriceCollector"

echo.
echo Kurulum tamamlandı!
echo Task'ları görmek için: schtasks /query /tn "14luk-PriceCollector"
echo Task'ı silmek için: schtasks /delete /tn "14luk-PriceCollector" /f
pause
