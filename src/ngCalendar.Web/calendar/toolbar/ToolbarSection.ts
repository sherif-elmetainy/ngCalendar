import { ToolbarGroup } from "./ToolbarGroup";
import { LocalizationService } from "../interfaces/LocalizationService";
import { CalendarToolbarGroupSettings } from "../interfaces/CalendarToolbarSettings"
import { CalendarComponent } from "../components/CalendarComponent";

export class ToolbarSection {
    public groups: ToolbarGroup[];
    constructor(public className: string, groups: CalendarToolbarGroupSettings[], public calendar: CalendarComponent, public localizationService: LocalizationService) {
        this.groups = groups.map(g => new ToolbarGroup(g, calendar, this.localizationService));
    }
};