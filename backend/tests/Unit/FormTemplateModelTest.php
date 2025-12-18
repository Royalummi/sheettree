<?php

namespace Tests\Unit;

use App\Models\FormTemplate;
use PHPUnit\Framework\TestCase as PHPUnitTestCase;

class FormTemplateModelTest extends PHPUnitTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        require_once __DIR__ . '/../bootstrap.php';
    }

    public function testTemplateCanBeCreated()
    {
        $template = FormTemplate::create([
            'name' => 'Contact Form Template',
            'description' => 'Basic contact form',
            'category' => 'contact',
            'icon' => 'MessageSquare',
            'fields' => json_encode([
                ['type' => 'text', 'label' => 'Name', 'required' => true],
                ['type' => 'email', 'label' => 'Email', 'required' => true],
            ]),
            'settings' => json_encode(['submitButtonText' => 'Send']),
            'is_active' => true,
            'usage_count' => 0,
        ]);

        $this->assertInstanceOf(FormTemplate::class, $template);
        $this->assertEquals('Contact Form Template', $template->name);
        $this->assertEquals('contact', $template->category);
        $this->assertTrue($template->is_active);
    }

    public function testActiveScope()
    {
        FormTemplate::create([
            'name' => 'Active Template',
            'description' => 'Active',
            'category' => 'general',
            'icon' => 'FileText',
            'fields' => json_encode([]),
            'is_active' => true,
        ]);

        FormTemplate::create([
            'name' => 'Inactive Template',
            'description' => 'Inactive',
            'category' => 'general',
            'icon' => 'FileText',
            'fields' => json_encode([]),
            'is_active' => false,
        ]);

        $activeTemplates = FormTemplate::active()->get();
        $this->assertCount(1, $activeTemplates);
        $this->assertEquals('Active Template', $activeTemplates->first()->name);
    }

    public function testByCategoryScope()
    {
        FormTemplate::create([
            'name' => 'Contact Template',
            'description' => 'Contact',
            'category' => 'contact',
            'icon' => 'MessageSquare',
            'fields' => json_encode([]),
            'is_active' => true,
        ]);

        FormTemplate::create([
            'name' => 'Survey Template',
            'description' => 'Survey',
            'category' => 'survey',
            'icon' => 'BarChart3',
            'fields' => json_encode([]),
            'is_active' => true,
        ]);

        $contactTemplates = FormTemplate::byCategory('contact')->get();
        $this->assertCount(1, $contactTemplates);
        $this->assertEquals('Contact Template', $contactTemplates->first()->name);
    }

    public function testPopularScope()
    {
        $template1 = FormTemplate::create([
            'name' => 'Popular Template',
            'description' => 'Popular',
            'category' => 'general',
            'icon' => 'Sparkles',
            'fields' => json_encode([]),
            'is_active' => true,
            'usage_count' => 100,
        ]);

        $template2 = FormTemplate::create([
            'name' => 'Less Popular Template',
            'description' => 'Less Popular',
            'category' => 'general',
            'icon' => 'FileText',
            'fields' => json_encode([]),
            'is_active' => true,
            'usage_count' => 10,
        ]);

        $popularTemplates = FormTemplate::popular()->get();
        $this->assertEquals('Popular Template', $popularTemplates->first()->name);
        $this->assertEquals(100, $popularTemplates->first()->usage_count);
    }

    public function testIncrementUsage()
    {
        $template = FormTemplate::create([
            'name' => 'Test Template',
            'description' => 'Test',
            'category' => 'general',
            'icon' => 'FileText',
            'fields' => json_encode([]),
            'is_active' => true,
            'usage_count' => 0,
        ]);

        $this->assertEquals(0, $template->usage_count);

        $template->incrementUsage();
        $template->refresh();

        $this->assertEquals(1, $template->usage_count);

        $template->incrementUsage();
        $template->refresh();

        $this->assertEquals(2, $template->usage_count);
    }

    public function testFieldsAndSettingsAreJsonCasted()
    {
        $fields = [
            ['type' => 'text', 'label' => 'Name'],
            ['type' => 'email', 'label' => 'Email'],
        ];

        $settings = [
            'submitButtonText' => 'Submit',
            'successMessage' => 'Thank you!',
        ];

        $template = FormTemplate::create([
            'name' => 'JSON Test Template',
            'description' => 'Test',
            'category' => 'general',
            'icon' => 'FileText',
            'fields' => $fields,
            'settings' => $settings,
            'is_active' => true,
        ]);

        $this->assertIsArray($template->fields);
        $this->assertIsArray($template->settings);
        $this->assertEquals('Submit', $template->settings['submitButtonText']);
        $this->assertCount(2, $template->fields);
    }
}
