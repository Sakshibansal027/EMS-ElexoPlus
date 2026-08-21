<?php

namespace Modules\Dashboard\Support;

class DateRange
{
    public function __construct(public readonly string $from, public readonly string $to) {}

    public static function currentMonth(): self
    {
        return new self(date('Y-m-01'), date('Y-m-t'));
    }

    public function months(int $count = 6): array
    {
        $months = [];
        $cursor = new \DateTimeImmutable(date('Y-m-01'));
        for ($index = $count - 1; $index >= 0; $index--) {
            $month = $cursor->modify("-{$index} months");
            $months[] = ['label' => $month->format('M'), 'from' => $month->format('Y-m-01'), 'to' => $month->format('Y-m-t')];
        }
        return $months;
    }
}
