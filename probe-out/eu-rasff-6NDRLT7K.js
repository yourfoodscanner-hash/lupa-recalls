import {
  AppAuthService
} from "./chunk-NMMTOIVC.js";
import {
  Injectable,
  Router,
  inject,
  of,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-JBC2RXAS.js";

// src/app/app-auth.guard.ts
var AppAuthGuard = class _AppAuthGuard {
  constructor() {
    this.router = inject(Router);
    this.appAuthService = inject(AppAuthService);
  }
  canActivate(route, state) {
    const user = this.appAuthService.getUserState()();
    const currentUrl = state.url;
    const isRestricted = this.appAuthService.isRestrictedUrl(currentUrl);
    const permissions = route.data.permission ? [route.data.permission] : [];
    if (user && user.fullName) {
      if (!isRestricted) {
        const restrictedUrl = this.appAuthService.convertToRestrictedUrl(currentUrl);
        this.router.navigateByUrl(restrictedUrl);
        return of(false);
      }
      if (this.appAuthService.checkSecurityAction(permissions)) {
        return of(true);
      }
      const publicUrl = this.appAuthService.convertToPublicUrl(currentUrl);
      this.router.navigateByUrl(publicUrl);
      return of(false);
    } else {
      if (!isRestricted) {
        return of(true);
      }
      const publicUrl = this.appAuthService.convertToPublicUrl(currentUrl);
      this.router.navigateByUrl(publicUrl);
      return of(false);
    }
  }
  static {
    this.\u0275fac = function AppAuthGuard_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AppAuthGuard)();
    };
  }
  static {
    this.\u0275prov = /** @pureOrBreakMyCode */
    \u0275\u0275defineInjectable({ token: _AppAuthGuard, factory: _AppAuthGuard.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppAuthGuard, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  AppAuthGuard
};
//# sourceMappingURL=chunk-6NDRLT7K.js.map
