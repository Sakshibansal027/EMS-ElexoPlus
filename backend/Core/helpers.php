<?php

if (!function_exists('env')) {
    function env(string $key, mixed $default = null): mixed
    {
        static $loaded = false;
        if (!$loaded) {
            $file = __DIR__ . '/../.env';
            if (file_exists($file)) {
                foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                    $line = trim($line);
                    if ($line === '' || str_starts_with($line, '#')) continue;
                    [$name, $value] = explode('=', $line, 2);
                    $_ENV[trim($name)] = trim(trim($value), '"\'');
                }
            }
            $loaded = true;
        }
        return $_ENV[$key] ?? $default;
    }
}

if (!function_exists('config')) {
    function config(string $key, mixed $default = null): mixed
    {
        static $config = [];
        if (empty($config)) {
            $file = __DIR__ . '/../config/app.php';
            if (file_exists($file)) {
                $config = require $file;
            }
        }
        $parts = explode('.', $key);
        $value = $config;
        foreach ($parts as $part) {
            if (is_array($value) && array_key_exists($part, $value)) {
                $value = $value[$part];
            } else {
                return $default;
            }
        }
        return $value;
    }
}

if (!function_exists('json')) {
    function json(mixed $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }
}

if (!function_exists('db')) {
    function db(): \PDO
    {
        return \Core\Database::connection();
    }
}
