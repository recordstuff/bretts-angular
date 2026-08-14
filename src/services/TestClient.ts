import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ClientBase } from './ClientBase'

@Injectable({providedIn: 'root'})
export class TestClient extends ClientBase {
    constructor() {
        super('test')
    }

    public throwError(): Observable<void> {
        return this.get<void>('throwerror')
    }

    public writeLogEntry(): Observable<void> {
        return this.get<void>('structuredlogentry')
    }

    public shutdown(): Observable<void> {
        return this.delete<void>('shutdown')
    }
}
