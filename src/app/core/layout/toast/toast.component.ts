import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { NotificationService, Toast } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  readonly toasts$: Observable<Toast[]>;

  constructor(private notifications: NotificationService) {
    this.toasts$ = notifications.toasts$;
  }

  dismiss(id: number): void {
    this.notifications.dismiss(id);
  }

  trackById(index: number, toast: Toast): number {
    return toast.id;
  }
}
