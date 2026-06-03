import { NestMiddleware } from '@nestjs/common';
export declare class BullBoardMiddleware implements NestMiddleware {
    private readonly router;
    constructor();
    use(req: any, res: any, next: () => void): any;
}
