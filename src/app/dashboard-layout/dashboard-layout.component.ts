import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppTopMenuComponent } from "../app-top-menu/app-top-menu.component";

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, AppTopMenuComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {

}
