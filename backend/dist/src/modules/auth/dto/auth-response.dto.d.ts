declare class UserDto {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    isFirstAccess: boolean;
    isEmailVerified: boolean;
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserDto;
}
export {};
