import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { JwtUtil } from '../../services/JwtUtil'
import { defaultUserCredentials, UserCredentials } from '../../models/UserCredentials';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { UserClient } from '../../services/UserClient';

@Component({
    templateUrl: 'login.component.html',
    styleUrl: 'login.component.scss',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatButtonModule, MatGridListModule],
    standalone: true
})

export class LoginComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef)

    constructor(
        private readonly jwtUtil: JwtUtil,
        private readonly router: Router,
        private readonly userClient: UserClient,
    ) {

    }

    UserCredentials: UserCredentials = defaultUserCredentials()
    isLoggingIn = false
    loginError = ''

    ngOnInit(): void {
        this.jwtUtil.clear()
    }

    handleClick(): void {
        if (this.isLoggingIn
         || this.UserCredentials.Email.trim().length === 0
         || this.UserCredentials.Password.length === 0) {
            return
        }

        this.isLoggingIn = true
        this.loginError = ''

        this.userClient.login(this.UserCredentials)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.isLoggingIn = false),
            )
            .subscribe({
                next: loginSession => {
                    this.jwtUtil.token = loginSession.Token
                    void this.router.navigateByUrl('/')
                },
                error: (error: HttpErrorResponse) => {
                    this.loginError = error.status === HttpStatusCode.Unauthorized
                        ? 'The Email or Password was incorrect.'
                        : 'The login service is unavailable. Please try again.'
                },
            })
    }
}
