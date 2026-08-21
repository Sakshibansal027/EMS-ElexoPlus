<?php

$composerAutoload = __DIR__ . '/../vendor/autoload.php';
require_once file_exists($composerAutoload)
    ? $composerAutoload
    : __DIR__ . '/../bootstrap/autoload.php';
require_once __DIR__ . '/../bootstrap/app.php';
