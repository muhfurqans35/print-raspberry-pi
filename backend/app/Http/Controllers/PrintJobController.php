<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PrintJob;

class PrintJobController extends Controller
{
    public function Index()
    {
        return PrintJob::all();
    }
}
