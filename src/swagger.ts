import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

// Minimal OpenAPI document covering only the auth module.
export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Hotel Booking API',
        version: '1.0.0',
        description: 'Endpoints for the Hotel Booking system',
    },
    paths: {
        '/api/auth/signup': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', format: 'password' },
                                    adminSecret: { type: 'string' },
                                },
                                required: ['username', 'email', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'User created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/AuthResponse',
                                },
                            },
                        },
                    },
                    '409': { description: 'Email or username already in use' },
                },
            },
        },
        '/api/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Obtain JWT token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', format: 'password' },
                                },
                                required: ['email', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/AuthResponse',
                                },
                            },
                        },
                    },
                    '401': { description: 'Invalid credentials' },
                },
            },
        },
        '/api/auth/logout': {
            post: {
                tags: ['Auth'],
                summary: 'Logout (client side only)',
                responses: {
                    '200': {
                        description: 'Logged out successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { message: { type: 'string' } },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/listings': {
            get: {
                tags: ['Listings'],
                summary: 'List all hotel listings (public)',
                parameters: [
                    { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by name or description' },
                    { name: 'city', in: 'query', schema: { type: 'string' }, description: 'Filter by city' },
                    { name: 'country', in: 'query', schema: { type: 'string' }, description: 'Filter by country' },
                    { name: 'page', in: 'query', schema: { type: 'integer' }, description: 'Page number' },
                    { name: 'limit', in: 'query', schema: { type: 'integer' }, description: 'Items per page' },
                ],
                responses: {
                    '200': {
                        description: 'List of listings with pagination',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/PaginatedListings',
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Listings'],
                summary: 'Create a new listing (admin only)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    description: { type: 'string' },
                                    country: { type: 'string' },
                                    city: { type: 'string' },
                                    address: { type: 'string' },
                                    nightly_rate: { type: 'number' },
                                    max_guests: { type: 'integer' },
                                    bedrooms: { type: 'integer' },
                                    bathrooms: { type: 'integer' },
                                    property_type: { type: 'string' },
                                    amenities: { type: 'array', items: { type: 'string' } },
                                    image: { type: 'string', format: 'binary' },
                                    location: { type: 'string' }
                                },
                                required: ['name', 'country', 'city', 'address', 'nightly_rate', 'max_guests'],
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Listing created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Listing',
                                },
                            },
                        },
                    },
                    '403': { description: 'Forbidden: admin role required' },
                },
            },
        },
        '/api/listings/{id}': {
            get: {
                tags: ['Listings'],
                summary: 'Get a specific listing (public)',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Listing ID' },
                ],
                responses: {
                    '200': {
                        description: 'Listing details',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Listing',
                                },
                            },
                        },
                    },
                    '404': { description: 'Listing not found' },
                },
            },
            put: {
                tags: ['Listings'],
                summary: 'Update a listing (admin only)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Listing ID' },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    description: { type: 'string' },
                                    country: { type: 'string' },
                                    city: { type: 'string' },
                                    address: { type: 'string' },
                                    nightly_rate: { type: 'number' },
                                    max_guests: { type: 'integer' },
                                    bedrooms: { type: 'integer' },
                                    bathrooms: { type: 'integer' },
                                    property_type: { type: 'string' },
                                    amenities: { type: 'array', items: { type: 'string' } },
                                    image: { type: 'string', format: 'binary' },
                                    is_active: { type: 'boolean' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Listing updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Listing',
                                },
                            },
                        },
                    },
                    '403': { description: 'Forbidden: admin role required' },
                    '404': { description: 'Listing not found' },
                },
            },
            delete: {
                tags: ['Listings'],
                summary: 'Delete a listing (admin only)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Listing ID' },
                ],
                responses: {
                    '204': { description: 'Listing deleted successfully' },
                    '403': { description: 'Forbidden: admin role required' },
                    '404': { description: 'Listing not found' },
                },
            },
        },
        '/api/bookings': {
            post: {
                tags: ['Bookings'],
                summary: 'Create a new booking (authenticated user)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    listing_id: { type: 'string' },
                                    check_in: { type: 'string', format: 'date' },
                                    check_out: { type: 'string', format: 'date' },
                                    guests: { type: 'integer' },
                                    notes: { type: 'string' },
                                },
                                required: ['listing_id', 'check_in', 'check_out', 'guests'],
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Booking created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Booking',
                                },
                            },
                        },
                    },
                    '409': { description: 'Dates already booked or invalid dates' },
                },
            },
        },
        '/api/bookings/me': {
            get: {
                tags: ['Bookings'],
                summary: 'Get my bookings (authenticated user)',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'List of user bookings',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Booking',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/bookings/me/{id}': {
            get: {
                tags: ['Bookings'],
                summary: 'Get a specific booking of the authenticated user',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Booking ID' },
                ],
                responses: {
                    '200': {
                        description: 'Booking details',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Booking',
                                },
                            },
                        },
                    },
                    '404': { description: 'Booking not found' },
                },
            },
        },
        '/api/bookings/{id}/cancel': {
            patch: {
                tags: ['Bookings'],
                summary: 'Cancel a booking (authenticated user)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Booking ID' },
                ],
                responses: {
                    '200': {
                        description: 'Booking cancelled successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Booking',
                                },
                            },
                        },
                    },
                    '404': { description: 'Booking not found' },
                },
            },
        },
        '/api/admin/bookings': {
            get: {
                tags: ['Admin Bookings'],
                summary: 'Get all bookings (admin only)',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'List of all bookings',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Booking',
                                    },
                                },
                            },
                        },
                    },
                    '403': { description: 'Forbidden: admin role required' },
                },
            },
        },
        '/api/admin/bookings/{id}/status': {
            patch: {
                tags: ['Admin Bookings'],
                summary: 'Update booking status (admin only)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Booking ID' },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled'] },
                                },
                                required: ['status'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Booking status updated',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Booking',
                                },
                            },
                        },
                    },
                    '403': { description: 'Forbidden: admin role required' },
                    '404': { description: 'Booking not found' },
                },
            },
        },
        '/api/raw-bookings': {
            get: {
                tags: ['Raw Bookings'],
                summary: 'Get all raw bookings (public)',
                responses: {
                    '200': {
                        description: 'List of raw bookings',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/RawBooking',
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Raw Bookings'],
                summary: 'Create a raw booking (public, no login required)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    full_name: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    contact_number: { type: 'string' },
                                    number_of_guests: { type: 'integer' },
                                    check_in: { type: 'string', format: 'date' },
                                    check_out: { type: 'string', format: 'date' },
                                    payment_method: { type: 'string', enum: ['cash', 'upi', 'net', 'credit'] },
                                },
                                required: ['full_name', 'email', 'contact_number', 'number_of_guests', 'check_in', 'check_out', 'payment_method'],
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Raw booking created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/RawBooking',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/raw-bookings/{id}': {
            get: {
                tags: ['Raw Bookings'],
                summary: 'Get a specific raw booking (public)',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Raw Booking ID' },
                ],
                responses: {
                    '200': {
                        description: 'Raw booking details',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/RawBooking',
                                },
                            },
                        },
                    },
                    '404': { description: 'Raw booking not found' },
                },
            },
            put: {
                tags: ['Raw Bookings'],
                summary: 'Update a raw booking (public)',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Raw Booking ID' },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    full_name: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    contact_number: { type: 'string' },
                                    number_of_guests: { type: 'integer' },
                                    check_in: { type: 'string', format: 'date' },
                                    check_out: { type: 'string', format: 'date' },
                                    payment_method: { type: 'string', enum: ['cash', 'upi', 'net', 'credit'] },
                                },
                                required: ['full_name', 'email', 'contact_number', 'number_of_guests', 'check_in', 'check_out', 'payment_method'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Raw booking updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/RawBooking',
                                },
                            },
                        },
                    },
                    '404': { description: 'Raw booking not found' },
                },
            },
            delete: {
                tags: ['Raw Bookings'],
                summary: 'Delete a raw booking (public)',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Raw Booking ID' },
                ],
                responses: {
                    '204': { description: 'Raw booking deleted successfully' },
                    '404': { description: 'Raw booking not found' },
                },
            },
        },

    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            AuthResponse: {
                type: 'object',
                properties: {
                    user: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            username: { type: 'string' },
                            email: { type: 'string', format: 'email' },
                            role: { type: 'string' },
                            created_at: { type: 'string', format: 'date-time' },
                        },
                    },
                    token: { type: 'string' },
                },
            },
            Listing: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    country: { type: 'string' },
                    city: { type: 'string' },
                    address: { type: 'string' },
                    nightly_rate: { type: 'number' },
                    max_guests: { type: 'integer' },
                    bedrooms: { type: 'integer' },
                    bathrooms: { type: 'integer' },
                    property_type: { type: 'string' },
                    amenities: { type: 'array', items: { type: 'string' } },
                    image_url: { type: 'string', nullable: true },
                    is_active: { type: 'boolean' },
                    rating: { type: 'number', nullable: true },
                    rating_count: { type: 'integer' },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' },
                },
            },
            PaginatedListings: {
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Listing',
                        },
                    },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    limit: { type: 'integer' },
                    total_pages: { type: 'integer' },
                },
            },
            Booking: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    user_id: { type: 'string' },
                    listing_id: { type: 'string' },
                    check_in: { type: 'string', format: 'date' },
                    check_out: { type: 'string', format: 'date' },
                    guests: { type: 'integer' },
                    nightly_rate: { type: 'number' },
                    total_nights: { type: 'integer' },
                    total_price: { type: 'number' },
                    status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled'] },
                    notes: { type: 'string', nullable: true },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' },
                },
            },
            RawBooking: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    full_name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    contact_number: { type: 'string' },
                    number_of_guests: { type: 'integer' },
                    check_in: { type: 'string', format: 'date' },
                    check_out: { type: 'string', format: 'date' },
                    payment_method: { type: 'string', enum: ['cash', 'upi', 'net', 'credit'] },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' },
                },
            },
        },
    },
};

export function setupSwagger(app: Express): void {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.get('/docs.json', (_req, res) => res.json(swaggerDocument));
}
