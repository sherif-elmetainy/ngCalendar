import { CalendarViewType } from "../interfaces/CalendarViewType";
import { CalendarToolbarButtonType } from "../interfaces/CalendarToolbarButtonType";
import Moment = moment.Moment;

export class DefaultLocalizationService {

    constructor(public lang: string) {
    }

    formatDate(date: Moment, format: string): string {
        return date.format(format);
    }

    getViewName(viewType: CalendarViewType): string {
        return CalendarViewType[viewType];
    }

    getButtonText(button: CalendarToolbarButtonType): string {
        return CalendarToolbarButtonType[button];
    }
}