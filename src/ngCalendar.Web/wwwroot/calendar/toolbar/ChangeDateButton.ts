import { ToolbarElement } from "./ToolbarElement";
import { Period } from "../core/Period";
import { CalendarToolbarButtonType } from "../interfaces/CalendarToolbarButtonType";
import { LocalizationService } from "../interfaces/LocalizationService";
import { CalendarViewType } from "../interfaces/CalendarViewType";
import { ClassMap } from "../core/ClassMap";
import { CalendarComponent } from "../components/CalendarComponent";

export class ChangeDateButton extends ToolbarElement {
    private elementString: string;
    private periodInternal: Period;
    private periodValue: number;

    constructor(element: CalendarToolbarButtonType, calendar: CalendarComponent, localizationService: LocalizationService) {
        super(element, calendar, localizationService);
        this.elementString = CalendarToolbarButtonType[element] as string;
        this.periodValue = this.elementString.indexOf("Next") === 0 ? 1 : -1;
        const len = this.periodValue === 1 ? "Next".length : "Previous".length;
        const part = this.elementString.length === len ? "" : this.elementString.substr(len);
        this.periodInternal = part.length === 0 ? null : ((Period[part as any] as any) as Period);
    }

    private get viewPeriod(): Period {
        if (this.calendar == null) return null;
        if (this.calendar.currentViewType === CalendarViewType.Week || this.calendar.currentViewType === CalendarViewType.AgendaWeek) {
            return Period.Week;
        } else if (this.calendar.currentViewType === CalendarViewType.Day || this.calendar.currentViewType === CalendarViewType.AgendaDay) {
            return Period.Day;
        } else {
            return Period.Month;
        }
    }

    private get period(): Period {
        return this.periodInternal || this.viewPeriod;
    }

    private get contentClass(): string {
        return `cal-icon cal-${this.period <= this.viewPeriod ? "" : "d"}${this.periodValue === 1 ? "next" : "prev"}`;
    }

    protected getContent(): string {
        return `<span class="${this.contentClass}"></span>`;
    }

    click(): void {
        if (this.calendar == null) return;
        this.calendar.changeDate(this.periodValue, this.period);
    }
}