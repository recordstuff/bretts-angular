import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { finalize } from 'rxjs'
import { PleaseWaitService } from './PleaseWait'

export const pleaseWaitInterceptor: HttpInterceptorFn = (request, next) => {
    const pleaseWait = inject(PleaseWaitService)

    pleaseWait.pleaseWait()

    return next(request).pipe(
        finalize(() => pleaseWait.doneWaiting()),
    )
}
