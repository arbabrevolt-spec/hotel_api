import type { Request, Response } from 'express';
import type { RawBookingService } from './rawBooking.service';
import { sendResponse } from '../../lib/response';

export class RawBookingController {
    constructor(private readonly service: RawBookingService) { }

    getAll = async (_req: Request, res: Response): Promise<void> => {
        const data = await this.service.getAll();
        sendResponse(res, true, { data });
    };

    getOne = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.get(req.validated!.params.id as string);
        sendResponse(res, true, { data });
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.create(req.validated!.body);
        sendResponse(res, true, { data, message: 'Created' }, 201);
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.update(req.validated!.params.id as string, req.validated!.body);
        sendResponse(res, true, { data, message: 'Updated' });
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        await this.service.delete(req.validated!.params.id as string);
        sendResponse(res, true, { message: 'Deleted' });
    };
}
