import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
export interface AppErrorResponse {
    statusCode: number;
    code: string;
    message: string;
}
export declare class AppExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): Response<any, Record<string, any>>;
}
