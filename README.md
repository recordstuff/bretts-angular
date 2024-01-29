# Angular 17 Frontend

This project is not as far along as the [React side](https://github.com/recordstuff/bretts-app) and is WAY more of just the bare beginning.

This project currently hits a [.Net 8 Core API backend](https://github.com/recordstuff/bretts-services).

## Points of Interest

- [AuthInterceptor.ts](https://github.com/recordstuff/bretts-angular/blob/master/src/services/AuthInterceptor.ts) where baseurl and other headers will be set.
- [JwtUtil.ts](https://github.com/recordstuff/bretts-angular/blob/master/src/services/JwtUtil.ts) for Jwt manipulation
- [AuthGuard.ts](https://github.com/recordstuff/bretts-angular/blob/master/src/components/AuthGuard.ts) for enforcing authentication