<?php

/**
 * Seed demo users for the Authentication module.
 *
 * Mirrors Frontend/src/features/auth/mock/mockUsers.js
 *
 * Usage: php Modules/Authentication/Database/seed.php
 */

require __DIR__ . '/../../../vendor/autoload.php';

use Modules\Authentication\Repositories\UserRepository;

$demoUsers = [
    [
        'username'    => 'admin',
        'email'       => 'admin@elexoplus.com',
        'name'        => 'Harshit Goel',
        'designation' => 'Administrator',
        'role'        => 'ADMIN',
        'status'      => 'System Live',
    ],
    [
        'username'    => 'sakshi.hr',
        'email'       => 'sakshi@elexoplus.com',
        'name'        => 'Sakshi Bansal',
        'designation' => 'HR Manager',
        'role'        => 'HR',
        'status'      => 'System Live',
    ],
    [
        'username'    => 'gaurav.asm',
        'email'       => 'gaurav@elexoplus.com',
        'name'        => 'Gaurav Kumar',
        'designation' => 'Area Sales Manager',
        'role'        => 'ASM',
        'status'      => 'System Live',
    ],
    [
        'username'    => 'nisha.se',
        'email'       => 'nisha@elexoplus.com',
        'name'        => 'Nisha Barnwal',
        'designation' => 'Sales Executive',
        'role'        => 'SALES_EXECUTIVE',
        'status'      => 'System Live',
    ],
    [
        'username'    => 'niyati.se',
        'email'       => 'niyati@elexoplus.com',
        'name'        => 'Niyati Kansal',
        'designation' => 'Sales Executive',
        'role'        => 'SALES_EXECUTIVE',
        'status'      => 'System Live',
    ],
];

$password = 'Elexo@123';
$repo = new UserRepository();

foreach ($demoUsers as $user) {
    if ($repo->findByEmail($user['email'])) {
        echo "Skipped (exists): {$user['email']}\n";
        continue;
    }
    $repo->create(array_merge($user, ['password' => password_hash($password, PASSWORD_BCRYPT)]));
    echo "Created: {$user['email']} / {$password}\n";
}

echo "Done.\n";
