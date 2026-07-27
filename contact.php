<?php
/**
 * CGE — Contact + lead-magnet form handler.
 *
 * On every valid submission:
 *   1. Appends the lead to a log file OUTSIDE public_html (never lose a lead).
 *   2. Emails the enquiry to TO_EMAIL (Rob).
 *   3. Emails the sender a branded thank-you with the booking link —
 *      including a copy of their message / tool results.
 *
 * Sends via SMTP (Google Workspace) when /home/<user>/cge-mail-config.php
 * exists, else falls back to PHP mail(). Returns JSON on fetch requests,
 * a small HTML confirmation page otherwise (no-JS fallback).
 */

declare(strict_types=1);

// ───── CONFIG ─────────────────────────────────────────────────────────
const TO_EMAIL    = 'rob@chiefgrowthengineer.com';
const FROM_EMAIL  = 'no-reply@chiefgrowthengineer.com'; // must be on this domain (SPF/DKIM)
const SITE_NAME   = 'Chief Growth Engineer';
const SITE_URL    = 'https://chiefgrowthengineer.com';
const SUBJECT_TAG = '[CGE Enquiry]';
const BOOKING_URL = 'https://calendar.app.google/vXohio54MnjJy57X7';

const RATE_LIMIT_MAX    = 10;    // submissions …
const RATE_LIMIT_WINDOW = 3600;  // … per IP per hour

// ───── HELPERS ────────────────────────────────────────────────────────

function wants_json(): bool {
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    return stripos($accept, 'application/json') !== false;
}

function respond(int $code, array $payload): void {
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
    $booking = BOOKING_URL;
    $message = $ok
        ? "Thanks — I'll reply within 24 hours. A confirmation is on its way to your inbox."
        : htmlspecialchars($payload['error'] ?? 'Something went wrong. Please email rob@chiefgrowthengineer.com directly.', ENT_QUOTES, 'UTF-8');
    $bookBtn = $ok
        ? "<a href=\"{$booking}\" style=\"display:inline-block;padding:14px 22px;background:#d62828;color:#fff;font-weight:900;text-transform:uppercase;letter-spacing:.1em;text-decoration:none;margin-right:12px\">Book a 30-min call →</a>"
        : '';
    echo <<<HTML
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>{$title} — CGE</title>
<link rel="stylesheet" href="/assets/css/site.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;700;900&display=swap" rel="stylesheet">
</head><body>
<main style="max-width:680px;margin:0 auto;padding:120px 32px;font-family:'Archivo',sans-serif">
  <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:#d62828;margin-bottom:24px">§ Contact</div>
  <h1 style="font-size:64px;font-weight:900;letter-spacing:-.04em;line-height:.9;text-transform:uppercase;margin:0">{$title}.</h1>
  <p style="font-size:18px;line-height:1.6;color:#2a2620;margin-top:24px">{$message}</p>
  <p style="margin-top:40px">{$bookBtn}<a href="/" style="display:inline-block;padding:14px 22px;border:1.5px solid #0a0a0a;color:#0a0a0a;font-weight:900;text-transform:uppercase;letter-spacing:.1em;text-decoration:none">← Back to site</a></p>
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
 * Simple per-IP rate limiter using timestamp files outside public_html.
 * Fails OPEN — a broken filesystem must never block a real lead.
 */
function rate_limited(string $ip): bool {
    $dir = dirname(__DIR__) . '/cge-ratelimit';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) $dir = sys_get_temp_dir();
    if (!is_writable($dir)) return false;

    $file = $dir . '/cge-rl-' . hash('sha256', $ip);
    $now  = time();
    $hits = [];
    if (is_readable($file)) {
        $hits = array_filter(
            array_map('intval', file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: []),
            fn ($t) => ($now - $t) < RATE_LIMIT_WINDOW
        );
    }
    if (count($hits) >= RATE_LIMIT_MAX) return true;

    $hits[] = $now;
    @file_put_contents($file, implode("\n", $hits) . "\n", LOCK_EX);
    return false;
}

/**
 * Append the lead to a JSONL log outside public_html.
 * This runs BEFORE any mail attempt so a mail outage never loses a lead.
 */
function log_lead(array $lead): void {
    $line = json_encode($lead, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($line === false) return;
    $path = dirname(__DIR__) . '/cge-leads.jsonl';
    if (@file_put_contents($path, $line . "\n", FILE_APPEND | LOCK_EX) === false) {
        error_log('[CGE] lead log write failed — lead follows: ' . $line);
    }
}

/**
 * Build a complete RFC-5322 message (headers + body).
 * With $htmlBody, produces multipart/alternative; otherwise plain text.
 * Returns [subjectHeaderValue, headerLines[], body] — mail() needs the
 * subject separately, SMTP wants everything in one blob.
 */
function build_message(
    string $fromEmail, string $fromName,
    string $toEmail, string $toName,
    string $subject, string $textBody, ?string $htmlBody = null,
    ?string $replyToEmail = null, ?string $replyToName = null,
    bool $autoReply = false
): array {
    $enc = fn (string $s): string => mb_encode_mimeheader($s, 'UTF-8', 'B');

    $headers = [
        'From: ' . $enc($fromName) . " <{$fromEmail}>",
        'To: ' . ($toName !== '' ? $enc($toName) . ' ' : '') . "<{$toEmail}>",
        'Date: ' . date('r'),
        'Message-ID: <' . bin2hex(random_bytes(12)) . '@chiefgrowthengineer.com>',
        'MIME-Version: 1.0',
    ];
    if ($replyToEmail !== null) {
        $headers[] = 'Reply-To: ' . ($replyToName ? $enc($replyToName) . ' ' : '') . "<{$replyToEmail}>";
    }
    if ($autoReply) {
        // Mark as automatic so vacation responders / bots don't loop
        $headers[] = 'Auto-Submitted: auto-replied';
        $headers[] = 'X-Auto-Response-Suppress: All';
    }

    if ($htmlBody === null) {
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';
        $headers[] = 'Content-Transfer-Encoding: 8bit';
        $body = $textBody;
    } else {
        $boundary = 'cge-' . bin2hex(random_bytes(12));
        $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";
        $body  = "--{$boundary}\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n";
        $body .= $textBody . "\r\n\r\n";
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n";
        $body .= $htmlBody . "\r\n\r\n";
        $body .= "--{$boundary}--";
    }

    return [$enc($subject), $headers, $body];
}

/**
 * Minimal SMTP client for Google Workspace (smtp.gmail.com).
 * Port 587 = STARTTLS (default); port 465 = implicit TLS.
 * Sends a fully built message (headers must NOT include Subject — pass it in $subjectHeader form via $headers upstream).
 */
function smtp_send(array $cfg, string $to, string $encodedSubject, array $headers, string $body): bool {
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

    // Envelope sender is the authenticated account; rewrite the From header to match
    $headers = array_map(
        fn ($h) => str_starts_with($h, 'From: ') ? preg_replace('/<[^>]+>$/', "<$user>", $h) : $h,
        $headers
    );
    $headers[] = 'Subject: ' . $encodedSubject;

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

/**
 * Send a built message via SMTP config when available, else PHP mail().
 */
function deliver(string $to, string $encodedSubject, array $headers, string $body): bool {
    static $cfg = null, $cfgLoaded = false;
    if (!$cfgLoaded) {
        $cfgLoaded = true;
        $cfgPath = dirname(__DIR__) . '/cge-mail-config.php';
        if (is_readable($cfgPath)) {
            $c = include $cfgPath;
            if (is_array($c) && !empty($c['smtp_user']) && !empty($c['smtp_pass'])) $cfg = $c;
        }
    }

    if ($cfg !== null) {
        if (smtp_send($cfg, $to, $encodedSubject, $headers, $body)) return true;
        error_log('[CGE] SMTP send failed — falling back to mail()');
    }

    // mail() supplies To: and Subject: itself — drop ours to avoid duplicates
    $mailHeaders = array_filter($headers, fn ($h) => !preg_match('/^(To|Subject):/i', $h));
    $mailHeaders[] = 'X-Mailer: PHP/' . phpversion();
    return @mail($to, $encodedSubject, $body, implode("\r\n", $mailHeaders), '-f' . FROM_EMAIL);
}

/**
 * The branded thank-you email (HTML part).
 * Email-safe: table layout, inline styles, system font stack, no images.
 */
function autoreply_html(string $name, string $submitted, bool $isTool, string $toolName): string {
    $safeSubmitted = nl2br(htmlspecialchars($submitted, ENT_QUOTES, 'UTF-8'));
    $booking       = BOOKING_URL;
    $site          = SITE_URL;
    $firstName     = htmlspecialchars(explode(' ', trim($name))[0] ?: 'there', ENT_QUOTES, 'UTF-8');

    $intro = $isTool
        ? "Your <strong>" . htmlspecialchars($toolName, ENT_QUOTES, 'UTF-8') . "</strong> results landed in my inbox — a copy is below for your records. I'll read them properly and reply personally, usually within 24 hours (Mon–Fri, GMT+2). No sequence, no spam — just my reply."
        : "Your message landed in my inbox — a copy is below for your records. I read every enquiry myself and reply personally, usually within 24 hours (Mon–Fri, GMT+2).";

    $copyLabel = $isTool ? 'Your results' : 'What you sent';

    return <<<HTML
<div style="margin:0;padding:0;background-color:#f4f1e8">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1e8;padding:0;margin:0">
<tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

    <!-- Header -->
    <tr><td style="background-color:#0a0a0a;padding:22px 32px">
      <span style="font-family:Arial,Helvetica,sans-serif;font-weight:900;font-size:16px;letter-spacing:1px;text-transform:uppercase;color:#ffffff">
        Chief&nbsp;<span style="color:#d62828">[&nbsp;Growth&nbsp;]</span>&nbsp;Engineer
      </span>
    </td></tr>

    <!-- Body -->
    <tr><td style="background-color:#ffffff;border-top:4px solid #d62828;padding:40px 32px">
      <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#d62828;margin:0 0 18px">§ Message received</p>
      <h1 style="font-family:Arial,Helvetica,sans-serif;font-weight:900;font-size:34px;line-height:1;letter-spacing:-1px;text-transform:uppercase;color:#0a0a0a;margin:0 0 20px">Got it, {$firstName}.</h1>
      <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#2a2620;margin:0 0 26px">{$intro}</p>

      <!-- Booking CTA -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px">
        <tr><td style="background-color:#d62828">
          <a href="{$booking}" style="display:inline-block;padding:16px 26px;font-family:Arial,Helvetica,sans-serif;font-weight:900;font-size:14px;letter-spacing:1px;text-transform:uppercase;color:#ffffff;text-decoration:none">Skip the queue — book a 30-min call &nbsp;&rarr;</a>
        </td></tr>
      </table>
      <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#6b6155;margin:0 0 30px">Free, no pitch if it's not a fit. Pick any slot that suits your timezone.</p>

      <!-- Copy of submission -->
      <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6b6155;margin:0 0 10px">{$copyLabel}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="background-color:#f4f1e8;border-left:3px solid #d62828;padding:18px 20px">
          <p style="font-family:'Courier New',monospace;font-size:13px;line-height:1.65;color:#2a2620;margin:0">{$safeSubmitted}</p>
        </td></tr>
      </table>
    </td></tr>

    <!-- Signature -->
    <tr><td style="background-color:#ffffff;border-top:1px solid #e8e6df;padding:26px 32px">
      <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#2a2620;margin:0">
        — Rob Louw<br>
        <span style="color:#6b6155;font-size:13px">Fractional Growth Engineer · Cape Town · GMT+2</span><br>
        <a href="mailto:rob@chiefgrowthengineer.com" style="color:#d62828;text-decoration:none;font-size:13px">rob@chiefgrowthengineer.com</a>
      </p>
    </td></tr>

    <!-- Footer -->
    <tr><td style="padding:22px 32px">
      <p style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#6b6155;margin:0">
        © MMXXVI · CGE Group · <a href="{$site}" style="color:#6b6155">chiefgrowthengineer.com</a><br><br>
        One-off confirmation because you contacted Chief Growth Engineer. One personal reply, no mailing list, no sequence.
      </p>
    </td></tr>

  </table>
</td></tr>
</table>
</div>
HTML;
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

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (rate_limited($ip)) {
    respond(429, ['ok' => false, 'error' => 'Too many messages from this connection. Please wait a bit, or email rob@chiefgrowthengineer.com directly.']);
}

$name    = clean($_POST['name']    ?? '');
$email   = clean($_POST['email']   ?? '');
$company = clean($_POST['company'] ?? '');
$phone   = clean($_POST['phone']   ?? '');
$budget  = clean($_POST['budget']  ?? '');
$message = trim($_POST['message']  ?? ''); // allow line breaks in body

if ($name === '' || $email === '' || $message === '') {
    respond(400, ['ok' => false, 'error' => 'Please fill in your name, email, and message.']);
}

if (mb_strlen($name) > 200 || mb_strlen($company) > 200 || mb_strlen($budget) > 200 || mb_strlen($phone) > 60) {
    respond(400, ['ok' => false, 'error' => 'One of the fields is suspiciously long.']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['ok' => false, 'error' => 'That email address doesn\'t look right.']);
}

if (strlen($message) > 8000) {
    respond(400, ['ok' => false, 'error' => 'Message too long. Please trim it down.']);
}

$isTool   = str_starts_with($budget, 'Tool: ');
$toolName = $isTool ? substr($budget, 6) : '';

// ── 1. Log the lead first — mail can fail, the log must not ──────────
log_lead([
    'when'    => gmdate('c'),
    'name'    => $name,
    'email'   => $email,
    'company' => $company,
    'phone'   => $phone,
    'budget'  => $budget,
    'message' => $message,
    'ip'      => $ip,
]);

// ── 2. Notification to Rob ────────────────────────────────────────────
$subject = SUBJECT_TAG . ' ' . ($company !== '' ? $company . ' — ' : '') . $name;

$ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$ua = preg_replace('/[^[:print:]]/', '', $ua);

$body  = "New enquiry via " . SITE_NAME . "\n";
$body .= "─────────────────────────────────────\n";
$body .= "Name:       $name\n";
$body .= "Email:      $email\n";
$body .= "Company:    " . ($company !== '' ? $company : '—') . "\n";
$body .= "Phone:      " . ($phone   !== '' ? $phone   : '—') . "\n";
$body .= "Engagement: " . ($budget  !== '' ? $budget  : '—') . "\n";
$body .= "─────────────────────────────────────\n";
$body .= "Message:\n\n$message\n";
$body .= "─────────────────────────────────────\n";
$body .= "IP:        $ip\n";
$body .= "UA:        $ua\n";
$body .= "When:      " . gmdate('Y-m-d H:i:s') . " UTC\n";

[$encSubject, $headers, $rawBody] = build_message(
    FROM_EMAIL, SITE_NAME . ' Website',
    TO_EMAIL, 'Rob Louw',
    $subject, $body, null,
    $email, $name          // Reply-To: the sender
);
$notified = deliver(TO_EMAIL, $encSubject, $headers, $rawBody);

if (!$notified) {
    error_log('[CGE] enquiry notification failed for ' . $email . ' (lead IS in cge-leads.jsonl)');
    respond(500, ['ok' => false, 'error' => 'Mail server refused the message. Please email rob@chiefgrowthengineer.com directly.']);
}

// ── 3. Thank-you auto-reply to the sender (best-effort) ──────────────
$replySubject = $isTool
    ? "Your {$toolName} results — and what happens next"
    : 'Got your message — here\'s what happens next';

$replyText  = "Hi " . (explode(' ', $name)[0] ?: 'there') . ",\n\n";
$replyText .= $isTool
    ? "Your {$toolName} results landed in my inbox — a copy is below for your records.\n"
    : "Your message landed in my inbox — a copy is below for your records.\n";
$replyText .= "I read every enquiry myself and reply personally, usually within 24 hours (Mon–Fri, GMT+2).\n\n";
$replyText .= "Want to skip the queue? Book a free 30-minute call:\n" . BOOKING_URL . "\n";
$replyText .= "No pitch if it's not a fit.\n\n";
$replyText .= "───── " . ($isTool ? 'Your results' : 'What you sent') . " ─────\n\n";
$replyText .= $message . "\n\n";
$replyText .= "─────\n— Rob Louw\nFractional Growth Engineer · Cape Town · GMT+2\nrob@chiefgrowthengineer.com · " . SITE_URL . "\n";

[$encReplySubject, $replyHeaders, $replyRaw] = build_message(
    FROM_EMAIL, 'Rob Louw — Chief Growth Engineer',
    $email, $name,
    $replySubject, $replyText, autoreply_html($name, $message, $isTool, $toolName),
    TO_EMAIL, 'Rob Louw',  // replies go to Rob's real inbox
    true                   // Auto-Submitted headers
);
if (!deliver($email, $encReplySubject, $replyHeaders, $replyRaw)) {
    // Not fatal — Rob has the lead; just note the auto-reply failure
    error_log('[CGE] thank-you auto-reply failed for ' . $email);
}

respond(200, ['ok' => true]);
