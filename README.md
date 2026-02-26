# Hotel Listings API

Node / Express 5 / TypeScript / Knex / PostgreSQL REST API.

This backend powers a simple hotel booking system with authentication, listings, and booking workflows. It uses strict validation via Zod and a unified response envelope to ensure consistency.

## Stack

| Concern    | Library               |
| ---------- | --------------------- |
| Framework  | Express 5             |
| Database   | PostgreSQL via Knex   |
| Validation | Zod                   |
| Auth       | JWT (jsonwebtoken)    |
| Passwords  | bcrypt                |
| Uploads    | Multer (disk storage) |
| Logging    | Winston + Morgan      |

## Setup

The `.env.example` file contains all supported configuration keys; copy it to `.env` and update:

```dotenv
PORT=3000
NODE_ENV=development

# PostgreSQL connection parameters (no connection string used):
# DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_SSL

# JWT
# JWT_SECRET must be set to something long and random
# JWT_EXPIRES_IN (e.g. "7d")

# Roles
# ADMIN_SECRET used during signup to create an admin user

# Logging
# LOG_LEVEL (info|debug|warn|error)

# Seeding
# LISTINGS_SEED_COUNT=20
```

Then follow the commands below to get the project running.

````bash
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and fill in values (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_SSL,
# JWT_SECRET, ADMIN_SECRET, etc.).

# 3. Create the database (Postgres must be running locally or remote)
createdb hotel_db

# 4. Run migrations
npm run migrate:latest

# 5. (optional) Seed data
# - `LISTINGS_SEED_COUNT` controls generated listing count when running 000_listings seed
# - `npm run seed` executes both listing and general seeds (users, bookings, raw bookings)

# 6. Start development server
npm run dev
````

```

## Architecture

```

src/
db/
knex.ts # knex singleton
migrations/ # versioned schema migrations
lib/
AppError.ts # base error class + typed subclasses
logger.ts # winston instance
upload.ts # multer config
middleware/
authenticate.ts # JWT → req.user
requireRole.ts # role guard (after authenticate)
validate.ts # zod middleware factory
httpLogger.ts # morgan → winston
errorHandler.ts # central error handler
modules/
auth/ # signup / login / logout
user/ # user types + repo
hotelListing/ # CRUD + image upload + paginated search
booking/ # user bookings + admin view
container.ts # wires all deps (only place `new` is called)
router.ts # all route definitions
app.ts # express app setup
server.ts # entry point

```

**Dependency injection** is manual and explicit. `container.ts` instantiates every class and passes deps by constructor. There is no DI framework.

**Error handling** — services throw typed `AppError` subclasses (`NotFoundError`, `ConflictError`, etc.). Controllers have no try/catch — Express 5 auto-propagates async errors to the central `errorHandler` middleware.

## Roles

| Role    | How to get it                                            |
| ------- | -------------------------------------------------------- |
| `user`  | Default on signup                                        |
| `admin` | Include `"adminSecret": "<ADMIN_SECRET>"` in signup body |

## API Routes

The API uses a response envelope (`{ success: boolean, status: number, data?, message?, error? }`) and all inputs are validated via Zod schemas.  Validated input is available under `req.validated` in handlers.



### Auth

```

POST /api/auth/signup body: { email, password, adminSecret? }
POST /api/auth/login body: { email, password }
POST /api/auth/logout

```

### Hotel Listings

```

GET /api/listings query: search, city, country, property_type,
min_price, max_price, min_guests, page, limit
GET /api/listings/:id

POST /api/listings admin multipart/form-data (includes image field)
PUT /api/listings/:id admin multipart/form-data
DELETE /api/listings/:id admin

```

### Bookings

```

GET /api/bookings/me user — list own bookings
GET /api/bookings/me/:id user — single booking
POST /api/bookings user — body: { listing_id, check_in, check_out, guests, notes? }
PATCH /api/bookings/:id/cancel user — cancel own booking

GET /api/admin/bookings admin — all bookings with user + listing details
PATCH /api/admin/bookings/:id/status admin — body: { status }

```

### Other

```

GET /health
GET /uploads/:filename static — serve uploaded images

```

## Uploading Images

Listing create/update routes accept `multipart/form-data`. Send all text fields alongside the `image` file field. Allowed types: JPEG, PNG, WebP. Max size: 5MB.

Images are served at `GET /uploads/<filename>` and the `image_url` field on a listing holds the path e.g. `/uploads/listing-1234567890.jpg`.
```
