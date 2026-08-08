import { Injectable } from '@angular/core'

const SUCCESS_MESSAGE_STORAGE_KEY = 'bretts-angular-success-message'

@Injectable({providedIn: 'root'})
export class SuccessMessageService {
    store(message: string): void {
        sessionStorage.setItem(SUCCESS_MESSAGE_STORAGE_KEY, message)
    }

    take(): string | null {
        const message = sessionStorage.getItem(SUCCESS_MESSAGE_STORAGE_KEY)

        sessionStorage.removeItem(SUCCESS_MESSAGE_STORAGE_KEY)

        return message
    }
}
