<?php

/**
 * Example: Integrating Email Notifications into FormController
 * 
 * This shows how to add email notifications when forms are submitted
 * Add this code to your FormController.php
 */

// At the top of FormController.php, add this import:
// use App\Helpers\NotificationHelper;

// In the submitForm() method, after successfully saving the submission:

/* Example code:
public function submitForm(Request $request, Response $response, array $args): Response
{
    try {
        $formId = $args['id'];
        $data = $request->getParsedBody();

        // ... existing form validation and submission code ...

        // After submission is saved successfully:
        $submission = FormSubmission::create([
            'form_id' => $form->id,
            'data' => $data,
            // ... other fields
        ]);

        // ✨ ADD THIS: Send email notification to form owner
        $submitterName = $data['name'] ?? $data['email'] ?? 'Anonymous';
        
        NotificationHelper::notifyFormSubmission(
            $form->user_id,           // Form owner's user ID
            $form->id,                // Form ID
            $form->title,             // Form title
            $submission->id,          // Submission ID
            $submitterName            // Submitter's name (optional)
        );

        // Continue with your response...
        $response->getBody()->write(json_encode([
            'message' => 'Form submitted successfully',
            'submission_id' => $submission->id
        ]));
        
        return $response->withHeader('Content-Type', 'application/json');
        
    } catch (\Exception $e) {
        // Error handling...
    }
}
*/

// Example 2: Notify when form status changes
/* Example code:
public function updateForm(Request $request, Response $response, array $args): Response
{
    try {
        $formId = $args['id'];
        $userId = $request->getAttribute('user_id');
        $data = $request->getParsedBody();

        $form = Form::find($formId);
        
        // Track previous status
        $previousStatus = $form->is_active ? 'active' : 'inactive';
        
        // Update form
        if (isset($data['is_active']) && $data['is_active'] != $form->is_active) {
            $form->is_active = $data['is_active'];
            $form->save();
            
            $newStatus = $data['is_active'] ? 'active' : 'inactive';
            
            // ✨ Send notification about status change
            NotificationHelper::notifyFormStatus(
                $userId,
                $form->id,
                $form->title,
                $newStatus,
                $previousStatus
            );
        }

        // ... rest of update logic
        
    } catch (\Exception $e) {
        // Error handling...
    }
}
*/

// Example 3: Notify when sheet connection fails (in SheetController)
/* Example code:
public function writeToSheet(int $sheetId, array $data): bool
{
    try {
        // ... attempt to write to sheet ...
        
        // ✨ On success
        NotificationHelper::notifySheetConnection(
            $userId,
            $sheetId,
            $sheetName,
            'success'
        );
        
        return true;
        
    } catch (\Exception $e) {
        // ✨ On failure
        NotificationHelper::notifySheetConnection(
            $userId,
            $sheetId,
            $sheetName,
            'error',
            $e->getMessage()
        );
        
        return false;
    }
}
*/

// Example 4: Spam detection notification
/* Example code:
public function detectSpam(int $formId, array $submission): bool
{
    $isSpam = false;
    $blockedIps = [];
    
    // ... your spam detection logic ...
    
    if ($isSpam) {
        // Track spam
        $spamCount = SpamSubmission::where('form_id', $formId)
            ->where('created_at', '>=', now()->subHour())
            ->count();
            
        // ✨ Notify if spam threshold reached
        if ($spamCount >= 3) {
            $form = Form::find($formId);
            
            NotificationHelper::notifySpamDetected(
                $form->user_id,
                $formId,
                $form->title,
                $spamCount,
                $blockedIps
            );
        }
    }
    
    return $isSpam;
}
*/

// Example 5: API limit warning (in a middleware or API tracking service)
/* Example code:
public function checkApiLimit(int $userId): void
{
    $usage = ApiUsage::where('user_id', $userId)
        ->where('month', date('Y-m'))
        ->sum('requests');
    
    $limit = 1000; // Your API limit
    $percentage = round(($usage / $limit) * 100);
    
    // ✨ Warn at 75%, 90%, and 100%
    if (in_array($percentage, [75, 90, 100])) {
        NotificationHelper::notifyApiLimit(
            $userId,
            $usage,
            $limit,
            $percentage
        );
    }
}
*/

// Example 6: Send welcome notification to new users
/* Example code:
public function createUser(array $userData): User
{
    $user = User::create($userData);
    
    // ✨ Send welcome notification
    NotificationHelper::notifySystem(
        $user->id,
        'Welcome to SheetTree! 🌳',
        'Thank you for signing up! Start by connecting your first Google Sheet and creating a form.',
        ['onboarding' => true]
    );
    
    return $user;
}
*/

/**
 * Best Practices:
 * 
 * 1. Always wrap in try-catch to prevent notification failures from breaking your app
 * 2. Use background jobs for heavy notification processing
 * 3. Respect user preferences - notifications are only sent if enabled
 * 4. Provide meaningful context in metadata
 * 5. Use appropriate notification types
 * 6. Don't spam users - batch similar notifications
 */
