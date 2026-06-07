import { ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-home-intro',
  standalone: true,
  templateUrl: './home-intro.component.html',
  styleUrl: './home-intro.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeIntroComponent implements OnDestroy {
  protected readonly showIntro = signal(true);

  private readonly introDurationMs = 3000;
  private readonly introExitDurationMs = 320;
  private readonly introTimeout = window.setTimeout(() => {
    this.showIntro.set(false);
  }, this.introDurationMs + this.introExitDurationMs);

  ngOnDestroy(): void {
    window.clearTimeout(this.introTimeout);
  }
}
