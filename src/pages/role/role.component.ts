import { Component, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { Observable } from 'rxjs'
import { EntityEditorBase } from '../../components/EntityEditorBase'
import { EntityFormActionsComponent } from '../../components/EntityFormActions'
import { NameGuidPair } from '../../models/NameGuidPair'
import { RoleNew } from '../../models/RoleNew'
import { RoleClient } from '../../services/RoleClient'

const emptyRole = (): NameGuidPair => ({Guid: '', Name: ''})

@Component({
    standalone: true,
    imports: [
        EntityFormActionsComponent,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: 'role.component.html',
})
export class RoleComponent extends EntityEditorBase<NameGuidPair> {
    private readonly formBuilder = inject(FormBuilder)
    private readonly roleClient = inject(RoleClient)

    readonly form = this.formBuilder.nonNullable.group({
        Name: ['', Validators.required],
    })
    readonly role = signal<NameGuidPair>(emptyRole())

    constructor() {
        super({
            entityName: 'Role',
            itemPath: '/role',
            listPath: '/roles',
            duplicateField: 'name',
        })
    }

    save(): void {
        this.snackbar.dismiss()

        if (this.form.invalid) {
            this.form.markAllAsTouched()
            this.showRequiredFieldsWarning()
            return
        }

        this.saveEntity(
            () => this.roleClient.updateRole(this.formRole()),
            () => {
                const newRole: RoleNew = {
                    Name: this.form.controls.Name.value.trim(),
                }

                return this.roleClient.insertRole(newRole)
            },
        )
    }

    protected override loadEntity(): void {
        const roleId = this.entityId

        if (roleId === null) {
            return
        }

        this.roleClient.getRole(roleId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: role => this.setEntity(role),
                error: error => this.errorHandler.handleError(error),
            })
    }

    protected override setEntity(role: NameGuidPair): void {
        this.role.set(role)
        this.form.reset({Name: role.Name})
    }

    protected override deleteEntity(id: string): Observable<boolean> {
        return this.roleClient.deleteRole(id)
    }

    protected override handleDeleteError(error: unknown): void {
        if (this.isConflict(error)) {
            this.snackbar.show(
                'This role is assigned to one or more users and cannot be deleted.',
                'warning',
            )
            return
        }

        super.handleDeleteError(error)
    }

    private formRole(): NameGuidPair {
        return {
            Guid: this.role().Guid,
            Name: this.form.controls.Name.value.trim(),
        }
    }
}
