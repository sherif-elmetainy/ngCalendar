import { ToolbarElement } from "./ToolbarElement";
import { ToolbarElementFactory } from "./ToolbarElementFactory";
import { CalendarToolbarElementSetting } from "../interfaces/CalendarToolbarSettings";
import { LocalizationService } from "../interfaces/LocalizationService";
import { CalendarComponent } from "../components/CalendarComponent";

export class ToolbarGroup {
    elements: ToolbarElement[];
    constructor(elements: CalendarToolbarElementSetting[], public calendar: CalendarComponent, public localizationService: LocalizationService) {
        this.elements = elements.map(e => ToolbarElementFactory.createToolbarElement(e, calendar, localizationService));
    }
};