<?php

namespace Core;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailerException;

class Mailer
{
    public static function send(string $to, string $subject, string $body, string $altBody = ''): void
    {
        $config = config('mail', []);
        $driver = $config['driver'] ?? 'log';

        if ($driver === 'log') {
            self::log($to, $subject);
            return;
        }

        $host = $config['host'] ?? '';
        $username = $config['username'] ?? '';

        if (empty($host) || empty($username)) {
            self::log($to, $subject);
            return;
        }

        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host       = $host;
            $mail->SMTPAuth   = true;
            $mail->Username   = $username;
            $mail->Password   = $config['password'] ?? '';
            $mail->SMTPSecure = $config['encryption'] ?? PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = (int) ($config['port'] ?? 587);

            $from = $config['from'] ?? ['address' => 'noreply@elexoplus.com', 'name' => 'EMS ElexoPlus'];
            $mail->setFrom($from['address'] ?? 'noreply@elexoplus.com', $from['name'] ?? 'EMS ElexoPlus');
            $mail->addAddress($to);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;
            $mail->AltBody = $altBody !== '' ? $altBody : strip_tags($body);

            $mail->send();
        } catch (MailerException $e) {
            self::log($to, $subject);
            error_log('[ElexoPlus] Mailer error: ' . $e->getMessage());
        }
    }

    private static function log(string $to, string $subject): void
    {
        // Never log mail body: reset links contain one-time credentials.
        $line = '[' . date('Y-m-d H:i:s') . "] To: {$to} | Subject: {$subject}";
        $logDir = __DIR__ . '/../storage/logs';

        if (!is_dir($logDir)) {
            mkdir($logDir, 0777, true);
        }

        file_put_contents($logDir . '/mail.log', $line . PHP_EOL, FILE_APPEND);
        error_log('[ElexoPlus] [mail-log] ' . $line);
    }
}
