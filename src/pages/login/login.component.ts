import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { JwtUtil } from '../../services/JwtUtil'
import {
    adminOnlyUserCredentials,
    defaultUserCredentials,
    userOnlyUserCredentials,
    UserCredentials,
} from '../../models/UserCredentials';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { UserClient } from '../../services/UserClient';
import { AppSnackbarService } from '../../components/AppSnackbar';

@Component({
    templateUrl: 'login.component.html',
    styleUrl: 'login.component.scss',
    imports: [FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule]
})

export class LoginComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef)

    constructor(
        private readonly jwtUtil: JwtUtil,
        private readonly router: Router,
        private readonly snackbar: AppSnackbarService,
        private readonly userClient: UserClient,
    ) {

    }

    UserCredentials: UserCredentials = defaultUserCredentials()
    isLoggingIn = false

    ngOnInit(): void {
        this.jwtUtil.clear()
    }

    populateWithAdminAndUserCredentials(): void {
        this.populateCredentials(defaultUserCredentials())
    }

    populateWithAdminOnlyCredentials(): void {
        this.populateCredentials(adminOnlyUserCredentials())
    }

    populateWithUserOnlyCredentials(): void {
        this.populateCredentials(userOnlyUserCredentials())
    }

    credentialsChanged(): void {
        this.snackbar.dismiss()
    }

    handleClick(): void {
        if (this.isLoggingIn
         || this.UserCredentials.Email.trim().length === 0
         || this.UserCredentials.Password.length === 0) {
            return
        }

        this.isLoggingIn = true
        this.snackbar.dismiss()

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
                    const message = error.status === HttpStatusCode.Unauthorized
                        ? 'The Email or Password was incorrect.'
                        : 'The login service is unavailable. Please try again.'

                    this.snackbar.show(message, 'warning')
                },
            })
    }

    private populateCredentials(credentials: UserCredentials): void {
        this.UserCredentials = credentials
        this.snackbar.dismiss()
    }
}
