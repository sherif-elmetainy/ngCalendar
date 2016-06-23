import { Component, Input } from "@angular/core";
import { EventInfo } from "../core/EventInfo";
import { CalendarAgendaSettings } from "../interfaces/CalendarAgendaSettings";
import { Event } from "../interfaces/Event";
import { EventSource } from "../interfaces/EventSource";
import { EventSourceCollection } from "../interfaces/EventSourceCollection";
import { LocalizationService } from "../interfaces/LocalizationService";
import Moment = moment.Moment;

@Component({
    selector: "agendadayview",
    templateUrl: "calendar/components/AgendaViewComponent.html"
})
export class AgendaViewComponent {
    private numberDays: number;
    private cDate: Moment;
    private agendaSettings: CalendarAgendaSettings;
    eventSources: EventSource[];

    sourceNames: string[];
    scrollWidth: string;
    days: Moment[];
    timeslots: number[];
    events: EventInfo[];

    constructor(eventSources: EventSourceCollection, public localizationService: LocalizationService) {
        this.eventSources = eventSources.eventSources;
        this.sourceNames = this.eventSources.map(s => s.name);
        this.calculateSlots();
        this.resize();
        this.fetchEvents();
    }

    resize() {
        this.scrollWidth = AgendaViewComponent.getScrollbarWidth();
    }

    @Input() set settings(val: CalendarAgendaSettings) {
        this.agendaSettings = val;
        this.calculateSlots();
    }

    get settings(): CalendarAgendaSettings {
        return this.agendaSettings;
    }

    @Input() set currentDate(val: Moment) {
        this.cDate = val;
        this.calculateDays();
        this.fetchEvents();
    }

    get currentDate(): Moment {
        return this.cDate;
    }

    @Input() set numberOfDays(val: number) {
        this.numberDays = val;
        this.calculateDays();
    }

    get numberOfDays(): number {
        return this.numberDays || 1;
    }

    get headerRows(): number {
        return this.sourceNames && this.sourceNames.length > 1 ? 2 : 1;
    }
    get sourceCount(): number {
        return this.sourceNames && this.sourceNames.length > 1 ? this.sourceNames.length : 1;
    }

    get axisFormat(): string {
        return (this.settings && this.settings.axisFormat) || "LT";
    }

    get dateFormat(): string {
        return (this.settings && this.settings.dateFormat) || "l";
    }

    get slotDuration(): number {
        return (this.settings && this.settings.slotDuration) ? this.settings.slotDuration : 30;
    }

    get displaySlotDuration(): number {
        return (this.settings && this.settings.displaySlotDuration) ? this.settings.displaySlotDuration : 60;
    }

    formatDate(date: Moment, format: string): string {
        return this.localizationService.formatDate(date, this.dateFormat);
    }

    getTimeSlot(slot: number): string {
        return this.isSubslot(slot) ? "" : this.localizationService.formatDate(moment("20000101", "YYYYMMDD", true).add(slot, "m"), this.axisFormat);
    }

    isSubslot(slot: number): boolean {
        return slot % this.displaySlotDuration !== 0;
    }

    public styleTop(ev: EventInfo): string {
        return (ev.top * 100) + "%";
    }

    public styleBottom(ev: EventInfo): string {
        return (ev.bottom * 100) + "%";
    }

    public styleLeft(ev: EventInfo): string {
        return ((ev.left + ev.col * this.eventSources.length + ev.sourceIndex) / (this.eventSources.length * this.numberOfDays) * 100) + "%";
    }

    public styleWidth(ev: EventInfo): string {
        return ((ev.right - ev.left) / (this.eventSources.length * this.numberOfDays) * 100) + "%";
    }

    private fetchEvents() {
        let result = [] as EventInfo[];
        if (this.eventSources && this.cDate) {
            const from = this.cDate.clone();
            const to = this.cDate.clone().add(this.numberOfDays, "d");
            for (let i = 0; i < this.eventSources.length; i++) {
                const evts = this.eventSources[i].getEvents(from, to);
                let res = [] as EventInfo[];
                for (let j = 0; j < evts.length; j++) {
                    let ev = AgendaViewComponent.cloneEvent(evts[j]);
                    ev.sourceIndex = i;
                    res.push(ev);
                }
                res = AgendaViewComponent.sliceAndlayoutEvents(res, from, this.numberOfDays);
                result = result.concat(res);
            }
        }
        return this.events = result;
    }

    private static cloneEvent(evt: Event, newFrom?: Moment, newTo?: Moment): EventInfo {
        return {
            from: newFrom ? newFrom.clone() : evt.from.clone(),
            to: newTo ? newTo.clone() : evt.to.clone(),
            title: evt.title,
            description: evt.description,
            source: evt.source,
            isAllDay: evt.isAllDay,
            url: evt.url,
            id: evt.id
        };
    }

    private static eventsCollide(a: EventInfo, b: EventInfo): boolean {
        return a.from.valueOf() < b.to.valueOf() && a.to.valueOf() > b.from.valueOf();
    }

    private static sliceAndlayoutEvents(evts: EventInfo[], date: Moment, ndays: number): EventInfo[] {
        const res = [] as EventInfo[];
        for (let j = 0; j < ndays; j++) {
            const from = date.clone().add(j, "d");
            const to = from.clone().add(1, "d");
            const period = to.valueOf() - from.valueOf();
            const temp = [] as EventInfo[];

            for (let i = 0; i < evts.length; i++) {
                let ev = evts[i];
                if (ev.to.valueOf() <= from.valueOf())
                    continue;
                if (ev.from.valueOf() >= to.valueOf())
                    continue;
                if (ev.from.valueOf() < from.valueOf() || ev.to.valueOf() > to.valueOf()) {
                    ev = this.cloneEvent(ev, ev.from.valueOf() < from.valueOf() ? from : null, ev.to.valueOf() > to.valueOf() ? to : null);
                }
                ev.col = j;
                ev.top = (ev.from.valueOf() - from.valueOf()) / period;
                ev.bottom = (to.valueOf() - ev.to.valueOf()) / period;
                temp.push(ev);
                res.push(ev);
            }
            AgendaViewComponent.layoutEvents(temp);
        }
        return res;
    }

    private static layoutEvents(evts: EventInfo[]): void {
        let cols = [] as Event[][];
        let lastEventEnding = null as Moment;
        evts = evts.sort((a, b) => a.from.valueOf() === b.from.valueOf() ? (a.to.valueOf() - b.to.valueOf()) : (a.from.valueOf() - b.from.valueOf()));
        for (let i = 0; i < evts.length; i++) {
            const ev = evts[i];
            if (lastEventEnding != null && ev.from.valueOf() >= lastEventEnding.valueOf()) {
                AgendaViewComponent.packEvents(cols);
                cols = [];
                lastEventEnding = null;
            }
            let placed = false;
            for (let j = 0; j < cols.length; j++) {
                const col = cols[j];
                if (!AgendaViewComponent.eventsCollide(col[col.length - 1], ev)) {
                    col.push(ev);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                cols.push([ev]);
            }
            if (lastEventEnding == null || ev.to.valueOf() > lastEventEnding.valueOf()) {
                lastEventEnding = ev.to;
            }
        }
        if (cols.length > 0) {
            AgendaViewComponent.packEvents(cols);
        }
    }

    private static packEvents(cols: EventInfo[][]): void {
        const numCols = cols.length;
        for (let i = 0; i < cols.length; i++) {
            var col = cols[i];
            for (var j = 0; j < col.length; j++) {
                var ev = col[j];
                const colspan = AgendaViewComponent.expandEvent(ev, i, cols);
                ev.left = i / numCols;
                ev.right = (i + colspan) / numCols;
            }
        }
    }

    private static expandEvent(ev: EventInfo, index: number, cols: EventInfo[][]): number {
        let colspan = 1;
        for (let i = index + 1; i < cols.length; i++) {
            const col = cols[i];
            for (let j = 0; j < col.length; j++) {
                if (AgendaViewComponent.eventsCollide(ev, col[j])) {
                    return colspan;
                }
            }
            colspan++;
        }
        return colspan;
    }

    private calculateSlots() {
        const slots = [] as number[];
        for (let i = 0; i < 24 * 60; i += this.slotDuration) {
            slots.push(i);
        }
        this.timeslots = slots;
    }

    private calculateDays() {
        if (!this.cDate) {
            this.days = null;
            return;
        }
        const dates = [] as Moment[];
        const n = this.numberOfDays;
        let d = this.currentDate.clone();
        for (let i = 0; i < n; i++) {
            dates.push(d);
            d = d.clone().add(1, "d");
        }
        this.days = dates;
    }

    private static getScrollbarWidth(): string {
        const scrollDiv = document.createElement("div");
        scrollDiv.style.width = "100px";
        scrollDiv.style.height = "100px";
        scrollDiv.style.overflow = "scroll";
        scrollDiv.style.position = "absolute";
        scrollDiv.style.top = "-9999px";
        document.body.appendChild(scrollDiv);
        let result = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return result + "px";
    }
}