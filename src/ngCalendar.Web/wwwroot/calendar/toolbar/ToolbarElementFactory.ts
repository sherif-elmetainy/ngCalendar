import { CalendarToolbarElementSetting } from "../interfaces/CalendarToolbarSettings";
import { CalendarToolbarButtonType } from "../interfaces/CalendarToolbarButtonType";
import { ToolbarElement } from "./ToolbarElement";
import { TodayButton } from "./TodayButton";
import { ChangeDateButton } from "./ChangeDateButton";
import { ViewButton } from "./ViewButton";
import { ToolbarTitle } from "./ToolbarTitle";
import { CalendarViewType } from "../interfaces/CalendarViewType";
import { CalendarComponent } from "../components/CalendarComponent";
import { LocalizationService } from "../interfaces/LocalizationService";

export class ToolbarElementFactory {
    static createToolbarElement(element: CalendarToolbarElementSetting, calendar: CalendarComponent, localizationService: LocalizationService): ToolbarElement {
        if (typeof (element) === "number") {
            if (element >= CalendarToolbarButtonType.Previous) {
                if (element === CalendarToolbarButtonType.Today) {
                    return new TodayButton(element as CalendarToolbarButtonType, calendar, localizationService);
                } else
                    return new ChangeDateButton(element as CalendarToolbarButtonType, calendar, localizationService);
            } else {
                return new ViewButton(element as CalendarViewType, calendar, localizationService);
            }
        }
        return new ToolbarTitle(element as string, calendar, localizationService);
    }
}