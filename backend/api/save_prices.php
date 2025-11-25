<?php

require_once '../config/db.php';
require_once '../config/rate_limit.php';

header('Access-Control-Allow-Origin: https://14luk.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Sadece POST metodu kabul edilir.']);
    exit;
}

$apiKey = $_SERVER['HTTP_X_API_KEY'] ?? '';
$validApiKey = getenv('PRICE_API_KEY') ?: 'default-secret-key-change-this';

if ($apiKey !== $validApiKey) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Geçersiz API anahtarı.']);
    exit;
}

$clientIp = getClientIp();

try {
    $pdo = getDBConnection();
    $rateLimitResult = checkRateLimitDB($pdo, $clientIp, 'save_prices', 100, 3600, 900);
    
    if (!$rateLimitResult['allowed']) {
        http_response_code(429);
        header('Retry-After: ' . $rateLimitResult['retry_after']);
        echo json_encode([
            'success' => false, 
            'message' => $rateLimitResult['message'],
            'retry_after' => $rateLimitResult['retry_after']
        ]);
        exit;
    }
} catch (Exception $e) {
    error_log("Rate limit initialization error: " . $e->getMessage());
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['prices'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Geçersiz veri formatı.']);
    exit;
}

$validSymbols = ['ONS', 'ALTIN', '14LUK'];
$prices = $data['prices'];

foreach ($prices as $price) {
    if (!isset($price['symbol']) || !in_array($price['symbol'], $validSymbols)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Geçersiz sembol: ' . ($price['symbol'] ?? 'null')]);
        exit;
    }
    
    if (!isset($price['buy_price']) || !isset($price['sell_price'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Eksik fiyat verisi.']);
        exit;
    }
    
    if (!is_numeric($price['buy_price']) || !is_numeric($price['sell_price'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Geçersiz fiyat değeri.']);
        exit;
    }
}

try {
    $pdo = getDBConnection();
    
    $stmt = $pdo->prepare("
        INSERT INTO price_history 
        (symbol, buy_price, sell_price, close_price, direction, recorded_at) 
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    
    $savedCount = 0;
    foreach ($prices as $price) {
        $result = $stmt->execute([
            $price['symbol'],
            $price['buy_price'],
            $price['sell_price'],
            $price['close_price'] ?? null,
            $price['direction'] ?? null
        ]);
        
        if ($result) {
            $savedCount++;
        }
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => "$savedCount fiyat kaydedildi.",
        'saved_count' => $savedCount
    ]);
    
} catch (Exception $e) {
    error_log("Save prices error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Veri kaydedilirken bir hata oluştu.'
    ]);
}
?>
