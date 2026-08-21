<?php

/**
 * Lightweight fallback for local development when Composer's generated
 * vendor/autoload.php has not been installed yet. Composer remains preferred
 * whenever it is available.
 */
spl_autoload_register(function (string $class): void {
    foreach (['Core\\' => __DIR__ . '/../Core/', 'Modules\\' => __DIR__ . '/../Modules/'] as $prefix => $basePath) {
        if (!str_starts_with($class, $prefix)) continue;

        $relative = substr($class, strlen($prefix));
        $file = $basePath . str_replace('\\', '/', $relative) . '.php';
        if (file_exists($file)) require_once $file;
        return;
    }
});

require_once __DIR__ . '/../Core/helpers.php';
