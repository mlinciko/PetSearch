import { InjectionToken } from "@angular/core";
import { AnnouncementService, announcementServiceFactory } from "./announcement.service";
import { HttpClient } from "@angular/common/http";
import { AnnouncementType } from "../models/announcement-type";

export const DefaultAnnouncementService = {
  provide: AnnouncementService,
  useFactory: announcementServiceFactory,
  deps: [
    HttpClient,
    new InjectionToken<AnnouncementType>("LN", {
      factory: () => "",
    }),
    new InjectionToken<boolean>("is_housing", {
      factory: () => false,
    }),
  ],
};

export const LandAnnouncementService = {
  provide: AnnouncementService,
  useFactory: announcementServiceFactory,
  deps: [
    HttpClient,
    new InjectionToken<AnnouncementType>("LN", {
      factory: () => "lands",
    }),
    new InjectionToken<boolean>("is_housing", {
      factory: () => false,
    }),
  ],
};

export const FamilyHouseAnnouncementService = {
  provide: AnnouncementService,
  useFactory: announcementServiceFactory,
  deps: [
    HttpClient,
    new InjectionToken<AnnouncementType>("FH", {
      factory: () => "family-houses",
    }),
    new InjectionToken<boolean>("is_housing", {
      factory: () => true,
    }),
  ],
};

export const ApartmentAnnouncementService = {
  provide: AnnouncementService,
  useFactory: announcementServiceFactory,
  deps: [
    HttpClient,
    new InjectionToken<AnnouncementType>("AP", {
      factory: () => "apartments",
    }),
    new InjectionToken<boolean>("is_housing", {
      factory: () => true,
    }),
  ],
};