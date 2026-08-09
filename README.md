# Angular 17 Frontend

This project is an Angular demo showing responsive behavior and Users CRUD operations.  It was originally based on [this React repo](https://github.com/recordstuff/bretts-next).

This project currently hits a [.Net 8 Core API backend](https://github.com/recordstuff/bretts-services).

See it hosted at [https://brettdrake.org](https://brettdrake.org).

## Points of Interest

- [AuthInterceptor.ts](https://github.com/recordstuff/bretts-angular/blob/master/src/services/AuthInterceptor.ts) applies the configured API URL, credentials, and JWT bearer token to relative API requests.
- [JwtUtil.ts](https://github.com/recordstuff/bretts-angular/blob/master/src/services/JwtUtil.ts) for Jwt manipulation
- [AuthGuard.ts](https://github.com/recordstuff/bretts-angular/blob/master/src/components/AuthGuard.ts) for enforcing authentication
- [Dockerfile](https://github.com/recordstuff/bretts-angular/blob/master/Dockerfile) for serving the client side rendered version of the site

## API Configuration

The application uses Angular's `HttpClient` and build-time environment file replacement:

- Development (`ng serve` or `ng build --configuration development`): `https://localhost:7217/`
- Production (`ng build`): `https://brettdrake.org:8080/`

The values live in `src/environments/environment.development.ts` and `src/environments/environment.ts`. Environment files are included in the browser bundle, so they must contain public configuration only and never secrets.

API calls belong in injectable domain services rather than components:

- `UserClient` provides login, paged/sorted user queries, user detail, insert, update, and delete contracts.
- `RoleClient` provides the assignable-role contract.

These services return RxJS `Observable` values. The functional auth interceptor prefixes relative request paths with the active environment's API URL. Absolute URLs are left unchanged so credentials and bearer tokens are not sent to unrelated origins.
