import { VolleyballPosition } from '@prisma/client';
export declare class UpdateMemberDto {
    isCaptain?: boolean;
    positions?: VolleyballPosition[];
    guestName?: string;
}
