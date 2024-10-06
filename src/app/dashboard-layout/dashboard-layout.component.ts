import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { distinctUntilChanged, fromEvent, map, startWith } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HeaderComponent, NgClass],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {
  public toggleNavbar = signal(window.innerWidth >= 768);
  private isMinimize = !(window.innerWidth < 768);

  private windowSize = fromEvent(window, 'resize').pipe(
    map(() => window.innerWidth),
    startWith(window.innerWidth),
    map((width) => width >= 768),
    distinctUntilChanged()
  );

  public ngOnInit(): void {
    this.windowSize.subscribe((newIsMinimize) => {
      if (newIsMinimize !== this.isMinimize) {
        this.isMinimize = newIsMinimize;
        this.toggleNavbar.update((v) => this.isMinimize);
      }
    });
  }
}
