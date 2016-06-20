import { CalendarViewType } from "./CalendarViewType";
import { CalendarToolbarButtonType } from "./CalendarToolbarButtonType"
import Moment = moment.Moment;

export abstract class LocalizationService {
    abstract formatDate(date: Moment, format: string): string;
    abstract getViewName(viewType: CalendarViewType): string;
    abstract getButtonText(button: CalendarToolbarButtonType): string;
}