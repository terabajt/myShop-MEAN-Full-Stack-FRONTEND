import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UiModule } from '@webappshop/ui';
import { AccordionModule } from 'primeng/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './shared/nav/nav.component';
import { ProductsModule } from '@webappshop/products';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [AppComponent, NxWelcomeComponent, HomePageComponent, HeaderComponent, FooterComponent, NavComponent],
    imports: [
        BrowserModule,
        UiModule,
        ProductsModule,
        HttpClientModule,
        AccordionModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
