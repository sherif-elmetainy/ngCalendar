import { EventSource } from "./EventSource"
import Moment = moment.Moment;

export interface Event {
    id?: string | number;
    url?: string;
    title: string;
    from: Moment;
    to: Moment;
    isAllDay?: boolean;
    description?: string;
    source: EventSource;
}