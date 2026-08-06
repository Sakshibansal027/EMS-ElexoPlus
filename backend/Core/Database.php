<?php

namespace Core;

use PDO;

class Database
{
    private static ?PDO $instance = null;

    public static function connection(): PDO
    {
        if (self::$instance === null) {
            $db = config('database');
            $dsn = sprintf('%s:host=%s;port=%s;dbname=%s;charset=utf8mb4',
                $db['driver'] ?? 'mysql',
                $db['host'] ?? '127.0.0.1',
                $db['port'] ?? '3306',
                $db['name'] ?? 'u364819982_ems'
            );
            self::$instance = new PDO($dsn, $db['user'] ?? 'root', $db['pass'] ?? '', [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        }
        return self::$instance;
    }
}
