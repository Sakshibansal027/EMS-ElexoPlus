<?php

namespace Modules\Authentication\Support;

class Jwt
{
    public static function issue(array $claims, ?int $ttl = null): string
    {
        $ttl = $ttl ?? (int) config('jwt.ttl', 3600);
        $now = time();

        $header = self::base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload = array_merge([
            'iss' => config('app.url', 'http://localhost:8000'),
            'iat' => $now,
            'exp' => $now + $ttl,
        ], $claims);

        $payload = self::base64UrlEncode(json_encode($payload));
        $signature = self::base64UrlEncode(self::sign("$header.$payload"));

        return "$header.$payload.$signature";
    }

    public static function parse(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;

        $expected = self::base64UrlEncode(self::sign("$header.$payload"));
        if (!hash_equals($expected, $signature)) {
            return null;
        }

        $claims = json_decode(self::base64UrlDecode($payload), true);
        if (!is_array($claims)) {
            return null;
        }

        if (!isset($claims['exp'], $claims['iat'], $claims['iss']) || !is_numeric($claims['exp']) || !is_numeric($claims['iat'])) {
            return null;
        }

        if (!hash_equals((string) config('app.url', 'http://localhost:8000'), (string) $claims['iss'])) {
            return null;
        }

        if ($claims['exp'] <= time() || $claims['iat'] > time() + 60) {
            return null;
        }

        return $claims;
    }

    private static function sign(string $data): string
    {
        $secret = config('jwt.secret', '');
        if ($secret === '') {
            $secret = config('app.key', 'elexoplus-secret-key');
        }
        return hash_hmac('sha256', $data, $secret, true);
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
