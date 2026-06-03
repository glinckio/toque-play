import { OnModuleInit } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TeamsService } from '../teams/teams.service';
import { FriendliesService } from '../friendlies/friendlies.service';
export declare class ChatModule implements OnModuleInit {
    private chatService;
    private teamsService;
    private friendliesService;
    constructor(chatService: ChatService, teamsService: TeamsService, friendliesService: FriendliesService);
    onModuleInit(): void;
}
