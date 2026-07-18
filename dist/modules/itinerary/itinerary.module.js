var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { ItineraryTools } from './itinerary.tools.js';
import { ItineraryService } from './itinerary.service.js';
import { DestinationsService } from '../planning/destinations.service.js';
let ItineraryModule = class ItineraryModule {
};
ItineraryModule = __decorate([
    Module({
        name: 'itinerary',
        description: 'Build and review day-wise group trip itineraries',
        controllers: [ItineraryTools],
        providers: [ItineraryService, DestinationsService],
    })
], ItineraryModule);
export { ItineraryModule };
//# sourceMappingURL=itinerary.module.js.map