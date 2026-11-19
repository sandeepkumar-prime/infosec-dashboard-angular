import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'success' | 'info' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/** Simple in-app toast notifications. */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  static readonly AUTO_DISMISS_MS = 4000;

  private nextId = 1;
  private readonly toastsSubject = new BehaviorSubject<Toast[]>([]);
  readonly toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  show(message: string, type: ToastType = 'success'): number {
    const toast: Toast = { id: this.nextId++, message, type };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);
    setTimeout(() => this.dismiss(toast.id), NotificationService.AUTO_DISMISS_MS);
    return toast.id;
  }

  dismiss(id: number): void {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }
}
