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

$from_name = mb_encode_mimeheader('Chief Growth Engineer Website', 'UTF-8', 'B');

$headers   = [];
$headers[] = "From: {$from_name} <" . FROM_EMAIL . ">";
$headers[] = "Reply-To: $name <$email>";
$headers[] = "X-Mailer: PHP/" . phpversion();
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";

$ok = @mail(TO_EMAIL, mb_encode_mimeheader($subject, 'UTF-8', 'B'), $body, implode("\r\n", $headers), '-f' . FROM_EMAIL);

if (!$ok) {
    // Log it so we can see what happened on the server
    error_log('[CGE] mail() failed for ' . $email);
    respond(500, ['ok' => false, 'error' => 'Mail server refused the message. Please email rob@chiefgrowthengineer.com directly.']);
}

respond(200, ['ok' => true]);
