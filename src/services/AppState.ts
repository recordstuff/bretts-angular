import { Injectable, signal } from '@angular/core'
import { VisitedPage } from '../models/VisitedPage'

const BREADCRUMBS_SESSION_KEY = 'OurBreadcrumbs'

@Injectable({ providedIn: 'root' })
export class AppStateService {
    private readonly currentBreadcrumbs = signal<VisitedPage[]>(this.initialBreadcrumbs())
    private readonly currentPageTitle = signal('')

    readonly breadcrumbs = this.currentBreadcrumbs.asReadonly()
    readonly pageTitle = this.currentPageTitle.asReadonly()

    firstBreadcrumb(visitedPage: VisitedPage): void {
        this.persistBreadcrumbs([visitedPage])
    }

    addBreadcrumb(visitedPage: VisitedPage): void {
        const breadcrumbs = this.currentBreadcrumbs()
        const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1]

        if (lastBreadcrumb?.title === visitedPage.title
            && lastBreadcrumb.url === visitedPage.url) {
            return
        }

        this.persistBreadcrumbs([...breadcrumbs, visitedPage])
    }

    setPageTitle(title: string): void {
        this.currentPageTitle.set(title)
    }

    private initialBreadcrumbs(): VisitedPage[] {
        const persistedBreadcrumbs = sessionStorage.getItem(BREADCRUMBS_SESSION_KEY)

        return persistedBreadcrumbs === null
            ? []
            : JSON.parse(persistedBreadcrumbs) as VisitedPage[]
    }

    private persistBreadcrumbs(breadcrumbs: VisitedPage[]): void {
        sessionStorage.setItem(BREADCRUMBS_SESSION_KEY, JSON.stringify(breadcrumbs))
        this.currentBreadcrumbs.set(breadcrumbs)
    }
}
