<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Supprt\Facades\Auth;

trait LogsActivity
{
    /**
     * Log an activity
     */
    protected function logActivity(
        string $action,
        string $module,
        $recordId = null,
        string $description = null,
        array $oldValues = null,
        array $newValues = null
    ) {
        $user = Auth::user();

        ActivityLog::create([
            'user_name' => $user ? ($user->name ?? $user->email) : 'System',
            'user_id' => $user ? $user->id : null,
            'action' => $action,
            'module' => $module,
            'record_id' => $recordId,
            'description' =>$description,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => reques()->ip(),
            'created_at' => now(),
        ]);
    }
    
}