<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Form;
use App\Models\FormTemplate;
use PHPUnit\Framework\TestCase as PHPUnitTestCase;

class UserModelTest extends PHPUnitTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        require_once __DIR__ . '/../bootstrap.php';
    }

    public function testUserCanBeCreated()
    {
        $user = User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'google_id' => 'google_123',
            'avatar' => 'https://example.com/avatar.jpg',
        ]);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->name);
        $this->assertEquals('john@example.com', $user->email);
        $this->assertEquals('google_123', $user->google_id);
    }

    public function testUserHasFormsRelationship()
    {
        $user = User::create([
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'google_id' => 'google_456',
        ]);

        $form = Form::create([
            'user_id' => $user->id,
            'title' => 'Test Form',
            'description' => 'Test Description',
            'fields' => json_encode([]),
            'is_active' => true,
        ]);

        $this->assertCount(1, $user->forms);
        $this->assertEquals('Test Form', $user->forms->first()->title);
    }

    public function testUserEmailIsUnique()
    {
        User::create([
            'name' => 'User One',
            'email' => 'duplicate@example.com',
            'google_id' => 'google_001',
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        User::create([
            'name' => 'User Two',
            'email' => 'duplicate@example.com',
            'google_id' => 'google_002',
        ]);
    }
}
