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
    }),
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public showNavbar = model<boolean>();

  public toggleNavbar() {
    this.showNavbar.update(() => !this.showNavbar());
  }
}
