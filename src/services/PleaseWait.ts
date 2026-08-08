import { Injectable, computed, signal } from '@angular/core'

@Injectable({providedIn: 'root'})
export class PleaseWaitService {
    private readonly mutableWaitCount = signal(0)

    readonly waitCount = this.mutableWaitCount.asReadonly()
    readonly isWaiting = computed(() => this.waitCount() > 0)

    pleaseWait(): void {
        this.mutableWaitCount.update(waitCount => waitCount + 1)
    }

    doneWaiting(): void {
        this.mutableWaitCount.update(waitCount => Math.max(waitCount - 1, 0))
    }

    clearAllWaits(): void {
        this.mutableWaitCount.set(0)
    }
}
