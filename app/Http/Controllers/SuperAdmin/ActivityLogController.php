<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $module = $request->input('module');
        $action = $request->input('action');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $logsQuery = ActivityLog::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('user_name', 'like', "%{search}%")
                      ->orWhere('description', 'like', "%{search}%")
                      ->orWhere('module', 'like', "%{search}%");
                });
            })
            ->when($module, function ($query, $module) {
                $query->where('module', $module);
            })
            ->when($action, function ($query, $action) {
                $query->where('action', $action);
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('create_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy('created_at');
        
        $logs = $logsQuery->paginate(50);

        //Get modules and action for filters
        $modules = ActivityLog::select('module')
            ->distinct()
            ->orderBy('module')
            ->pluck('module');

        $actions = ActivityLog::select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action');

        return Inertia::render('SuperAdmin/ActivityLogs/Index', [
            'logs' => $logs,
            'modules' => $modules,
            'actions' => $actions,
            'filters' => [
                'search' => $search,
                'module' => $module,
                'action' => $action,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    public function show($id)
    {
        $log = ActivityLog::findOrFail($id);

        return Inertia::render('SuperAdmin/ActivityLogs/Show', [
            'log' => $log,
        ]);
    }
}
