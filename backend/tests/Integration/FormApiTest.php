<?php

namespace Tests\Integration;

use App\Models\User;
use App\Models\Form;

class FormApiTest extends \TestCase
{
    public function testUserCanCreateForm()
    {
        $user = $this->createTestUser();

        $form = Form::create([
            'user_id' => $user->id,
            'title' => 'Contact Form',
            'description' => 'A simple contact form',
            'fields' => [
                ['type' => 'text', 'label' => 'Name', 'required' => true],
                ['type' => 'email', 'label' => 'Email', 'required' => true],
                ['type' => 'textarea', 'label' => 'Message', 'required' => true],
            ],
            'is_active' => true,
            'is_public' => true,
        ]);

        $this->assertInstanceOf(Form::class, $form);
        $this->assertEquals($user->id, $form->user_id);
        $this->assertEquals('Contact Form', $form->title);
        $this->assertCount(3, $form->fields);
        $this->assertTrue($form->is_active);
    }

    public function testUserCanGetTheirForms()
    {
        $user = $this->createTestUser();

        // Create multiple forms
        Form::create([
            'user_id' => $user->id,
            'title' => 'Form 1',
            'description' => 'First form',
            'fields' => [['type' => 'text', 'label' => 'Name']],
            'is_active' => true,
        ]);

        Form::create([
            'user_id' => $user->id,
            'title' => 'Form 2',
            'description' => 'Second form',
            'fields' => [['type' => 'email', 'label' => 'Email']],
            'is_active' => true,
        ]);

        $forms = $user->forms;

        $this->assertCount(2, $forms);
        $this->assertEquals('Form 1', $forms[0]->title);
        $this->assertEquals('Form 2', $forms[1]->title);
    }

    public function testUserCanUpdateTheirForm()
    {
        $user = $this->createTestUser();

        $form = Form::create([
            'user_id' => $user->id,
            'title' => 'Original Title',
            'description' => 'Original Description',
            'fields' => [['type' => 'text', 'label' => 'Name']],
            'is_active' => true,
        ]);

        $form->update([
            'title' => 'Updated Title',
            'description' => 'Updated Description',
            'is_active' => false,
        ]);

        $form->refresh();

        $this->assertEquals('Updated Title', $form->title);
        $this->assertEquals('Updated Description', $form->description);
        $this->assertFalse($form->is_active);
    }

    public function testUserCanDeleteTheirForm()
    {
        $user = $this->createTestUser();

        $form = Form::create([
            'user_id' => $user->id,
            'title' => 'Form to Delete',
            'description' => 'This will be deleted',
            'fields' => [['type' => 'text', 'label' => 'Name']],
            'is_active' => true,
        ]);

        $formId = $form->id;

        $form->delete();

        $deletedForm = Form::find($formId);

        $this->assertNull($deletedForm);
    }

    public function testUserCannotAccessOtherUsersForms()
    {
        $user1 = $this->createTestUser(['email' => 'user1@example.com']);
        $user2 = $this->createTestUser(['email' => 'user2@example.com']);

        $form = Form::create([
            'user_id' => $user1->id,
            'title' => 'User 1 Form',
            'description' => 'Private form',
            'fields' => [['type' => 'text', 'label' => 'Name']],
            'is_active' => true,
            'is_public' => false,
        ]);

        // User2 should not see User1's private forms
        $user2Forms = Form::where('user_id', $user2->id)->get();

        $this->assertCount(0, $user2Forms);
        $this->assertNotContains($form->id, $user2Forms->pluck('id'));
    }

    public function testPublicFormCanBeAccessedByAnyone()
    {
        $user = $this->createTestUser();

        $publicForm = Form::create([
            'user_id' => $user->id,
            'title' => 'Public Form',
            'description' => 'Everyone can see this',
            'fields' => [['type' => 'text', 'label' => 'Name']],
            'is_active' => true,
            'is_public' => true,
        ]);

        $retrievedForm = Form::where('is_public', true)->find($publicForm->id);

        $this->assertNotNull($retrievedForm);
        $this->assertEquals('Public Form', $retrievedForm->title);
        $this->assertTrue($retrievedForm->is_public);
    }
}
