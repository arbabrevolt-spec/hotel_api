/**
 * container.ts — single source of truth for dependency wiring.
 *
 * Instantiate every class here and pass deps down by constructor.
 * Nothing else in the codebase calls `new` on a repo/service/controller.
 *
 * Dependency graph:
 *   db → UserRepo       → AuthService         → AuthController
 *   db → ListingRepo    → ListingService       → ListingController
 *   db → BookingRepo ─┐
 *        ListingRepo ─┴→ BookingService        → BookingController
 */

import db from './db/knex';

import { UserRepo } from './modules/user/user.repo';
import { UserService } from './modules/user/user.service';
import { UserController } from './modules/user/user.controller';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';

import { HotelListingRepo } from './modules/hotelListing/hotelListing.repo';
import { HotelListingService } from './modules/hotelListing/hotelListing.service';
import { HotelListingController } from './modules/hotelListing/hotelListing.controller';

import { BookingRepo } from './modules/booking/booking.repo';
import { BookingService } from './modules/booking/booking.service';
import { BookingController } from './modules/booking/booking.controller';

import { RawBookingRepo } from './modules/rawBookings/rawBooking.repo';
import { RawBookingService } from './modules/rawBookings/rawBooking.service';
import { RawBookingController } from './modules/rawBookings/rawBooking.controller';

// ── Repos ────────────────────────────────────────────────
const userRepo = new UserRepo(db);
const listingRepo = new HotelListingRepo(db);
const bookingRepo = new BookingRepo(db);
const rawBookingRepo = new RawBookingRepo(db);

// ── Services ─────────────────────────────────────────────
const authService = new AuthService(userRepo);
const listingService = new HotelListingService(listingRepo);
const bookingService = new BookingService(bookingRepo, listingRepo);
const rawBookingService = new RawBookingService(rawBookingRepo);
const userService = new UserService(userRepo);

// ── Controllers ──────────────────────────────────────────
export const authController = new AuthController(authService);
export const listingController = new HotelListingController(listingService);
export const bookingController = new BookingController(bookingService);
export const rawBookingController = new RawBookingController(rawBookingService);
export const userController = new UserController(userService);
