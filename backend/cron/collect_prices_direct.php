<?php

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/fetch_gramfiyat_14luk.php';

function logMessage($message) {
    $logFile = __DIR__ . '/price_collection.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
    echo "[$timestamp] $message\n";
}

function fetchPricesFromHaremin() {
    try {
        $nodeScript = realpath(__DIR__ . '/fetch-prices.js');
        if (!$nodeScript || !file_exists($nodeScript)) {
            logMessage("Node.js script dosyası bulunamadı!");
            return null;
        }

        $nodePaths = [
            'node',
            'C:\\Program Files\\nodejs\\node.exe',
            'C:\\Program Files (x86)\\nodejs\\node.exe',
            'C:\\nodejs\\node.exe'
        ];
        
        $validNodePath = null;
        foreach ($nodePaths as $nodePath) {
            $testCommand = escapeshellcmd($nodePath) . ' --version 2>&1';
            $testOutput = shell_exec($testCommand);
            if ($testOutput && strpos(trim($testOutput), 'v') === 0) {
                $validNodePath = $nodePath;
                logMessage("Node.js bulundu: $nodePath");
                break;
            }
        }
        
        if (!$validNodePath) {
            logMessage("Node.js bulunamadı!");
            return null;
        }
        
        $command = escapeshellcmd($validNodePath) . ' ' . escapeshellarg($nodeScript) . ' 2>&1';
        
        logMessage("Node.js script çalıştırılıyor...");
        logMessage("Komut: $command");
        $output = shell_exec($command);
        
        if (!$output) {
            logMessage("Node.js script çalıştırılamadı - Çıktı boş");
            return null;
        }
        
        logMessage("Node.js çıktısı: " . substr($output, 0, 200) . "...");
        
        $result = json_decode(trim($output), true);
        
        if (!$result || !$result['success']) {
            $error = $result['error'] ?? 'Bilinmeyen hata';
            logMessage("Harem API hatası: $error");
            return null;
        }
        
        if (!isset($result['data'])) {
            logMessage("Harem API'den geçersiz veri");
            return null;
        }
        
        logMessage("Harem API'den veri alındı");
        return $result['data'];
        
    } catch (Exception $e) {
        logMessage("Harem API hatası: " . $e->getMessage());
        return null;
    }
}

function savePriceHistory($pdo, $symbol, $buyPrice, $sellPrice, $closePrice = null, $direction = null) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO price_history 
            (symbol, buy_price, sell_price, close_price, direction, recorded_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        
        $stmt->execute([
            $symbol,
            $buyPrice,
            $sellPrice,
            $closePrice,
            $direction
        ]);
        
        logMessage("Kaydedildi: $symbol - Alış: $buyPrice, Satış: $sellPrice");
        return true;
        
    } catch (Exception $e) {
        logMessage("Kayıt hatası: " . $e->getMessage());
        return false;
    }
}

function cleanOldRecords($pdo) {
    try {
        $stmt = $pdo->prepare("
            DELETE FROM price_history 
            WHERE recorded_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
        ");
        $stmt->execute();
        $deleted = $stmt->rowCount();
        
        if ($deleted > 0) {
            logMessage("Eski kayıtlar temizlendi: $deleted adet");
        }
        
    } catch (Exception $e) {
        logMessage("Temizleme hatası: " . $e->getMessage());
    }
}

function checkRecentData($pdo) {
    try {
        $stmt = $pdo->prepare("
            SELECT symbol, COUNT(*) as count, MAX(recorded_at) as last_record
            FROM price_history 
            WHERE recorded_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
            GROUP BY symbol
        ");
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        logMessage("Son 24 saat veri özeti:");
        foreach ($results as $row) {
            logMessage("   {$row['symbol']}: {$row['count']} kayıt - Son: {$row['last_record']}");
        }
        
        foreach (['ONS', 'ALTIN', '14LUK'] as $symbol) {
            $found = false;
            foreach ($results as $row) {
                if ($row['symbol'] === $symbol && $row['count'] > 0) {
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                logMessage("$symbol için son 24 saatte veri yok!");
            }
        }
        
    } catch (Exception $e) {
        logMessage("Kontrol hatası: " . $e->getMessage());
    }
}

function formatPriceData($haremData) {
    $prices = [];
    
    // ONS ve HAS ALTIN fiyatlarını al
    if (isset($haremData['ONS'])) {
        $ons = $haremData['ONS'];
        $prices[] = [
            'symbol' => 'ONS',
            'buy_price' => (float)$ons['alis'],
            'sell_price' => (float)$ons['satis'],
            'close_price' => isset($ons['kapanis']) ? (float)$ons['kapanis'] : null,
            'direction' => $ons['dir']['satis_dir'] ?? null,
            'source' => 'harem'
        ];
    }
    
    if (isset($haremData['ALTIN'])) {
        $altin = $haremData['ALTIN'];
        $prices[] = [
            'symbol' => 'ALTIN',
            'buy_price' => (float)$altin['alis'],
            'sell_price' => (float)$altin['satis'],
            'close_price' => isset($altin['kapanis']) ? (float)$altin['kapanis'] : null,
            'direction' => $altin['dir']['satis_dir'] ?? null,
            'source' => 'harem'
        ];
    }
    
    return $prices;
}

function collectAllPrices() {
    $allPrices = [];
    
    // 1. Haremin'den ONS ve ALTIN fiyatlarını al
    logMessage("Harem API'den ONS ve ALTIN fiyatları alınıyor...");
    $haremData = fetchPricesFromHaremin();
    
    if ($haremData) {
        $haremPrices = formatPriceData($haremData);
        $allPrices = array_merge($allPrices, $haremPrices);
        logMessage("Harem'den " . count($haremPrices) . " fiyat alındı");
    } else {
        logMessage("Harem'den veri alınamadı");
    }
    
    // 2. GramFiyat'tan 14'lük fiyatını al
    logMessage("GramFiyat'tan 14'lük fiyatı alınıyor...");
    $gramfiyat14luk = fetch14LukFromGramFiyat();
    
    if ($gramfiyat14luk) {
        $allPrices[] = $gramfiyat14luk;
        logMessage("GramFiyat'tan 14'lük fiyatı alındı");
    } else {
        logMessage("GramFiyat'tan 14'lük fiyatı alınamadı, hesaplama yapılacak");
        
        // Haremden gelen veri ile hesap
        if (isset($haremData['ALTIN'])) {
            $altin = $haremData['ALTIN'];
            $allPrices[] = [
                'symbol' => '14LUK',
                'buy_price' => (float)$altin['alis'] * 0.580,
                'sell_price' => (float)$altin['satis'] * 0.645,
                'close_price' => isset($altin['kapanis']) ? (float)$altin['kapanis'] * 0.645 : null,
                'direction' => $altin['dir']['satis_dir'] ?? null,
                'source' => 'harem_calculated'
            ];
            logMessage("14'lük fiyatı Haremin verilerinden hesaplandı");
        }
    }
    
    return $allPrices;
}

try {
    logMessage("Cron job başladı (Harem + GramFiyat)");
    
    $pdo = getDBConnection();
    
    // Hibrit şekilde hem Harem hem XML
    $allPrices = collectAllPrices();
    
    if (!empty($allPrices)) {
        $savedCount = 0;
        foreach ($allPrices as $price) {
            $source = $price['source'] ?? 'unknown';
            logMessage("Kaydediliyor: {$price['symbol']} (Kaynak: $source)");
            
            if (savePriceHistory($pdo, $price['symbol'], $price['buy_price'], 
                               $price['sell_price'], $price['close_price'], $price['direction'])) {
                $savedCount++;
            }
        }
        
        logMessage("$savedCount fiyat kaydedildi");
    } else {
        logMessage("Hiçbir kaynaktan veri çekilemedi");
    }
    
    checkRecentData($pdo);
    
    $hour = (int)date('H');
    if ($hour === 3) {
        cleanOldRecords($pdo);
    }
    
    logMessage("Cron job tamamlandı\n");
    
} catch (Exception $e) {
    logMessage("HATA: " . $e->getMessage());
    exit(1);
}
?>

