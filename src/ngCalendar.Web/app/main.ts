import { bootstrap }    from "@angular/platform-browser-dynamic";
import { bind, provide } from "@angular/core";
import { CalendarSettings, LocalizationService, DefaultLocalizationService, EventSourceCollection } from "../calendar/index";
import { AppComponent } from "./AppComponent";
import { calendarSettings } from "./CalendarSettings";
import { TestEventSource } from "./TestEventSource";

bootstrap(AppComponent, [provide(CalendarSettings, { useValue: calendarSettings }),
    provide(LocalizationService, { useValue: new DefaultLocalizationService("en") }),
    provide(EventSourceCollection, { useValue: new EventSourceCollection([new TestEventSource("Test 1"), new TestEventSource("Test 2")]) })
]);