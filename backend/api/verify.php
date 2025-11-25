<?php

require_once '../config/db.php';
require_once '../config/rate_limit.php';

$allowedOrigins = [
    'https://14luk.com',
    'https://www.14luk.com',
    'https://37.148.209.185',
    'http://37.148.209.185'
];

if (getenv('ENVIRONMENT') === 'development' || $_SERVER['SERVER_NAME'] === 'localhost') {
    $allowedOrigins[] = 'http://localhost:3000';
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Sadece POST metodu kabul edilir.'
    ]);
    exit;
}

$clientIp = getClientIp();

try {
    $pdo = getDBConnection();
    //  20 istek, 5 dakika
    $rateLimitResult = checkRateLimitDB($pdo, $clientIp, 'verify', 20, 60, 300);
    
    if (!$rateLimitResult['allowed']) {
        http_response_code(429);
        header('Retry-After: ' . $rateLimitResult['retry_after']);
        echo json_encode([
            'success' => false, 
            'message' => $rateLimitResult['message'],
            'retry_after' => $rateLimitResult['retry_after']
        ]);
        
        logVerificationAttempt('', false, 'Rate limit exceeded');
        exit;
    }
} catch (Exception $e) {
    error_log("Rate limit initialization error (verify): " . $e->getMessage());
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$certificateNumber = trim($data['certificateNumber'] ?? '');

if (empty($certificateNumber)) {
    http_response_code(200);
    echo json_encode([
        'success' => false,
        'message' => 'Sertifika numarası gereklidir.'
    ]);
    exit;
}

if (!preg_match('/^[A-Z0-9\-]+$/i', $certificateNumber)) {
    http_response_code(200);
    echo json_encode([
        'success' => false,
        'message' => 'Geçersiz sertifika numarası formatı.'
    ]);
    exit;
}

if (strlen($certificateNumber) > 100) {
    http_response_code(200);
    echo json_encode([
        'success' => false,
        'message' => 'Sertifika numarası çok uzun.'
    ]);
    exit;
}

try {
    $pdo = getDBConnection();
    
    $stmt = $pdo->prepare("
        SELECT 
            serial_number,
            product_type,
            DATE_FORMAT(production_date, '%d.%m.%Y') as production_date,
            weight
        FROM certificates 
        WHERE UPPER(serial_number) = UPPER(?) 
        AND status = 'active'
        LIMIT 1
    ");
    
    $stmt->execute([$certificateNumber]);
    $certificate = $stmt->fetch();
    
    if ($certificate) {
        logVerificationAttempt($certificateNumber, true);
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => [
                'serialNumber' => $certificate['serial_number'],
                'productType' => $certificate['product_type'],
                'productionDate' => $certificate['production_date'],
                'weight' => $certificate['weight']
            ]
        ]);
        
    } else {
        logVerificationAttempt($certificateNumber, false);
        
        http_response_code(200);
        echo json_encode([
            'success' => false,
            'message' => 'Sertifika numarası bulunamadı veya geçersiz.'
        ]);
    }
    
} catch (Exception $e) {
    error_log("Verification error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Doğrulama sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    ]);
}

/**
 * Doğrulama denemesini loglama kısmı
 */
function logVerificationAttempt($serialNumber, $success, $note = '') {
    try {
        $pdo = getDBConnection();
        
        $stmt = $pdo->prepare("
            INSERT INTO verification_logs 
            (serial_number, success, ip_address, user_agent) 
            VALUES (?, ?, ?, ?)
        ");
        
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
        
        $stmt->execute([
            $serialNumber,
            $success ? 1 : 0,
            $ipAddress,
            $userAgent
        ]);
        
    } catch (Exception $e) {
        error_log("Logging error: " . $e->getMessage());
    }
}

