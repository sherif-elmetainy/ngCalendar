import { Event } from "./Event";
import Moment = moment.Moment;

export interface EventSource {
    name: string;
    getEvents: (from: Moment, to: Moment) => Event[];
}