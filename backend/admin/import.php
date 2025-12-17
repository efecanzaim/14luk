<?php

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/csrf.php';

// Session güvenlik ayarları
$isHTTPS = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443;
ini_set('session.cookie_httponly', 1);  // cookie erişimi
ini_set('session.cookie_secure', $isHTTPS ? 1 : 0);
ini_set('session.cookie_samesite', 'Lax'); // daha esnek olduğu için Lax kullanıldı
ini_set('session.use_strict_mode', 1);   // random session idleri reddet
ini_set('session.use_only_cookies', 1);

session_start();

// Session Timeout Kontrolü Yapıyoruz (30 dakika süre ile)
if (isset($_SESSION['admin_logged_in']) && isset($_SESSION['LAST_ACTIVITY'])) {
    $inactive = time() - $_SESSION['LAST_ACTIVITY'];
    if ($inactive > 1800) { // 30 dakika
        session_unset();
        session_destroy();
        header('Location: import.php?timeout=1');
        exit;
    }
}

if (isset($_SESSION['admin_logged_in'])) {
    $_SESSION['LAST_ACTIVITY'] = time();
}

if (isset($_SESSION['admin_logged_in'])) {
    if (!isset($_SESSION['CREATED'])) {
        $_SESSION['CREATED'] = time();
    } else if (time() - $_SESSION['CREATED'] > 1800) {
        // 30 dakikada bir session ID yenile
        session_regenerate_id(true);
        $_SESSION['CREATED'] = time();
    }
}

// Giriş kontrolü
if (!isset($_SESSION['admin_logged_in'])) {
    if (isset($_POST['username']) && isset($_POST['password'])) {
        if (!csrf_verify_token('POST')) {
            $loginError = 'Güvenlik hatası: CSRF token geçersiz!';
        } else {
            $username = trim($_POST['username']);
            $password = $_POST['password'];
        
        try {
            $pdo = getDBConnection();
            
            // Kullanıcı DB kontrolü
            $stmt = $pdo->prepare("
                SELECT id, username, password, full_name, role, password_changed 
                FROM admin_users 
                WHERE username = ? AND is_active = 1
                LIMIT 1
            ");
            $stmt->execute([$username]);
            $user = $stmt->fetch();
            
            // kullanıcı var mı ve şifre doğru mu?
            if ($user && password_verify($password, $user['password'])) {
                // Session Fixation saldırılarını önlemek için yeni session ID
                session_regenerate_id(true);
                
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_user_id'] = $user['id'];
                $_SESSION['admin_username'] = $user['username'];
                $_SESSION['admin_full_name'] = $user['full_name'];
                $_SESSION['admin_role'] = $user['role'];
                $_SESSION['password_changed'] = $user['password_changed'];
                $_SESSION['CREATED'] = time();
                $_SESSION['LAST_ACTIVITY'] = time();
                $_SESSION['USER_IP'] = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
                $_SESSION['USER_AGENT'] = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
                
                // son giriş zamanını güncelle
                $updateStmt = $pdo->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
                $updateStmt->execute([$user['id']]);
            } else {
                $loginError = 'Kullanıcı adı veya şifre hatalı!';
            }
        } catch (Exception $e) {
            $loginError = 'Giriş sırasında bir hata oluştu.';
        }
        }
    }
    
    // Admin login
    if (!isset($_SESSION['admin_logged_in'])) {
        ?>
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Girişi - 14'lük</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">
            <script src="https://unpkg.com/lucide@latest"></script>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
                    background: linear-gradient(135deg, #041234 0%, #0a1f4a 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .login-container {
                    text-align: center;
                    max-width: 450px;
                    width: 100%;
                }
                .login-logo {
                    background: #ffb600;
                    color: #041234;
                    width: 80px;
                    height: 80px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 48px;
                    font-weight: 700;
                    margin: 0 auto 25px;
                    box-shadow: 0 10px 40px rgba(255, 182, 0, 0.3);
                }
                .login-title {
                    color: white;
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }
                .login-subtitle {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 16px;
                    margin-bottom: 35px;
                }
                .login-box {
                    background: white;
                    padding: 45px;
                    border-radius: 25px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
                h2 { 
                    color: #041234; 
                    margin-bottom: 25px; 
                    text-align: center; 
                    font-size: 24px;
                    font-weight: 700;
                }
            input[type="text"],
            input[type="password"] {
                width: 100%;
                padding: 16px 18px;
                border: 2px solid #e0e0e0;
                border-radius: 12px;
                font-size: 16px;
                margin-bottom: 20px;
                font-family: 'Geist', sans-serif;
                transition: all 0.3s ease;
                background: #fafafa;
            }
            input[type="text"]:focus,
            input[type="password"]:focus {
                outline: none;
                border-color: #ffb600;
                background: white;
                box-shadow: 0 0 0 4px rgba(255, 182, 0, 0.1);
            }
                button {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #041234 0%, #0a1f4a 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Geist', sans-serif;
                    box-shadow: 0 4px 15px rgba(4, 18, 52, 0.3);
                }
                button:hover { 
                    background: linear-gradient(135deg, #0a1f4a 0%, #041234 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(4, 18, 52, 0.4);
                }
                .error { 
                    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
                    color: #721c24; 
                    text-align: center; 
                    padding: 14px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    font-weight: 500;
                    border: 2px solid #dc3545;
                }
                .footer-text {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 13px;
                    margin-top: 25px;
                }
            </style>
        </head>
        <body>
            <div class="login-container">
                <div class="login-logo">14</div>
                <div class="login-title">14'lük Admin Panel</div>
                <div class="login-subtitle">Sertifika Yönetim Sistemi</div>
                <div class="login-box">
                    <h2 style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <i data-lucide="lock" style="width: 24px; height: 24px;"></i>
                        Güvenli Giriş
                    </h2>
                    <?php if (isset($_GET['timeout'])): ?>
                        <div class="error">⏱️ Oturum süresi doldu. Lütfen tekrar giriş yapın.</div>
                    <?php elseif (isset($loginError)): ?>
                        <div class="error"><?php echo htmlspecialchars($loginError, ENT_QUOTES, 'UTF-8'); ?></div>
                    <?php endif; ?>
                    <form method="POST">
                        <?php echo csrf_token_field(); ?>
                        <input type="text" name="username" placeholder="Kullanıcı Adı" required autofocus>
                        <input type="password" name="password" placeholder="Şifre" required>
                        <button type="submit">Giriş Yap</button>
                    </form>
                </div>
                <div class="footer-text">© 2025 14'lük - Tüm hakları saklıdır</div>
            </div>
            <script>
                lucide.createIcons();
            </script>
        </body>
        </html>
        <?php
        exit;
    }
}

// Şifre değiştirme işlemi
if (isset($_POST['change_password'])) {
    csrf_protect('POST');
    
    $currentPassword = $_POST['current_password'];
    $newPassword = $_POST['new_password'];
    $confirmPassword = $_POST['confirm_password'];
    
    if ($newPassword !== $confirmPassword) {
        $passwordError = 'Yeni şifreler eşleşmiyor!';
    } elseif (strlen($newPassword) < 6) {
        $passwordError = 'Şifre en az 6 karakter olmalıdır!';
    } else {
        try {
            $pdo = getDBConnection();
            
            // Mevcut şifreyi kontrol et
            $stmt = $pdo->prepare("SELECT password FROM admin_users WHERE id = ?");
            $stmt->execute([$_SESSION['admin_user_id']]);
            $user = $stmt->fetch();
            
            if (password_verify($currentPassword, $user['password'])) {
                $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
                $updateStmt = $pdo->prepare("
                    UPDATE admin_users 
                    SET password = ?, password_changed = 1 
                    WHERE id = ?
                ");
                $updateStmt->execute([$newPasswordHash, $_SESSION['admin_user_id']]);
                
                $_SESSION['password_changed'] = 1;
                $passwordSuccess = 'Şifreniz başarıyla değiştirildi!';
            } else {
                $passwordError = 'Mevcut şifreniz hatalı!';
            }
        } catch (Exception $e) {
            $passwordError = 'Şifre değiştirme sırasında bir hata oluştu.';
        }
    }
}

// İlk girişte şifre değiştirme zorunluluğu
if (isset($_SESSION['admin_logged_in']) && $_SESSION['password_changed'] == 0) {
    ?>
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Şifre Değiştir - 14'lük Admin</title>
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">
        <script src="https://unpkg.com/lucide@latest"></script>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Geist', sans-serif;
                background: linear-gradient(135deg, #041234 0%, #0a1f4a 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .password-container {
                max-width: 500px;
                width: 100%;
                text-align: center;
            }
            .logo-box {
                background: #ffb600;
                color: #041234;
                width: 80px;
                height: 80px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
                font-weight: 700;
                margin: 0 auto 25px;
                box-shadow: 0 10px 40px rgba(255, 182, 0, 0.3);
            }
            .title {
                color: white;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 10px;
            }
            .subtitle {
                color: rgba(255, 255, 255, 0.7);
                font-size: 15px;
                margin-bottom: 30px;
            }
            .password-box {
                background: white;
                padding: 40px;
                border-radius: 25px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            .welcome {
                background: linear-gradient(135deg, #fff9e6 0%, #fff4cc 100%);
                border: 2px solid #ffb600;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 25px;
                text-align: left;
            }
            .welcome h3 {
                color: #041234;
                font-size: 18px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .welcome p {
                color: #666;
                font-size: 14px;
                line-height: 1.6;
                margin: 0;
            }
            h2 {
                color: #041234;
                font-size: 22px;
                font-weight: 700;
                margin-bottom: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            label {
                display: block;
                text-align: left;
                margin-bottom: 8px;
                color: #041234;
                font-weight: 600;
                font-size: 14px;
            }
            input[type="password"] {
                width: 100%;
                padding: 14px 16px;
                border: 2px solid #e0e0e0;
                border-radius: 12px;
                font-size: 15px;
                margin-bottom: 18px;
                font-family: 'Geist', sans-serif;
                transition: all 0.3s ease;
                background: #fafafa;
            }
            input[type="password"]:focus {
                outline: none;
                border-color: #ffb600;
                background: white;
                box-shadow: 0 0 0 4px rgba(255, 182, 0, 0.1);
            }
            button {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #041234 0%, #0a1f4a 100%);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(4, 18, 52, 0.3);
            }
            button:hover {
                background: linear-gradient(135deg, #0a1f4a 0%, #041234 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(4, 18, 52, 0.4);
            }
            .error {
                background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
                color: #721c24;
                padding: 14px;
                border-radius: 10px;
                margin-bottom: 20px;
                font-weight: 500;
                border: 2px solid #dc3545;
            }
            .success {
                background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                color: #155724;
                padding: 14px;
                border-radius: 10px;
                margin-bottom: 20px;
                font-weight: 500;
                border: 2px solid #28a745;
            }
            .password-requirements {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                margin-top: 15px;
                text-align: left;
            }
            .password-requirements h4 {
                color: #041234;
                font-size: 14px;
                margin-bottom: 10px;
                font-weight: 600;
            }
            .password-requirements ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .password-requirements li {
                color: #666;
                font-size: 13px;
                padding: 4px 0;
                padding-left: 20px;
                position: relative;
            }
            .password-requirements li::before {
                content: '✓';
                color: #28a745;
                position: absolute;
                left: 0;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="password-container">
            <div class="logo-box">14</div>
            <div class="title">İlk Giriş</div>
            <div class="subtitle">Güvenliğiniz için şifrenizi değiştirin</div>
            <div class="password-box">
                <div class="welcome">
                    <h3>
                        <i data-lucide="user-check" style="width: 20px; height: 20px;"></i>
                        Hoş Geldiniz, <?php echo htmlspecialchars($_SESSION['admin_full_name']); ?>!
                    </h3>
                    <p style="margin-bottom: 8px;">
                        <strong>Kullanıcı Adı:</strong> 
                        <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 6px; color: #041234; font-weight: 600;">
                            <?php echo htmlspecialchars($_SESSION['admin_username']); ?>
                        </code>
                    </p>
                    <p style="margin: 0;">İlk girişinizde şifrenizi güçlü bir şifre ile değiştirmeniz gerekmektedir.</p>
                </div>
                
                <h2>
                    <i data-lucide="key" style="width: 22px; height: 22px;"></i>
                    Şifrenizi Değiştirin
                </h2>
                
                <?php if (isset($passwordError)): ?>
                    <div class="error"><?php echo htmlspecialchars($passwordError, ENT_QUOTES, 'UTF-8'); ?></div>
                <?php endif; ?>
                
                <?php if (isset($passwordSuccess)): ?>
                    <div class="success">
                        <?php echo htmlspecialchars($passwordSuccess, ENT_QUOTES, 'UTF-8'); ?>
                        <br><small>Yönlendiriliyorsunuz...</small>
                    </div>
                    <script>
                        setTimeout(function() {
                            window.location.href = 'import.php';
                        }, 2000);
                    </script>
                <?php else: ?>
                    <form method="POST">
                        <?php echo csrf_token_field(); ?>
                        <label>Mevcut Şifre:</label>
                        <input type="password" name="current_password" placeholder="Mevcut şifreniz (admin123)" required autofocus>
                        
                        <label>Yeni Şifre:</label>
                        <input type="password" name="new_password" placeholder="Güçlü bir şifre belirleyin" required>
                        
                        <label>Yeni Şifre (Tekrar):</label>
                        <input type="password" name="confirm_password" placeholder="Yeni şifrenizi tekrar girin" required>
                        
                        <div class="password-requirements">
                            <h4>Şifre Gereksinimleri:</h4>
                            <ul>
                                <li>En az 6 karakter uzunluğunda</li>
                                <li>Tahmin edilmesi zor olmalı</li>
                                <li>Harf ve rakam kombinasyonu önerilir</li>
                            </ul>
                        </div>
                        
                        <button type="submit" name="change_password">
                            Şifreyi Değiştir
                        </button>
                    </form>
                <?php endif; ?>
            </div>
        </div>
        <script>
            lucide.createIcons();
        </script>
    </body>
    </html>
    <?php
    exit;
}

/**
 * 
 * @param string
 * @param bool
 * @return string
 */
function e($string, $allowHTML = false) {
    if ($allowHTML) {
        return strip_tags($string, '<b><i><u><br><p><strong><em>');
    }
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: import.php');
    exit;
}

// Excel export kısmı
if (isset($_GET['export']) && $_GET['export'] === 'excel') {
    try {
        $pdo = getDBConnection();
        $selectedSymbol = $_GET['symbol'] ?? '';
        
        $whereClause = '';
        $params = [];
        
        if (!empty($selectedSymbol)) {
            $whereClause = 'WHERE symbol = ?';
            $params[] = $selectedSymbol;
        }
        
        $sql = "
            SELECT symbol, buy_price, sell_price, close_price, direction, recorded_at 
            FROM price_history 
            $whereClause
            ORDER BY recorded_at DESC
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $priceHistory = $stmt->fetchAll();
        
        exportToExcel($priceHistory, $selectedSymbol);
        
    } catch (Exception $e) {
        header('Location: import.php?page=price_history');
        exit;
    }
}

// Kullanıcı yönetimi işlemleri
$userMessage = '';
$userSuccess = false;

if (isset($_POST['user_action'])) {
    csrf_protect('POST');
    
    if ($_POST['user_action'] === 'create_user') {
        $result = createNewUser($_POST);
        $userMessage = $result['message'];
        $userSuccess = $result['success'];
    } elseif ($_POST['user_action'] === 'change_password') {
        $result = changeUserPassword($_POST);
        $userMessage = $result['message'];
        $userSuccess = $result['success'];
    }
}

/**
 * Yeni kullanıcı oluşturma kısmı
 */
function createNewUser($data) {
    try {
        $pdo = getDBConnection();
        
        $username = trim($data['username']);
        $password = $data['password'];
        $fullName = trim($data['full_name']);
        $role = $data['role'];
        
        if (empty($username) || empty($password) || empty($fullName)) {
            return ['success' => false, 'message' => 'Tüm alanlar doldurulmalıdır!'];
        }
        
        if (strlen($password) < 6) {
            return ['success' => false, 'message' => 'Şifre en az 6 karakter olmalıdır!'];
        }
        
        $checkStmt = $pdo->prepare("SELECT id FROM admin_users WHERE username = ?");
        $checkStmt->execute([$username]);
        if ($checkStmt->fetch()) {
            return ['success' => false, 'message' => 'Bu kullanıcı adı zaten kullanılıyor!'];
        }
        
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("
            INSERT INTO admin_users (username, password, full_name, role, is_active, created_by) 
            VALUES (?, ?, ?, ?, 1, ?)
        ");
        
        $stmt->execute([
            $username,
            $passwordHash,
            $fullName,
            $role,
            $_SESSION['admin_username']
        ]);
        
        logUserAction('create_user', $username, [
            'full_name' => $fullName,
            'role' => $role
        ], $_SESSION['admin_username']);
        
        return [
            'success' => true,
            'message' => '✅ Kullanıcı başarıyla oluşturuldu!'
        ];
        
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => '❌ Hata: ' . $e->getMessage()
        ];
    }
}

/**
 * Kullanıcı şifresini değiştirme kısmı
 */
function changeUserPassword($data) {
    try {
        $pdo = getDBConnection();
        
        $userId = $data['user_id'];
        $newPassword = $data['new_password'];
        
        if (empty($newPassword)) {
            return ['success' => false, 'message' => 'Yeni şifre boş olamaz!'];
        }
        
        if (strlen($newPassword) < 6) {
            return ['success' => false, 'message' => 'Şifre en az 6 karakter olmalıdır!'];
        }
    
        $checkStmt = $pdo->prepare("SELECT username FROM admin_users WHERE id = ?");
        $checkStmt->execute([$userId]);
        $user = $checkStmt->fetch();
        
        if (!$user) {
            return ['success' => false, 'message' => 'Kullanıcı bulunamadı!'];
        }
        
        $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("
            UPDATE admin_users 
            SET password = ?, password_changed = 1 
            WHERE id = ?
        ");
        
        $stmt->execute([$passwordHash, $userId]);
        
        logUserAction('change_password', $user['username'], [
            'changed_by' => $_SESSION['admin_username']
        ], $_SESSION['admin_username']);
        
        return [
            'success' => true,
            'message' => '✅ Şifre başarıyla değiştirildi!'
        ];
        
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => '❌ Hata: ' . $e->getMessage()
        ];
    }
}

/**
 * Excel dosyası oluştur ve indir
 */
function exportToExcel($priceHistory, $selectedSymbol = '') {
    $filename = 'fiyat_gecmisi_' . date('Y-m-d_H-i-s');
    if (!empty($selectedSymbol)) {
        $filename .= '_' . $selectedSymbol;
    }
    $filename .= '.csv';
    
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    
    echo "\xEF\xBB\xBF";
    
    $output = fopen('php://output', 'w');
    fputcsv($output, ['Sembol', 'Alış Fiyatı (₺)', 'Satış Fiyatı (₺)', 'Kapanış Fiyatı (₺)', 'Yön', 'Kayıt Zamanı'], ';');
    
    foreach ($priceHistory as $record) {
        $direction = '';
        if ($record['direction'] === 'up') {
            $direction = 'Yükseliş';
        } elseif ($record['direction'] === 'down') {
            $direction = 'Düşüş';
        }
        
        fputcsv($output, [
            $record['symbol'],
            number_format($record['buy_price'], 2, ',', '.'),
            number_format($record['sell_price'], 2, ',', '.'),
            $record['close_price'] ? number_format($record['close_price'], 2, ',', '.') : '',
            $direction,
            date('d.m.Y H:i:s', strtotime($record['recorded_at']))
        ], ';');
    }
    
    fclose($output);
    exit;
}

/**
 * Kullanıcı işlemlerini loglama kısmı
 */
function logUserAction($actionType, $targetUser, $details, $performedBy) {
    try {
        $pdo = getDBConnection();
        
        $stmt = $pdo->prepare("
            INSERT INTO certificate_logs 
            (action_type, serial_number, details, performed_by, ip_address) 
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $detailsJson = json_encode([
            'target_user' => $targetUser,
            'details' => $details
        ], JSON_UNESCAPED_UNICODE);
        
        $stmt->execute([
            $actionType,
            'USER_MANAGEMENT',
            $detailsJson,
            $performedBy,
            $ipAddress
        ]);
        
    } catch (Exception $e) {
        error_log("User action logging error: " . $e->getMessage());
    }
}

// Excel import işlemi kısmı
$importMessage = '';
$importSuccess = false;

if (isset($_POST['import_action'])) {
    csrf_protect('POST');
    
    if ($_POST['import_action'] === 'csv') {
        if (isset($_FILES['csv_file']) && $_FILES['csv_file']['error'] === UPLOAD_ERR_OK) {
            $allowedExtensions = ['csv'];
            $maxFileSize = 5 * 1024 * 1024; // 5MB
            
            $fileName = $_FILES['csv_file']['name'];
            $fileSize = $_FILES['csv_file']['size'];
            $fileTmpPath = $_FILES['csv_file']['tmp_name'];
            $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            
            if (!in_array($fileExtension, $allowedExtensions)) {
                $importMessage = 'Sadece CSV dosyaları yüklenebilir!';
                $importSuccess = false;
            }
            elseif ($fileSize > $maxFileSize) {
                $importMessage = 'Dosya boyutu çok büyük! (Maksimum: 5MB)';
                $importSuccess = false;
            }
            elseif (!file_exists($fileTmpPath) || !is_uploaded_file($fileTmpPath)) {
                $importMessage = 'Dosya yükleme hatası!';
                $importSuccess = false;
            }
            else {
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mimeType = finfo_file($finfo, $fileTmpPath);
                finfo_close($finfo);
                
                // kabul edilen MIME tipleri
                $allowedMimeTypes = ['text/csv', 'text/plain', 'application/csv', 'application/vnd.ms-excel'];
                
                if (!in_array($mimeType, $allowedMimeTypes)) {
                    $importMessage = '❌ Geçersiz dosya türü! (Algılanan: ' . htmlspecialchars($mimeType) . ')';
                    $importSuccess = false;
                } else {
                    $result = importCSV($fileTmpPath);
                    $importMessage = $result['message'];
                    $importSuccess = $result['success'];
                }
            }
        } else {
            $uploadError = $_FILES['csv_file']['error'] ?? UPLOAD_ERR_NO_FILE;
            switch ($uploadError) {
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    $importMessage = '❌ Dosya boyutu izin verilen maksimum boyutu aşıyor!';
                    break;
                case UPLOAD_ERR_PARTIAL:
                    $importMessage = '❌ Dosya kısmen yüklendi, lütfen tekrar deneyin!';
                    break;
                case UPLOAD_ERR_NO_FILE:
                    $importMessage = '❌ Lütfen bir dosya seçin!';
                    break;
                default:
                    $importMessage = '❌ Dosya yükleme hatası! (Kod: ' . $uploadError . ')';
            }
            $importSuccess = false;
        }
    } elseif ($_POST['import_action'] === 'manual') {
        $result = addManualCertificate($_POST);
        $importMessage = $result['message'];
        $importSuccess = $result['success'];
    }
}


function parseCSVLine($line) {
    $row = str_getcsv($line, ',', '"', '\\');
    
    if (count($row) < 5) {
        $row = explode(',', $line);
        $row = array_map('trim', $row);
    }
    
    while (count($row) < 5) {
        $row[] = '';
    }
    
    return $row;
}


function formatDateForDatabase($dateString) {
    $dateString = trim($dateString);
    
    // farklı tarih formatları
    $formats = [
        'd.m.Y',      // 13.10.2025
        'd.m.Y',      // 13. 10. 2025
        'Y-m-d',      // 2025-10-13
        'd/m/Y',      // 13/10/2025
        'd-m-Y',      // 13-10-2025
    ];
    
    foreach ($formats as $format) {
        $dateObj = DateTime::createFromFormat($format, $dateString);
        if ($dateObj) {
            return $dateObj->format('Y-m-d');
        }
    }
    
    // eğer hiçbiri çalışmazsa bugünün tarihi
    return date('Y-m-d');
}


function importCSV($filePath) {
    try {
        $pdo = getDBConnection();
        
        $file = fopen($filePath, 'r');
        $headerSkipped = false;
        $successCount = 0;
        $errorCount = 0;
        $errors = [];
        $username = $_SESSION['admin_username'] ?? 'unknown';
        
        while (($line = fgets($file)) !== FALSE) {
            if (!$headerSkipped) {
                $headerSkipped = true;
                continue;
            }
            
            $line = trim($line);
            if (empty($line)) continue;
            
            $row = parseCSVLine($line);
            
            $serialNumber = trim($row[0] ?? '');
            $productType = trim($row[1] ?? '');
            $productionDate = trim($row[2] ?? '');
            $weight = trim($row[3] ?? '');
            $status = trim($row[4] ?? 'active');
            
            if (empty($serialNumber)) continue;
            
            try {
                $productionDate = formatDateForDatabase($productionDate);
                
                $stmt = $pdo->prepare("
                    INSERT INTO certificates 
                    (serial_number, product_type, production_date, weight, status, created_by) 
                    VALUES (?, ?, ?, ?, ?, ?)
                ");
                
                $stmt->execute([
                    $serialNumber,
                    $productType,
                    $productionDate,
                    $weight,
                    $status,
                    $username
                ]);
                
                logCertificateAction('import', $serialNumber, [
                    'product_type' => $productType,
                    'weight' => $weight
                ], $username);
                
                $successCount++;
                
            } catch (PDOException $e) {
                $errorCount++;
                $errors[] = "Seri: $serialNumber - " . $e->getMessage();
            }
        }
        
        fclose($file);
        
        $message = "✅ Başarılı: $successCount kayıt eklendi.";
        if ($errorCount > 0) {
            $message .= " ❌ Hata: $errorCount kayıt eklenemedi.";
        }
        
        return [
            'success' => $successCount > 0,
            'message' => $message,
            'errors' => $errors
        ];
        
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Import hatası: ' . $e->getMessage()
        ];
    }
}


function addManualCertificate($data) {
    try {
        $pdo = getDBConnection();
        $username = $_SESSION['admin_username'] ?? 'unknown';
        
        $stmt = $pdo->prepare("
            INSERT INTO certificates 
            (serial_number, product_type, production_date, weight, status, created_by) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $dateObj = DateTime::createFromFormat('Y-m-d', $data['production_date']);
        $productionDate = $dateObj ? $dateObj->format('Y-m-d') : date('Y-m-d');
        
        $stmt->execute([
            $data['serial_number'],
            $data['product_type'],
            $productionDate,
            $data['weight'],
            $data['status'] ?? 'active',
            $username
        ]);
        
        logCertificateAction('create', $data['serial_number'], [
            'product_type' => $data['product_type'],
            'weight' => $data['weight'],
            'status' => $data['status'] ?? 'active'
        ], $username);
        
        return [
            'success' => true,
            'message' => '✅ Sertifika başarıyla eklendi!'
        ];
        
    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => '❌ Hata: ' . $e->getMessage()
        ];
    }
}


function logCertificateAction($actionType, $serialNumber, $details, $performedBy) {
    try {
        $pdo = getDBConnection();
        
        $stmt = $pdo->prepare("
            INSERT INTO certificate_logs 
            (action_type, serial_number, details, performed_by, ip_address) 
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $detailsJson = json_encode($details, JSON_UNESCAPED_UNICODE);
        
        $stmt->execute([
            $actionType,
            $serialNumber,
            $detailsJson,
            $performedBy,
            $ipAddress
        ]);
        
    } catch (Exception $e) {
        error_log("Logging error: " . $e->getMessage());
    }
}
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - 14'lük Sertifika Yönetimi</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body { 
            font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #041234 0%, #0a1f4a 100%);
            min-height: 100vh;
            padding: 0;
        }
        
        /* Header */
        .admin-header {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 20px 0;
            margin-bottom: 40px;
        }
        
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .header-title {
            color: white;
            font-size: 28px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .header-logo {
            background: #ffb600;
            color: #041234;
            width: 45px;
            height: 45px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 700;
        }
        
        .header-center {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .header-right {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .nav-button {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.2);
            padding: 10px 20px;
            border-radius: 10px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            font-family: 'Geist', sans-serif;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            white-space: nowrap;
        }
        
        .nav-button:hover {
            background: rgba(255, 182, 0, 0.2);
            border-color: #ffb600;
            color: #ffb600;
            transform: translateY(-1px);
            box-shadow: 0 3px 10px rgba(255, 182, 0, 0.2);
        }
        
        .nav-button.active {
            background: linear-gradient(135deg, #ffb600 0%, #ffc633 100%);
            color: #041234;
            border-color: #ffb600;
        }
        
        .nav-button.active:hover {
            background: linear-gradient(135deg, #ffc633 0%, #ffb600 100%);
            color: #041234;
        }
        
        .user-info {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        /* Container */
        .container {
            max-width: 1200px;
            margin: 0 auto 40px;
            padding: 0 30px;
        }
        
        /* Cards */
        .card {
            background: white;
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 25px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
        }
        
        .card-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .card-icon {
            background: linear-gradient(135deg, #ffb600 0%, #ffc633 100%);
            color: #041234;
            width: 45px;
            height: 45px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }
        
        .card-icon svg {
            width: 24px;
            height: 24px;
        }
        
        h2 {
            color: #041234;
            font-size: 22px;
            font-weight: 700;
            margin: 0;
        }
        
        /* Info Box */
        .info-box {
            background: linear-gradient(135deg, #fff9e6 0%, #fff4cc 100%);
            border: 2px solid #ffb600;
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .info-box strong {
            color: #041234;
            display: block;
            margin-bottom: 8px;
            font-size: 16px;
        }
        
        .info-box em {
            color: #666;
            font-style: normal;
            font-size: 14px;
        }
        
        /* Form Elements */
        label {
            display: block;
            margin-bottom: 8px;
            color: #041234;
            font-weight: 600;
            font-size: 14px;
        }
        
        input, select {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            margin-bottom: 20px;
            font-size: 15px;
            font-family: 'Geist', sans-serif;
            transition: all 0.3s ease;
            background: #fafafa;
        }
        
        input:focus, select:focus {
            outline: none;
            border-color: #ffb600;
            background: white;
            box-shadow: 0 0 0 4px rgba(255, 182, 0, 0.1);
        }
        
        input[type="file"] {
            padding: 12px;
            cursor: pointer;
        }
        
        /* Buttons */
        button {
            padding: 14px 28px;
            background: linear-gradient(135deg, #041234 0%, #0a1f4a 100%);
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            font-family: 'Geist', sans-serif;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(4, 18, 52, 0.2);
        }
        
        button:hover {
            background: linear-gradient(135deg, #0a1f4a 0%, #041234 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(4, 18, 52, 0.3);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        .logout {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            padding: 10px 20px;
            font-size: 14px;
        }
        
        .logout:hover {
            background: linear-gradient(135deg, #c82333 0%, #dc3545 100%);
        }
        
        a {
            text-decoration: none;
        }
        
        /* Messages */
        .message {
            padding: 18px 20px;
            border-radius: 12px;
            margin-bottom: 25px;
            font-size: 15px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .message.success {
            background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
            color: #155724;
            border: 2px solid #28a745;
        }
        
        .message.error {
            background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
            color: #721c24;
            border: 2px solid #dc3545;
        }
        
        /* Table */
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 15px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        th {
            background: linear-gradient(135deg, #041234 0%, #0a1f4a 100%);
            color: white;
            padding: 14px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
        }
        
        td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #f0f0f0;
            background: white;
            font-size: 14px;
            color: #333;
        }
        
        tbody tr:hover {
            background: #fafafa;
        }
        
        tbody tr:last-child td {
            border-bottom: none;
        }
        
        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
            border: 2px solid #e0e0e0;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: #041234;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 13px;
            color: #666;
            font-weight: 500;
        }
        
        /* Sayfalama Stilleri */
        .pagination-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
            flex-wrap: wrap;
        }
        
        .pagination-button {
            padding: 6px 10px;
            font-size: 13px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 6px;
            color: #495057;
            text-decoration: none;
            transition: all 0.2s ease;
            min-width: 36px;
            text-align: center;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 3px;
        }
        
        .pagination-button:hover {
            background: #f8f9fa;
            border-color: #ffb600;
            color: #ffb600;
            transform: translateY(-1px);
        }
        
        .pagination-button.active {
            background: #ffb600;
            color: #041234;
            border-color: #ffb600;
            font-weight: bold;
        }
        
        .pagination-button:disabled {
            background: #e9ecef;
            color: #6c757d;
            cursor: not-allowed;
            border-color: #e9ecef;
        }
        
        .pagination-button:disabled:hover {
            transform: none;
            background: #e9ecef;
            color: #6c757d;
            border-color: #e9ecef;
        }
        
        .pagination-ellipsis {
            padding: 6px 4px;
            color: #6c757d;
            font-size: 13px;
            font-weight: bold;
        }
        
        .pagination-info {
            color: #495057;
            font-weight: 600;
            font-size: 14px;
            margin-right: 15px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .header-center {
                gap: 10px;
            }
            
            .nav-button {
                padding: 8px 16px;
                font-size: 12px;
            }
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 0 20px;
            }
            
            .header-content {
                padding: 0 20px;
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
            
            .header-left {
                justify-content: center;
            }
            
            .header-center {
                justify-content: center;
                gap: 8px;
            }
            
            .header-right {
                justify-content: center;
                flex-direction: column;
                gap: 10px;
            }
            
            .header-title {
                font-size: 22px;
            }
            
            .nav-button {
                padding: 8px 12px;
                font-size: 11px;
            }
            
            .nav-button i {
                width: 12px !important;
                height: 12px !important;
            }
            
            .user-info {
                font-size: 13px;
            }
            
            .card {
                padding: 20px;
            }
            
            h2 {
                font-size: 18px;
            }
            
            table {
                font-size: 12px;
            }
            
            th, td {
                padding: 8px 6px;
            }
            
            /* Mobil sayfalama */
            .pagination-container {
                gap: 4px;
                padding: 10px 0;
            }
            
            .pagination-button {
                padding: 4px 8px;
                font-size: 12px;
                min-width: 32px;
            }
            
            .pagination-info {
                font-size: 12px;
                margin-right: 8px;
            }
            
            .pagination-ellipsis {
                padding: 4px 2px;
                font-size: 12px;
            }
        }
        
        @media (max-width: 480px) {
            .header-center {
                flex-direction: column;
                gap: 8px;
                width: 100%;
            }
            
            .nav-button {
                width: 100%;
                justify-content: center;
                padding: 10px;
            }
            
            /* Çok küçük ekranlar için sayfalama */
            .pagination-container {
                flex-direction: column;
                gap: 8px;
                align-items: center;
            }
            
            .pagination-info {
                margin-right: 0;
                margin-bottom: 5px;
            }
            
            .pagination-button {
                padding: 6px 12px;
                font-size: 13px;
                min-width: 40px;
            }
            
            /* Sadece önceki/sonraki ve mevcut sayfa göster */
            .pagination-container .pagination-button:not(.active):not(:first-child):not(:last-child) {
                display: none;
            }
            
            .pagination-ellipsis {
                display: none;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="admin-header">
        <div class="header-content">
            <!-- Sol Taraf: Logo ve Başlık -->
            <div class="header-left">
                <div class="header-logo">14</div>
                <div class="header-title">
                    <span>Admin Panel</span>
                </div>
            </div>
            
            <!-- Orta: Navigasyon Butonları -->
            <div class="header-center">
                <a href="import.php" class="nav-button <?php echo !isset($_GET['page']) ? 'active' : ''; ?>">
                    <i data-lucide="home" style="width: 14px; height: 14px;"></i>
                    Ana Sayfa
                </a>
                
                <a href="?page=price_history" class="nav-button <?php echo isset($_GET['page']) && $_GET['page'] === 'price_history' ? 'active' : ''; ?>">
                    <i data-lucide="trending-up" style="width: 14px; height: 14px;"></i>
                    Fiyat Geçmişi
                </a>
                
                <?php if ($_SESSION['admin_role'] === 'admin'): ?>
                <a href="?page=user_management" class="nav-button <?php echo isset($_GET['page']) && $_GET['page'] === 'user_management' ? 'active' : ''; ?>">
                    <i data-lucide="users" style="width: 14px; height: 14px;"></i>
                    Hesap Yönetimi
                </a>
                <?php endif; ?>
            </div>
            
            <!-- Sağ Taraf: Kullanıcı Bilgisi ve Çıkış -->
            <div class="header-right">
                <div class="user-info">
                    <i data-lucide="user" style="width: 16px; height: 16px;"></i>
                    <span><?php echo htmlspecialchars($_SESSION['admin_full_name']); ?></span>
                </div>
                <a href="?logout=1">
                    <button class="logout" style="display: flex; align-items: center; gap: 6px; justify-content: center; padding: 8px 16px; font-size: 13px;">
                        <i data-lucide="log-out" style="width: 16px; height: 16px;"></i>
                        Çıkış
                    </button>
                </a>
            </div>
        </div>
    </div>
    
    <div class="container">
        <?php if ($importMessage): ?>
            <div class="message <?php echo $importSuccess ? 'success' : 'error'; ?>">
                <?php echo htmlspecialchars($importMessage, ENT_QUOTES, 'UTF-8'); ?>
            </div>
        <?php endif; ?>
        
        <?php
        $currentPage = $_GET['page'] ?? 'home';
        
        if ($currentPage === 'home'): 
            // Ürün istatistiklerini çek
            try {
                $pdo = getDBConnection();
                
                // Ürün tipine göre sayıları
                $productTypeStmt = $pdo->prepare("
                    SELECT product_type, COUNT(*) as count 
                    FROM certificates 
                    WHERE status = 'active'
                    GROUP BY product_type 
                    ORDER BY product_type
                ");
                $productTypeStmt->execute();
                $productTypeStats = $productTypeStmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Ağırlığa göre sayıları (normalize edilmiş)
                $weightStmt = $pdo->prepare("
                    SELECT weight, COUNT(*) as count 
                    FROM certificates 
                    WHERE status = 'active'
                    GROUP BY weight 
                    ORDER BY weight
                ");
                $weightStmt->execute();
                $weightStatsRaw = $weightStmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Ağırlık verilerini normalize et ve birleştir
                $weightStats = [];
                $processedCount = 0; // İşlenen kayıt sayısını takip et
                
                foreach ($weightStatsRaw as $stat) {
                    // Ağırlık değerini normalize et: boşlukları kaldır, küçük harfe çevir
                    $rawWeight = trim($stat['weight']);
                    $normalizedWeight = strtolower($rawWeight);
                    $normalizedWeight = preg_replace('/\s+/', '', $normalizedWeight); // Tüm boşlukları kaldır
                    
                    // Sayısal değeri ve birimi ayır - daha esnek pattern
                    // Örnek: "2.5gr", "2.5 gr", "2.5g", "2.5", "10gr", "10 gr" vb.
                    if (preg_match('/^(\d+(?:\.\d+)?)(gr|g|gram)?$/i', $normalizedWeight, $matches)) {
                        $numericValue = $matches[1];
                        $unit = isset($matches[2]) ? strtolower($matches[2]) : 'gr';
                        
                        // Birimi standartlaştır (g, gram -> gr)
                        if ($unit === 'g' || $unit === 'gram' || $unit === '') {
                            $unit = 'gr';
                        }
                        
                        // Normalize edilmiş ağırlık anahtarı (sayısal değer + birim)
                        $normalizedKey = $numericValue . $unit;
                        
                        // Normalize edilmiş ağırlık için toplam sayıyı hesapla
                        if (isset($weightStats[$normalizedKey])) {
                            $weightStats[$normalizedKey]['count'] += $stat['count'];
                        } else {
                            $weightStats[$normalizedKey] = [
                                'weight' => $normalizedKey,
                                'count' => $stat['count']
                            ];
                        }
                        
                        $processedCount += $stat['count'];
                    } else {
                        // Regex eşleşmeyen değerleri de ekle (hata ayıklama için)
                        // Ancak önce orijinal değeri kullan
                        if (isset($weightStats[$rawWeight])) {
                            $weightStats[$rawWeight]['count'] += $stat['count'];
                        } else {
                            $weightStats[$rawWeight] = [
                                'weight' => $rawWeight,
                                'count' => $stat['count']
                            ];
                        }
                        $processedCount += $stat['count'];
                    }
                }
                
                // Sayıya göre sırala (büyükten küçüğe)
                usort($weightStats, function($a, $b) {
                    return $b['count'] - $a['count'];
                });
                
                // Toplam aktif sertifika sayısı
                $totalStmt = $pdo->prepare("SELECT COUNT(*) as total FROM certificates WHERE status = 'active'");
                $totalStmt->execute();
                $totalActive = $totalStmt->fetch()['total'];
                
                // Ağırlık istatistiklerinin toplamını hesapla (doğrulama için)
                $weightStatsTotal = array_sum(array_column($weightStats, 'count'));
                
                // Eğer toplamlar eşleşmiyorsa, bir uyarı göster (debug için)
                // Not: Bu normal olabilir çünkü bazı kayıtlarda ağırlık NULL olabilir
                $weightStatsValidation = ($weightStatsTotal == $totalActive);
                
            } catch (Exception $e) {
                $productTypeStats = [];
                $weightStats = [];
                $totalActive = 0;
            }
        ?>
            <!-- Ana Sayfa İçeriği -->
            
            <!-- Ürün İstatistikleri -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">
                        <i data-lucide="bar-chart-3"></i>
                    </div>
                    <h2>Ürün Stok Durumu</h2>
                </div>
                
                <!-- Toplam Aktif Sertifika -->
                <div style="background: linear-gradient(135deg, #041234 0%, #0a1f4a 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Toplam Aktif Sertifika</div>
                    <div style="font-size: 42px; font-weight: 700;"><?php echo number_format($totalActive, 0, ',', '.'); ?></div>
                </div>
                
                <!-- Ürün Tipine Göre Dağılım -->
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #041234; font-size: 18px; font-weight: 600; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="package" style="width: 20px; height: 20px;"></i>
                        Ürün Tipine Göre Dağılım
                    </h3>
                    <div class="stats-grid">
                        <?php if (!empty($productTypeStats)): ?>
                            <?php foreach ($productTypeStats as $stat): ?>
                                <div class="stat-card">
                                    <div class="stat-value"><?php echo number_format($stat['count'], 0, ',', '.'); ?></div>
                                    <div class="stat-label"><?php echo htmlspecialchars($stat['product_type']); ?></div>
                                </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <div style="text-align: center; padding: 20px; color: #666; grid-column: 1 / -1;">
                                Henüz ürün kaydı bulunmuyor.
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
                
                <!-- Ağırlığa Göre Dağılım -->
                <div>
                    <h3 style="color: #041234; font-size: 18px; font-weight: 600; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="weight" style="width: 20px; height: 20px;"></i>
                        Ağırlığa Göre Dağılım
                    </h3>
                    <div class="stats-grid">
                        <?php if (!empty($weightStats)): ?>
                            <?php foreach ($weightStats as $stat): 
                                // Ağırlık gösterimini formatla: "2.5gr" -> "2.5 gr"
                                $displayWeight = preg_replace('/(\d+(?:\.\d+)?)(gr|g)$/i', '$1 gr', $stat['weight']);
                            ?>
                                <div class="stat-card">
                                    <div class="stat-value"><?php echo number_format($stat['count'], 0, ',', '.'); ?></div>
                                    <div class="stat-label"><?php echo htmlspecialchars($displayWeight); ?></div>
                                </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <div style="text-align: center; padding: 20px; color: #666; grid-column: 1 / -1;">
                                Henüz ağırlık kaydı bulunmuyor.
                            </div>
                        <?php endif; ?>
                    </div>
                    
                    <!-- Doğrulama Bilgisi (Debug için) -->
                    <?php if (isset($weightStatsTotal) && isset($weightStatsValidation)): ?>
                    <div style="margin-top: 15px; padding: 12px; background: <?php echo $weightStatsValidation ? '#d4edda' : '#fff3cd'; ?>; border: 1px solid <?php echo $weightStatsValidation ? '#28a745' : '#ffc107'; ?>; border-radius: 8px; font-size: 13px; color: <?php echo $weightStatsValidation ? '#155724' : '#856404'; ?>;">
                        <strong>Doğrulama:</strong> 
                        Ağırlık istatistikleri toplamı: <strong><?php echo number_format($weightStatsTotal, 0, ',', '.'); ?></strong> | 
                        Toplam aktif sertifika: <strong><?php echo number_format($totalActive, 0, ',', '.'); ?></strong>
                        <?php if (!$weightStatsValidation): ?>
                            <br><small>⚠️ Fark: <?php echo number_format(abs($totalActive - $weightStatsTotal), 0, ',', '.'); ?> kayıt (NULL veya geçersiz ağırlık değerleri olabilir)</small>
                        <?php else: ?>
                            <br><small>✅ Tüm kayıtlar başarıyla işlendi</small>
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
            
            <div class="info-box">
                <strong style="display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="info" style="width: 20px; height: 20px;"></i>
                    CSV Dosya Formatı
                </strong>
                <strong>Kolonlar:</strong> Seri Numarası, Ürün Tipi, Üretim Tarihi, Ağırlık, Durum<br>
                <strong>Örnek:</strong> AA00000001, Kare, 13.10.2025, 1gr, active<br>
                <em>⚠️ Tarih formatı: dd.mm.yyyy (örn: 13.10.2025)</em>
            </div>
            
            <!-- CSV Import -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">
                        <i data-lucide="upload"></i>
                    </div>
                    <h2>CSV Dosyası ile Toplu Import</h2>
                </div>
                <form method="POST" enctype="multipart/form-data">
                    <?php echo csrf_token_field(); ?>
                    <input type="hidden" name="import_action" value="csv">
                    <label>CSV Dosyası Seçin:</label>
                    <input type="file" name="csv_file" accept=".csv" required>
                    <button type="submit">CSV'yi İçe Aktar</button>
                </form>
            </div>
            
            <!-- Manuel Ekleme -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">
                        <i data-lucide="plus-circle"></i>
                    </div>
                    <h2>Tek Sertifika Ekle</h2>
                </div>
                <form method="POST">
                    <?php echo csrf_token_field(); ?>
                    <input type="hidden" name="import_action" value="manual">
                    
                    <label>Seri Numarası:</label>
                    <input type="text" name="serial_number" placeholder="Örn: AA00000001" required>
                    
                    <label>Ürün Tipi:</label>
                    <select name="product_type" required>
                        <option value="">Seçiniz</option>
                        <option value="Kare">Kare</option>
                        <option value="Yuvarlak">Yuvarlak</option>
                        <option value="Kalp">Kalp</option>
                        <option value="Yonca">Yonca</option>
                    </select>
                    
                    <label>Üretim Tarihi:</label>
                    <input type="date" name="production_date" required>
                    
                    <label>Ağırlık:</label>
                    <input type="text" name="weight" placeholder="1gr" required>
                    
                    <label>Durum:</label>
                    <select name="status">
                        <option value="active">Aktif</option>
                        <option value="pending">Beklemede</option>
                        <option value="cancelled">İptal</option>
                    </select>
                    
                    <button type="submit">Sertifika Ekle</button>
                </form>
            </div>
            
            <!-- Örnek CSV Şablonu -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">
                        <i data-lucide="table"></i>
                    </div>
                    <h2>Örnek CSV Şablonu</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Seri Numarası</th>
                            <th>Ürün Tipi</th>
                            <th>Üretim Tarihi</th>
                            <th>Ağırlık</th>
                            <th>Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>AA00000001</td>
                            <td>Kare</td>
                            <td>09.10.2025</td>
                            <td>1gr</td>
                            <td>active</td>
                        </tr>
                        <tr>
                            <td>AA0000002</td>
                            <td>Yuvarlak</td>
                            <td>09.10.2025</td>
                            <td>1gr</td>
                            <td>active</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
        <?php elseif ($currentPage === 'price_history'): ?>
            <!-- Fiyat Geçmişi Sayfası -->
            <?php
            try {
                $pdo = getDBConnection();
                
                // filtreleme parametreleri
                $selectedSymbol = $_GET['symbol'] ?? '';
                $page = max(1, intval($_GET['p'] ?? 1));
                $perPage = 10;
                $offset = ($page - 1) * $perPage;
                
                $whereClause = '';
                $params = [];
                
                if (!empty($selectedSymbol)) {
                    $whereClause = 'WHERE symbol = ?';
                    $params[] = $selectedSymbol;
                }
                
                $countSql = "SELECT COUNT(*) as total FROM price_history $whereClause";
                $countStmt = $pdo->prepare($countSql);
                $countStmt->execute($params);
                $totalRecords = $countStmt->fetch()['total'];
                $totalPages = ceil($totalRecords / $perPage);
                
                $sql = "
                    SELECT symbol, buy_price, sell_price, close_price, direction, recorded_at 
                    FROM price_history 
                    $whereClause
                    ORDER BY recorded_at DESC 
                    LIMIT $perPage OFFSET $offset
                ";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $priceHistory = $stmt->fetchAll();
                
                $symbolsStmt = $pdo->prepare("SELECT DISTINCT symbol FROM price_history ORDER BY symbol");
                $symbolsStmt->execute();
                $availableSymbols = $symbolsStmt->fetchAll(PDO::FETCH_COLUMN);
                
            } catch (Exception $e) {
                $priceHistory = [];
                $availableSymbols = [];
                $totalPages = 0;
                $page = 1;
            }
            ?>
            
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">
                        <i data-lucide="table"></i>
                    </div>
                    <h2>Fiyat Kayıtları</h2>
                </div>
                
                <!-- Filtreleme ve Sayfalama Üst Kısım -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px; flex-wrap: wrap; gap: 15px;">
                    <!-- Filtreleme -->
                    <form method="GET" style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                        <input type="hidden" name="page" value="price_history">
                        
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <label style="margin: 0; font-weight: 600; color: #495057;">Filtre:</label>
                            <select name="symbol" style="margin: 0; padding: 6px 10px; border-radius: 6px; border: 1px solid #ddd;">
                                <option value="">Altının Türü</option>
                                <?php foreach ($availableSymbols as $symbol): ?>
                                <option value="<?php echo htmlspecialchars($symbol); ?>" 
                                        <?php echo $selectedSymbol === $symbol ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($symbol); ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <button type="submit" style="margin: 0; padding: 6px 12px; font-size: 13px;">
                            <i data-lucide="search" style="width: 14px; height: 14px; margin-right: 4px;"></i>
                            Filtrele
                        </button>
                        
                        <?php if (!empty($selectedSymbol)): ?>
                        <a href="?page=price_history" style="text-decoration: none;">
                            <button type="button" style="margin: 0; padding: 6px 12px; font-size: 13px; background: #6c757d;">
                                <i data-lucide="x" style="width: 14px; height: 14px; margin-right: 4px;"></i>
                                Temizle
                            </button>
                        </a>
                        <?php endif; ?>
                        
                        <!-- Excel İndirme Butonu -->
                        <a href="?page=price_history&export=excel<?php echo !empty($selectedSymbol) ? '&symbol=' . urlencode($selectedSymbol) : ''; ?>" 
                           style="text-decoration: none;">
                            <button type="button" style="margin: 0; padding: 6px 12px; font-size: 13px; background: #28a745;">
                                <i data-lucide="download" style="width: 14px; height: 14px; margin-right: 4px;"></i>
                                Excel İndir
                            </button>
                        </a>
                    </form>
                    
                    <!-- Sayfa Bilgisi -->
                    <div style="color: #495057; font-weight: 600; font-size: 14px;">
                        Toplam <?php echo $totalRecords; ?> kayıt
                        <?php if (!empty($selectedSymbol)): ?>
                        - Filtre: <?php echo htmlspecialchars($selectedSymbol); ?>
                        <?php endif; ?>
                    </div>
                </div>
                
                <?php if (!empty($priceHistory)): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Sembol</th>
                            <th>Alış Fiyatı</th>
                            <th>Satış Fiyatı</th>
                            <th>Kapanış Fiyatı</th>
                            <th>Yön</th>
                            <th>Kayıt Zamanı</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($priceHistory as $record): ?>
                        <tr>
                            <td><strong><?php echo htmlspecialchars($record['symbol']); ?></strong></td>
                            <td><?php echo number_format($record['buy_price'], 2); ?> ₺</td>
                            <td><?php echo number_format($record['sell_price'], 2); ?> ₺</td>
                            <td><?php echo $record['close_price'] ? number_format($record['close_price'], 2) . ' ₺' : '-'; ?></td>
                            <td>
                                <?php if ($record['direction'] === 'up'): ?>
                                    <span style="color: #28a745; font-weight: bold;">↗ Yükseliş</span>
                                <?php elseif ($record['direction'] === 'down'): ?>
                                    <span style="color: #dc3545; font-weight: bold;">↘ Düşüş</span>
                                <?php else: ?>
                                    <span style="color: #666;">-</span>
                                <?php endif; ?>
                            </td>
                            <td><?php echo date('d.m.Y H:i:s', strtotime($record['recorded_at'])); ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                <?php else: ?>
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i data-lucide="database" style="width: 48px; height: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>Henüz fiyat verisi bulunmuyor.</p>
                </div>
                <?php endif; ?>
                
                <!-- Sayfalama Kontrolleri -->
                <?php if ($totalPages > 1): ?>
                <div class="pagination-container">
                    <!-- Sayfa Bilgisi -->
                    <div class="pagination-info">
                        Sayfa <?php echo $page; ?> / <?php echo $totalPages; ?>
                    </div>
                    
                    <!-- Önceki Sayfa -->
                    <?php if ($page > 1): ?>
                    <a href="?page=price_history<?php echo !empty($selectedSymbol) ? '&symbol=' . urlencode($selectedSymbol) : ''; ?>&p=<?php echo $page - 1; ?>" 
                       class="pagination-button">
                        <i data-lucide="chevron-left" style="width: 14px; height: 14px;"></i>
                        Önceki
                    </a>
                    <?php else: ?>
                    <span class="pagination-button" style="cursor: not-allowed; background: #e9ecef; color: #6c757d; border-color: #e9ecef;">
                        <i data-lucide="chevron-left" style="width: 14px; height: 14px;"></i>
                        Önceki
                    </span>
                    <?php endif; ?>
                    
                    <!-- Sayfa Numaraları - Modern Sayfalama -->
                    <?php
                    $maxVisiblePages = 5;
                    $halfVisible = floor($maxVisiblePages / 2);
                    
                    $startPage = max(1, $page - $halfVisible);
                    $endPage = min($totalPages, $page + $halfVisible);
                    
                    if ($startPage > 1): ?>
                    <a href="?page=price_history<?php echo !empty($selectedSymbol) ? '&symbol=' . urlencode($selectedSymbol) : ''; ?>&p=1" 
                       class="pagination-button">
                        1
                    </a>
                    <?php if ($startPage > 2): ?>
                    <span class="pagination-ellipsis">...</span>
                    <?php endif; ?>
                    <?php endif; ?>
                    
                    <!-- Sayfa numaraları -->
                    <?php for ($i = $startPage; $i <= $endPage; $i++): ?>
                    <a href="?page=price_history<?php echo !empty($selectedSymbol) ? '&symbol=' . urlencode($selectedSymbol) : ''; ?>&p=<?php echo $i; ?>" 
                       class="pagination-button <?php echo $page == $i ? 'active' : ''; ?>">
                        <?php echo $i; ?>
                    </a>
                    <?php endfor; ?>
                    
                    <!-- Sayfa gösterme prensibi -->
                    <?php if ($endPage < $totalPages): ?>
                    <?php if ($endPage < $totalPages - 1): ?>
                    <span class="pagination-ellipsis">...</span>
                    <?php endif; ?>
                    <a href="?page=price_history<?php echo !empty($selectedSymbol) ? '&symbol=' . urlencode($selectedSymbol) : ''; ?>&p=<?php echo $totalPages; ?>" 
                       class="pagination-button">
                        <?php echo $totalPages; ?>
                    </a>
                    <?php endif; ?>
                    
                    <!-- Sonraki Sayfa-->
                    <?php if ($page < $totalPages): ?>
                    <a href="?page=price_history<?php echo !empty($selectedSymbol) ? '&symbol=' . urlencode($selectedSymbol) : ''; ?>&p=<?php echo $page + 1; ?>" 
                       class="pagination-button">
                        Sonraki
                        <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
                    </a>
                    <?php else: ?>
                    <span class="pagination-button" style="cursor: not-allowed; background: #e9ecef; color: #6c757d; border-color: #e9ecef;">
                        Sonraki
                        <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
                    </span>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>
            
        <?php elseif ($currentPage === 'user_management' && $_SESSION['admin_role'] === 'admin'): ?>
            <!-- Hesap Yönetimi Sayfası -->
            <?php
            try {
                $pdo = getDBConnection();
                
                $stmt = $pdo->prepare("
                    SELECT id, username, full_name, role, is_active, last_login, created_at 
                    FROM admin_users 
                    ORDER BY created_at DESC
                ");
                $stmt->execute();
                $users = $stmt->fetchAll();
            } catch (Exception $e) {
                $users = [];
            }
            ?>
            
            <?php if ($userMessage): ?>
                <div class="message <?php echo $userSuccess ? 'success' : 'error'; ?>">
                    <?php echo htmlspecialchars($userMessage, ENT_QUOTES, 'UTF-8'); ?>
                </div>
            <?php endif; ?>
            
            <!-- Yeni Kullanıcı Oluştur -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">
                        <i data-lucide="user-plus"></i>
                    </div>
                    <h2>Yeni Kullanıcı Oluştur</h2>
                </div>
                <form method="POST">
                    <?php echo csrf_token_field(); ?>
                    <input type="hidden" name="user_action" value="create_user">
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label>Kullanıcı Adı:</label>
                            <input type="text" name="username" placeholder="Örn: admin2" required>
                        </div>
                        <div>
                            <label>Ad Soyad:</label>
                            <input type="text" name="full_name" placeholder="Örn: Ahmet Yılmaz" required>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label>Şifre:</label>
                            <input type="password" name="password" placeholder="En az 6 karakter" required>
                        </div>
                        <div>
                            <label>Rol:</label>
                            <select name="role" required>
                                <option value="">Seçiniz</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>
                    
                    <button type="submit">Kullanıcı Oluştur</button>
                </form>
            </div>
            
            <!-- Şifre Değiştir -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">
                        <i data-lucide="key"></i>
                    </div>
                    <h2>Kullanıcı Şifresini Değiştir</h2>
                </div>
                <form method="POST">
                    <?php echo csrf_token_field(); ?>
                    <input type="hidden" name="user_action" value="change_password">
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label>Kullanıcı Seçin:</label>
                            <select name="user_id" required>
                                <option value="">Kullanıcı seçiniz</option>
                                <?php foreach ($users as $user): ?>
                                <option value="<?php echo $user['id']; ?>">
                                    <?php echo htmlspecialchars($user['username'] . ' (' . $user['full_name'] . ')'); ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div>
                            <label>Yeni Şifre:</label>
                            <input type="password" name="new_password" placeholder="En az 6 karakter" required>
                        </div>
                    </div>
                    
                    <button type="submit">Şifreyi Değiştir</button>
                </form>
            </div>
            
            <!-- Kullanıcı Listesi -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">
                        <i data-lucide="users"></i>
                    </div>
                    <h2>Mevcut Kullanıcılar</h2>
                </div>
                
                <?php if (!empty($users)): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Kullanıcı Adı</th>
                            <th>Ad Soyad</th>
                            <th>Rol</th>
                            <th>Durum</th>
                            <th>Son Giriş</th>
                            <th>Oluşturulma</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $user): ?>
                        <tr>
                            <td><strong><?php echo htmlspecialchars($user['username']); ?></strong></td>
                            <td><?php echo htmlspecialchars($user['full_name']); ?></td>
                            <td>
                                <span style="
                                    background: <?php echo $user['role'] === 'admin' ? '#ffb600' : '#6c757d'; ?>;
                                    color: <?php echo $user['role'] === 'admin' ? '#041234' : 'white'; ?>;
                                    padding: 4px 8px;
                                    border-radius: 6px;
                                    font-size: 12px;
                                    font-weight: 600;
                                ">
                                    <?php echo ucfirst($user['role']); ?>
                                </span>
                            </td>
                            <td>
                                <span style="
                                    background: <?php echo $user['is_active'] ? '#28a745' : '#dc3545'; ?>;
                                    color: white;
                                    padding: 4px 8px;
                                    border-radius: 6px;
                                    font-size: 12px;
                                    font-weight: 600;
                                ">
                                    <?php echo $user['is_active'] ? 'Aktif' : 'Pasif'; ?>
                                </span>
                            </td>
                            <td><?php echo $user['last_login'] ? date('d.m.Y H:i', strtotime($user['last_login'])) : 'Hiç'; ?></td>
                            <td><?php echo date('d.m.Y', strtotime($user['created_at'])); ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                <?php else: ?>
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i data-lucide="users" style="width: 48px; height: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>Kullanıcı bulunamadı.</p>
                </div>
                <?php endif; ?>
            </div>
            
        <?php else: ?>
            <!-- 404 Sayfa Bulunamadı -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">
                        <i data-lucide="alert-circle"></i>
                    </div>
                    <h2>Sayfa Bulunamadı</h2>
                </div>
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i data-lucide="file-x" style="width: 48px; height: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>Aradığınız sayfa bulunamadı.</p>
                    <a href="import.php" style="color: #ffb600; text-decoration: none; font-weight: 600;">
                        ← Ana sayfaya dön
                    </a>
                </div>
            </div>
        <?php endif; ?>
    </div>
    
    <script>
        lucide.createIcons();
    </script>
</body>
</html>

