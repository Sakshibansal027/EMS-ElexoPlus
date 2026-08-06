<?php

namespace Modules\Authentication\Support;

class Request
{
    public static function all(): array
    {
        $body = file_get_contents('php://input');
        $json = $body ? json_decode($body, true) : null;

        return array_merge($_GET, $_POST, is_array($json) ? $json : []);
    }

    public static function input(string $key, mixed $default = null): mixed
    {
        $data = self::all();
        return $data[$key] ?? $default;
    }

    public static function bearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(\S+)/i', $header, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
