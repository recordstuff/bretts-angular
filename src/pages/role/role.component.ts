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
import { filter, finalize, switchMap, tap } from 'rxjs'
import { AppSnackbarService } from '../../components/AppSnackbar'
import { YesNoDialogComponent } from '../../components/YesNoDialog'
import { NameGuidPair } from '../../models/NameGuidPair'
import { RoleNew } from '../../models/RoleNew'
import { AppStateService } from '../../services/AppState'
import { RoleClient } from '../../services/RoleClient'
import { SuccessMessageService } from '../../services/SuccessMessage'

const emptyRole = (): NameGuidPair => ({Guid: '', Name: ''})

@Component({
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: 'role.component.html',
    styleUrl: 'role.component.scss',
})
export class RoleComponent implements OnInit {
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

    readonly form = this.formBuilder.nonNullable.group({
        Name: ['', Validators.required],
    })
    readonly role = signal<NameGuidPair>(emptyRole())
    readonly isEdit = signal(false)
    readonly isSaving = signal(false)

    private roleId: string | null = null

    ngOnInit(): void {
        this.roleId = this.activatedRoute.snapshot.paramMap.get('id')
        this.isEdit.set(this.roleId !== null)

        let pageTitle = 'Add Role'
        let url = '/role'

        if (this.roleId !== null) {
            pageTitle = 'Edit Role'
            url = `${url}/${this.roleId}`
        }

        this.appState.setPageTitle(pageTitle)
        this.appState.addBreadcrumb({title: pageTitle, url})

        const successMessage = this.successMessage.take()

        if (successMessage !== null && this.isEdit()) {
            this.snackbar.show(successMessage, 'success')
        }

        this.loadRole()
    }

    save(): void {
        this.snackbar.dismiss()

        if (this.form.invalid) {
            this.form.markAllAsTouched()
            this.snackbar.show('Complete the required role fields.', 'warning')
            return
        }

        if (this.isSaving()) {
            return
        }

        this.isSaving.set(true)

        if (this.isEdit()) {
            this.roleClient.updateRole(this.formRole())
                .pipe(
                    takeUntilDestroyed(this.destroyRef),
                    finalize(() => this.isSaving.set(false)),
                )
                .subscribe({
                    next: role => {
                        this.setRole(role)
                        this.snackbar.show('This role was saved.', 'success')
                    },
                    error: error => this.handleSaveError(error),
                })
            return
        }

        const newRole: RoleNew = {
            Name: this.form.controls.Name.value.trim(),
        }

        this.roleClient.insertRole(newRole)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.isSaving.set(false)),
            )
            .subscribe({
                next: role => {
                    this.successMessage.store('This role was created.')
                    void this.router.navigate(['/role', role.Guid])
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

        this.loadRole()
    }

    confirmDelete(): void {
        const roleId = this.roleId

        if (roleId === null) {
            return
        }

        this.dialog.open(YesNoDialogComponent, {
            data: {question: 'Are you sure you want to delete this role?'},
        })
            .afterClosed()
            .pipe(
                filter((confirmed): confirmed is true => confirmed === true),
                tap(() => this.isSaving.set(true)),
                switchMap(() => this.roleClient.deleteRole(roleId).pipe(
                    finalize(() => this.isSaving.set(false)),
                )),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: () => {
                    this.successMessage.store('This role was deleted.')
                    void this.router.navigate(['/roles'])
                },
                error: error => this.handleDeleteError(error),
            })
    }

    private loadRole(): void {
        const roleId = this.roleId

        if (roleId === null) {
            return
        }

        this.roleClient.getRole(roleId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: role => this.setRole(role),
                error: error => this.errorHandler.handleError(error),
            })
    }

    private setRole(role: NameGuidPair): void {
        this.role.set(role)
        this.form.reset({Name: role.Name})
    }

    private formRole(): NameGuidPair {
        return {
            Guid: this.role().Guid,
            Name: this.form.controls.Name.value.trim(),
        }
    }

    private handleSaveError(error: unknown): void {
        if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.Conflict) {
            this.snackbar.show('A role with this name already exists.', 'warning')
            return
        }

        this.errorHandler.handleError(error)
    }

    private handleDeleteError(error: unknown): void {
        if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.Conflict) {
            this.snackbar.show('This role is assigned to one or more users and cannot be deleted.', 'warning')
            return
        }

        this.errorHandler.handleError(error)
    }
}
