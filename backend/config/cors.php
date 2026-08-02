<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter([
        env('FRONTEND_URL'),                  // zadacademiq.com
        env('FRONTEND_URL_STAGING'),          // staging.zadacademiq.com
        env('SYSTEM_FRONTEND_URL'),           // app.zadacademiq.com
        env('SYSTEM_FRONTEND_URL_STAGING'),   // app-staging.zadacademiq.com
        'http://localhost:3000',
        'http://app.localhost:3000',
        'http://system.localhost:3000',
    ]),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
