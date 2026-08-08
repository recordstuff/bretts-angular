import { TestBed } from '@angular/core/testing'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AppSnackbarComponent, AppSnackbarService } from './AppSnackbar'

describe('AppSnackbarService', () => {
    let service: AppSnackbarService
    let snackbar: jasmine.SpyObj<MatSnackBar>

    beforeEach(() => {
        snackbar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['openFromComponent', 'dismiss'])

        TestBed.configureTestingModule({
            providers: [
                AppSnackbarService,
                {provide: MatSnackBar, useValue: snackbar},
            ],
        })

        service = TestBed.inject(AppSnackbarService)
    })

    it('matches the NextJS snackbar placement and timeout', () => {
        service.show('The Email or Password was incorrect.', 'warning')

        expect(snackbar.openFromComponent).toHaveBeenCalledWith(
            AppSnackbarComponent,
            jasmine.objectContaining({
                data: {
                    message: 'The Email or Password was incorrect.',
                    severity: 'warning',
                },
                duration: 4000,
                horizontalPosition: 'center',
                panelClass: ['app-snackbar-panel', 'app-snackbar-warning'],
                verticalPosition: 'top',
            }),
        )
    })

    it('dismisses the current snackbar', () => {
        service.dismiss()

        expect(snackbar.dismiss).toHaveBeenCalled()
    })
})
