import { Component } from '@angular/core';
import { defaultUserCredentials, UserCredentials } from '../../models/UserCredentials';
import { FormsModule } from '@angular/forms';

@Component({
    templateUrl: 'login.component.html',
    imports: [FormsModule],
    standalone: true
})

export class LoginComponent { 
    public UserCredentials: UserCredentials = defaultUserCredentials()

    public handleClick(event: MouseEvent) : void
    {
        alert('test')
    }
}
