import { Event } from "../calendar/index";

export class TestEventSource {
    constructor(public name: string) { }

    private createRandomEvent(from: moment.Moment, to: moment.Moment): Event {
        const diffHours = to.diff(from, "h");
        const start = from.clone().add(Math.round(Math.random() * diffHours), "h");
        const end = start.clone().add(Math.round(Math.random() * 8 + 1) / 2, "h");
        const id = Math.round(Math.random() * 1000000);
        const title = `Event Title:${id} ${this.name}`;
        const desc = `Event desc: ${id}`;
        return {
            from: start,
            to: end,
            id: id,
            title: title,
            description: desc,
            isAllDay: false,
            url: `/events/${id}`,
            source: this
        };
    }

    getEvents(from: moment.Moment, to: moment.Moment): Event[] {
        const n = Math.round(Math.random() * 4 + 1);
        const res = [] as Event[];
        for (let i = 0; i < n; i++) {
            res.push(this.createRandomEvent(from, to));
        }
        return res;
    }
}