import {
  EuiPermissionService,
  Injectable,
  UserService,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-JBC2RXAS.js";

// src/app/app.permission.actions.ts
var PermissionActions;
(function(PermissionActions2) {
  PermissionActions2["ViewReferenceDataItem"] = "01_ViewReferenceDataItem";
  PermissionActions2["SearchReferenceDataItem"] = "02_SearchReferenceDataItem";
  PermissionActions2["ViewMasterDataItem"] = "03_ViewMasterDataItem";
  PermissionActions2["SearchMasterDataItem"] = "04_SearchMasterDataItem";
  PermissionActions2["CreateReferenceDataItem"] = "05_CreateReferenceDataItem";
  PermissionActions2["CreateMasterDataItem"] = "06_CreateMasterDataItem";
  PermissionActions2["UpdateReferenceDataItem"] = "07_UpdateReferenceDataItem";
  PermissionActions2["UpdateMasterDataItem"] = "08_UpdateMasterDataItem";
  PermissionActions2["DisableReferenceDataItem"] = "09_DisableReferenceDataItem";
  PermissionActions2["DisableMasterDataItem"] = "10_DisableMasterDataItem";
  PermissionActions2["ViewReferenceDataItemTranslation"] = "11_ViewReferenceDataItemTranslation";
  PermissionActions2["SearchReferenceDataItemTranslation"] = "12_SearchReferenceDataItemTranslation";
  PermissionActions2["CreateReferenceDataItemTranslation"] = "13_CreateReferenceDataItemTranslation";
  PermissionActions2["UpdateReferenceDataItemTranslation"] = "14_UpdateReferenceDataItemTranslation";
  PermissionActions2["DisableReferenceDataItemTranslation"] = "15_DisableReferenceDataItemTranslation";
  PermissionActions2["ViewNotification"] = "16_ViewNotification";
  PermissionActions2["CreateDraftNotification"] = "17_CreateDraftNotification";
  PermissionActions2["OpenCatalogueManagementConsole"] = "18_OpenCatalogueManagementConsole";
  PermissionActions2["SearchOperatorItem"] = "19_SearchOperatorItem";
  PermissionActions2["CreateOperatorItem"] = "20_CreateOperatorItem";
  PermissionActions2["UpdateOperatorItem"] = "21_UpdateOperatorItem";
  PermissionActions2["DisableOperatorItem"] = "22_DisableOperatorItem";
  PermissionActions2["DeleteOperatorItem"] = "23_DeleteOperatorItem";
  PermissionActions2["SearchLaboratoryItem"] = "26_SearchLaboratoryItem";
  PermissionActions2["CreateLaboratoryItem"] = "27_CreateLaboratoryItem";
  PermissionActions2["UpdateLaboratoryItem"] = "28_UpdateLaboratoryItem";
  PermissionActions2["DisableLaboratoryItem"] = "29_DisableLaboratoryItem";
  PermissionActions2["DeleteLaboratoryItem"] = "30_DeleteLaboratoryItem";
  PermissionActions2["CreateAlertBanner"] = "34_CreateAlertBanner";
  PermissionActions2["UpdateAlertBanner"] = "35_UpdateAlertBanner";
  PermissionActions2["DeleteAlertBanner"] = "36_DeleteAlertBanner";
  PermissionActions2["CreateConsumerLink"] = "37_CreateConsumerLink";
  PermissionActions2["UpdateConsumerLink"] = "38_UpdateConsumerLink";
  PermissionActions2["DeleteConsumerLink"] = "39_DeleteConsumerLink";
  PermissionActions2["CreateLegislation"] = "40_CreateLegislation";
})(PermissionActions || (PermissionActions = {}));

// src/app/app-auth.service.ts
var AppAuthService = class _AppAuthService {
  constructor() {
    this.userService = inject(UserService);
    this.euiPermissionService = inject(EuiPermissionService);
    this.LOGGED_IN_PATTERN = "logged/";
    this.SCREEN_PREFIX = "/screen/";
  }
  getUserState() {
    return this.userService.getSignal();
  }
  convertToPublicUrl(url) {
    return url.replace(this.SCREEN_PREFIX + this.LOGGED_IN_PATTERN, this.SCREEN_PREFIX);
  }
  convertToRestrictedUrl(url) {
    if (!this.isRestrictedUrl(url)) {
      return url.replace(this.SCREEN_PREFIX, this.SCREEN_PREFIX + this.LOGGED_IN_PATTERN);
    } else {
      return url;
    }
  }
  isRestrictedUrl(url) {
    return url.includes(this.SCREEN_PREFIX + this.LOGGED_IN_PATTERN);
  }
  checkSecurityAction(actions) {
    let result = true;
    if (actions.length > 0) {
      actions.forEach((action) => {
        result = result && this.euiPermissionService.checkRight(action);
      });
    }
    return result;
  }
  static {
    this.\u0275fac = function AppAuthService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AppAuthService)();
    };
  }
  static {
    this.\u0275prov = /** @pureOrBreakMyCode */
    \u0275\u0275defineInjectable({ token: _AppAuthService, factory: _AppAuthService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppAuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  PermissionActions,
  AppAuthService
};
//# sourceMappingURL=chunk-NMMTOIVC.js.map
