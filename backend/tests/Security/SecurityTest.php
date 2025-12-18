<?php

namespace Tests\Security;

use App\Security\Sanitizer;
use App\Security\CaptchaValidator;
use App\Security\RequestSigning;
use App\Middleware\CsrfMiddleware;

class SecurityTest extends \TestCase
{
    /**
     * Test XSS Detection
     */
    public function testXssDetection()
    {
        $xssAttempts = [
            '<script>alert("XSS")</script>',
            '<img src=x onerror=alert("XSS")>',
            'javascript:alert("XSS")',
            '<iframe src="malicious.com"></iframe>',
            'onclick="malicious()"',
        ];

        foreach ($xssAttempts as $attempt) {
            $this->assertTrue(
                Sanitizer::detectXss($attempt),
                "Failed to detect XSS: $attempt"
            );
        }
    }

    /**
     * Test XSS Prevention
     */
    public function testXssPrevention()
    {
        $maliciousInput = '<script>alert("XSS")</script>';
        $sanitized = Sanitizer::sanitizeString($maliciousInput);

        $this->assertStringNotContainsString('<script>', $sanitized);
        $this->assertStringNotContainsString('alert', $sanitized);
    }

    /**
     * Test SQL Injection Detection
     */
    public function testSqlInjectionDetection()
    {
        $sqlAttempts = [
            "' OR '1'='1",
            "admin'--",
            "1; DROP TABLE users",
            "' UNION SELECT * FROM users--",
            "1' AND 1=1--",
        ];

        foreach ($sqlAttempts as $attempt) {
            $this->assertTrue(
                Sanitizer::detectSqlInjection($attempt),
                "Failed to detect SQL injection: $attempt"
            );
        }
    }

    /**
     * Test Email Sanitization
     */
    public function testEmailSanitization()
    {
        $maliciousEmail = 'test@example.com<script>alert()</script>';
        $sanitized = Sanitizer::sanitizeEmail($maliciousEmail);

        $this->assertStringNotContainsString('<script>', $sanitized);
        $this->assertEquals('test@example.com', $sanitized);
    }

    /**
     * Test URL Sanitization
     */
    public function testUrlSanitization()
    {
        $maliciousUrl = 'javascript:alert("XSS")';
        $sanitized = Sanitizer::sanitizeUrl($maliciousUrl);

        $this->assertStringNotContainsString('javascript:', $sanitized);
    }

    /**
     * Test Filename Sanitization
     */
    public function testFilenameSanitization()
    {
        $maliciousFilenames = [
            '../../../etc/passwd',
            'test<script>.txt',
            'file|name.txt',
            'test*.php',
        ];

        foreach ($maliciousFilenames as $filename) {
            $sanitized = Sanitizer::sanitizeFilename($filename);
            $this->assertStringNotContainsString('..', $sanitized);
            $this->assertStringNotContainsString('/', $sanitized);
            $this->assertStringNotContainsString('<', $sanitized);
        }
    }

    /**
     * Test Array Sanitization
     */
    public function testArraySanitization()
    {
        $maliciousArray = [
            'name' => 'John<script>alert()</script>',
            'email' => 'test@example.com',
            'nested' => [
                'value' => '<img src=x onerror=alert()>',
            ],
        ];

        $sanitized = Sanitizer::sanitizeArray($maliciousArray);

        $this->assertStringNotContainsString('<script>', $sanitized['name']);
        $this->assertStringNotContainsString('<img', $sanitized['nested']['value']);
    }

    /**
     * Test Honeypot Validation
     */
    public function testHoneypotValidation()
    {
        // Legitimate submission (honeypot empty)
        $legitimateData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'website' => '', // Honeypot field
        ];

        $this->assertTrue(CaptchaValidator::validateHoneypot($legitimateData));

        // Bot submission (honeypot filled)
        $botData = [
            'name' => 'Bot',
            'email' => 'bot@spam.com',
            'website' => 'http://spam.com', // Honeypot filled
        ];

        $this->assertFalse(CaptchaValidator::validateHoneypot($botData));
    }

    /**
     * Test Form Timing Validation
     */
    public function testFormTimingValidation()
    {
        $currentTime = time();

        // Too fast (likely bot)
        $tooFast = $currentTime - 1;
        $this->assertFalse(CaptchaValidator::validateFormTiming($tooFast));

        // Normal timing
        $normal = $currentTime - 10;
        $this->assertTrue(CaptchaValidator::validateFormTiming($normal));

        // Too old (possible replay)
        $tooOld = $currentTime - 7200;
        $this->assertFalse(CaptchaValidator::validateFormTiming($tooOld));
    }

    /**
     * Test Request Signing
     */
    public function testRequestSigning()
    {
        $signer = new RequestSigning('test-secret-key');

        $payload = [
            'form_id' => 123,
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ];

        // Sign request
        $signature = $signer->signRequest($payload);

        $this->assertNotEmpty($signature);
        $this->assertIsString($signature);

        // Verify valid signature
        $this->assertTrue($signer->verifyRequest($payload, $signature));

        // Verify invalid signature
        $this->assertFalse($signer->verifyRequest($payload, 'invalid-signature'));

        // Verify tampered payload
        $tamperedPayload = $payload;
        $tamperedPayload['email'] = 'hacker@malicious.com';
        $this->assertFalse($signer->verifyRequest($tamperedPayload, $signature));
    }

    /**
     * Test CSRF Token Generation
     */
    public function testCsrfTokenGeneration()
    {
        $token1 = CsrfMiddleware::generateToken();
        $token2 = CsrfMiddleware::getToken();

        $this->assertNotEmpty($token1);
        $this->assertIsString($token1);
        $this->assertEquals(64, strlen($token1)); // 32 bytes = 64 hex chars
        $this->assertEquals($token1, $token2); // Same token in session
    }

    /**
     * Test Webhook Signature
     */
    public function testWebhookSignature()
    {
        $signer = new RequestSigning('webhook-secret');

        $payload = json_encode([
            'event' => 'form.submitted',
            'form_id' => 123,
            'data' => ['name' => 'John'],
        ]);

        $signature = $signer->generateWebhookSignature($payload, 'webhook-secret');

        $this->assertNotEmpty($signature);
        $this->assertTrue($signer->verifyWebhookSignature($payload, $signature, 'webhook-secret'));
        $this->assertFalse($signer->verifyWebhookSignature($payload, $signature, 'wrong-secret'));
    }

    /**
     * Test Signed URL Creation and Verification
     */
    public function testSignedUrl()
    {
        $signer = new RequestSigning('url-secret');

        $url = 'https://example.com/download?file=document.pdf';
        $signedUrl = $signer->createSignedUrl($url, 3600);

        $this->assertNotEmpty($signedUrl);
        $this->assertStringContainsString('signature=', $signedUrl);
        $this->assertStringContainsString('expires=', $signedUrl);

        // Verify valid signed URL
        $this->assertTrue($signer->verifySignedUrl($signedUrl));

        // Verify tampered URL
        $tamperedUrl = str_replace('document.pdf', 'secret.pdf', $signedUrl);
        $this->assertFalse($signer->verifySignedUrl($tamperedUrl));
    }

    /**
     * Test JSON Sanitization
     */
    public function testJsonSanitization()
    {
        $maliciousJson = json_encode([
            'name' => 'John<script>alert()</script>',
            'email' => 'test@example.com',
        ]);

        $sanitized = Sanitizer::sanitizeJson($maliciousJson);

        $this->assertIsArray($sanitized);
        $this->assertStringNotContainsString('<script>', $sanitized['name']);
    }

    /**
     * Test HTML Attribute Sanitization
     */
    public function testAttributeSanitization()
    {
        $maliciousAttributes = [
            'class' => 'btn-primary',
            'id' => 'submit-btn',
            'onclick' => 'malicious()', // Should be removed
            'data-value' => 'test<script>',
        ];

        $sanitized = Sanitizer::sanitizeAttributes($maliciousAttributes);

        $this->assertArrayHasKey('class', $sanitized);
        $this->assertArrayHasKey('id', $sanitized);
        $this->assertArrayNotHasKey('onclick', $sanitized); // Dangerous attribute removed
        $this->assertStringNotContainsString('<script>', $sanitized['data-value']);
    }

    /**
     * Test Multiple Security Layers
     */
    public function testMultipleSecurityLayers()
    {
        $maliciousInput = '<script>alert("XSS")</script>\' OR \'1\'=\'1';

        // Layer 1: XSS Detection
        $this->assertTrue(Sanitizer::detectXss($maliciousInput));

        // Layer 2: SQL Injection Detection
        $this->assertTrue(Sanitizer::detectSqlInjection($maliciousInput));

        // Layer 3: Sanitization
        $sanitized = Sanitizer::sanitizeString($maliciousInput);
        $this->assertStringNotContainsString('<script>', $sanitized);
        $this->assertStringNotContainsString('alert', $sanitized);
    }

    /**
     * Test Safe HTML Allowance
     */
    public function testSafeHtmlAllowance()
    {
        $htmlInput = '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>';
        $sanitized = Sanitizer::sanitizeString($htmlInput, true);

        // Should keep safe tags
        $this->assertStringContainsString('<p>', $sanitized);
        $this->assertStringContainsString('<strong>', $sanitized);
        $this->assertStringContainsString('<em>', $sanitized);

        // But remove dangerous content
        $dangerousHtml = '<p>Text</p><script>alert()</script>';
        $sanitized = Sanitizer::sanitizeString($dangerousHtml, true);
        $this->assertStringNotContainsString('<script>', $sanitized);
    }
}
