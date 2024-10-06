import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { HlmIconModule } from '../../components/ui/ui-icon-helm/src/index';
import { HlmIconComponent } from '../../components/ui/ui-icon-helm/src/lib/hlm-icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardDescriptionDirective,
    HlmCardContentDirective,
    HlmCardFooterDirective,
    HlmSeparatorDirective,
    HlmIconModule,
    HlmSeparatorDirective,
    HlmIconComponent,
  ],
  providers: [
    provideIcons({
      lucideArrowRight,
    }),
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  public ngOnInit(): void {
    this.http.get('http://localhost:8080/api/auth/me').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.http.get('http://localhost:8080/api/auth/me').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.http.get('http://localhost:8080/api/auth/me').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
