import { Component, Input } from "@angular/core";
import { LocalizationService } from "../interfaces/LocalizationService";
import { ToolbarSection } from "../toolbar/ToolbarSection";
import { CalendarToolbarSettings } from "../interfaces/CalendarToolbarSettings";
import { CalendarComponent } from "../components/CalendarComponent";

@Component({
    selector: "toolbar",
    templateUrl: "calendar/components/ToolbarComponent.html"
})
export class ToolbarComponent {
    constructor(public localizationService: LocalizationService) {

    }

    @Input() calendar: CalendarComponent;
    @Input() settings: CalendarToolbarSettings;

    private savedSettings: CalendarToolbarSettings;
    private savedSections: ToolbarSection[];
    private savedCalendar: CalendarComponent;

    get sections(): ToolbarSection[] {
        if (this.savedSettings === this.settings && this.savedCalendar === this.calendar) {
            return this.savedSections;
        }
        this.savedSections = [
            new ToolbarSection("cal-left", this.settings.left, this.calendar, this.localizationService),
            new ToolbarSection("cal-center", this.settings.center, this.calendar, this.localizationService),
            new ToolbarSection("cal-right", this.settings.right, this.calendar, this.localizationService)
        ];
        this.savedSettings = this.settings;
        this.savedCalendar = this.calendar;
        return this.savedSections;
    }
};