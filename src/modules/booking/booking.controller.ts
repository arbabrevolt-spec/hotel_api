import type { Request, Response } from 'express';
import type { BookingService } from './booking.service';
import { sendResponse } from '../../lib/response';

export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  getMyBookings = async (req: Request, res: Response): Promise<void> => {
    const bookings = await this.bookingService.getMyBookings(req.user.id);
    sendResponse(res, true, { data: bookings });
  };

  getMyBooking = async (req: Request, res: Response): Promise<void> => {
    const booking = await this.bookingService.getMyBooking(req.validated!.params.id as string, req.user.id);
    sendResponse(res, true, { data: booking });
  };

  getAllBookings = async (_req: Request, res: Response): Promise<void> => {
    const bookings = await this.bookingService.getAllBookings();
    sendResponse(res, true, { data: bookings });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const booking = await this.bookingService.create(req.user.id, req.validated!.body);
    sendResponse(res, true, { data: booking, message: 'Booking created' }, 201);
  };

  cancelBooking = async (req: Request, res: Response): Promise<void> => {
    const booking = await this.bookingService.cancelBooking(req.validated!.params.id as string, req.user.id);
    sendResponse(res, true, { data: booking, message: 'Booking cancelled' });
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const booking = await this.bookingService.updateStatus(req.validated!.params.id as string, req.validated!.body.status);
    sendResponse(res, true, { data: booking, message: 'Status updated' });
  };
}
