var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { PlanningTools } from './planning.tools.js';
import { DestinationsService } from './destinations.service.js';
import { PhotoService } from './photo.service.js';
let PlanningModule = class PlanningModule {
};
PlanningModule = __decorate([
    Module({
        name: 'planning',
        description: 'Collect group trip preferences and recommend the best destination',
        controllers: [PlanningTools],
        providers: [DestinationsService, PhotoService],
    })
], PlanningModule);
export { PlanningModule };
//# sourceMappingURL=planning.module.js.map