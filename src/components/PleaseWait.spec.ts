import { TestBed } from '@angular/core/testing'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { PleaseWaitService } from '../services/PleaseWait'
import { PleaseWaitComponent } from './PleaseWait'

describe('PleaseWaitComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PleaseWaitComponent],
            providers: [provideNoopAnimations()],
        }).compileComponents()
    })

    it('covers the screen while work is pending', () => {
        const fixture = TestBed.createComponent(PleaseWaitComponent)
        const pleaseWait = TestBed.inject(PleaseWaitService)

        fixture.detectChanges()
        expect(fixture.nativeElement.querySelector('.please-wait-backdrop')).toBeNull()

        pleaseWait.pleaseWait()
        fixture.detectChanges()
        expect(fixture.nativeElement.querySelector('.please-wait-backdrop')).not.toBeNull()

        pleaseWait.doneWaiting()
        fixture.detectChanges()
        expect(fixture.nativeElement.querySelector('.please-wait-backdrop')).toBeNull()
    })
})
