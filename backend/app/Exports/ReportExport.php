<?php

namespace App\Exports;

use App\Models\Report;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class ReportExport implements FromArray, WithHeadings, WithTitle
{
    protected $data;
    protected $report;

    public function __construct(array $data, Report $report)
    {
        $this->data = $data;
        $this->report = $report;
    }

    public function array(): array
    {
        return $this->data;
    }

    public function headings(): array
    {
        if (empty($this->data)) {
            return [];
        }

        return array_keys($this->data[0]);
    }

    public function title(): string
    {
        return substr($this->report->title, 0, 31); // Excel sheet name limit
    }
}

