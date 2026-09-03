import { Component, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { Observable, forkJoin } from 'rxjs'
import { EntityEditorBase } from '../../components/EntityEditorBase'
import { EntityFormActionsComponent } from '../../components/EntityFormActions'
import { ItemsSelectorComponent } from '../../components/ItemsSelector'
import { NameGuidPair } from '../../models/NameGuidPair'
import { emptyUserDetail, UserDetail } from '../../models/UserDetail'
import { UserNew } from '../../models/UserNew'
import { RoleClient } from '../../services/RoleClient'
import { UserClient } from '../../services/UserClient'

@Component({
    imports: [
        EntityFormActionsComponent,
        ItemsSelectorComponent,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: 'user.component.html'
})
export class UserComponent extends EntityEditorBase<UserDetail> {
    private readonly formBuilder = inject(FormBuilder)
    private readonly roleClient = inject(RoleClient)
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

    constructor() {
        super({
            entityName: 'User',
            itemPath: '/user',
            listPath: '/users',
            duplicateField: 'email',
        })
    }

    rolesChanged(roles: NameGuidPair[]): void {
        this.selectedRoles.set(roles)
    }

    save(): void {
        this.snackbar.dismiss()

        if (this.form.invalid) {
            this.form.markAllAsTouched()
            this.showRequiredFieldsWarning()
            return
        }

        if (this.selectedRoles().length === 0) {
            this.snackbar.show('Select at least one role.', 'warning')
            return
        }

        this.saveEntity(
            () => this.userClient.updateUser(this.formUser()),
            () => {
                const newUser: UserNew = {
                    ...this.formUser(),
                    Password: this.form.controls.Password.value,
                }

                return this.userClient.insertUser(newUser)
            },
        )
    }

    protected override initialize(): void {
        if (!this.isEdit()) {
            this.form.controls.Password.addValidators(Validators.required)
            this.form.controls.Password.updateValueAndValidity()
        }
    }

    protected override loadEntity(): void {
        const userId = this.entityId

        if (userId === null) {
            this.roleClient.getAllRoles()
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: roles => this.roles.set(roles),
                    error: error => this.errorHandler.handleError(error),
                })
            return
        }

        forkJoin({
            roles: this.roleClient.getAllRoles(),
            user: this.getEntity(userId),
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ({roles, user}) => {
                    this.roles.set(roles)
                    this.setEntity(user)
                },
                error: error => this.errorHandler.handleError(error),
            })
    }

    protected override getEntity(id: string): Observable<UserDetail> {
        return this.userClient.getUser(id)
    }

    protected override setEntity(user: UserDetail): void {
        this.user.set(user)
        this.selectedRoles.set([...user.Roles])
        this.form.reset({
            DisplayName: user.DisplayName,
            Email: user.Email,
            Phone: user.Phone ?? '',
            Password: '',
        })
    }

    protected override deleteEntity(id: string): Observable<boolean> {
        return this.userClient.deleteUser(id)
    }

    private formUser(): UserDetail {
        const values = this.form.getRawValue()
        const normalizedPhone = values.Phone.trim()
        let phone: string | null = normalizedPhone

        if (normalizedPhone.length === 0) {
            phone = null
        }

        return {
            Guid: this.user().Guid,
            DisplayName: values.DisplayName.trim(),
            Email: values.Email.trim(),
            Phone: phone,
            Roles: [...this.selectedRoles()],
        }
    }
}
