<?php
// Temporary redirect to public folder for testing
// This file should be uploaded to: public_html/sheets/backend/index.php

// Check if public/index.php exists
if (file_exists('public/index.php')) {
    // Redirect to public folder
    header('Location: public/');
    exit;
} else {
    // Show diagnostic information
    echo "Backend folder accessed successfully!<br>";
    echo "Looking for: public/index.php<br>";
    echo "Current directory: " . __DIR__ . "<br>";
    echo "Files in current directory:<br>";

    $files = scandir(__DIR__);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            echo "- " . $file . "<br>";
        }
    }
}
