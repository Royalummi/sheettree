<?php

namespace Tests\Unit;

use App\Models\Form;
use App\Models\User;
use App\Models\FormSubmission;
use PHPUnit\Framework\TestCase as PHPUnitTestCase;

class FormModelTest extends PHPUnitTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        require_once __DIR__ . '/../bootstrap.php';
    }

    public function testFormCanBeCreated()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'google_id' => 'google_test',
        ]);

        $form = Form::create([
            'user_id' => $user->id,
            'title' => 'Contact Form',
            'description' => 'A simple contact form',
            'fields' => json_encode([
                ['type' => 'text', 'label' => 'Name', 'required' => true],
                ['type' => 'email', 'label' => 'Email', 'required' => true],
            ]),
            'is_active' => true,
            'is_public' => true,
        ]);

        $this->assertInstanceOf(Form::class, $form);
        $this->assertEquals('Contact Form', $form->title);
        $this->assertTrue($form->is_active);
        $this->assertTrue($form->is_public);
    }

    public function testFormBelongsToUser()
    {
        $user = User::create([
            'name' => 'Form Owner',
            'email' => 'owner@example.com',
            'google_id' => 'google_owner',
        ]);

        $form = Form::create([
            'user_id' => $user->id,
            'title' => 'Test Form',
            'description' => 'Test',
            'fields' => json_encode([]),
            'is_active' => true,
        ]);

        $this->assertInstanceOf(User::class, $form->user);
        $this->assertEquals($user->id, $form->user->id);
    }

    public function testFormHasSubmissions()
    {
        $user = User::create([
            'name' => 'User',
            'email' => 'user@example.com',
            'google_id' => 'google_user',
        ]);

        $form = Form::create([
            'user_id' => $user->id,
            'title' => 'Survey',
            'description' => 'Test Survey',
            'fields' => json_encode([]),
            'is_active' => true,
        ]);

        $submission = FormSubmission::create([
            'form_id' => $form->id,
            'data' => json_encode(['name' => 'John', 'email' => 'john@test.com']),
            'submitted_at' => date('Y-m-d H:i:s'),
        ]);

        $this->assertCount(1, $form->submissions);
        $this->assertEquals($submission->id, $form->submissions->first()->id);
    }

    public function testFormFieldsAreJsonCasted()
    {
        $user = User::create([
            'name' => 'User',
            'email' => 'json@example.com',
            'google_id' => 'google_json',
        ]);

        $fields = [
            ['type' => 'text', 'label' => 'Name'],
            ['type' => 'email', 'label' => 'Email'],
        ];

        $form = Form::create([
            'user_id' => $user->id,
            'title' => 'Form with JSON',
            'description' => 'Test',
            'fields' => $fields,
            'is_active' => true,
        ]);

        $this->assertIsArray($form->fields);
        $this->assertCount(2, $form->fields);
        $this->assertEquals('text', $form->fields[0]['type']);
    }

    public function testFormRequiresUserId()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        Form::create([
            'title' => 'Invalid Form',
            'description' => 'Missing user_id',
            'fields' => json_encode([]),
            'is_active' => true,
        ]);
    }
}
