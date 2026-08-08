import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({providedIn: 'root'})
export class TestClient {
    private readonly httpClient = inject(HttpClient)

    public throwError(): Observable<void> {
        return this.httpClient.get<void>('test/throwerror')
    }

    public writeLogEntry(): Observable<void> {
        return this.httpClient.get<void>('test/structuredlogentry')
    }

    public shutdown(): Observable<void> {
        return this.httpClient.delete<void>('test/shutdown')
    }
}
