import { Location } from '@angular/common'
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http'
import { Component, DestroyRef, ErrorHandler, OnInit, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { ActivatedRoute, Router } from '@angular/router'
import { filter, finalize, forkJoin, switchMap, tap } from 'rxjs'
import { AppSnackbarService } from '../../components/AppSnackbar'
import { ItemsSelectorComponent } from '../../components/ItemsSelector'
import { YesNoDialogComponent } from '../../components/YesNoDialog'
import { NameGuidPair } from '../../models/NameGuidPair'
import { emptyUserDetail, UserDetail } from '../../models/UserDetail'
import { UserNew } from '../../models/UserNew'
import { AppStateService } from '../../services/AppState'
import { RoleClient } from '../../services/RoleClient'
import { SuccessMessageService } from '../../services/SuccessMessage'
import { UserClient } from '../../services/UserClient'

@Component({
    standalone: true,
    imports: [
        ItemsSelectorComponent,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: 'user.component.html',
    styleUrl: 'user.component.scss',
})
export class UserComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly appState = inject(AppStateService)
    private readonly destroyRef = inject(DestroyRef)
    private readonly dialog = inject(MatDialog)
    private readonly errorHandler = inject(ErrorHandler)
    private readonly formBuilder = inject(FormBuilder)
    private readonly location = inject(Location)
    private readonly roleClient = inject(RoleClient)
    private readonly router = inject(Router)
    private readonly snackbar = inject(AppSnackbarService)
    private readonly successMessage = inject(SuccessMessageService)
    private readonly userClient = inject(UserClient)

    readonly form = this.formBuilder.nonNullable.group({
        DisplayName: ['', Validators.required],
        Email: ['', [Validators.required, Validators.email]],
        Phone: [''],
        Password: [''],
    })
    readonly roles = signal<NameGuidPair[]>([])
    readonly selectedRoles = signal<NameGuidPair[]>([])
    readonly user = signal<UserDetail>(emptyUserDetail())
    readonly isEdit = signal(false)
    readonly isSaving = signal(false)

    private userId: string | null = null

    ngOnInit(): void {
        this.userId = this.activatedRoute.snapshot.paramMap.get('id')
        this.isEdit.set(this.userId !== null)
        const pageTitle = this.isEdit() ? 'Edit User' : 'Add User'
        const url = this.userId === null ? '/user' : `/user/${this.userId}`
        this.appState.setPageTitle(pageTitle)
        this.appState.addBreadcrumb({title: pageTitle, url})

        if (!this.isEdit()) {
            this.form.controls.Password.addValidators(Validators.required)
            this.form.controls.Password.updateValueAndValidity()
        }

        const successMessage = this.successMessage.take()

        if (successMessage !== null && this.isEdit()) {
            this.snackbar.show(successMessage, 'success')
        }

        this.loadData()
    }

    rolesChanged(roles: NameGuidPair[]): void {
        this.selectedRoles.set(roles)
    }

    save(): void {
        this.snackbar.dismiss()

        if (this.form.invalid) {
            this.form.markAllAsTouched()
            this.snackbar.show('Complete the required user fields.', 'warning')
            return
        }

        if (this.selectedRoles().length === 0) {
            this.snackbar.show('Select at least one role.', 'warning')
            return
        }

        if (this.isSaving()) {
            return
        }

        this.isSaving.set(true)

        if (this.isEdit()) {
            this.userClient.updateUser(this.formUser())
                .pipe(
                    takeUntilDestroyed(this.destroyRef),
                    finalize(() => this.isSaving.set(false)),
                )
                .subscribe({
                    next: user => {
                        this.setUser(user)
                        this.snackbar.show('This user was saved.', 'success')
                    },
                    error: error => this.handleSaveError(error),
                })
            return
        }

        const newUser: UserNew = {
            ...this.formUser(),
            Password: this.form.controls.Password.value,
        }

        this.userClient.insertUser(newUser)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.isSaving.set(false)),
            )
            .subscribe({
                next: user => {
                    this.successMessage.store('This user was created.')
                    void this.router.navigate(['/user', user.Guid])
                },
                error: error => this.handleSaveError(error),
            })
    }

    cancel(): void {
        this.snackbar.dismiss()

        if (!this.isEdit()) {
            this.location.back()
            return
        }

        this.loadUser()
    }

    confirmDelete(): void {
        const userId = this.userId

        if (userId === null) {
            return
        }

        this.dialog.open(YesNoDialogComponent, {
            data: {question: 'Are you sure you want to delete this user?'},
        })
            .afterClosed()
            .pipe(
                filter((confirmed): confirmed is true => confirmed === true),
                tap(() => this.isSaving.set(true)),
                switchMap(() => this.userClient.deleteUser(userId).pipe(
                    finalize(() => this.isSaving.set(false)),
                )),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: () => {
                    this.successMessage.store('This user was deleted.')
                    void this.router.navigate(['/users'])
                },
                error: error => this.errorHandler.handleError(error),
            })
    }

    private loadData(): void {
        const userId = this.userId

        if (userId === null) {
            this.roleClient.getRoles()
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: roles => this.roles.set(roles),
                    error: error => this.errorHandler.handleError(error),
                })
            return
        }

        forkJoin({
            roles: this.roleClient.getRoles(),
            user: this.userClient.getUser(userId),
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ({roles, user}) => {
                    this.roles.set(roles)
                    this.setUser(user)
                },
                error: error => this.errorHandler.handleError(error),
            })
    }

    private loadUser(): void {
        if (this.userId === null) {
            return
        }

        this.userClient.getUser(this.userId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: user => this.setUser(user),
                error: error => this.errorHandler.handleError(error),
            })
    }

    private setUser(user: UserDetail): void {
        this.user.set(user)
        this.selectedRoles.set([...user.Roles])
        this.form.reset({
            DisplayName: user.DisplayName,
            Email: user.Email,
            Phone: user.Phone ?? '',
            Password: '',
        })
    }

    private formUser(): UserDetail {
        const values = this.form.getRawValue()

        return {
            Guid: this.user().Guid,
            DisplayName: values.DisplayName.trim(),
            Email: values.Email.trim(),
            Phone: values.Phone.trim().length === 0 ? null : values.Phone.trim(),
            Roles: [...this.selectedRoles()],
        }
    }

    private handleSaveError(error: unknown): void {
        if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.Conflict) {
            this.snackbar.show('A user with this email already exists.', 'warning')
            return
        }

        this.errorHandler.handleError(error)
    }
}
