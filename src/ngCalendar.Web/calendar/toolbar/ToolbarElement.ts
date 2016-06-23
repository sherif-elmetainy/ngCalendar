import { CalendarToolbarElementSetting } from "../interfaces/CalendarToolbarSettings";
import { LocalizationService } from "../interfaces/LocalizationService";
import { CalendarToolbarButtonType } from "../interfaces/CalendarToolbarButtonType";
import { CalendarViewType } from "../interfaces/CalendarViewType";
import { ClassMap } from "../core/ClassMap";
import { CalendarComponent } from "../components/CalendarComponent";

export abstract class ToolbarElement {
    private classMap: ClassMap;

    constructor(public element: CalendarToolbarElementSetting, public calendar: CalendarComponent, public localizationService: LocalizationService) {
    }

    get elementType(): string {
        if (typeof (this.element) === "number") {
            if (this.element >= CalendarToolbarButtonType.Previous) {
                return "CalendarToolbarButtonType";
            }
            else
                return "CalendarViewType";
        }
        return "Title";
    }

    get disabled(): boolean {
        return false;
    }

    get down(): boolean {
        return false;
    }

    protected abstract getContent(): string;

    get content(): string {
        return this.getContent();
    }

    get classes(): ClassMap {
        if (this.classesChanged) {
            this.classMap = this.calculateClasses();
        }
        return this.classMap;
    }

    protected calculateClasses(): ClassMap {
        return {};
    }

    protected get classesChanged(): boolean {
        return false;
    }
};