import {
  HttpClient,
  Injectable,
  TranslateService,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-JBC2RXAS.js";

// src/app/services/organization.service.ts
var OrganizationService = class _OrganizationService {
  constructor() {
    this.http = inject(HttpClient);
    this.translateService = inject(TranslateService);
    this.organizationsUrl = "./backend/public/organization/list/";
    this.marketsUrl = "./backend/public/organization/single/market/list/";
    this.marketsUrlLogged = "./backend/logged/organization/single/market/list/";
    this.EUmarket = "./backend/public/organization/single/market/EU/";
  }
  getOrganizations() {
    return this.http.get(`${this.organizationsUrl}`);
  }
  getMarkets() {
    return this.http.get(`${this.marketsUrl}${this.translateService.currentLang}/`);
  }
  getMarketsLogged() {
    return this.http.get(`${this.marketsUrlLogged}${this.translateService.currentLang}/`);
  }
  getEUmarket() {
    return this.http.get(`${this.EUmarket}`);
  }
  static {
    this.\u0275fac = function OrganizationService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _OrganizationService)();
    };
  }
  static {
    this.\u0275prov = /** @pureOrBreakMyCode */
    \u0275\u0275defineInjectable({ token: _OrganizationService, factory: _OrganizationService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OrganizationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  OrganizationService
};
//# sourceMappingURL=chunk-2WIGVTXQ.js.map
