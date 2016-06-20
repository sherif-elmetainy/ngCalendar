import { LocalizationService } from "../interfaces/LocalizationService";
import { ToolbarElement } from "./ToolbarElement";
import { CalendarToolbarButtonType } from "../interfaces/CalendarToolbarButtonType";
import { CalendarViewType } from "../interfaces/CalendarViewType";
import { CalendarComponent } from "../components/CalendarComponent";

export class ToolbarTitle extends ToolbarElement {
    constructor(element: string, calendar: CalendarComponent, public localizationService: LocalizationService) {
        super(element, calendar, localizationService);
    }

    protected getContent(): string {
        return this.calendar == null ? "" : this.localizationService.formatDate(this.calendar.currentDate, this.element as string);
    }

    click(): void {
        // Do nothing
    }
}