<?php
/**
 * Receives the contact-form lead and sends it by email via Resend.
 * Config comes from real environment variables (set them in cPanel's
 * "Environment Variables" / PHP config) or, if the host doesn't expose
 * those, from a local .env file next to this script (KEY=value per
 * line) — that file is gitignored and must never be committed.
 */

declare(strict_types=1);

function send_contact_load_local_env($path)
{
    if (!is_readable($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || substr($line, 0, 1) === '#' || strpos($line, '=') === false) {
            continue;
        }
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, " \t\n\r\0\x0B\"'");
        if ($key !== '' && getenv($key) === false) {
            putenv($key . '=' . $value);
        }
    }
}

send_contact_load_local_env(__DIR__ . '/.env');

function send_contact_env($key, $default = '')
{
    $value = getenv($key);
    return ($value === false || $value === '') ? $default : $value;
}

function send_contact_esc($s)
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('ok' => false, 'error' => 'method_not_allowed'));
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

$name = trim((string) (isset($data['name']) ? $data['name'] : ''));
$phone = trim((string) (isset($data['phone']) ? $data['phone'] : ''));
$email = trim((string) (isset($data['email']) ? $data['email'] : ''));
$interest = trim((string) (isset($data['interest']) ? $data['interest'] : ''));
$message = trim((string) (isset($data['message']) ? $data['message'] : ''));

if ($name === '' || $phone === '') {
    http_response_code(422);
    echo json_encode(array('ok' => false, 'error' => 'missing_required_fields'));
    exit;
}

$apiKey = send_contact_env('RESEND_API_KEY');
if ($apiKey === '') {
    http_response_code(500);
    echo json_encode(array('ok' => false, 'error' => 'server_not_configured'));
    exit;
}

$from = send_contact_env('RESEND_FROM', 'האתר של דורון בן ארבון <onboarding@resend.dev>');
$to = send_contact_env('RESEND_TO', 'bayazamut@gmail.com');

$rows = array(
    'שם' => $name,
    'טלפון' => $phone,
    'אימייל' => $email !== '' ? $email : '-',
    'תחום עניין' => $interest !== '' ? $interest : '-',
    'הודעה' => $message !== '' ? $message : '-',
);

$htmlRows = '';
$text = "פנייה חדשה מהאתר\n\n";
foreach ($rows as $label => $value) {
    $htmlRows .= '<tr><td style="padding:4px 12px 4px 0;color:#666;white-space:nowrap">' . send_contact_esc($label) . '</td><td style="padding:4px 0">' . nl2br(send_contact_esc($value)) . '</td></tr>';
    $text .= $label . ': ' . $value . "\n";
}

$html = '<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;color:#111"><h2 style="margin:0 0 12px">פנייה חדשה מהאתר</h2><table>' . $htmlRows . '</table></div>';

$emailPayload = array(
    'from' => $from,
    'to' => array($to),
    'subject' => 'פנייה חדשה מהאתר - ' . $name,
    'html' => $html,
    'text' => $text,
);
if ($email !== '') {
    $emailPayload['reply_to'] = $email;
}

$payload = json_encode($emailPayload, JSON_UNESCAPED_UNICODE);

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, array(
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => array(
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ),
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_TIMEOUT => 15,
));
$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $status < 200 || $status >= 300) {
    http_response_code(502);
    echo json_encode(array('ok' => false, 'error' => 'resend_failed'));
    exit;
}

echo json_encode(array('ok' => true));
