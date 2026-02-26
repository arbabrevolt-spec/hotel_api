import path from 'path';
import fs from 'fs/promises';
import type { HotelListingRepo } from './hotelListing.repo';
import type { HotelListing, ListingFilters, PaginatedListings } from './hotelListing.types';
import type { CreateListingInput, UpdateListingInput } from './hotelListing.schema';
import { NotFoundError } from '../../lib/AppError';
import logger from '../../lib/logger';

export class HotelListingService {
  constructor(private readonly listingRepo: HotelListingRepo) { }

  async getAll(filters: ListingFilters): Promise<PaginatedListings> {
    return this.listingRepo.findPaginated(filters);
  }

  async getOne(id: string): Promise<HotelListing> {
    const listing = await this.listingRepo.findById(id);
    if (!listing) throw new NotFoundError('Hotel listing');
    return listing;
  }

  async create(data: CreateListingInput, imageFile?: Express.Multer.File): Promise<HotelListing> {
    const image_url = imageFile ? `/uploads/${imageFile.filename}` : null;
    //@ts-ignore
    delete data.image
    return this.listingRepo.create({ ...data, image_url });
  }

  async update(
    id: string,
    data: UpdateListingInput,
    imageFile?: Express.Multer.File,
  ): Promise<HotelListing> {
    const existing = await this.listingRepo.findById(id);
    if (!existing) throw new NotFoundError('Hotel listing');

    let image_url: string | null | undefined = undefined; // undefined = leave unchanged

    if (imageFile) {
      image_url = `/uploads/${imageFile.filename}`;
      if (existing.image_url) {
        const oldPath = path.join(process.cwd(), existing.image_url);
        await fs.unlink(oldPath).catch((err) => {
          logger.warn(`Failed to delete old image file: ${oldPath}`, { error: err.message });
        });
      }
    }

    const updated = await this.listingRepo.update(id, {
      ...data,
      ...(image_url !== undefined && { image_url }),
    });

    return updated!;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.listingRepo.findById(id);
    if (!existing) throw new NotFoundError('Hotel listing');

    if (existing.image_url) {
      const filePath = path.join(process.cwd(), existing.image_url);
      await fs.unlink(filePath).catch((err) => {
        logger.warn(`Failed to delete image file: ${filePath}`, { error: err.message });
      });
    }

    await this.listingRepo.delete(id);
  }
}
