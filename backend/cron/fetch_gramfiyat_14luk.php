<?php

/**
 * GramFiyat.com'dan 14'lük altın fiyatlarını çekme fonksiyonu
 * Cache busting ile güncel veri garantisi
 */

function fetch14LukFromGramFiyat() {
    try {
        $timestamp = time();
        $url = "https://v2.gramfiyat.com/products/export/abe6a42e-0f17-4250-a51e-ddc6636a181d?t=" . $timestamp;
        
        logMessage("GramFiyat XML çekiliyor: $url");
        
        // cURL ile XML verisini çek
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/xml, text/xml, */*',
            'Accept-Language: tr-TR,tr;q=0.9,en;q=0.8',
            'Cache-Control: no-cache'
        ]);
        
        $xmlContent = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            logMessage("✗ cURL hatası: $error");
            return null;
        }
        
        if ($httpCode !== 200) {
            logMessage("✗ HTTP hatası: $httpCode");
            return null;
        }
        
        if (!$xmlContent) {
            logMessage("✗ XML içeriği boş");
            return null;
        }
        
        logMessage("✓ XML verisi alındı (" . strlen($xmlContent) . " byte)");
        
        // XML'i parse et
        $xml = simplexml_load_string($xmlContent);
        if (!$xml) {
            logMessage("✗ XML parse hatası");
            return null;
        }
        
        // Sadece 1 gram 14'lük web_sitesi fiyatını bul
        foreach ($xml->children() as $product) {
            $code = (string)$product->code ?? '';
            $name = (string)$product->name ?? '';
            
            // Sadece 1 gram 14'lük ara
            if ($code === '1-GR-14') {
                $webSitesi = (float)($product->price->web_sitesi ?? 0);
                
                if ($webSitesi > 0) {
                    logMessage("✓ 1 gram 14'lük bulundu: $name - Web Sitesi Fiyatı: $webSitesi TL");
                    
                    return [
                        'symbol' => '14LUK',
                        'buy_price' => $webSitesi,
                        'sell_price' => $webSitesi,
                        'close_price' => null,
                        'direction' => null,
                        'source' => 'gramfiyat',
                        'product_name' => $name,
                        'product_code' => $code
                    ];
                }
            }
        }
        
        logMessage("⚠️ 1 gram 14'lük fiyat bulunamadı");
        return null;
        
    } catch (Exception $e) {
        logMessage("✗ GramFiyat hatası: " . $e->getMessage());
        return null;
    }
}

/**
 * Test fonksiyonu - manuel test için
 */
function testGramFiyatConnection() {
    logMessage("🧪 GramFiyat bağlantı testi başlıyor...");
    
    $result = fetch14LukFromGramFiyat();
    
    if ($result) {
        logMessage("✅ Test başarılı!");
        logMessage("   14'lük Alış: " . $result['buy_price']);
        logMessage("   14'lük Satış: " . $result['sell_price']);
        logMessage("   Ürün: " . $result['product_name']);
        return true;
    } else {
        logMessage("❌ Test başarısız!");
        return false;
    }
}

// Test için
if (basename(__FILE__) === basename($_SERVER['SCRIPT_NAME'])) {
    require_once __DIR__ . '/../config/db.php';
    
    function logMessage($message) {
        $logFile = __DIR__ . '/gramfiyat_test.log';
        $timestamp = date('Y-m-d H:i:s');
        file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
        echo "[$timestamp] $message\n";
    }
    
    testGramFiyatConnection();
}

?>
