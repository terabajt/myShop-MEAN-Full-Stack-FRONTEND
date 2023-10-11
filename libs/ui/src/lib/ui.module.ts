import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner/banner.component';
import { SliderComponent } from './slider/slider.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [CommonModule, ButtonModule],
    declarations: [BannerComponent, SliderComponent],
    exports: [BannerComponent]
})
export class UiModule {}
