<?php

/**
 * 
 * @return string CSRF token
 */
function csrf_generate_token() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    
    return $_SESSION['csrf_token'];
}

/**
 * 
 * @param string
 * @return bool
 */
function csrf_verify_token($method = 'POST') {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if ($method === 'GET') {
        return true;
    }
    
    // token al
    $token = null;
    
    if ($method === 'POST' && isset($_POST['csrf_token'])) {
        $token = $_POST['csrf_token'];
    } elseif (isset($_SERVER['HTTP_X_CSRF_TOKEN'])) {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'];
    }
    
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * 
 * @param string
 * @param string
 */
function csrf_protect($method = 'POST', $errorMessage = null) {
    if (!csrf_verify_token($method)) {
        if ($errorMessage === null) {
            $errorMessage = 'CSRF token geçersiz veya eksik. Güvenlik nedeniyle işlem iptal edildi.';
        }
        
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (strpos($contentType, 'application/json') !== false || isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
            http_response_code(403);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => 'csrf_token_invalid',
                'message' => $errorMessage
            ]);
        } else {
            http_response_code(403);
            die('<h1>403 Forbidden</h1><p>' . htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8') . '</p>');
        }
        exit;
    }
}

/**
 * 
 * @return string
 */
function csrf_token_field() {
    $token = csrf_generate_token();
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '">';
}

/**
 * 
 * @return string
 */
function csrf_token_meta() {
    $token = csrf_generate_token();
    return '<meta name="csrf-token" content="' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '">';
}

/**
 * 
 * @return string
 */
function csrf_token() {
    return csrf_generate_token();
}

/**
 */
function csrf_regenerate_token() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf_token'];
}

