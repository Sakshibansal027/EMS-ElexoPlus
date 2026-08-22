<?php

return [
    'name'       => env('APP_NAME', 'EMS ElexoPlus'),
    'debug'      => filter_var(env('APP_DEBUG', false), FILTER_VALIDATE_BOOLEAN),
    'url'        => env('APP_URL', 'http://localhost:8000'),
    'frontend_url' => rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/'),
    'timezone'   => env('APP_TIMEZONE', 'UTC'),

    'database'   => [
        'driver' => env('DB_DRIVER', 'mysql'),
        'host'   => env('DB_HOST', '127.0.0.1'),
        'port'   => env('DB_PORT', '3306'),
        'name'   => env('DB_DATABASE', 'ems_elexoplus'),
        'user'   => env('DB_USERNAME', 'root'),
        'pass'   => env('DB_PASSWORD', ''),
        'prefix' => env('DB_PREFIX', ''),
    ],

    'mail'       => [
        'driver'    => env('MAIL_DRIVER', 'log'),
        'host'      => env('MAIL_HOST', 'smtp.mailtrap.io'),
        'port'      => (int) env('MAIL_PORT', 2525),
        'username'  => env('MAIL_USERNAME', ''),
        'password'  => env('MAIL_PASSWORD', ''),
        'encryption'=> env('MAIL_ENCRYPTION', 'tls'),
        'from'      => [
            'address' => env('MAIL_FROM_ADDRESS', 'noreply@elexoplus.com'),
            'name'    => env('MAIL_FROM_NAME', 'EMS ElexoPlus'),
        ],
    ],

    'jwt'        => [
        'secret'      => env('JWT_SECRET', ''),
        'ttl'         => (int) env('JWT_TTL', 3600),
        'refresh_ttl' => (int) env('JWT_REFRESH_TTL', 604800),
    ],

    'upload'     => [
        'max_size' => (int) env('MAX_UPLOAD_SIZE', 10485760),
        'path'     => __DIR__ . '/../storage/uploads',
    ],

    'cors'       => explode(',', env('ALLOWED_ORIGINS', '*')),
    'per_page'   => (int) env('PAGINATION_PER_PAGE', 15),
];
