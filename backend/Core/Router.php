<?php

namespace Core;

class Router
{
    private static array $routes = [];
    private static string $prefix = '';

    public static function get(string $uri, callable|array $handler): void
    {
        self::add('GET', $uri, $handler);
    }

    public static function post(string $uri, callable|array $handler): void
    {
        self::add('POST', $uri, $handler);
    }

    public static function put(string $uri, callable|array $handler): void
    {
        self::add('PUT', $uri, $handler);
    }

    public static function patch(string $uri, callable|array $handler): void
    {
        self::add('PATCH', $uri, $handler);
    }

    public static function delete(string $uri, callable|array $handler): void
    {
        self::add('DELETE', $uri, $handler);
    }

    public static function group(string $prefix, \Closure $callback): void
    {
        $prev = self::$prefix;
        self::$prefix .= '/' . trim($prefix, '/');
        self::$prefix = rtrim(self::$prefix, '/');
        $callback();
        self::$prefix = $prev;
    }

    private static function add(string $method, string $uri, callable|array $handler): void
    {
        $uri = self::$prefix . '/' . trim($uri, '/');
        $uri = rtrim($uri, '/') ?: '/';
        self::$routes[$method][] = ['uri' => $uri, 'handler' => $handler];
    }

    public static function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = rtrim($uri, '/') ?: '/';

        $routes = self::$routes[$method] ?? [];

        foreach ($routes as $route) {
            $pattern = preg_replace('/\{(\w+)\}/', '(?P<$1>[^/]+)', $route['uri']);
            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $uri, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                $handler = $route['handler'];

                try {
                    // PHP's development server keeps static state alive. Do
                    // not reuse an idle remote-MySQL connection from a prior
                    // HTTP request; reconnect once at the request boundary.
                    Database::reset();
                    if (is_callable($handler)) {
                        $result = $handler($params);
                    } else {
                        [$class, $action] = $handler;
                        $controller = new $class();
                        $result = $controller->$action($params);
                    }
                } catch (\Throwable $exception) {
                    // Never expose database hosts, paths, SQL, or stack traces
                    // to browser clients. Server logs retain the diagnostic.
                    error_log(sprintf('API %s %s failed: %s', $method, $uri, $exception->getMessage()));
                    $logDirectory = __DIR__ . '/../storage/logs';
                    if (!is_dir($logDirectory)) @mkdir($logDirectory, 0755, true);
                    @file_put_contents(
                        $logDirectory . '/api-errors.log',
                        sprintf("[%s] API %s %s failed: %s\n", date('c'), $method, $uri, $exception->getMessage()),
                        FILE_APPEND | LOCK_EX
                    );
                    json(['success' => false, 'message' => 'The request could not be completed. Please try again.'], 500);
                    return;
                }

                if (is_array($result)) {
                    $status = (int) ($result['status'] ?? 200);
                    unset($result['status']);
                    json($result, $status);
                } elseif (is_string($result)) {
                    echo $result;
                }
                return;
            }
        }

        json(['success' => false, 'message' => 'Not found'], 404);
    }
}
