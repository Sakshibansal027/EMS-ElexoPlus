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

                if (is_callable($handler)) {
                    $result = $handler($params);
                } else {
                    [$class, $action] = $handler;
                    $controller = new $class();
                    $result = $controller->$action($params);
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
