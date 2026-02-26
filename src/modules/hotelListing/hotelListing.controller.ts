import type { Request, Response } from 'express';
import type { HotelListingService } from './hotelListing.service';
import type { ListingFilters } from './hotelListing.types';
import { sendResponse } from '../../lib/response';

export class HotelListingController {
  constructor(private readonly listingService: HotelListingService) { }

  getAll = async (req: Request, res: Response): Promise<void> => {
    // req.validated.query is validated by listingQuerySchema middleware
    const result = await this.listingService.getAll(req.validated!.query as ListingFilters);
    sendResponse(res, true, { data: result });
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const listing = await this.listingService.getOne(req.validated!.params.id as string);
    sendResponse(res, true, { data: listing });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const listing = await this.listingService.create(req.validated!.body, req.file);
    sendResponse(res, true, { data: listing, message: 'Listing created' }, 201);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const listing = await this.listingService.update(req.validated!.params.id as string, req.validated!.body, req.file);
    sendResponse(res, true, { data: listing, message: 'Listing updated' });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.listingService.delete(req.validated!.params.id as string);
    sendResponse(res, true, { message: 'Listing deleted' }, 204);
  };
}
