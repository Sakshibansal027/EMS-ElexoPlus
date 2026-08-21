<?php
 
namespace Modules\Leave\Support;
 
class Uuid
{
    /**
     * Generates a random UUID v4 string (e.g. "550e8400-e29b-41d4-a716-446655440000").
     * No composer package (like ramsey/uuid) is installed in this project,
     * so we build one manually from random bytes. This is the standard
     * "roll your own UUID v4" recipe:
     *  - 16 random bytes
     *  - set the 4 bits that mark this as version 4
     *  - set the 2 bits that mark the RFC 4122 variant
     *  - format as 8-4-4-4-12 hex groups
     */
    public static function generate(): string
    {
        $data = random_bytes(16);
 
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40); // version 4
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80); // variant
 
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}