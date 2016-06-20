import { Event } from "../interfaces/Event";

export interface EventInfo extends Event {
    left?: number;
    right?: number;
    col?: number;
    top?: number;
    bottom?: number;
    sourceIndex?: number;
}