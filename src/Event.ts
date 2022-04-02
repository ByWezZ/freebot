import { SuperClient } from ".";

export interface DiscordEvent {
    name?: String;

    run: (client: SuperClient, ...rest: any[]) => void;
}
