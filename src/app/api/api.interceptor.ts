import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseURL = environment.apiUrl;

  if (!req.url.startsWith('http')) {
    req = req.clone({
      url: `${baseURL}${req.url}`,
    });
  }

  return next(req);
};
