import { Location } from '@angular/common'
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http'
import { DestroyRef, Directive, ErrorHandler, OnInit, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, filter, finalize, switchMap, tap } from 'rxjs'
import { AppStateService } from '../services/AppState'
import { SuccessMessageService } from '../services/SuccessMessage'
import { AppSnackbarService } from './AppSnackbar'
import { YesNoDialogComponent } from './YesNoDialog'

interface EntityEditorOptions {
    entityName: string
    itemPath: string
    listPath: string
    duplicateField: string
}

interface IdentifiableEntity {
    Guid: string
}

@Directive()
export abstract class EntityEditorBase<TEntity extends IdentifiableEntity> implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly appState = inject(AppStateService)
    private readonly dialog = inject(MatDialog)
    private readonly location = inject(Location)
    private readonly router = inject(Router)
    private readonly successMessage = inject(SuccessMessageService)
    protected readonly destroyRef = inject(DestroyRef)
    protected readonly errorHandler = inject(ErrorHandler)
    protected readonly snackbar = inject(AppSnackbarService)

    readonly isEdit = signal(false)
    readonly isSaving = signal(false)

    protected entityId: string | null = null

    protected constructor(private readonly options: EntityEditorOptions) {}

    ngOnInit(): void {
        this.entityId = this.activatedRoute.snapshot.paramMap.get('id')
        this.isEdit.set(this.entityId !== null)

        let pageAction = 'Add'
        let url = this.options.itemPath

        if (this.entityId !== null) {
            pageAction = 'Edit'
            url = `${url}/${this.entityId}`
        }

        const pageTitle = `${pageAction} ${this.options.entityName}`
        this.appState.setPageTitle(pageTitle)
        this.appState.addBreadcrumb({title: pageTitle, url})

        const successMessage = this.successMessage.take()

        if (successMessage !== null && this.isEdit()) {
            this.snackbar.show(successMessage, 'success')
        }

        this.initialize()
        this.loadEntity()
    }

    cancel(): void {
        this.snackbar.dismiss()

        if (!this.isEdit()) {
            this.location.back()
            return
        }

        this.resetEntity()
    }

    confirmDelete(): void {
        const entityId = this.entityId

        if (entityId === null) {
            return
        }

        const entityName = this.options.entityName.toLowerCase()

        this.dialog.open(YesNoDialogComponent, {
            data: {question: `Are you sure you want to delete this ${entityName}?`},
        })
            .afterClosed()
            .pipe(
                filter((confirmed): confirmed is true => confirmed === true),
                tap(() => this.isSaving.set(true)),
                switchMap(() => this.deleteEntity(entityId).pipe(
                    finalize(() => this.isSaving.set(false)),
                )),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: () => {
                    this.successMessage.store(`This ${entityName} was deleted.`)
                    void this.router.navigate([this.options.listPath])
                },
                error: error => this.handleDeleteError(error),
            })
    }

    protected initialize(): void {}

    protected resetEntity(): void {
        this.loadEntity()
    }

    protected showRequiredFieldsWarning(): void {
        const entityName = this.options.entityName.toLowerCase()
        this.snackbar.show(`Complete the required ${entityName} fields.`, 'warning')
    }

    protected saveEntity(
        updateEntity: () => Observable<TEntity>,
        insertEntity: () => Observable<TEntity>,
    ): void {
        if (this.isSaving()) {
            return
        }

        this.isSaving.set(true)

        let request: Observable<TEntity>

        if (this.isEdit()) {
            request = updateEntity()
        }
        else {
            request = insertEntity()
        }

        request
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.isSaving.set(false)),
            )
            .subscribe({
                next: entity => this.entitySaved(entity),
                error: error => this.handleSaveError(error),
            })
    }

    protected isConflict(error: unknown): boolean {
        return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Conflict
    }

    protected handleDeleteError(error: unknown): void {
        this.errorHandler.handleError(error)
    }

    protected abstract loadEntity(): void

    protected abstract setEntity(entity: TEntity): void

    protected abstract deleteEntity(id: string): Observable<unknown>

    private entitySaved(entity: TEntity): void {
        const entityName = this.options.entityName.toLowerCase()

        if (this.isEdit()) {
            this.setEntity(entity)
            this.snackbar.show(`This ${entityName} was saved.`, 'success')
            return
        }

        this.successMessage.store(`This ${entityName} was created.`)
        void this.router.navigate([this.options.itemPath, entity.Guid])
    }

    private handleSaveError(error: unknown): void {
        if (this.isConflict(error)) {
            const entityName = this.options.entityName.toLowerCase()
            this.snackbar.show(
                `A ${entityName} with this ${this.options.duplicateField} already exists.`,
                'warning',
            )
            return
        }

        this.errorHandler.handleError(error)
    }
}
