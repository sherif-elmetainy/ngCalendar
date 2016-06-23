import { CalendarViewType } from "./CalendarViewType"
import { CalendarToolbarButtonType } from "./CalendarToolbarButtonType"

export type CalendarToolbarElementSetting = CalendarViewType | CalendarToolbarButtonType | string;
export type CalendarToolbarGroupSettings = CalendarToolbarElementSetting[];

export interface CalendarToolbarSettings {
    left?: CalendarToolbarGroupSettings[];
    center?: CalendarToolbarGroupSettings[];
    right?: CalendarToolbarGroupSettings[];
};