import { CalendarComponent } from "../components/CalendarComponent";
import { LocalizationService } from "../interfaces/LocalizationService";
import { CalendarViewType } from "../interfaces/CalendarViewType";
import { ToolbarElement } from "./ToolbarElement";
import { ClassMap } from "../core/ClassMap";


export class ViewButton extends ToolbarElement {
    constructor(element: CalendarViewType, calendar: CalendarComponent, localizationService: LocalizationService) {
        super(element, calendar, localizationService);
        this.viewType = element as CalendarViewType;
    }

    protected getContent(): string {
        return this.localizationService.getViewName(this.viewType);
    }

    click(): void {
        if (this.calendar == null) return;
        this.calendar.currentViewType = this.viewType;
    }
    private viewType: CalendarViewType;
    private savedView: CalendarViewType;
    protected get classesChanged(): boolean {
        return this.calendar == null ? false : this.savedView !== this.calendar.currentViewType;
    }

    protected calculateClasses(): ClassMap {
        if (this.calendar == null) return {};

        this.savedView = this.calendar.currentViewType;
        if (this.savedView === this.viewType) {
            return { "cal-down": true };
        }
        return {};
    }

    get down(): boolean {
        return this.calendar == null ? false : (this.calendar.currentViewType === this.viewType);
    }
}