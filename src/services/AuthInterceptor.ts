import { Injectable } from "@angular/core";
import { JwtUtil } from "../services/JwtUtil";
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {

    constructor(private jwtUtil: JwtUtil) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = this.jwtUtil.token

// TODO: you are here get base url from environment.ts and replace baseurl in string below. set other headers like the cors stuff

        const authReq = req.clone({
            url: `baseurl/${req.url}`,
            headers: req.headers.set('Authorization', token)
        })

        return next.handle(authReq);
    }
}