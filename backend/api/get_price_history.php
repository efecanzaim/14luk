<?php

require_once '../config/db.php';

$allowedOrigins = [
    'https://14luk.com',
    'https://www.14luk.com'
];

if (getenv('ENVIRONMENT') === 'development' || $_SERVER['SERVER_NAME'] === 'localhost') {
    $allowedOrigins[] = 'http://localhost:3000';
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Sadece GET metodu kabul edilir.'
    ]);
    exit;
}

$symbol = $_GET['symbol'] ?? 'ONS';
$hours = min((int)($_GET['hours'] ?? 24), 168); // max 1 hafta

$validSymbols = ['ONS', 'ALTIN', '14LUK'];
if (!in_array($symbol, $validSymbols)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Geçersiz sembol. Geçerli değerler: ' . implode(', ', $validSymbols)
    ]);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // fiyat geçmişini çek
    $stmt = $pdo->prepare("
        SELECT 
            DATE_FORMAT(recorded_at, '%Y-%m-%d %H:%i') as time,
            sell_price as price,
            buy_price,
            sell_price,
            close_price,
            direction
        FROM price_history 
        WHERE symbol = ? 
        AND recorded_at >= DATE_SUB(NOW(), INTERVAL ? HOUR)
        ORDER BY recorded_at ASC
    ");
    
    $stmt->execute([$symbol, $hours]);
    $data = $stmt->fetchAll();
    
    error_log("Price history query for symbol: $symbol, hours: $hours, found: " . count($data) . " records");
    
    $chartData = array_map(function($row) {
        return [
            'time' => date('H:i', strtotime($row['time'])),
            'fullTime' => $row['time'],
            'price' => (float)$row['price'],
            'buyPrice' => (float)$row['buy_price'],
            'sellPrice' => (float)$row['sell_price'],
            'closePrice' => $row['close_price'] ? (float)$row['close_price'] : null,
            'direction' => $row['direction']
        ];
    }, $data);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'symbol' => $symbol,
        'hours' => $hours,
        'dataPoints' => count($chartData),
        'data' => $chartData
    ]);
    
} catch (Exception $e) {
    error_log("Price history error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Veri çekilirken bir hata oluştu.'
    ]);
}

