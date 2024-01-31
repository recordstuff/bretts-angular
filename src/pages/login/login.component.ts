import { Component } from '@angular/core';
import { JwtUtil } from '../../services/JwtUtil'
import { defaultUserCredentials, UserCredentials } from '../../models/UserCredentials';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import { HttpClient } from '@angular/common/http';

@Component({
    templateUrl: 'login.component.html',
    styleUrl: 'login.component.scss',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatButtonModule, MatGridListModule],
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
