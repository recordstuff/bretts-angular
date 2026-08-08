import { TestBed } from '@angular/core/testing'
import { PleaseWaitService } from './PleaseWait'

describe('PleaseWaitService', () => {
    let service: PleaseWaitService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(PleaseWaitService)
    })

    it('tracks overlapping waits', () => {
        service.pleaseWait()
        service.pleaseWait()

        expect(service.waitCount()).toBe(2)
        expect(service.isWaiting()).toBeTrue()

        service.doneWaiting()

        expect(service.waitCount()).toBe(1)
        expect(service.isWaiting()).toBeTrue()
    })

    it('never allows the wait count to become negative', () => {
        service.doneWaiting()

        expect(service.waitCount()).toBe(0)
        expect(service.isWaiting()).toBeFalse()
    })

    it('clears every outstanding wait', () => {
        service.pleaseWait()
        service.pleaseWait()

        service.clearAllWaits()

        expect(service.waitCount()).toBe(0)
        expect(service.isWaiting()).toBeFalse()
    })
})
