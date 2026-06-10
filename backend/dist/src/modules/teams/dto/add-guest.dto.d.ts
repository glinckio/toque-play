import { VolleyballPosition } from '@prisma/client';
export declare class AddGuestDto {
    guestName: string;
    cpf?: string;
    positions?: VolleyballPosition[];
}
