import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { NameGuidPair } from '../models/NameGuidPair'

@Component({
    selector: 'app-items-selector',
    imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatListModule],
    templateUrl: 'ItemsSelector.html',
    styleUrl: 'ItemsSelector.scss'
})
export class ItemsSelectorComponent implements OnChanges {
    @Input() label = ''
    @Input() allItems: readonly NameGuidPair[] = []
    @Input() initiallySelectedItems: readonly NameGuidPair[] = []
    @Output() readonly selectedChange = new EventEmitter<NameGuidPair[]>()

    selectedItems: NameGuidPair[] = []
    availableItems: NameGuidPair[] = []
    selectedFilter = ''
    availableFilter = ''

    get filteredSelectedItems(): NameGuidPair[] {
        return this.filter(this.selectedItems, this.selectedFilter)
    }

    get filteredAvailableItems(): NameGuidPair[] {
        return this.filter(this.availableItems, this.availableFilter)
    }

    ngOnChanges(): void {
        this.selectedItems = this.sort(this.initiallySelectedItems)
        this.availableItems = this.sort(this.allItems.filter(item =>
            !this.selectedItems.some(selected => selected.Guid === item.Guid)))
    }

    select(item: NameGuidPair): void {
        this.availableItems = this.availableItems.filter(available => available.Guid !== item.Guid)
        this.selectedItems = this.sort([...this.selectedItems, item])
        this.emitSelection()
    }

    deselect(item: NameGuidPair): void {
        this.selectedItems = this.selectedItems.filter(selected => selected.Guid !== item.Guid)
        this.availableItems = this.sort([...this.availableItems, item])
        this.emitSelection()
    }

    selectAll(): void {
        this.selectedItems = this.sort(this.allItems)
        this.availableItems = []
        this.emitSelection()
    }

    deselectAll(): void {
        this.selectedItems = []
        this.availableItems = this.sort(this.allItems)
        this.emitSelection()
    }

    private emitSelection(): void {
        this.selectedChange.emit([...this.selectedItems])
    }

    private filter(items: NameGuidPair[], searchText: string): NameGuidPair[] {
        const normalizedSearchText = searchText.trim().toLocaleLowerCase()

        return normalizedSearchText.length === 0
            ? items
            : items.filter(item => item.Name.toLocaleLowerCase().includes(normalizedSearchText))
    }

    private sort(items: readonly NameGuidPair[]): NameGuidPair[] {
        return [...items].sort((left, right) => left.Name.localeCompare(right.Name))
    }
}
