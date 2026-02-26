import { Router } from 'express';
import { authController, listingController, bookingController, rawBookingController } from './container';
import { authenticate } from './middleware/authenticate';
import { requireRole } from './middleware/requireRole';
import { validate } from './middleware/validate';
import { uploadImage } from './lib/upload';

import { signupSchema, loginSchema } from './modules/auth/auth.schema';
import {
  createListingSchema,
  updateListingSchema,
  listingIdParamSchema,
  listingQuerySchema,
} from './modules/hotelListing/hotelListing.schema';
import {
  createBookingSchema,
  bookingIdParamSchema,
  updateBookingStatusSchema,
} from './modules/booking/booking.schema';
import {
  createRawBookingSchema,
  idParamSchema as rawIdParamSchema,
} from './modules/rawBookings/rawBooking.schema';

const router = Router();

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/auth/signup', validate(signupSchema), authController.signup);
router.post('/auth/login', validate(loginSchema), authController.login);
router.post('/auth/logout', authController.logout);

// ── Hotel Listings — public reads ─────────────────────────────────────────────
router.get('/listings', validate(listingQuerySchema), listingController.getAll);
router.get('/listings/:id', validate(listingIdParamSchema), listingController.getOne);

// ── Hotel Listings — admin writes ─────────────────────────────────────────────
// Note: uploadImage runs before validate because multer must parse multipart
//       before Zod can access req.body fields.
router.post('/listings',
  authenticate, requireRole('admin'),
  uploadImage,
  validate(createListingSchema),
  listingController.create,
);
router.put('/listings/:id',
  authenticate, requireRole('admin'),
  uploadImage,
  validate(updateListingSchema),
  listingController.update,
);
router.delete('/listings/:id',
  authenticate, requireRole('admin'),
  validate(listingIdParamSchema),
  listingController.delete,
);

// ── Bookings — authenticated user ─────────────────────────────────────────────
router.get('/bookings/me',
  authenticate,
  bookingController.getMyBookings,
);
router.get('/bookings/me/:id',
  authenticate, validate(bookingIdParamSchema),
  bookingController.getMyBooking,
);
router.post('/bookings',
  authenticate, validate(createBookingSchema),
  bookingController.create,
);
router.patch('/bookings/:id/cancel',
  authenticate, validate(bookingIdParamSchema),
  bookingController.cancelBooking,
);

// ── Bookings — admin ──────────────────────────────────────────────────────────
router.get('/admin/bookings',
  authenticate, requireRole('admin'),
  bookingController.getAllBookings,
);
router.patch('/admin/bookings/:id/status',
  authenticate, requireRole('admin'),
  validate(updateBookingStatusSchema),
  bookingController.updateStatus,
);

// ── Raw bookings — open access ──────────────────────────────────────────────────
router.get('/raw-bookings', rawBookingController.getAll);
router.get('/raw-bookings/:id', validate(rawIdParamSchema), rawBookingController.getOne);
router.post('/raw-bookings', validate(createRawBookingSchema), rawBookingController.create);
router.put('/raw-bookings/:id', validate(rawIdParamSchema), validate(createRawBookingSchema), rawBookingController.update);
router.delete('/raw-bookings/:id', validate(rawIdParamSchema), rawBookingController.delete);

export default router;
