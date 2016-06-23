import { CalendarComponent } from "../components/CalendarComponent";
import { LocalizationService } from "../interfaces/LocalizationService";
import { CalendarToolbarButtonType } from "../interfaces/CalendarToolbarButtonType";
import { ToolbarElement } from "./ToolbarElement";

export class TodayButton extends ToolbarElement {
    constructor(element: CalendarToolbarButtonType, calendar: CalendarComponent, localizationService: LocalizationService) {
        super(element, calendar, localizationService);
    }

    protected getContent(): string {
        return this.localizationService.getButtonText(CalendarToolbarButtonType.Today);
    }

    click(): void {
        if (this.calendar == null) {
            return;
        }
        this.calendar.gotoToday();
    }

    get disabled(): boolean {
        return this.calendar == null ? false : (this.calendar.currentDate.valueOf() === this.calendar.todayDate.valueOf());
    }
}