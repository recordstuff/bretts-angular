import { Component } from '@angular/core';
import { JwtUtil } from '../../services/JwtUtil'
import { defaultUserCredentials, UserCredentials } from '../../models/UserCredentials';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    templateUrl: 'login.component.html',
    imports: [FormsModule],
    standalone: true
})

export class LoginComponent { 
    constructor(private jwtUtil: JwtUtil, private httpClient: HttpClient) {

    }

    UserCredentials: UserCredentials = defaultUserCredentials()

    ngOnInit() {
        this.jwtUtil.clear()
    }

    handleClick(event: MouseEvent) : void {
        const reply = this.httpClient.get("blah").subscribe()
    }
}
