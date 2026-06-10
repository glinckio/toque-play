import { VolleyballPosition } from '@prisma/client';
export declare class AddMemberDto {
    email: string;
    cpf?: string;
    isCaptain?: boolean;
    positions?: VolleyballPosition[];
}
