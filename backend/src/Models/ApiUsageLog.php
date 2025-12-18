<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $form_api_config_id
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property string|null $origin
 * @property string|null $request_method
 * @property string|null $endpoint
 * @property int|null $response_status
 * @property string|null $error_message
 * @property \DateTime $created_at
 * @property-read FormApiConfig $apiConfig
 */
class ApiUsageLog extends Model
{
    protected $table = 'api_usage_logs';

    protected $fillable = [
        'form_api_config_id',
        'ip_address',
        'user_agent',
        'origin',
        'request_method',
        'endpoint',
        'response_status',
        'error_message',
        'created_at'
    ];

    public $timestamps = false; // We handle created_at manually

    /**
     * Get the API config that owns this log
     */
    public function apiConfig()
    {
        return $this->belongsTo(FormApiConfig::class, 'form_api_config_id');
    }

    /**
     * Log API usage
     */
    public static function logUsage($apiConfigId, $request, $responseStatus, $errorMessage = null)
    {
        return static::create([
            'form_api_config_id' => $apiConfigId,
            'ip_address' => $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $request->getHeaderLine('User-Agent'),
            'origin' => $request->getHeaderLine('Origin'),
            'request_method' => $request->getMethod(),
            'endpoint' => $request->getUri()->getPath(),
            'response_status' => $responseStatus,
            'error_message' => $errorMessage,
            'created_at' => date('Y-m-d H:i:s')
        ]);
    }

    /**
     * Get usage statistics for an API
     */
    public static function getUsageStats($apiConfigId, $days = 30)
    {
        $startDate = date('Y-m-d H:i:s', strtotime("-{$days} days"));

        return static::where('form_api_config_id', $apiConfigId)
            ->where('created_at', '>=', $startDate)
            ->selectRaw('
                DATE(created_at) as date,
                COUNT(*) as total_requests,
                SUM(CASE WHEN response_status = 200 THEN 1 ELSE 0 END) as successful_requests,
                SUM(CASE WHEN response_status >= 400 THEN 1 ELSE 0 END) as failed_requests
            ')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();
    }
}
