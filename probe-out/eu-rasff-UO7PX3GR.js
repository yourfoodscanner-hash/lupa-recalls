import {
  BehaviorSubject,
  Injectable,
  NavigationEnd,
  Router,
  filter,
  inject,
  pairwise,
  setClassMetadata,
  tap,
  ɵɵdefineInjectable
} from "./chunk-JBC2RXAS.js";

// src/app/services/url.service.ts
var UrlService = class _UrlService {
  constructor() {
    this.router = inject(Router);
    this.previousUrl = new BehaviorSubject(null);
    this.previousUrl$ = this.previousUrl.asObservable();
    this.currentUrl = new BehaviorSubject(null);
    this.currentUrl$ = this.currentUrl.asObservable();
  }
  setUrlListener() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd), tap(() => {
      if (window.$wt) {
        if (window.$wt?.analytics?.isTrackable()) {
          window.$wt.trackPageView();
        }
      }
    }), pairwise()).subscribe((event) => {
      const previousUrl = event[0].url;
      const currentUrl = event[1].url;
      this.previousUrl.next(previousUrl);
      this.currentUrl.next(currentUrl);
    });
  }
  static {
    this.\u0275fac = function UrlService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _UrlService)();
    };
  }
  static {
    this.\u0275prov = /** @pureOrBreakMyCode */
    \u0275\u0275defineInjectable({ token: _UrlService, factory: _UrlService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UrlService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  UrlService
};
//# sourceMappingURL=chunk-UO7PX3GR.js.map
