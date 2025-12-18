<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\FormTemplate;

class FormTemplateController
{
    /**
     * Get all active form templates
     * GET /templates
     */
    public function getTemplates(Request $request, Response $response): Response
    {
        try {
            $queryParams = $request->getQueryParams();
            $category = $queryParams['category'] ?? null;

            $query = FormTemplate::active();

            if ($category) {
                $query->byCategory($category);
            }

            $templates = $query->orderBy('usage_count', 'desc')
                ->orderBy('name', 'asc')
                ->get()
                ->map(function ($template) {
                    return [
                        'id' => $template->id,
                        'name' => $template->name,
                        'description' => $template->description,
                        'category' => $template->category,
                        'icon' => $template->icon,
                        'fields' => $template->fields,
                        'settings' => $template->settings,
                        'usage_count' => $template->usage_count
                    ];
                });

            $response->getBody()->write(json_encode([
                'templates' => $templates
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get single template by ID
     * GET /templates/{id}
     */
    public function getTemplate(Request $request, Response $response, array $args): Response
    {
        try {
            $templateId = $args['id'];
            $template = FormTemplate::find($templateId);

            if (!$template || !$template->is_active) {
                $response->getBody()->write(json_encode(['error' => 'Template not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'template' => [
                    'id' => $template->id,
                    'name' => $template->name,
                    'description' => $template->description,
                    'category' => $template->category,
                    'icon' => $template->icon,
                    'fields' => $template->fields,
                    'settings' => $template->settings,
                    'usage_count' => $template->usage_count
                ]
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Record template usage
     * POST /templates/{id}/use
     */
    public function useTemplate(Request $request, Response $response, array $args): Response
    {
        try {
            $templateId = $args['id'];
            $template = FormTemplate::find($templateId);

            if (!$template) {
                $response->getBody()->write(json_encode(['error' => 'Template not found']));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Increment usage count
            $template->incrementUsage();

            $response->getBody()->write(json_encode([
                'message' => 'Template usage recorded',
                'usage_count' => $template->usage_count
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get template categories
     * GET /templates/categories
     */
    public function getCategories(Request $request, Response $response): Response
    {
        try {
            $categories = [
                ['value' => 'contact', 'label' => 'Contact Forms', 'icon' => '📧'],
                ['value' => 'registration', 'label' => 'Registration', 'icon' => '📝'],
                ['value' => 'survey', 'label' => 'Surveys & Feedback', 'icon' => '📊'],
                ['value' => 'event', 'label' => 'Event Registration', 'icon' => '📅'],
                ['value' => 'business', 'label' => 'Business', 'icon' => '💼'],
                ['value' => 'order', 'label' => 'Orders & Booking', 'icon' => '🛒'],
                ['value' => 'application', 'label' => 'Applications', 'icon' => '📋'],
                ['value' => 'general', 'label' => 'General Purpose', 'icon' => '✨']
            ];

            $response->getBody()->write(json_encode(['categories' => $categories]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
