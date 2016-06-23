import { Component } from "@angular/core";
import { ToolbarComponent } from "./ToolbarComponent";
import { AgendaViewComponent } from "./AgendaViewComponent";
import { CalendarViewType } from "../interfaces/CalendarViewType";
import { CalendarToolbarButtonType } from "../interfaces/CalendarToolbarButtonType";
import { CalendarAgendaSettings } from "../interfaces/CalendarAgendaSettings";
import { CalendarToolbarSettings } from "../interfaces/CalendarToolbarSettings";
import { CalendarSettings } from "../interfaces/CalendarSettings";
import { Period } from "../core/Period";
import Moment = moment.Moment;

@Component({
    selector: "calendar",
    templateUrl: "calendar/components/CalendarComponent.html",
    directives: [ToolbarComponent, AgendaViewComponent]
})
export class CalendarComponent {
    toolbarSettings: CalendarToolbarSettings;
    agendaSettings: CalendarAgendaSettings;
    currentDate: Moment;
    todayDate: Moment;
    currentViewType: CalendarViewType;
    thisCalendar: CalendarComponent;

    constructor(private settings?: CalendarSettings) {
        this.toolbarSettings = (settings && settings.toolbar) || {
            left: [[CalendarToolbarButtonType.Previous, CalendarToolbarButtonType.Next], [CalendarToolbarButtonType.Today]],
            center: [["F"]],
            right: [[CalendarViewType.Month, CalendarViewType.Week, CalendarViewType.Day]]
        };

        this.agendaSettings = settings && settings.agenda || {
            dateFormat: "l", axisFormat: "LT"
        };
        this.todayDate = CalendarComponent.stripTime(moment());
        this.currentDate = this.todayDate;
        this.currentViewType = CalendarViewType.AgendaDay;
        this.thisCalendar = this;
    }

    private static stripTime(date: Moment): Moment {
        return moment(date.format("YYYYMMDD"), "YYYYMMDD", true);
    }

    gotoToday() {
        this.currentDate = this.todayDate;
    }

    gotoDate(date: Moment) {
        this.currentDate = date;
    }

    changeDate(n: number, p: Period) {
        switch (p) {
            case Period.Day:
                this.currentDate = CalendarComponent.stripTime(this.currentDate.clone().add(n, "d"));
                break;
            case Period.Week:
                this.currentDate = CalendarComponent.stripTime(this.currentDate.clone().add(n, "w"));
                break;
            case Period.Month:
                this.currentDate = CalendarComponent.stripTime(this.currentDate.clone().add(n, "M"));
                break;
            case Period.Year:
                this.currentDate = CalendarComponent.stripTime(this.currentDate.clone().add(n, "y"));
                break;
        };
    }
};