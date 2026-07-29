<?php

use Core\Router;

date_default_timezone_set(config('timezone'));

if (config('debug')) {
    ini_set('display_errors', '1');
    error_reporting(E_ALL);
}

$origins = config('cors', ['*']);
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
if (in_array('*', $origins) || in_array($origin, $origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

foreach (glob(__DIR__ . '/../Modules/*/Routes/*.php') as $file) {
    require $file;
}

Router::dispatch();
