<?php

/**
 * 
 * @return string
 */
function getClientIp() {
    $ip = $_SERVER['REMOTE_ADDR'];
    
    $trustedProxies = ['127.0.0.1', '::1'];
    
    if (in_array($ip, $trustedProxies) && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $forwardedIps = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip = trim($forwardedIps[0]);
    }
    
    if (!filter_var($ip, FILTER_VALIDATE_IP)) {
        return 'unknown';
    }
    
    return $ip;
}

/**
 * @param PDO
 * @param string
 * @param string
 * @param int
 * @param int
 * @return array
 */
function checkRateLimitDB($pdo, $ip, $endpoint = 'api', $maxRequests = 100, $timeWindow = 3600, $blockDuration = 900) {
    try {
        $stmt = $pdo->prepare("
            SELECT blocked_until 
            FROM rate_limits 
            WHERE ip_address = ? AND endpoint = ? AND blocked_until > NOW()
            LIMIT 1
        ");
        $stmt->execute([$ip, $endpoint]);
        $blocked = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($blocked) {
            $retryAfter = strtotime($blocked['blocked_until']) - time();
            
            echo "<!-- DEBUG: IP: $ip, Blocked until: " . $blocked['blocked_until'] . ", Current time: " . date('Y-m-d H:i:s') . ", Retry after: $retryAfter -->";
            
            return [
                'allowed' => false,
                'message' => 'Biraz hızlısınız! 5 dakika bekleyip tekrar deneyebilirsiniz.',
                'retry_after' => max(0, $retryAfter)
            ];
        }
        
        $stmt = $pdo->prepare("
            SELECT id, request_count, reset_time 
            FROM rate_limits 
            WHERE ip_address = ? AND endpoint = ?
            LIMIT 1
        ");
        $stmt->execute([$ip, $endpoint]);
        $record = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $now = time();
        
        if (!$record) {
            $resetTime = date('Y-m-d H:i:s', $now + $timeWindow);
            $stmt = $pdo->prepare("
                INSERT INTO rate_limits (ip_address, endpoint, request_count, reset_time) 
                VALUES (?, ?, 1, ?)
            ");
            $stmt->execute([$ip, $endpoint, $resetTime]);
            
            return ['allowed' => true, 'message' => 'OK', 'retry_after' => 0];
        }
        
        $resetTime = strtotime($record['reset_time']);
        
        if ($now > $resetTime) {
            $newResetTime = date('Y-m-d H:i:s', $now + $timeWindow);
            $stmt = $pdo->prepare("
                UPDATE rate_limits 
                SET request_count = 1, reset_time = ?, blocked_until = NULL 
                WHERE id = ?
            ");
            $stmt->execute([$newResetTime, $record['id']]);
            
            return ['allowed' => true, 'message' => 'OK', 'retry_after' => 0];
        }
        
        if ($record['request_count'] >= $maxRequests) {
            $blockedUntil = date('Y-m-d H:i:s', $now + $blockDuration);
            $stmt = $pdo->prepare("
                UPDATE rate_limits 
                SET blocked_until = ? 
                WHERE id = ?
            ");
            $stmt->execute([$blockedUntil, $record['id']]);
            
            error_log("Rate limit exceeded: IP=$ip, Endpoint=$endpoint, Blocked until=$blockedUntil");
            
            return [
                'allowed' => false,
                'message' => 'Çok fazla deneme yaptınız. 5 dakika sonra tekrar deneyebilirsiniz.',
                'retry_after' => $blockDuration
            ];
        }
        
        $stmt = $pdo->prepare("
            UPDATE rate_limits 
            SET request_count = request_count + 1 
            WHERE id = ?
        ");
        $stmt->execute([$record['id']]);
        
        return ['allowed' => true, 'message' => 'OK', 'retry_after' => 0];
        
    } catch (Exception $e) {
        error_log("Rate limit check error: " . $e->getMessage());
        return ['allowed' => true, 'message' => 'Rate limit check failed', 'retry_after' => 0];
    }
}

/**
 * 
 * @param PDO
 * @param int
 * @return int
 */
function cleanOldRateLimits($pdo, $daysOld = 1) {
    try {
        $stmt = $pdo->prepare("
            DELETE FROM rate_limits 
            WHERE reset_time < DATE_SUB(NOW(), INTERVAL ? DAY)
        ");
        $stmt->execute([$daysOld]);
        
        $deletedCount = $stmt->rowCount();
        if ($deletedCount > 0) {
            error_log("Cleaned $deletedCount old rate limit records");
        }
        
        return $deletedCount;
    } catch (Exception $e) {
        error_log("Rate limit cleanup error: " . $e->getMessage());
        return 0;
    }
}

