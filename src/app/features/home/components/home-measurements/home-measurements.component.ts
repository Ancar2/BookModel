import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface HomeMeasurementItem {
  iconSrc: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-home-measurements',
  standalone: true,
  templateUrl: './home-measurements.component.html',
  styleUrl: './home-measurements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeMeasurementsComponent {
  readonly items = input.required<readonly HomeMeasurementItem[]>();
}
