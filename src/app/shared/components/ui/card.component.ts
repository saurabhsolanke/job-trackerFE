import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="['rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50', customClass]">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  @Input() customClass = '';
}

@Component({
  selector: 'ui-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="['flex flex-col space-y-1.5 p-6', customClass]">
      <ng-content></ng-content>
    </div>
  `
})
export class CardHeaderComponent {
  @Input() customClass = '';
}

@Component({
  selector: 'ui-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 [ngClass]="['font-semibold leading-none tracking-tight text-lg text-zinc-900 dark:text-zinc-50', customClass]">
      <ng-content></ng-content>
    </h3>
  `
})
export class CardTitleComponent {
  @Input() customClass = '';
}

@Component({
  selector: 'ui-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [ngClass]="['text-sm text-zinc-500 dark:text-zinc-400', customClass]">
      <ng-content></ng-content>
    </p>
  `
})
export class CardDescriptionComponent {
  @Input() customClass = '';
}

@Component({
  selector: 'ui-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="['p-6', customClass]">
      <ng-content></ng-content>
    </div>
  `
})
export class CardContentComponent {
  @Input() customClass = '';
}

@Component({
  selector: 'ui-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="['flex items-center p-6 pt-0', customClass]">
      <ng-content></ng-content>
    </div>
  `
})
export class CardFooterComponent {
  @Input() customClass = '';
}
