<?php
/**
 * CGE — Contact form handler.
 *
 * Sends the form submission to TO_EMAIL using PHP mail().
 * Falls back to a plain HTML success page when called without fetch (no JS).
 * Returns JSON when the request Accepts JSON (fetch path).
 */

declare(strict_types=1);

// ───── CONFIG ─────────────────────────────────────────────────────────
const TO_EMAIL    = 'rob@chiefgrowthengineer.com';
const FROM_EMAIL  = 'no-reply@chiefgrowthengineer.com'; // must be on this domain (SPF/DKIM)
const SITE_NAME   = 'Chief Growth Engineer';
const SUBJECT_TAG = '[CGE Enquiry]';

// ───── HELPERS ────────────────────────────────────────────────────────

function wants_json(): bool {
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    return stripos($accept, 'application/json') !== false;
}

function respond(int $code, array $payload, ?string $redirect = null): void {
    if (wants_json()) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload);
        exit;
    }

    // No-JS fallback — render a small confirmation/error page
    http_response_code($code);
    header('Content-Type: text/html; charset=utf-8');
    $ok      = !empty($payload['ok']);
    $title   = $ok ? 'Message received' : 'Could not send';
    $message = $ok
        ? "Thanks — I'll reply within 24 hours."
        : htmlspecialchars($payload['error'] ?? 'Something went wrong. Please email rob@chiefgrowthengineer.com directly.', ENT_QUOTES, 'UTF-8');
    echo <<<HTML
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{$title} — CGE</title>
<link rel="stylesheet" href="/assets/css/site.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;700;900&display=swap" rel="stylesheet">
</head><body>
<main style="max-width:680px;margin:0 auto;padding:120px 32px;font-family:'Archivo',sans-serif">
  <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:#d62828;margin-bottom:24px">§ Contact</div>
  <h1 style="font-size:64px;font-weight:900;letter-spacing:-.04em;line-height:.9;text-transform:uppercase;margin:0">{$title}.</h1>
  <p style="font-size:18px;line-height:1.6;color:#2a2620;margin-top:24px">{$message}</p>
  <p style="margin-top:40px"><a href="/" style="display:inline-block;padding:14px 22px;background:#d62828;color:#fff;font-weight:900;text-transform:uppercase;letter-spacing:.1em;text-decoration:none">← Back to site</a></p>
</main>
</body></html>
HTML;
    exit;
}

function clean(string $s): string {
    // Strip CR/LF from header-bound fields to prevent injection
    $s = str_replace(["\r", "\n", "%0A", "%0D"], ' ', $s);
    return trim($s);
}

/**
 * Minimal SMTP client for Google Workspace (smtp.gmail.com).
 * Port 587 = STARTTLS (default); port 465 = implicit TLS.
 * Returns true on a 250 response to DATA, false on any failure.
 */
function smtp_send(array $cfg, string $to, string $subject, string $body, string $replyName, string $replyEmail): bool {
    $host = $cfg['smtp_host'] ?? 'smtp.gmail.com';
    $port = (int)($cfg['smtp_port'] ?? 587);
    $user = $cfg['smtp_user'];
    $pass = $cfg['smtp_pass'];
    $timeout = 15;

    $remote = ($port === 465 ? "ssl://$host:$port" : "tcp://$host:$port");
    $ctx = stream_context_create(['ssl' => ['SNI_enabled' => true]]);
    $fp = @stream_socket_client($remote, $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) { error_log("[CGE] SMTP connect failed: $errno $errstr"); return false; }
    stream_set_timeout($fp, $timeout);

    $read = function () use ($fp): string {
        $data = '';
        while (($line = fgets($fp, 515)) !== false) {
            $data .= $line;
            if (strlen($line) < 4 || $line[3] !== '-') break; // last line of multi-line reply
        }
        return $data;
    };
    $cmd = function (string $c, array $expect) use ($fp, $read): bool {
        fwrite($fp, $c . "\r\n");
        $r = $read();
        $code = (int)substr($r, 0, 3);
        if (!in_array($code, $expect, true)) { error_log("[CGE] SMTP unexpected reply to '" . substr($c, 0, 12) . "…': " . trim($r)); return false; }
        return true;
    };

    $hostname = 'chiefgrowthengineer.com';
    if ((int)substr($read(), 0, 3) !== 220) { fclose($fp); return false; }
    if (!$cmd("EHLO $hostname", [250])) { fclose($fp); return false; }

    if ($port !== 465) {
        if (!$cmd('STARTTLS', [220])) { fclose($fp); return false; }
        if (!@stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            error_log('[CGE] SMTP STARTTLS negotiation failed'); fclose($fp); return false;
        }
        if (!$cmd("EHLO $hostname", [250])) { fclose($fp); return false; }
    }

    if (!$cmd('AUTH LOGIN', [334])
        || !$cmd(base64_encode($user), [334])
        || !$cmd(base64_encode($pass), [235])) { fclose($fp); return false; }

    if (!$cmd("MAIL FROM:<$user>", [250])) { fclose($fp); return false; }
    if (!$cmd("RCPT TO:<$to>", [250, 251])) { fclose($fp); return false; }
    if (!$cmd('DATA', [354])) { fclose($fp); return false; }

    $fromName = mb_encode_mimeheader('Chief Growth Engineer Website', 'UTF-8', 'B');
    $headers = [
        "From: $fromName <$user>",
        "To: <$to>",
        'Reply-To: ' . mb_encode_mimeheader($replyName, 'UTF-8', 'B') . " <$replyEmail>",
        'Subject: ' . mb_encode_mimeheader($subject, 'UTF-8', 'B'),
        'Date: ' . date('r'),
        'Message-ID: <' . bin2hex(random_bytes(12)) . '@chiefgrowthengineer.com>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];
    // Normalise line endings and dot-stuff the body (RFC 5321 §4.5.2)
    $data = implode("\r\n", $headers) . "\r\n\r\n" . $body;
    $data = preg_replace("/\r\n|\r|\n/", "\r\n", $data);
    $data = preg_replace('/^\./m', '..', $data);

    fwrite($fp, $data . "\r\n.\r\n");
    $r = $read();
    $cmdOk = ((int)substr($r, 0, 3) === 250);
    if (!$cmdOk) error_log('[CGE] SMTP DATA rejected: ' . trim($r));
    fwrite($fp, "QUIT\r\n");
    fclose($fp);
    return $cmdOk;
}

// ───── HANDLE ─────────────────────────────────────────────────────────

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

// Honeypot: bots typically fill all fields
$honeypot = $_POST['company_url'] ?? '';
if ($honeypot !== '') {
    // Silently "succeed" to confuse the bot
    respond(200, ['ok' => true]);
}

$name    = clean($_POST['name']    ?? '');
$email   = clean($_POST['email']   ?? '');
$company = clean($_POST['company'] ?? '');
$budget  = clean($_POST['budget']  ?? '');
$message = trim($_POST['message']  ?? ''); // allow line breaks in body

if ($name === '' || $email === '' || $message === '') {
    respond(400, ['ok' => false, 'error' => 'Please fill in your name, email, and message.']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['ok' => false, 'error' => 'That email address doesn\'t look right.']);
}

if (strlen($message) > 8000) {
    respond(400, ['ok' => false, 'error' => 'Message too long. Please trim it down.']);
}

// Build email
$subject = SUBJECT_TAG . ' ' . ($company !== '' ? $company . ' — ' : '') . $name;

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$ua = preg_replace('/[^[:print:]]/', '', $ua);

$body  = "New enquiry via " . SITE_NAME . "\n";
$body .= "─────────────────────────────────────\n";
$body .= "Name:       $name\n";
$body .= "Email:      $email\n";
$body .= "Company:    " . ($company !== '' ? $company : '—') . "\n";
$body .= "Engagement: " . ($budget  !== '' ? $budget  : '—') . "\n";
$body .= "─────────────────────────────────────\n";
$body .= "Message:\n\n$message\n";
$body .= "─────────────────────────────────────\n";
$body .= "IP:        $ip\n";
$body .= "UA:        $ua\n";
$body .= "When:      " . date('Y-m-d H:i:s') . " UTC\n";

// ── Send: SMTP via Google Workspace if a config file exists, else PHP mail() ──
// Config lives OUTSIDE public_html so it is never in git and never deployed:
//   /home/<cpanel-user>/cge-mail-config.php  (i.e. one directory above this file's docroot)
$ok = false;
$cfgPath = dirname(__DIR__) . '/cge-mail-config.php';
if (is_readable($cfgPath)) {
    $cfg = include $cfgPath;
    if (is_array($cfg) && !empty($cfg['smtp_user']) && !empty($cfg['smtp_pass'])) {
        $ok = smtp_send($cfg, TO_EMAIL, $subject, $body, $name, $email);
        if (!$ok) error_log('[CGE] SMTP send failed — falling back to mail()');
    }
}

if (!$ok) {
    $from_name = mb_encode_mimeheader('Chief Growth Engineer Website', 'UTF-8', 'B');
    $headers   = [];
    $headers[] = "From: {$from_name} <" . FROM_EMAIL . ">";
    $headers[] = "Reply-To: $name <$email>";
    $headers[] = "X-Mailer: PHP/" . phpversion();
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-Type: text/plain; charset=UTF-8";
    $ok = @mail(TO_EMAIL, mb_encode_mimeheader($subject, 'UTF-8', 'B'), $body, implode("\r\n", $headers), '-f' . FROM_EMAIL);
}

if (!$ok) {
    // Log it so we can see what happened on the server
    error_log('[CGE] mail() failed for ' . $email);
    respond(500, ['ok' => false, 'error' => 'Mail server refused the message. Please email rob@chiefgrowthengineer.com directly.']);
}

respond(200, ['ok' => true]);
