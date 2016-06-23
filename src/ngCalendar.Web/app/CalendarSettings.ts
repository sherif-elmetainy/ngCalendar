import { CalendarSettings, CalendarToolbarButtonType, CalendarViewType } from "../calendar/index";

export var calendarSettings: CalendarSettings = {
    toolbar: {
        left: [[CalendarToolbarButtonType.Previous, CalendarToolbarButtonType.Next], [CalendarToolbarButtonType.Today]],
        center: [["LL"]],
        right: [[CalendarViewType.Month, CalendarViewType.AgendaWeek, CalendarViewType.AgendaDay]]
    },
    agenda: {
        axisFormat: "LT",
        dateFormat: "l"
    }
};