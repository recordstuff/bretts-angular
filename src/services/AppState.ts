import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class AppStateService {
    private readonly currentPageTitle = signal('')

    readonly pageTitle = this.currentPageTitle.asReadonly()

    setPageTitle(title: string): void {
        this.currentPageTitle.set(title)
    }
}
