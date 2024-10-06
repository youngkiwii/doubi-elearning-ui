import { NgClass, NgIf } from '@angular/common';
import { Component, model } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeftFromLine,
  lucideArrowRightFromLine,
  lucideBookmark,
  lucideCalendarHeart,
  lucideFileBadge,
  lucideFolder,
  lucideGlobe,
  lucideGraduationCap,
  lucideHelpCircle,
  lucideHome,
  lucideLayoutGrid,
  lucideLightbulb,
  lucideMoon,
  lucideSettings,
  lucideSunMoon,
} from '@ng-icons/lucide';
import { HlmIconComponent } from '../../components/ui/ui-icon-helm/src/lib/hlm-icon.component';
import { HlmSeparatorDirective } from '../../components/ui/ui-separator-helm/src/lib/hlm-separator.directive';
import { HlmSwitchComponent } from '../../components/ui/ui-switch-helm/src/lib/hlm-switch.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    HlmIconComponent,
    HlmSeparatorDirective,
    HlmSwitchComponent,
    NgIf,
    NgClass,
  ],
  providers: [
    provideIcons({
      lucideArrowLeftFromLine,
      lucideArrowRightFromLine,
      lucideHome,
      lucideBookmark,
      lucideGraduationCap,
      lucideFolder,
      lucideLightbulb,
      lucideFileBadge,
      lucideLayoutGrid,
      lucideMoon,
      lucideCalendarHeart,
      lucideGlobe,
      lucideSettings,
      lucideHelpCircle,
      lucideSunMoon,
    }),
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public showNavbar = model<boolean>();
  public isDark: boolean = localStorage.getItem('theme') === 'dark';

  ngOnInit(): void {
    if (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  public toggleNavbar() {
    this.showNavbar.update(() => !this.showNavbar());
  }

  public toggleDarkmode() {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      this.isDark = false;
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      this.isDark = true;
    }
  }
}
