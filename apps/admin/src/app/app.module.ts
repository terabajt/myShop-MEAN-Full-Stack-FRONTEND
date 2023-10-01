import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@NgModule({
    declarations: [AppComponent, NxWelcomeComponent, DashboardComponent, ShellComponent, SidebarComponent],
    imports: [BrowserModule, RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' })],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
