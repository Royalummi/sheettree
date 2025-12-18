<?php

/**
 * API Gateway - Routes requests to Slim Framework
 * Handles requests in format: /api.php?path=endpoint/path
 */

// Get the requested path from query parameter
$path = $_GET['path'] ?? '';

// Remove api.php from the path if it exists
$path = str_replace('api.php', '', $path);
$path = ltrim($path, '/');

// Store the original REQUEST_URI
$_SERVER['ORIGINAL_REQUEST_URI'] = $_SERVER['REQUEST_URI'];

// Rewrite the REQUEST_URI to the actual path for Slim
$_SERVER['REQUEST_URI'] = '/' . $path;

// Add query string if exists (excluding the path parameter)
$queryParams = $_GET;
unset($queryParams['path']);
if (!empty($queryParams)) {
    $_SERVER['REQUEST_URI'] .= '?' . http_build_query($queryParams);
}

// Include the main Slim application
require __DIR__ . '/index.php';
