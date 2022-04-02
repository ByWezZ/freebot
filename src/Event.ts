import { SuperClient } from "./bot";

export interface DiscordEvent {
    name?: String;

    run: (client: SuperClient, ...rest: any[]) => void;
}
