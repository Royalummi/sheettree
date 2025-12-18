<?php

namespace App\Services;

class CaptchaService
{
    /**
     * Verify CAPTCHA response
     */
    public function verifyCaptcha(array $data, string $captchaType, string $secretKey): bool
    {
        switch ($captchaType) {
            case 'recaptcha_v2':
            case 'recaptcha_v3':
                return $this->verifyRecaptcha($data, $secretKey);

            case 'hcaptcha':
                return $this->verifyHcaptcha($data, $secretKey);

            default:
                return false;
        }
    }

    /**
     * Verify Google reCAPTCHA v2/v3
     */
    private function verifyRecaptcha(array $data, string $secretKey): bool
    {
        $captchaResponse = $data['g-recaptcha-response'] ?? '';

        if (empty($captchaResponse)) {
            return false;
        }

        $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
        $postData = [
            'secret' => $secretKey,
            'response' => $captchaResponse
        ];

        $response = $this->makeCaptchaRequest($verifyUrl, $postData);

        if (!$response) {
            return false;
        }

        $result = json_decode($response, true);
        return isset($result['success']) && $result['success'] === true;
    }

    /**
     * Verify hCaptcha
     */
    private function verifyHcaptcha(array $data, string $secretKey): bool
    {
        $captchaResponse = $data['h-captcha-response'] ?? '';

        if (empty($captchaResponse)) {
            return false;
        }

        $verifyUrl = 'https://hcaptcha.com/siteverify';
        $postData = [
            'secret' => $secretKey,
            'response' => $captchaResponse
        ];

        $response = $this->makeCaptchaRequest($verifyUrl, $postData);

        if (!$response) {
            return false;
        }

        $result = json_decode($response, true);
        return isset($result['success']) && $result['success'] === true;
    }

    /**
     * Make HTTP request to CAPTCHA service
     */
    private function makeCaptchaRequest(string $url, array $postData): ?string
    {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/x-www-form-urlencoded',
                'content' => http_build_query($postData),
                'timeout' => 10
            ]
        ]);

        $response = @file_get_contents($url, false, $context);

        return $response !== false ? $response : null;
    }
}
