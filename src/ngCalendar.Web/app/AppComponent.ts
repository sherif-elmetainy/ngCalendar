import { Component } from "@angular/core";
import { CalendarComponent } from "../calendar/index";

@Component({
    selector: "calendar-app",
    templateUrl: "app/AppComponent.html",
    directives: [ CalendarComponent]
})
export class AppComponent { }