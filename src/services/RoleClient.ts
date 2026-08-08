import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { NameGuidPair } from '../models/NameGuidPair'

@Injectable({ providedIn: 'root' })
export class RoleClient {
    private readonly httpClient = inject(HttpClient)

    public getRoles(): Observable<NameGuidPair[]> {
        return this.httpClient.get<NameGuidPair[]>('role/roles')
    }
}
