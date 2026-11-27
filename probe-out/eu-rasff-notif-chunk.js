import {
  FlagType
} from "./chunk-JVSHWEAP.js";
import {
  require_lodash
} from "./chunk-ETISIC7B.js";
import {
  ActivatedRoute,
  BackToTopLinkComponent,
  CapitaliseFirstLetterPipe,
  Component,
  CountryComponent,
  EuiGrowlService,
  EuiIconSvgComponent,
  EuiPaginatorComponent,
  EuiPermissionService,
  EuiPopoverComponent,
  EuiTableComponent,
  EuiTableSortableColComponent,
  EuiTemplateDirective,
  EuiTooltipDirective,
  EventEmitter,
  HttpClient,
  Injectable,
  Input,
  LinkHttpPipe,
  LowerCasePipe,
  NgModule,
  Output,
  RasffDatePipe,
  Router,
  RouterModule,
  SharedModule,
  Title,
  TranslatePipe,
  TranslateService,
  TruncatePipe,
  UpperCasePipe,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  __commonJS,
  __toESM,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinterpolate,
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵpipeBind3,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵviewQuery
} from "./chunk-JBC2RXAS.js";

// node_modules/print-js/dist/print.js
var require_print = __commonJS({
  "node_modules/print-js/dist/print.js"(exports, module) {
    (function webpackUniversalModuleDefinition(root, factory) {
      if (typeof exports === "object" && typeof module === "object")
        module.exports = factory();
      else if (typeof define === "function" && define.amd)
        define([], factory);
      else if (typeof exports === "object")
        exports["printJS"] = factory();
      else
        root["printJS"] = factory();
    })(window, function() {
      return (
        /******/
        function(modules) {
          var installedModules = {};
          function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) {
              return installedModules[moduleId].exports;
            }
            var module2 = installedModules[moduleId] = {
              /******/
              i: moduleId,
              /******/
              l: false,
              /******/
              exports: {}
              /******/
            };
            modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
            module2.l = true;
            return module2.exports;
          }
          __webpack_require__.m = modules;
          __webpack_require__.c = installedModules;
          __webpack_require__.d = function(exports2, name, getter) {
            if (!__webpack_require__.o(exports2, name)) {
              Object.defineProperty(exports2, name, { enumerable: true, get: getter });
            }
          };
          __webpack_require__.r = function(exports2) {
            if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
              Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
            }
            Object.defineProperty(exports2, "__esModule", { value: true });
          };
          __webpack_require__.t = function(value, mode) {
            if (mode & 1) value = __webpack_require__(value);
            if (mode & 8) return value;
            if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
            var ns = /* @__PURE__ */ Object.create(null);
            __webpack_require__.r(ns);
            Object.defineProperty(ns, "default", { enumerable: true, value });
            if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, function(key2) {
              return value[key2];
            }.bind(null, key));
            return ns;
          };
          __webpack_require__.n = function(module2) {
            var getter = module2 && module2.__esModule ? (
              /******/
              function getDefault() {
                return module2["default"];
              }
            ) : (
              /******/
              function getModuleExports() {
                return module2;
              }
            );
            __webpack_require__.d(getter, "a", getter);
            return getter;
          };
          __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
          };
          __webpack_require__.p = "";
          return __webpack_require__(__webpack_require__.s = 0);
        }({
          /***/
          "./src/index.js": (
            /*!**********************!*\
              !*** ./src/index.js ***!
              \**********************/
            /*! exports provided: default */
            /***/
            function(module2, __webpack_exports__, __webpack_require__) {
              "use strict";
              __webpack_require__.r(__webpack_exports__);
              var _sass_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                /*! ./sass/index.scss */
                "./src/sass/index.scss"
              );
              var _sass_index_scss__WEBPACK_IMPORTED_MODULE_0___default = /* @__PURE__ */ __webpack_require__.n(_sass_index_scss__WEBPACK_IMPORTED_MODULE_0__);
              var _js_init__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                /*! ./js/init */
                "./src/js/init.js"
              );
              var printJS2 = _js_init__WEBPACK_IMPORTED_MODULE_1__["default"].init;
              if (typeof window !== "undefined") {
                window.printJS = printJS2;
              }
              __webpack_exports__["default"] = printJS2;
            }
          ),
          /***/
          "./src/js/browser.js": (
            /*!***************************!*\
              !*** ./src/js/browser.js ***!
              \***************************/
            /*! exports provided: default */
            /***/
            function(module2, __webpack_exports__, __webpack_require__) {
              "use strict";
              __webpack_require__.r(__webpack_exports__);
              var Browser = {
                // Firefox 1.0+
                isFirefox: function isFirefox() {
                  return typeof InstallTrigger !== "undefined";
                },
                // Internet Explorer 6-11
                isIE: function isIE() {
                  return navigator.userAgent.indexOf("MSIE") !== -1 || !!document.documentMode;
                },
                // Edge 20+
                isEdge: function isEdge() {
                  return !Browser.isIE() && !!window.StyleMedia;
                },
                // Chrome 1+
                isChrome: function isChrome() {
                  var context = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : window;
                  return !!context.chrome;
                },
                // At least Safari 3+: "[object HTMLElementConstructor]"
                isSafari: function isSafari() {
                  return Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0 || navigator.userAgent.toLowerCase().indexOf("safari") !== -1;
                },
                // IOS Chrome
                isIOSChrome: function isIOSChrome() {
                  return navigator.userAgent.toLowerCase().indexOf("crios") !== -1;
                }
              };
              __webpack_exports__["default"] = Browser;
            }
          ),
          /***/
          "./src/js/functions.js": (
            /*!*****************************!*\
              !*** ./src/js/functions.js ***!
              \*****************************/
            /*! exports provided: addWrapper, capitalizePrint, collectStyles, addHeader, cleanUp, isRawHTML */
            /***/
            function(module2, __webpack_exports__, __webpack_require__) {
              "use strict";
              __webpack_require__.r(__webpack_exports__);
              __webpack_require__.d(__webpack_exports__, "addWrapper", function() {
                return addWrapper;
              });
              __webpack_require__.d(__webpack_exports__, "capitalizePrint", function() {
                return capitalizePrint;
              });
              __webpack_require__.d(__webpack_exports__, "collectStyles", function() {
                return collectStyles;
              });
              __webpack_require__.d(__webpack_exports__, "addHeader", function() {
                return addHeader;
              });
              __webpack_require__.d(__webpack_exports__, "cleanUp", function() {
                return cleanUp;
              });
              __webpack_require__.d(__webpack_exports__, "isRawHTML", function() {
                return isRawHTML;
              });
              var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                /*! ./modal */
                "./src/js/modal.js"
              );
              var _browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                /*! ./browser */
                "./src/js/browser.js"
              );
              function _typeof(obj) {
                "@babel/helpers - typeof";
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                  _typeof = function _typeof2(obj2) {
                    return typeof obj2;
                  };
                } else {
                  _typeof = function _typeof2(obj2) {
                    return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                  };
                }
                return _typeof(obj);
              }
              function addWrapper(htmlData, params) {
                var bodyStyle = "font-family:" + params.font + " !important; font-size: " + params.font_size + " !important; width:100%;";
                return '<div style="' + bodyStyle + '">' + htmlData + "</div>";
              }
              function capitalizePrint(obj) {
                return obj.charAt(0).toUpperCase() + obj.slice(1);
              }
              function collectStyles(element, params) {
                var win = document.defaultView || window;
                var elementStyle = "";
                var styles = win.getComputedStyle(element, "");
                for (var key = 0; key < styles.length; key++) {
                  if (params.targetStyles.indexOf("*") !== -1 || params.targetStyle.indexOf(styles[key]) !== -1 || targetStylesMatch(params.targetStyles, styles[key])) {
                    if (styles.getPropertyValue(styles[key])) elementStyle += styles[key] + ":" + styles.getPropertyValue(styles[key]) + ";";
                  }
                }
                elementStyle += "max-width: " + params.maxWidth + "px !important; font-size: " + params.font_size + " !important;";
                return elementStyle;
              }
              function targetStylesMatch(styles, value) {
                for (var i = 0; i < styles.length; i++) {
                  if (_typeof(value) === "object" && value.indexOf(styles[i]) !== -1) return true;
                }
                return false;
              }
              function addHeader(printElement, params) {
                var headerContainer = document.createElement("div");
                if (isRawHTML(params.header)) {
                  headerContainer.innerHTML = params.header;
                } else {
                  var headerElement = document.createElement("h1");
                  var headerNode = document.createTextNode(params.header);
                  headerElement.appendChild(headerNode);
                  headerElement.setAttribute("style", params.headerStyle);
                  headerContainer.appendChild(headerElement);
                }
                printElement.insertBefore(headerContainer, printElement.childNodes[0]);
              }
              function cleanUp(params) {
                if (params.showModal) _modal__WEBPACK_IMPORTED_MODULE_0__["default"].close();
                if (params.onLoadingEnd) params.onLoadingEnd();
                if (params.showModal || params.onLoadingStart) window.URL.revokeObjectURL(params.printable);
                var event = "mouseover";
                if (_browser__WEBPACK_IMPORTED_MODULE_1__["default"].isChrome() || _browser__WEBPACK_IMPORTED_MODULE_1__["default"].isFirefox()) {
                  event = "focus";
                }
                var handler = function handler2() {
                  window.removeEventListener(event, handler2);
                  params.onPrintDialogClose();
                  var iframe = document.getElementById(params.frameId);
                  if (iframe) {
                    iframe.remove();
                  }
                };
                window.addEventListener(event, handler);
              }
              function isRawHTML(raw) {
                var regexHtml = new RegExp("<([A-Za-z][A-Za-z0-9]*)\\b[^>]*>(.*?)</\\1>");
                return regexHtml.test(raw);
              }
            }
          ),
          /***/
          "./src/js/html.js": (
            /*!************************!*\
              !*** ./src/js/html.js ***!
              \************************/
            /*! exports provided: default */
            /***/
            function(module2, __webpack_exports__, __webpack_require__) {
              "use strict";
              __webpack_require__.r(__webpack_exports__);
              var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                /*! ./functions */
                "./src/js/functions.js"
              );
              var _print__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                /*! ./print */
                "./src/js/print.js"
              );
              function _typeof(obj) {
                "@babel/helpers - typeof";
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                  _typeof = function _typeof2(obj2) {
                    return typeof obj2;
                  };
                } else {
                  _typeof = function _typeof2(obj2) {
                    return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                  };
                }
                return _typeof(obj);
              }
              __webpack_exports__["default"] = {
                print: function print(params, printFrame) {
                  var printElement = isHtmlElement(params.printable) ? params.printable : document.getElementById(params.printable);
                  if (!printElement) {
                    window.console.error("Invalid HTML element id: " + params.printable);
                    return;
                  }
                  params.printableElement = cloneElement(printElement, params);
                  if (params.header) {
                    Object(_functions__WEBPACK_IMPORTED_MODULE_0__["addHeader"])(params.printableElement, params);
                  }
                  _print__WEBPACK_IMPORTED_MODULE_1__["default"].send(params, printFrame);
                }
              };
              function cloneElement(element, params) {
                var clone = element.cloneNode();
                var childNodesArray = Array.prototype.slice.call(element.childNodes);
                for (var i = 0; i < childNodesArray.length; i++) {
                  if (params.ignoreElements.indexOf(childNodesArray[i].id) !== -1) {
                    continue;
                  }
                  var clonedChild = cloneElement(childNodesArray[i], params);
                  clone.appendChild(clonedChild);
                }
                if (params.scanStyles && element.nodeType === 1) {
                  clone.setAttribute("style", Object(_functions__WEBPACK_IMPORTED_MODULE_0__["collectStyles"])(element, params));
                }
                switch (element.tagName) {
                  case "SELECT":
                    clone.value = element.value;
                    break;
                  case "CANVAS":
                    clone.getContext("2d").drawImage(element, 0, 0);
                    break;
                }
                return clone;
              }
              function isHtmlElement(printable) {
                return _typeof(printable) === "object" && printable && (printable instanceof HTMLElement || printable.nodeType === 1);
              }
            }
          ),
          /***/
          "./src/js/image.js": (
            /*!*************************!*\
              !*** ./src/js/image.js ***!
              \*************************/
            /*! exports provided: default */
            /***/
            function(module2, __webpack_exports__, __webpack_require__) {
              "use strict";
              __webpack_require__.r(__webpack_exports__);
              var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                /*! ./functions */
                "./src/js/functions.js"
              );
              var _print__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                /*! ./print */
                "./src/js/print.js"
              );
              var _browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                /*! ./browser */
                "./src/js/browser.js"
              );
              __webpack_exports__["default"] = {
                print: function print(params, printFrame) {
                  if (params.printable.constructor !== Array) {
                    params.printable = [params.printable];
                  }
                  params.printableElement = document.createElement("div");
                  params.printable.forEach(function(src) {
                    var img = document.createElement("img");
                    img.setAttribute("style", params.imageStyle);
                    img.src = src;
                    if (_browser__WEBPACK_IMPORTED_MODULE_2__["default"].isFirefox()) {
                      var fullyQualifiedSrc = img.src;
                      img.src = fullyQualifiedSrc;
                    }
                    var imageWrapper = document.createElement("div");
                    imageWrapper.appendChild(img);
                    params.printableElement.appendChild(imageWrapper);
                  });
                  if (params.header) Object(_functions__WEBPACK_IMPORTED_MODULE_0__["addHeader"])(params.printableElement, params);
                  _print__WEBPACK_IMPORTED_MODULE_1__["default"].send(params, printFrame);
                }
              };
            }
          ),
          /***/
          "./src/js/init.js": (
            /*!************************!*\
              !*** ./src/js/init.js ***!
              \************************/
            /*! exports provided: default */
            /***/
            function(module2, __webpack_exports__, __webpack_require__) {
              "use strict";
              __webpack_require__.r(__webpack_exports__);
              var _browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                /*! ./browser */
                "./src/js/browser.js"
              );
              var _modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                /*! ./modal */
                "./src/js/modal.js"
              );
              var _pdf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                /*! ./pdf */
                "./src/js/pdf.js"
              );
              var _html__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                /*! ./html */
                "./src/js/html.js"
              );
              var _raw_html__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
                /*! ./raw-html */
                "./src/js/raw-html.js"
              );
              var _image__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
                /*! ./image */
                "./src/js/image.js"
              );
              var _json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
                /*! ./json */
                "./src/js/json.js"
              );
              function _typeof(obj) {
                "@babel/helpers - typeof";
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                  _typeof = function _typeof2(obj2) {
                    return typeof obj2;
                  };
                } else {
                  _typeof = function _typeof2(obj2) {
                    return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                  };
                }
                return _typeof(obj);
              }
              var printTypes = ["pdf", "html", "image", "json", "raw-html"];
              __webpack_exports__["default"] = {
                init: function init() {
                  var params = {
                    printable: null,
                    fallbackPrintable: null,
                    type: "pdf",
                    header: null,
                    headerStyle: "font-weight: 300;",
                    maxWidth: 800,
                    properties: null,
                    gridHeaderStyle: "font-weight: bold; padding: 5px; border: 1px solid #dddddd;",
                    gridStyle: "border: 1px solid lightgray; margin-bottom: -1px;",
                    showModal: false,
                    onError: function onError(error) {
                      throw error;
                    },
                    onLoadingStart: null,
                    onLoadingEnd: null,
                    onPrintDialogClose: function onPrintDialogClose() {
                    },
                    onIncompatibleBrowser: function onIncompatibleBrowser() {
                    },
                    modalMessage: "Retrieving Document...",
                    frameId: "printJS",
                    printableElement: null,
                    documentTitle: "Document",
                    targetStyle: ["clear", "display", "width", "min-width", "height", "min-height", "max-height"],
                    targetStyles: ["border", "box", "break", "text-decoration"],
                    ignoreElements: [],
                    repeatTableHeader: true,
                    css: null,
                    style: null,
                    scanStyles: true,
                    base64: false,
                    // Deprecated
                    onPdfOpen: null,
                    font: "TimesNewRoman",
                    font_size: "12pt",
                    honorMarginPadding: true,
                    honorColor: false,
                    imageStyle: "max-width: 100%;"
                  };
                  var args = arguments[0];
                  if (args === void 0) {
                    throw new Error("printJS expects at least 1 attribute.");
                  }
                  switch (_typeof(args)) {
                    case "string":
                      params.printable = encodeURI(args);
                      params.fallbackPrintable = params.printable;
                      params.type = arguments[1] || params.type;
                      break;
                    case "object":
                      params.printable = args.printable;
                      params.fallbackPrintable = typeof args.fallbackPrintable !== "undefined" ? args.fallbackPrintable : params.printable;
                      params.fallbackPrintable = params.base64 ? "data:application/pdf;base64,".concat(params.fallbackPrintable) : params.fallbackPrintable;
                      for (var k in params) {
                        if (k === "printable" || k === "fallbackPrintable") continue;
                        params[k] = typeof args[k] !== "undefined" ? args[k] : params[k];
                      }
                      break;
                    default:
                      throw new Error('Unexpected argument type! Expected "string" or "object", got ' + _typeof(args));
                  }
                  if (!params.printable) throw new Error("Missing printable information.");
                  if (!params.type || typeof params.type !== "string" || printTypes.indexOf(params.type.toLowerCase()) === -1) {
                    throw new Error("Invalid print type. Available types are: pdf, html, image and json.");
                  }
                  if (params.showModal) _modal__WEBPACK_IMPORTED_MODULE_1__["default"].show(params);
                  if (params.onLoadingStart) params.onLoadingStart();
                  var usedFrame = document.getElementById(params.frameId);
                  if (usedFrame) usedFrame.parentNode.removeChild(usedFrame);
                  var printFrame = document.createElement("iframe");
                  if (_browser__WEBPACK_IMPORTED_MODULE_0__["default"].isFirefox()) {
                    printFrame.setAttribute("style", "width: 1px; height: 100px; position: fixed; left: 0; top: 0; opacity: 0; border-width: 0; margin: 0; padding: 0");
                  } else {
                    printFrame.setAttribute("style", "visibility: hidden; height: 0; width: 0; position: absolute; border: 0");
                  }
                  printFrame.setAttribute("id", params.frameId);
                  if (params.type !== "pdf") {
                    printFrame.srcdoc = "<html><head><title>" + params.documentTitle + "</title>";
                    if (params.css) {
                      if (!Array.isArray(params.css)) params.css = [params.css];
                      params.css.forEach(function(file) {
                        printFrame.srcdoc += '<link rel="stylesheet" href="' + file + '">';
                      });
                    }
                    printFrame.srcdoc += "</head><body></body></html>";
                  }
                  switch (params.type) {
                    case "pdf":
                      if (_browser__WEBPACK_IMPORTED_MODULE_0__["default"].isIE()) {
                        try {
                          console.info("Print.js doesn't support PDF printing in Internet Explorer.");
                          var win = window.open(params.fallbackPrintable, "_blank");
                          win.focus();
                          params.onIncompatibleBrowser();
                        } catch (error) {
                          params.onError(error);
                        } finally {
                          if (params.showModal) _modal__WEBPACK_IMPORTED_MODULE_1__["default"].close();
                          if (params.onLoadingEnd) params.onLoadingEnd();
                        }
                      } else {
                        _pdf__WEBPACK_IMPORTED_MODULE_2__["default"].print(params, printFrame);
                      }
                      break;
                    case "image":
                      _image__WEBPACK_IMPORTED_MODULE_5__["default"].print(params, printFrame);
                      break;
                    case "html":
                      _html__WEBPACK_IMPORTED_MODULE_3__["default"].print(params, printFrame);
                      break;
                    case "raw-html":
                      _raw_html__WEBPACK_IMPORTED_MODULE_4__["default"].print(params, printFrame);
                      break;
                    case "json":
                      _json__WEBPACK_IMPORTED_MODULE_6__["default"].print(params, printFrame);
                      break;
                  }
                }
              };
            }
          ),
          /***/
          "./src/js/json.js": (
            /*!************************!*\
              !*** ./src/js/json.js ***!
              \************************/
            /*! exports provided: default */
            /***/
            function(module2, __webpack_exports__, __webpack_require__) {
              "use strict";
              __webpack_require__.r(__webpack_exports__);
              var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                /*! ./functions */
                "./src/js/functions.js"
              );
              var _print__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                /*! ./print */
                "./src/js/print.js"
              );
              function _typeof(obj) {
                "@babel/helpers - typeof";
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                  _typeof = function _typeof2(obj2) {
                    return typeof obj2;
                  };
                } else {
                  _typeof = function _typeof2(obj2) {
                    return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                  };
                }
                return _typeof(obj);
              }
              __webpack_exports__["default"] = {
                print: function print(params, printFrame) {
                  if (_typeof(params.printable) !== "object") {
                    throw new Error("Invalid javascript data object (JSON).");
                  }
                  if (typeof params.repeatTableHeader !== "boolean") {
                    throw new Error("Invalid value for repeatTableHeader attribute (JSON).");
                  }
                  if (!params.properties || !Array.isArray(params.properties)) {
                    throw new Error("Invalid properties array for your JSON data.");
                  }
                  params.properties = params.properties.map(function(property) {
                    return {
                      field: _typeof(property) === "object" ? property.field : property,
                      displayName: _typeof(property) === "object" ? property.displayName : property,
                      columnSize: _typeof(property) === "object" && property.columnSize ? property.columnSize + ";" : 100 / params.properties.length + "%;"
                    };
                  });
                  params.printableElement = document.createElement("div");
                  if (params.header) {
                    Object(_functions__WEBPACK_IMPORTED_MODULE_0__["addHeader"])(params.printableElement, params);
                  }
                  params.printableElement.innerHTML += jsonToHTML(params);
                  _print__WEBPACK_IMPORTED_MODULE_1__["default"].send(params, printFrame);
                }
              };
              function jsonToHTML(params) {
                var data = params.printable;
                var properties = params.properties;
                var htmlData = '<table style="border-collapse: collapse; width: 100%;">';
                if (params.repeatTableHeader) {
                  htmlData += "<thead>";
                }
                htmlData += "<tr>";
                for (var a = 0; a < properties.length; a++) {
                  htmlData += '<th style="width:' + properties[a].columnSize + ";" + params.gridHeaderStyle + '">' + Object(_functions__WEBPACK_IMPORTED_MODULE_0__["capitalizePrint"])(properties[a].displayName) + "</th>";
                }
                htmlData += "</tr>";
                if (params.repeatTableHeader) {
                  htmlData += "</thead>";
                }
                htmlData += "<tbody>";
                for (var i = 0; i < data.length; i++) {
                  htmlData += "<tr>";
                  for (var n = 0; n < properties.length; n++) {
                    var stringData = data[i];
                    var property = properties[n].field.split(".");
                    if (property.length > 1) {
                      for (var p = 0; p < property.length; p++) {
                        stringData = stringData[property[p]];
                      }
                    } else {
                      stringData = stringData[properties[n].field];
                    }
                    htmlData += '<td style="width:' + properties[n].columnSize + params.gridStyle + '">' + stringData + "</td>";
                  }
                  htmlData += "</tr>";
                }
                htmlData += "</tbody></table>";
                return htmlData;
              }
            }
          ),
          /***/
          "./src/js/modal.js": (
            /*!*************************!*\
              !*** ./src/js/modal.js ***!
              \*************************/
            /*! exports provided: default */
            /***/
            function(module2, __webpack_exports__, __webpack_require__) {
              "use strict";
              __webpack_require__.r(__webpack_exports__);
              var Modal = {
                show: function show(params) {
                  var modalStyle = "font-family:sans-serif; display:table; text-align:center; font-weight:300; font-size:30px; left:0; top:0;position:fixed; z-index: 9990;color: #0460B5; width: 100%; height: 100%; background-color:rgba(255,255,255,.9);transition: opacity .3s ease;";
                  var printModal = document.createElement("div");
                  printModal.setAttribute("style", modalStyle);
                  printModal.setAttribute("id", "printJS-Modal");
                  var contentDiv = document.createElement("div");
                  contentDiv.setAttribute("style", "display:table-cell; vertical-align:middle; padding-bottom:100px;");
                  var closeButton = document.createElement("div");
                  closeButton.setAttribute("class", "printClose");
                  closeButton.setAttribute("id", "printClose");
                  contentDiv.appendChild(closeButton);
                  var spinner = document.createElement("span");
                  spinner.setAttribute("class", "printSpinner");
                  contentDiv.appendChild(spinner);
                  var messageNode = document.createTextNode(params.modalMessage);
                  contentDiv.appendChild(messageNode);
                  printModal.appendChild(contentDiv);
                  document.getElementsByTagName("body")[0].appendChild(printModal);
                  document.getElementById("printClose").addEventListener("click", function() {
                    Modal.close();
                  });
                },
                close: function close() {
                  var printModal = document.getElementById("printJS-Modal");
                  if (printModal) {
                    printModal.parentNode.removeChild(printModal);
                  }
                }
              };
              __webpack_exports__["default"] = Modal;
            }
          ),
          /***/
          "./src/js/pdf.js": (
            /*!***********************!*\
              !*** ./src/js/pdf.js ***!
              \***********************/
            /*! exports provided: default */
            /***/
            function(module2, __webpack_exports__, __webpack_require__) {
              "use strict";
              __webpack_require__.r(__webpack_exports__);
              var _print__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                /*! ./print */
                "./src/js/print.js"
              );
              var _functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                /*! ./functions */
                "./src/js/functions.js"
              );
              __webpack_exports__["default"] = {
                print: function print(params, printFrame) {
                  if (params.base64) {
                    var bytesArray = Uint8Array.from(atob(params.printable), function(c) {
                      return c.charCodeAt(0);
                    });
                    createBlobAndPrint(params, printFrame, bytesArray);
                    return;
                  }
                  params.printable = /^(blob|http|\/\/)/i.test(params.printable) ? params.printable : window.location.origin + (params.printable.charAt(0) !== "/" ? "/" + params.printable : params.printable);
                  var req = new window.XMLHttpRequest();
                  req.responseType = "arraybuffer";
                  req.addEventListener("error", function() {
                    Object(_functions__WEBPACK_IMPORTED_MODULE_1__["cleanUp"])(params);
                    params.onError(req.statusText, req);
                  });
                  req.addEventListener("load", function() {
                    if ([200, 201].indexOf(req.status) === -1) {
                      Object(_functions__WEBPACK_IMPORTED_MODULE_1__["cleanUp"])(params);
                      params.onError(req.statusText, req);
                      return;
                    }
                    createBlobAndPrint(params, printFrame, req.response);
                  });
                  req.open("GET", params.printable, true);
                  req.send();
                }
              };
              function createBlobAndPrint(params, printFrame, data) {
                var localPdf = new window.Blob([data], {
                  type: "application/pdf"
                });
                localPdf = window.URL.createObjectURL(localPdf);
                printFrame.setAttribute("src", localPdf);
                _print__WEBPACK_IMPORTED_MODULE_0__["default"].send(params, printFrame);
              }
            }
          ),
          /***/
          "./src/js/print.js": (
            /*!*************************!*\
              !*** ./src/js/print.js ***!
              \*************************/
            /*! exports provided: default */
            /***/
            function(module2, __webpack_exports__, __webpack_require__) {
              "use strict";
              __webpack_require__.r(__webpack_exports__);
              var _browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                /*! ./browser */
                "./src/js/browser.js"
              );
              var _functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                /*! ./functions */
                "./src/js/functions.js"
              );
              var Print = {
                send: function send(params, printFrame) {
                  document.getElementsByTagName("body")[0].appendChild(printFrame);
                  var iframeElement = document.getElementById(params.frameId);
                  iframeElement.onload = function() {
                    if (params.type === "pdf") {
                      if (_browser__WEBPACK_IMPORTED_MODULE_0__["default"].isFirefox()) {
                        setTimeout(function() {
                          return performPrint(iframeElement, params);
                        }, 1e3);
                      } else {
                        performPrint(iframeElement, params);
                      }
                      return;
                    }
                    var printDocument = iframeElement.contentWindow || iframeElement.contentDocument;
                    if (printDocument.document) printDocument = printDocument.document;
                    printDocument.body.appendChild(params.printableElement);
                    if (params.type !== "pdf" && params.style) {
                      var style = document.createElement("style");
                      style.innerHTML = params.style;
                      printDocument.head.appendChild(style);
                    }
                    var images = printDocument.getElementsByTagName("img");
                    if (images.length > 0) {
                      loadIframeImages(Array.from(images)).then(function() {
                        return performPrint(iframeElement, params);
                      });
                    } else {
                      performPrint(iframeElement, params);
                    }
                  };
                }
              };
              function performPrint(iframeElement, params) {
                try {
                  iframeElement.focus();
                  if (_browser__WEBPACK_IMPORTED_MODULE_0__["default"].isEdge() || _browser__WEBPACK_IMPORTED_MODULE_0__["default"].isIE()) {
                    try {
                      iframeElement.contentWindow.document.execCommand("print", false, null);
                    } catch (e) {
                      iframeElement.contentWindow.print();
                    }
                  } else {
                    iframeElement.contentWindow.print();
                  }
                } catch (error) {
                  params.onError(error);
                } finally {
                  if (_browser__WEBPACK_IMPORTED_MODULE_0__["default"].isFirefox()) {
                    iframeElement.style.visibility = "hidden";
                    iframeElement.style.left = "-1px";
                  }
                  Object(_functions__WEBPACK_IMPORTED_MODULE_1__["cleanUp"])(params);
                }
              }
              function loadIframeImages(images) {
                var promises = images.map(function(image) {
                  if (image.src && image.src !== window.location.href) {
                    return loadIframeImage(image);
                  }
                });
                return Promise.all(promises);
              }
              function loadIframeImage(image) {
                return new Promise(function(resolve) {
                  var pollImage = function pollImage2() {
                    !image || typeof image.naturalWidth === "undefined" || image.naturalWidth === 0 || !image.complete ? setTimeout(pollImage2, 500) : resolve();
                  };
                  pollImage();
                });
              }
              __webpack_exports__["default"] = Print;
            }
          ),
          /***/
          "./src/js/raw-html.js": (
            /*!****************************!*\
              !*** ./src/js/raw-html.js ***!
              \****************************/
            /*! exports provided: default */
            /***/
            function(module2, __webpack_exports__, __webpack_require__) {
              "use strict";
              __webpack_require__.r(__webpack_exports__);
              var _print__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                /*! ./print */
                "./src/js/print.js"
              );
              __webpack_exports__["default"] = {
                print: function print(params, printFrame) {
                  params.printableElement = document.createElement("div");
                  params.printableElement.setAttribute("style", "width:100%");
                  params.printableElement.innerHTML = params.printable;
                  _print__WEBPACK_IMPORTED_MODULE_0__["default"].send(params, printFrame);
                }
              };
            }
          ),
          /***/
          "./src/sass/index.scss": (
            /*!*****************************!*\
              !*** ./src/sass/index.scss ***!
              \*****************************/
            /*! no static exports found */
            /***/
            function(module2, exports2, __webpack_require__) {
            }
          ),
          /***/
          0: (
            /*!****************************!*\
              !*** multi ./src/index.js ***!
              \****************************/
            /*! no static exports found */
            /***/
            function(module2, exports2, __webpack_require__) {
              module2.exports = __webpack_require__(
                /*! ./src/index.js */
                "./src/index.js"
              );
            }
          )
          /******/
        })["default"]
      );
    });
  }
});

// src/app/features/notification/notification-layout.ts
var NOTIFICATION_LAYOUT_PUBLIC = {
  headerLeft: {},
  mainInfo: {
    left: [
      { label: "notification.reference", key: "reference" },
      { label: "notification.subject", key: "subject" },
      {
        label: "notification.contactOrg",
        key: "additionalInformations[0].organization"
      },
      {
        label: "notification.productType",
        key: "productType.description"
      },
      {
        label: "notification.basis",
        key: "notificationBasis.description"
      },
      {
        label: "notification.classification",
        key: "notificationClassification.description"
      },
      { label: "notification.summary", key: "summary" }
    ],
    topRight: [
      { label: "notification.date", key: "ecValidationDate" },
      {
        label: "notification.notifyingCountry",
        key: "notifyingCountry.description"
      }
    ],
    bottomRight: [
      { label: "notification.product", key: "product.description" },
      {
        label: "notification.category",
        key: "product.productCategory.description"
      }
    ]
  }
};
var NOTIFICATION_LAYOUT_LOGGED = {
  headerLeft: {},
  mainInfo: {
    left: [
      { label: "notification.reference", key: "reference" },
      {
        label: "notification.cpReference",
        key: "additionalInformations[0].cpReference"
      },
      { label: "notification.date", key: "ecValidationDate" },
      { label: "notification.subject", key: "subject" },
      {
        label: "notification.contactOrg",
        key: "additionalInformations[0].organization"
      },
      {
        label: "notification.productType",
        key: "productType.description"
      },
      {
        label: "notification.basis",
        key: "notificationBasis.description"
      },
      {
        label: "notification.classification",
        key: "notificationClassification.description"
      },
      { label: "notification.eCommerce", key: "ecommerce" },
      { label: "notification.iRASFFLink", key: "irasffLink" },
      { label: "notification.summary", key: "summary" }
    ]
  }
};
var NOTIFICATION_LAYOUT_NON_MEMBER = {
  headerLeft: {},
  mainInfo: {
    left: [
      { label: "notification.reference", key: "reference" },
      { label: "notification.date", key: "ecValidationDate" },
      { label: "notification.subject", key: "subject" },
      {
        label: "notification.contactOrg",
        key: "additionalInformations[0].organization"
      },
      {
        label: "notification.productType",
        key: "productType.description"
      },
      {
        label: "notification.basis",
        key: "notificationBasis.description"
      },
      {
        label: "notification.classification",
        key: "notificationClassification.description"
      },
      { label: "notification.eCommerce", key: "ecommerce" }
    ]
  }
};

// src/app/features/notification/notification.service.ts
var NotificationService = class _NotificationService {
  constructor() {
    this.http = inject(HttpClient);
    this.translateService = inject(TranslateService);
    this.publicNotificationViewUrl = "./backend/public/notification/view/";
    this.privateNotificationViewURL = "./backend/logged/notification/view/";
    this.byIdUrl = "id/";
    this.byRefUrl = "reference/";
  }
  getPublicNotificationById(id) {
    return this.getNotification(`${this.publicNotificationViewUrl}${this.byIdUrl}` + id + `/${this.translateService.currentLang}/`);
  }
  getPublicNotificationByReference(reference) {
    return this.getNotification(`${this.publicNotificationViewUrl}${this.byRefUrl}` + reference + `/${this.translateService.currentLang}/`);
  }
  getPrivateNotificationById(id) {
    return this.getNotification(`${this.privateNotificationViewURL}${this.byIdUrl}` + id + `/${this.translateService.currentLang}/`);
  }
  getPrivateNotificationByReference(reference) {
    return this.getNotification(`${this.privateNotificationViewURL}${this.byRefUrl}` + reference + `/${this.translateService.currentLang}/`);
  }
  getNotification(url) {
    return this.http.get(url);
  }
  static {
    this.\u0275fac = function NotificationService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NotificationService)();
    };
  }
  static {
    this.\u0275prov = /** @pureOrBreakMyCode */
    \u0275\u0275defineInjectable({ token: _NotificationService, factory: _NotificationService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/features/notification/notification-utils.service.ts
var NotificationUtilsService = class _NotificationUtilsService {
  constructor() {
  }
  hasFlag(organizationFlag, flagType) {
    let found = false;
    if (organizationFlag.notificationFlags) {
      organizationFlag.notificationFlags.forEach((notificationFlag) => {
        if (notificationFlag.flagType === flagType) {
          found = true;
        }
      });
    }
    return found;
  }
  getProductName(item) {
    return item?.description ?? "No name provided";
  }
  getProductInfo(item) {
    const description = item?.productDescriptions?.[0];
    return {
      expiryDate: item?.consignments?.[0]?.expirationDate,
      aspect: description?.productAspect,
      temperature: description?.temperature?.description,
      labelling: description?.labelling,
      nameOnLabel: description?.nameOnLabel,
      weight: description?.weight,
      weightUnit: description?.weightUnit?.description,
      barcode: description?.barcode,
      brand: description?.brand
    };
  }
  static {
    this.\u0275fac = function NotificationUtilsService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NotificationUtilsService)();
    };
  }
  static {
    this.\u0275prov = /** @pureOrBreakMyCode */
    \u0275\u0275defineInjectable({ token: _NotificationUtilsService, factory: _NotificationUtilsService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationUtilsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/features/notification/tables/followups-table/followups-table.component.ts
var _ = __toESM(require_lodash());

// src/app/features/notification/tables/table-elements/fup-type-icon/fup-type-icon.component.ts
function FupTypeIconComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 0)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r0.normalizedType);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.fupOutput, " ");
  }
}
var FupTypeIconComponent = class _FupTypeIconComponent {
  constructor() {
    this.fupOutput = "";
    this.normalizedType = "";
  }
  ngOnChanges(changes) {
    if (changes.fupType) {
      this.updateFromType(changes.fupType.currentValue);
    }
  }
  updateFromType(fupType) {
    if (!fupType) {
      this.normalizedType = "";
      this.fupOutput = "";
      return;
    }
    const normalized = fupType.toLowerCase().replace(/\s+/g, "-").replace(/[()/]+/g, "");
    this.normalizedType = normalized;
    this.fupOutput = this.chooseOutput(normalized);
  }
  chooseOutput(fupType) {
    switch (fupType) {
      case "accompanying-documents":
        return "[]";
      case "additional-information":
        return "+";
      case "additional-lots":
        return "L";
      case "consignment-re-dispatch":
        return ">>";
      case "corrigendum":
        return "--";
      case "information-on-samplinganalysis":
        return "S";
      case "lifting-of-reinforced-control-measures":
        return "/";
      case "measures-taken":
        return "M";
      case "notification-downgrade":
        return "\u02C7";
      case "notification-reclassification":
        return "~";
      case "notification-upgrade":
        return "^";
      case "outcome-of-investigations":
        return "I";
      case "outcome-of-investigations-and-measures-taken":
        return "IM";
      case "reaction-from-third-country":
        return "@";
      case "request":
        return "?";
      case "request-for-withdrawal":
        return "W";
      case "translation":
        return "T";
      case "withdrawal-of-follow-up-notification":
        return "X";
      case "withdrawal-of-original-notification":
        return "W";
      default:
        return "";
    }
  }
  static {
    this.\u0275fac = function FupTypeIconComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _FupTypeIconComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _FupTypeIconComponent, selectors: [["app-fup-type-icon"]], inputs: { fupType: "fupType" }, features: [\u0275\u0275NgOnChangesFeature], decls: 1, vars: 1, consts: [[1, "fup-type-icon"]], template: function FupTypeIconComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275conditionalCreate(0, FupTypeIconComponent_Conditional_0_Template, 3, 3, "span", 0);
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.fupOutput ? 0 : -1);
      }
    }, dependencies: [SharedModule], styles: ["\n.fup-type-icon[_ngcontent-%COMP%] {\n  display: inline-block;\n  width: 24px;\n  height: 20px;\n  line-height: 20px;\n  text-align: center;\n  padding: 0px 4px;\n  background: #f4f4f4;\n  border-radius: 3px;\n  margin: 0 4px;\n  font-weight: bold;\n  print-color-adjust: exact;\n  -webkit-print-color-adjust: exact;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .accompanying-documents[_ngcontent-%COMP%] {\n  color: #006fb4;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .additional-information[_ngcontent-%COMP%] {\n  color: #006fb4;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .additional-lots[_ngcontent-%COMP%] {\n  color: #006fb4;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .consignment-re-dispatch[_ngcontent-%COMP%] {\n  color: #f29527;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .corrigendum[_ngcontent-%COMP%] {\n  color: #f29527;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .information-on-samplinganalysis[_ngcontent-%COMP%] {\n  color: #006fb4;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .lifting-of-reinforced-control-measures[_ngcontent-%COMP%] {\n  color: #467a39;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .measures-taken[_ngcontent-%COMP%] {\n  color: #f29527;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .notification-downgrade[_ngcontent-%COMP%] {\n  color: #467a39;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .notification-reclassification[_ngcontent-%COMP%] {\n  color: #f29527;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .notification-upgrade[_ngcontent-%COMP%] {\n  color: #da2131;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .outcome-of-investigations[_ngcontent-%COMP%] {\n  color: #006fb4;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .outcome-of-investigations-and-measures-taken[_ngcontent-%COMP%] {\n  color: #f29527;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .re-dispatch-information[_ngcontent-%COMP%] {\n  color: #006fb4;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .reaction-from-third-country[_ngcontent-%COMP%] {\n  color: #da2131;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .request[_ngcontent-%COMP%] {\n  color: #da2131;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .request-for-withdrawal[_ngcontent-%COMP%] {\n  color: #da2131;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .translation[_ngcontent-%COMP%] {\n  color: #006fb4;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .withdrawal-of-follow-up-notification[_ngcontent-%COMP%] {\n  color: #467a39;\n}\n.fup-type-icon[_ngcontent-%COMP%]   .withdrawal-of-original-notification[_ngcontent-%COMP%] {\n  color: #467a39;\n}\n/*# sourceMappingURL=fup-type-icon.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FupTypeIconComponent, [{
    type: Component,
    args: [{ selector: "app-fup-type-icon", imports: [SharedModule], standalone: true, template: '@if (fupOutput) {\n    <span class="fup-type-icon">\n        <span [class]="normalizedType">\n            {{ fupOutput }}\n        </span>\n    </span>\n}\n', styles: ["/* src/app/features/notification/tables/table-elements/fup-type-icon/fup-type-icon.component.scss */\n.fup-type-icon {\n  display: inline-block;\n  width: 24px;\n  height: 20px;\n  line-height: 20px;\n  text-align: center;\n  padding: 0px 4px;\n  background: #f4f4f4;\n  border-radius: 3px;\n  margin: 0 4px;\n  font-weight: bold;\n  print-color-adjust: exact;\n  -webkit-print-color-adjust: exact;\n}\n.fup-type-icon .accompanying-documents {\n  color: #006fb4;\n}\n.fup-type-icon .additional-information {\n  color: #006fb4;\n}\n.fup-type-icon .additional-lots {\n  color: #006fb4;\n}\n.fup-type-icon .consignment-re-dispatch {\n  color: #f29527;\n}\n.fup-type-icon .corrigendum {\n  color: #f29527;\n}\n.fup-type-icon .information-on-samplinganalysis {\n  color: #006fb4;\n}\n.fup-type-icon .lifting-of-reinforced-control-measures {\n  color: #467a39;\n}\n.fup-type-icon .measures-taken {\n  color: #f29527;\n}\n.fup-type-icon .notification-downgrade {\n  color: #467a39;\n}\n.fup-type-icon .notification-reclassification {\n  color: #f29527;\n}\n.fup-type-icon .notification-upgrade {\n  color: #da2131;\n}\n.fup-type-icon .outcome-of-investigations {\n  color: #006fb4;\n}\n.fup-type-icon .outcome-of-investigations-and-measures-taken {\n  color: #f29527;\n}\n.fup-type-icon .re-dispatch-information {\n  color: #006fb4;\n}\n.fup-type-icon .reaction-from-third-country {\n  color: #da2131;\n}\n.fup-type-icon .request {\n  color: #da2131;\n}\n.fup-type-icon .request-for-withdrawal {\n  color: #da2131;\n}\n.fup-type-icon .translation {\n  color: #006fb4;\n}\n.fup-type-icon .withdrawal-of-follow-up-notification {\n  color: #467a39;\n}\n.fup-type-icon .withdrawal-of-original-notification {\n  color: #467a39;\n}\n/*# sourceMappingURL=fup-type-icon.component.css.map */\n"] }]
  }], () => [], { fupType: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FupTypeIconComponent, { className: "FupTypeIconComponent", filePath: "src/app/features/notification/tables/table-elements/fup-type-icon/fup-type-icon.component.ts", lineNumber: 11 });
})();

// src/app/features/notification/tables/followups-table/followups-table.component.ts
function FollowupsTableComponent_ng_template_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 5);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "notification.fup.table.cpReference"), " ");
  }
}
function FollowupsTableComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 4);
    \u0275\u0275text(2, "Fup #");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, FollowupsTableComponent_ng_template_4_Conditional_3_Template, 3, 3, "th", 5);
    \u0275\u0275elementStart(4, "th", 6);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 7);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 8);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 9);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "translate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.auth === "private" ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(6, 7, "notification.fup.table.date"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 9, "notification.fup.table.orgInforming"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(12, 11, "notification.fup.table.contactOrg"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(15, 13, "notification.fup.table.type"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 15, "notification.fup.table.summary"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(21, 17, "notification.fup.table.flaggedOrg"));
  }
}
function FollowupsTableComponent_ng_template_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r2.cpReference !== void 0 ? row_r2.cpReference : "n/a", " ");
  }
}
function FollowupsTableComponent_ng_template_5_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-fup-type-icon", 16);
  }
  if (rf & 2) {
    const row_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("fupType", row_r2.fupType.description);
  }
}
function FollowupsTableComponent_ng_template_5_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275pipe(1, "translate");
    \u0275\u0275listener("click", function FollowupsTableComponent_ng_template_5_Conditional_33_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const row_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.copy(row_r2.summary));
    });
    \u0275\u0275element(2, "eui-icon-svg", 25);
    \u0275\u0275text(3, "copy to clipboard ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("euiTooltip", \u0275\u0275interpolate(\u0275\u0275pipeBind1(1, 2, "actions.copyClipboard")));
  }
}
function FollowupsTableComponent_ng_template_5_For_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-country", 15);
  }
  if (rf & 2) {
    const org_r4 = ctx.$implicit;
    \u0275\u0275property("country", org_r4.description)("isocode", org_r4.code)("noName", true);
  }
}
function FollowupsTableComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, FollowupsTableComponent_ng_template_5_Conditional_3_Template, 2, 1, "td", 11);
    \u0275\u0275elementStart(4, "td", 12)(5, "span", 13);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "rasffDate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 14)(9, "span");
    \u0275\u0275element(10, "app-country", 15);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "capitaliseFirstLetter");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, FollowupsTableComponent_ng_template_5_Conditional_13_Template, 1, 1, "app-fup-type-icon", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 17);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "capitaliseFirstLetter");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 18);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "capitaliseFirstLetter");
    \u0275\u0275pipe(20, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td", 19);
    \u0275\u0275pipe(22, "capitaliseFirstLetter");
    \u0275\u0275pipe(23, "translate");
    \u0275\u0275elementStart(24, "span", 20);
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "capitaliseFirstLetter");
    \u0275\u0275pipe(27, "truncate");
    \u0275\u0275pipe(28, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span", 21);
    \u0275\u0275text(30);
    \u0275\u0275pipe(31, "capitaliseFirstLetter");
    \u0275\u0275pipe(32, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(33, FollowupsTableComponent_ng_template_5_Conditional_33_Template, 4, 4, "button", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "td", 23);
    \u0275\u0275repeaterCreate(35, FollowupsTableComponent_ng_template_5_For_36_Template, 1, 3, "app-country", 15, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r2.fupNumber !== void 0 ? row_r2.fupNumber : "Fup(?)", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.auth === "private" ? 3 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", row_r2.fupDate !== void 0 ? \u0275\u0275pipeBind1(7, 15, row_r2.fupDate) : "No date", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("country", row_r2.organization)("isocode", row_r2.isoCode)("noName", true);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r2.organization !== void 0 ? \u0275\u0275pipeBind1(12, 17, row_r2.organization) : "", " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r2.fupType !== void 0 ? 13 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r2.contactOrganization !== void 0 ? \u0275\u0275pipeBind1(16, 19, row_r2.contactOrganization) : "n/a", " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", row_r2.fupType !== void 0 ? \u0275\u0275pipeBind1(19, 21, row_r2.fupType.description) : \u0275\u0275pipeBind1(20, 23, "notification.followUps.table.noSpecified"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("euiTooltip", \u0275\u0275interpolate(row_r2.summary !== void 0 ? \u0275\u0275pipeBind1(22, 25, row_r2.summary) : \u0275\u0275pipeBind1(23, 27, "notification.followUps.table.noSummary")));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", row_r2.summary !== void 0 ? \u0275\u0275pipeBind3(27, 31, \u0275\u0275pipeBind1(26, 29, row_r2.summary), 320, true) : \u0275\u0275pipeBind1(28, 35, "notification.followUps.table.noSummary"), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", row_r2.summary !== void 0 ? \u0275\u0275pipeBind1(31, 37, row_r2.summary) : \u0275\u0275pipeBind1(32, 39, "notification.followUps.table.noSummary"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(row_r2.summary !== void 0 ? 33 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.getOrganizationFromFlaggingByFupId(row_r2.fupId));
  }
}
var FollowupsTableComponent = class _FollowupsTableComponent {
  constructor() {
    this.growlService = inject(EuiGrowlService);
    this.fups = signal([], ...ngDevMode ? [{ debugName: "fups" }] : (
      /* istanbul ignore next */
      []
    ));
    this.isGrowlSticky = false;
    this.isGrowlMultiple = false;
    this.growlLife = 2e3;
    this.position = "bottom-right";
  }
  ngOnInit() {
    if (this.items?.length > 0) {
      this.mapItems();
    }
  }
  ngOnChanges(changes) {
    if ((changes["items"] || changes["additionalInfo"]) && this.items?.length > 0) {
      this.mapItems();
    }
  }
  mapItems() {
    const items = [];
    for (const item of this.items) {
      const additionalInfo = this.getAdditionalInfo(item);
      const newItem = {
        fupNumber: this.getFupNumber(item),
        fupId: this.getField(item, "fupId"),
        additionalInfoId: item["additionalInfoId"],
        fupDate: this.convertToString(this.getField(item, "fupDate")),
        organization: this.convertToString(this.getField(item, "organizationDescription")),
        isoCode: this.convertToString(this.getField(item, "organizationCode")),
        fupType: this.convertToString(this.getField(item, "fupType")),
        summary: this.convertToString(this.getField(item, "fupAdditionalInfo")),
        contactOrganization: additionalInfo?.organization,
        cpReference: additionalInfo?.cpReference
      };
      items.push(newItem);
    }
    this.fups.set(items);
  }
  getAdditionalInfo(item) {
    const additionalInfos = Array.isArray(this.additionalInfo) ? this.additionalInfo : this.additionalInfo ? [this.additionalInfo] : [];
    for (const info of additionalInfos) {
      if (info?.id === item["additionalInfoId"]) {
        return info;
      }
    }
    return void 0;
  }
  sortBy($event) {
    const { sort, order } = $event;
    this.fups.set(_.orderBy(this.fups(), [sort], [order]));
  }
  getField(item, fieldName) {
    if (item[fieldName] !== void 0 && item[fieldName] !== "") {
      return item[fieldName];
    } else {
      return void 0;
    }
  }
  getFupNumber(item) {
    if (item["fupNumber"] !== void 0) {
      return "fup" + item["fupNumber"];
    } else {
      return void 0;
    }
  }
  convertToString(value) {
    if (value === void 0) {
      return void 0;
    }
    return String(value);
  }
  getOrganizationFromFlaggingByFupId(fupId) {
    const fupOrgs = [];
    const addedOrgIds = /* @__PURE__ */ new Set();
    if (fupId) {
      for (const orgFlag of this.orgFlags) {
        if (orgFlag.notificationFlags) {
          orgFlag.notificationFlags.forEach((notificationFlag) => {
            if (notificationFlag.notificationId === fupId && !addedOrgIds.has(orgFlag.organization.id)) {
              fupOrgs.push(orgFlag.organization);
              addedOrgIds.add(orgFlag.organization.id);
            }
          });
        }
      }
    }
    return fupOrgs;
  }
  copy(text) {
    navigator.clipboard.writeText(String(text));
    this.growlService.growl({
      severity: "success",
      summary: "Copied to clipboard",
      detail: ""
    }, this.isGrowlSticky, this.isGrowlMultiple, this.growlLife, this.position);
  }
  static {
    this.\u0275fac = function FollowupsTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _FollowupsTableComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _FollowupsTableComponent, selectors: [["app-followups-table"]], inputs: { items: "items", userType: "userType", notifId: "notifId", additionalInfo: "additionalInfo", orgFlags: "orgFlags", auth: "auth" }, features: [\u0275\u0275NgOnChangesFeature], decls: 8, vars: 5, consts: [["paginatorFups", ""], ["euiTable", "", "isTableResponsive", "", 1, "notification-table", 3, "sortChange", "data", "paginator"], ["euiTemplate", "header"], ["euiTemplate", "body"], ["isSortable", "", "sortOn", "fupNumber"], ["isSortable", "", "sortOn", "cpReference"], ["isSortable", "", "sortOn", "fupDate"], ["isSortable", "", "sortOn", "organization"], ["isSortable", "", "sortOn", "contactOrganization"], ["isSortable", "", "sortOn", "fupType"], ["data-col-label", "Fup #", 1, "col-md-1"], ["data-col-label", "CP Reference", 1, "col-md-2"], ["data-col-label", "Date", 1, "col-md-1"], [1, "text-uppercase"], ["data-col-label", "Organisation", 1, "col-md-3"], [3, "country", "isocode", "noName"], [3, "fupType"], ["data-col-label", "Contact Organisation", 1, "col-md-2"], ["data-col-label", "Type", 1, "col-md-2"], ["data-col-label", "Summary", 1, "col-md-3", 3, "euiTooltip"], [1, "print-not"], [1, "print-only"], [1, "copy", "print-not", 3, "euiTooltip"], ["data-col-label", "Flags", 1, "col-md-2"], [1, "copy", "print-not", 3, "click", "euiTooltip"], ["aria-hidden", "true", "icon", "ecl-copy:ecl", "size", "xs"]], template: function FollowupsTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "table", 1);
        \u0275\u0275listener("sortChange", function FollowupsTableComponent_Template_table_sortChange_0_listener($event) {
          return ctx.sortBy($event);
        });
        \u0275\u0275elementStart(1, "caption");
        \u0275\u0275text(2);
        \u0275\u0275pipe(3, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275template(4, FollowupsTableComponent_ng_template_4_Template, 22, 19, "ng-template", 2)(5, FollowupsTableComponent_ng_template_5_Template, 37, 41, "ng-template", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275element(6, "eui-paginator", null, 0);
      }
      if (rf & 2) {
        const paginatorFups_r5 = \u0275\u0275reference(7);
        \u0275\u0275property("data", ctx.fups())("paginator", paginatorFups_r5);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(3, 3, "notification.followUps"), " ");
      }
    }, dependencies: [SharedModule, CountryComponent, EuiTableComponent, EuiTableSortableColComponent, EuiTemplateDirective, EuiPaginatorComponent, EuiIconSvgComponent, EuiTooltipDirective, FupTypeIconComponent, TranslatePipe, TruncatePipe, CapitaliseFirstLetterPipe, RasffDatePipe], styles: ["\n.notification-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  position: relative;\n}\n.notification-table[_ngcontent-%COMP%]   .eui-icon[_ngcontent-%COMP%], \n.notification-table[_ngcontent-%COMP%]   .ux-icon[_ngcontent-%COMP%] {\n  font-size: var(--eui-font-size);\n}\n.notification-table[_ngcontent-%COMP%]   button.copy[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  height: 24px;\n  border: #cbcbcb solid 1px;\n  margin-left: auto;\n  background: transparent;\n  box-shadow: none;\n}\n.notification-table[_ngcontent-%COMP%]   button.copy[_ngcontent-%COMP%]:hover {\n  cursor: pointer;\n  border-color: #909090;\n  color: #606060;\n}\n.notification-table[_ngcontent-%COMP%]   tr.hidden-more[_ngcontent-%COMP%] {\n  display: none;\n}\n@media screen and (max-width: 767px) {\n  .notification-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    width: auto;\n  }\n  .notification-table[_ngcontent-%COMP%]   button.copy[_ngcontent-%COMP%] {\n    bottom: -2px;\n  }\n  button.btn-show-hide[_ngcontent-%COMP%] {\n    display: block;\n    width: 50%;\n    margin: 2em auto;\n  }\n}\n@media screen and (max-width: 540px) {\n  app-fup-type-icon[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=followups-table.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FollowupsTableComponent, [{
    type: Component,
    args: [{ selector: "app-followups-table", imports: [SharedModule, FupTypeIconComponent], standalone: true, template: `<table
    euiTable
    isTableResponsive
    [data]="fups()"
    [paginator]="paginatorFups"
    (sortChange)="sortBy($event)"
    class="notification-table"
>
    <caption>
        {{
            "notification.followUps" | translate
        }}
    </caption>

    <ng-template euiTemplate="header">
        <tr>
            <th isSortable sortOn="fupNumber">Fup #</th>
            @if (auth === "private") {
                <th isSortable sortOn="cpReference">
                    {{ "notification.fup.table.cpReference" | translate }}
                </th>
            }
            <th isSortable sortOn="fupDate">
                {{ "notification.fup.table.date" | translate }}
            </th>
            <th isSortable sortOn="organization">
                {{ "notification.fup.table.orgInforming" | translate }}
            </th>
            <th isSortable sortOn="contactOrganization">
                {{ "notification.fup.table.contactOrg" | translate }}
            </th>
            <th isSortable sortOn="fupType">
                {{ "notification.fup.table.type" | translate }}
            </th>
            <th>{{ "notification.fup.table.summary" | translate }}</th>
            <th>{{ "notification.fup.table.flaggedOrg" | translate }}</th>
        </tr>
    </ng-template>

    <ng-template let-row euiTemplate="body">
        <tr>
            <td data-col-label="Fup #" class="col-md-1">
                {{ row.fupNumber !== undefined ? row.fupNumber : "Fup(?)" }}
            </td>
            @if (auth === "private") {
                <td data-col-label="CP Reference" class="col-md-2">
                    {{ row.cpReference !== undefined ? row.cpReference : "n/a" }}
                </td>
            }

            <td data-col-label="Date" class="col-md-1">
                <span class="text-uppercase">
                    {{ row.fupDate !== undefined ? (row.fupDate | rasffDate) : "No date" }}
                </span>
            </td>

            <td data-col-label="Organisation" class="col-md-3">
                <span>
                    <app-country
                        [country]="row.organization"
                        [isocode]="row.isoCode"
                        [noName]="true"
                    ></app-country>
                    {{
                        row.organization !== undefined
                            ? (row.organization | capitaliseFirstLetter)
                            : ""
                    }}
                </span>
                @if (row.fupType !== undefined) {
                    <app-fup-type-icon [fupType]="row.fupType.description"></app-fup-type-icon>
                }
            </td>
            <td data-col-label="Contact Organisation" class="col-md-2">
                {{
                    row.contactOrganization !== undefined
                        ? (row.contactOrganization | capitaliseFirstLetter)
                        : "n/a"
                }}
            </td>

            <td data-col-label="Type" class="col-md-2">
                {{
                    row.fupType !== undefined
                        ? (row.fupType.description | capitaliseFirstLetter)
                        : ("notification.followUps.table.noSpecified" | translate)
                }}
            </td>

            <td
                class="col-md-3"
                data-col-label="Summary"
                euiTooltip="{{
                    row.summary !== undefined
                        ? (row.summary | capitaliseFirstLetter)
                        : ('notification.followUps.table.noSummary' | translate)
                }}"
            >
                <span class="print-not">
                    {{
                        row.summary !== undefined
                            ? (row.summary | capitaliseFirstLetter | truncate: 320 : true)
                            : ("notification.followUps.table.noSummary" | translate)
                    }}
                </span>
                <span class="print-only">
                    {{
                        row.summary !== undefined
                            ? (row.summary | capitaliseFirstLetter)
                            : ("notification.followUps.table.noSummary" | translate)
                    }}
                </span>
                @if (row.summary !== undefined) {
                    <button
                        class="copy print-not"
                        (click)="copy(row.summary)"
                        euiTooltip="{{ 'actions.copyClipboard' | translate }}"
                    >
                        <eui-icon-svg
                            aria-hidden="true"
                            icon="ecl-copy:ecl"
                            size="xs"
                        ></eui-icon-svg
                        >copy to clipboard
                    </button>
                }
            </td>

            <td data-col-label="Flags" class="col-md-2">
                @for (org of getOrganizationFromFlaggingByFupId(row.fupId); track org) {
                    <app-country
                        [country]="org.description"
                        [isocode]="org.code"
                        [noName]="true"
                    ></app-country>
                }
            </td>
        </tr>
    </ng-template>
</table>

<eui-paginator #paginatorFups></eui-paginator>
`, styles: ["/* src/app/features/notification/tables/followups-table/followups-table.component.scss */\n.notification-table td {\n  position: relative;\n}\n.notification-table .eui-icon,\n.notification-table .ux-icon {\n  font-size: var(--eui-font-size);\n}\n.notification-table button.copy {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  height: 24px;\n  border: #cbcbcb solid 1px;\n  margin-left: auto;\n  background: transparent;\n  box-shadow: none;\n}\n.notification-table button.copy:hover {\n  cursor: pointer;\n  border-color: #909090;\n  color: #606060;\n}\n.notification-table tr.hidden-more {\n  display: none;\n}\n@media screen and (max-width: 767px) {\n  .notification-table td {\n    width: auto;\n  }\n  .notification-table button.copy {\n    bottom: -2px;\n  }\n  button.btn-show-hide {\n    display: block;\n    width: 50%;\n    margin: 2em auto;\n  }\n}\n@media screen and (max-width: 540px) {\n  app-fup-type-icon {\n    display: none;\n  }\n}\n/*# sourceMappingURL=followups-table.component.css.map */\n"] }]
  }], null, { items: [{
    type: Input
  }], userType: [{
    type: Input
  }], notifId: [{
    type: Input
  }], additionalInfo: [{
    type: Input
  }], orgFlags: [{
    type: Input
  }], auth: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FollowupsTableComponent, { className: "FollowupsTableComponent", filePath: "src/app/features/notification/tables/followups-table/followups-table.component.ts", lineNumber: 20 });
})();

// src/app/features/notification/nt-item/nt-item.component.ts
var _c0 = (a0) => ({ title: a0 });
function NtItemComponent_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 1);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("href", \u0275\u0275interpolate(ctx_r1.info), \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.info, " ");
  }
}
function NtItemComponent_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275element(1, "eui-icon-svg", 4);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("euiTooltip", \u0275\u0275interpolate(ctx_r1.info ? "Yes" : "No"))("icon", ctx_r1.info ? "ecl-check-filled:ecl" : "ecl-close-filled:ecl")("fillColor", ctx_r1.info ? "success-dark" : "danger");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.info ? "Yes" : "No", " ");
  }
}
function NtItemComponent_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "capitaliseFirstLetter");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, ctx_r1.info), " ");
  }
}
function NtItemComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "h3");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275pipe(4, "capitaliseFirstLetter");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275conditionalCreate(6, NtItemComponent_Conditional_0_Conditional_6_Template, 2, 3, "a", 1);
    \u0275\u0275conditionalCreate(7, NtItemComponent_Conditional_0_Conditional_7_Template, 3, 5, "span");
    \u0275\u0275conditionalCreate(8, NtItemComponent_Conditional_0_Conditional_8_Template, 3, 3, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 2);
    \u0275\u0275pipe(10, "translate");
    \u0275\u0275pipe(11, "translate");
    \u0275\u0275pipe(12, "translate");
    \u0275\u0275listener("click", function NtItemComponent_Conditional_0_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.copy());
    });
    \u0275\u0275element(13, "eui-icon-svg", 3);
    \u0275\u0275text(14, " copy to clipboard ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 11, \u0275\u0275pipeBind1(3, 9, ctx_r1.title)), " ");
    \u0275\u0275advance(3);
    \u0275\u0275classMap(ctx_r1.customClass);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.type === "url" ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.type === "boolean" ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.type === "text" ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("euiTooltip", \u0275\u0275interpolate(\u0275\u0275pipeBind1(10, 13, "actions.copyClipboard")));
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind2(12, 17, "notification.copyToClipboard", \u0275\u0275pureFunction1(20, _c0, \u0275\u0275pipeBind1(11, 15, ctx_r1.title))));
  }
}
var NtItemComponent = class _NtItemComponent {
  constructor() {
    this.title = "";
    this.customClass = "";
    this.type = "text";
    this.isGrowlSticky = false;
    this.isGrowlMultiple = false;
    this.growlLife = 2e3;
    this.position = "bottom-right";
    this.growlService = inject(EuiGrowlService);
  }
  ngOnInit() {
    if (this.info === "") {
      this.info = "n/a";
    }
    if (typeof this.info === "boolean") {
      this.type = "boolean";
    }
    if (typeof this.info === "string" && this.info.match(/^https?:\/\//)) {
      this.type = "url";
    }
  }
  copy() {
    navigator.clipboard.writeText(String(this.info));
    this.growlService.growl({
      severity: "success",
      summary: "Copied to clipboard",
      detail: ""
    }, this.isGrowlSticky, this.isGrowlMultiple, this.growlLife, this.position);
  }
  static {
    this.\u0275fac = function NtItemComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NtItemComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _NtItemComponent, selectors: [["app-nt-item"]], inputs: { title: "title", info: "info", customClass: "customClass" }, decls: 1, vars: 1, consts: [[1, "nt-item"], ["target", "_blank", "rel", "noopener", 3, "href"], [1, "copy", "print-not", 3, "click", "euiTooltip"], ["icon", "ecl-copy:ecl", "size", "xs", "aria-hidden", "true"], ["size", "xs", "aria-hidden", "true", 3, "icon", "fillColor", "euiTooltip"]], template: function NtItemComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275conditionalCreate(0, NtItemComponent_Conditional_0_Template, 15, 22, "div", 0);
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.info !== void 0 ? 0 : -1);
      }
    }, dependencies: [SharedModule, EuiIconSvgComponent, EuiTooltipDirective, TranslatePipe, CapitaliseFirstLetterPipe], styles: ["\n.nt-item[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  align-items: flex-end;\n  margin-bottom: 0.5em;\n  border-bottom: #cbcbcb solid 1px;\n}\n.nt-item[_ngcontent-%COMP%]   .eui-icon[_ngcontent-%COMP%], \n.nt-item[_ngcontent-%COMP%]   .ux-icon[_ngcontent-%COMP%] {\n  font-size: var(--eui-font-size);\n}\n.nt-item[_ngcontent-%COMP%]   .eui-icon-check-circle[_ngcontent-%COMP%] {\n  color: #467a39;\n}\n.nt-item[_ngcontent-%COMP%]   .eui-icon-times-circle[_ngcontent-%COMP%] {\n  color: #da2131;\n}\n.nt-item[_ngcontent-%COMP%]:hover {\n  border-color: #909090;\n}\n.nt-item[_ngcontent-%COMP%]:hover   button.copy[_ngcontent-%COMP%] {\n  border-color: #909090;\n  color: #606060;\n}\n.nt-item[_ngcontent-%COMP%]:hover   button.copy[_ngcontent-%COMP%]:hover {\n  cursor: pointer;\n}\n.nt-item[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  width: 25%;\n  font-size: var(--eui-font-size);\n  color: #000000;\n  font-weight: 700;\n  margin: 0 0 3px 0;\n}\n.nt-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  width: 70%;\n  font-size: var(--eui-font-size);\n  line-height: 1.2em;\n  margin: 0 0 3px 8px;\n}\n.nt-item[_ngcontent-%COMP%]   button.copy[_ngcontent-%COMP%] {\n  position: relative;\n  top: 1px;\n  height: 28px;\n  border: #cbcbcb solid 1px;\n  margin-left: auto;\n  background: transparent;\n  box-shadow: none;\n  transition: all 150ms ease-out;\n}\n.nt-item[_ngcontent-%COMP%]   button.copy[_ngcontent-%COMP%]:hover {\n  border-color: #333333;\n  background: #efefef;\n  color: #000000;\n}\n@media screen and (max-width: 540px) {\n  .nt-item[_ngcontent-%COMP%] {\n    display: block;\n    position: relative;\n    border: none;\n    height: auto;\n    margin: 2em 0 2em 0;\n    clear: both;\n    overflow: hidden;\n  }\n  .nt-item[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    display: block;\n    width: 100%;\n    border-bottom: #cbcbcb solid 1px;\n    padding-bottom: 5px;\n  }\n  .nt-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    display: inline-block;\n    float: left;\n    position: relative;\n    width: auto;\n    margin: 3px 0 0 0;\n  }\n  .nt-item[_ngcontent-%COMP%]   button.copy[_ngcontent-%COMP%] {\n    position: absolute;\n    top: 0;\n    right: 0;\n    height: 24px;\n    font-size: 0;\n  }\n}\n/*# sourceMappingURL=nt-item.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NtItemComponent, [{
    type: Component,
    args: [{ selector: "app-nt-item", imports: [SharedModule], standalone: true, template: `@if (info !== undefined) {
    <div class="nt-item">
        <h3>
            {{ title | translate | capitaliseFirstLetter }}
        </h3>
        <p class="{{ customClass }}">
            @if (type === "url") {
                <a href="{{ info }}" target="_blank" rel="noopener">
                    {{ info }}
                </a>
            }
            @if (type === "boolean") {
                <span>
                    <eui-icon-svg
                        [icon]="info ? 'ecl-check-filled:ecl' : 'ecl-close-filled:ecl'"
                        size="xs"
                        aria-hidden="true"
                        [fillColor]="info ? 'success-dark' : 'danger'"
                        euiTooltip="{{ info ? 'Yes' : 'No' }}"
                    >
                    </eui-icon-svg>
                    {{ info ? "Yes" : "No" }}
                </span>
            }
            @if (type === "text") {
                <span>
                    {{ info | capitaliseFirstLetter }}
                </span>
            }
        </p>
        <button
            class="copy print-not"
            [attr.aria-label]="
                'notification.copyToClipboard' | translate: { title: (title | translate) }
            "
            (click)="copy()"
            euiTooltip="{{ 'actions.copyClipboard' | translate }}"
        >
            <eui-icon-svg icon="ecl-copy:ecl" size="xs" aria-hidden="true"></eui-icon-svg>
            copy to clipboard
        </button>
    </div>
}
`, styles: ["/* src/app/features/notification/nt-item/nt-item.component.scss */\n.nt-item {\n  display: flex;\n  flex-direction: row;\n  align-items: flex-end;\n  margin-bottom: 0.5em;\n  border-bottom: #cbcbcb solid 1px;\n}\n.nt-item .eui-icon,\n.nt-item .ux-icon {\n  font-size: var(--eui-font-size);\n}\n.nt-item .eui-icon-check-circle {\n  color: #467a39;\n}\n.nt-item .eui-icon-times-circle {\n  color: #da2131;\n}\n.nt-item:hover {\n  border-color: #909090;\n}\n.nt-item:hover button.copy {\n  border-color: #909090;\n  color: #606060;\n}\n.nt-item:hover button.copy:hover {\n  cursor: pointer;\n}\n.nt-item h3 {\n  width: 25%;\n  font-size: var(--eui-font-size);\n  color: #000000;\n  font-weight: 700;\n  margin: 0 0 3px 0;\n}\n.nt-item p {\n  width: 70%;\n  font-size: var(--eui-font-size);\n  line-height: 1.2em;\n  margin: 0 0 3px 8px;\n}\n.nt-item button.copy {\n  position: relative;\n  top: 1px;\n  height: 28px;\n  border: #cbcbcb solid 1px;\n  margin-left: auto;\n  background: transparent;\n  box-shadow: none;\n  transition: all 150ms ease-out;\n}\n.nt-item button.copy:hover {\n  border-color: #333333;\n  background: #efefef;\n  color: #000000;\n}\n@media screen and (max-width: 540px) {\n  .nt-item {\n    display: block;\n    position: relative;\n    border: none;\n    height: auto;\n    margin: 2em 0 2em 0;\n    clear: both;\n    overflow: hidden;\n  }\n  .nt-item h3 {\n    display: block;\n    width: 100%;\n    border-bottom: #cbcbcb solid 1px;\n    padding-bottom: 5px;\n  }\n  .nt-item p {\n    display: inline-block;\n    float: left;\n    position: relative;\n    width: auto;\n    margin: 3px 0 0 0;\n  }\n  .nt-item button.copy {\n    position: absolute;\n    top: 0;\n    right: 0;\n    height: 24px;\n    font-size: 0;\n  }\n}\n/*# sourceMappingURL=nt-item.component.css.map */\n"] }]
  }], () => [], { title: [{
    type: Input
  }], info: [{
    type: Input
  }], customClass: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NtItemComponent, { className: "NtItemComponent", filePath: "src/app/features/notification/nt-item/nt-item.component.ts", lineNumber: 13 });
})();

// src/app/features/notification/org-flags-summary/org-flag-icon/org-flag-icon.component.ts
var OrgFlagIconComponent = class _OrgFlagIconComponent {
  constructor() {
    this.flag = "";
    this.on = false;
    this.cssClass = "";
  }
  ngOnInit() {
    this.cssClass = this.on ? "active-flag " + this.flag : "inactive-flag " + this.flag;
  }
  static {
    this.\u0275fac = function OrgFlagIconComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _OrgFlagIconComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _OrgFlagIconComponent, selectors: [["app-org-flag-icon"]], inputs: { flag: "flag", on: "on" }, decls: 3, vars: 6, consts: [[1, "org-flag-icon", 3, "euiTooltip"]], template: function OrgFlagIconComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "span", 0);
        \u0275\u0275pipe(1, "capitaliseFirstLetter");
        \u0275\u0275element(2, "span");
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("euiTooltip", \u0275\u0275interpolate(ctx.on ? \u0275\u0275pipeBind1(1, 4, ctx.flag) : "Not " + ctx.flag));
        \u0275\u0275advance(2);
        \u0275\u0275classMap(ctx.cssClass);
      }
    }, dependencies: [SharedModule, EuiTooltipDirective, CapitaliseFirstLetterPipe], styles: ['\n.org-flag-icon[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 24px;\n  display: flex;\n  margin: 0 0 0 0;\n  print-color-adjust: exact;\n  -webkit-print-color-adjust: exact;\n}\n.org-flag-icon[_ngcontent-%COMP%]   .notifying[_ngcontent-%COMP%] {\n  mask-image: url("./media/notifying.svg");\n}\n.org-flag-icon[_ngcontent-%COMP%]   .origin[_ngcontent-%COMP%] {\n  mask-image: url("./media/origin.svg");\n}\n.org-flag-icon[_ngcontent-%COMP%]   .distribution[_ngcontent-%COMP%] {\n  mask-image: url("./media/distribution.svg");\n}\n.org-flag-icon[_ngcontent-%COMP%]   .operator[_ngcontent-%COMP%] {\n  mask-image: url("./media/operator.svg");\n}\n.org-flag-icon[_ngcontent-%COMP%]   .flagged-for-follow-up[_ngcontent-%COMP%] {\n  mask-image: url("./media/flagged-for-follow-up.svg");\n}\n.org-flag-icon[_ngcontent-%COMP%]   .flagged-for-attention[_ngcontent-%COMP%] {\n  mask-image: url("./media/flagged-for-attention.svg");\n}\n.org-flag-icon[_ngcontent-%COMP%]   .active-flag[_ngcontent-%COMP%] {\n  background-color: #004494;\n}\n.org-flag-icon[_ngcontent-%COMP%]   .inactive-flag[_ngcontent-%COMP%] {\n  background-color: #acacac;\n}\n.org-flag-icon[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  width: 24px;\n  height: 24px;\n  margin: 0 auto;\n}\n@media screen and (max-width: 767px) {\n  .org-flag-icon[_ngcontent-%COMP%] {\n    display: block;\n  }\n}\n/*# sourceMappingURL=org-flag-icon.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OrgFlagIconComponent, [{
    type: Component,
    args: [{ selector: "app-org-flag-icon", imports: [SharedModule], standalone: true, template: `<span class="org-flag-icon" euiTooltip="{{ on ? (flag | capitaliseFirstLetter) : 'Not ' + flag }}">
    <span class="{{ cssClass }}"></span>
</span>
`, styles: ['/* src/app/features/notification/org-flags-summary/org-flag-icon/org-flag-icon.component.scss */\n.org-flag-icon {\n  width: 40px;\n  height: 24px;\n  display: flex;\n  margin: 0 0 0 0;\n  print-color-adjust: exact;\n  -webkit-print-color-adjust: exact;\n}\n.org-flag-icon .notifying {\n  mask-image: url("./media/notifying.svg");\n}\n.org-flag-icon .origin {\n  mask-image: url("./media/origin.svg");\n}\n.org-flag-icon .distribution {\n  mask-image: url("./media/distribution.svg");\n}\n.org-flag-icon .operator {\n  mask-image: url("./media/operator.svg");\n}\n.org-flag-icon .flagged-for-follow-up {\n  mask-image: url("./media/flagged-for-follow-up.svg");\n}\n.org-flag-icon .flagged-for-attention {\n  mask-image: url("./media/flagged-for-attention.svg");\n}\n.org-flag-icon .active-flag {\n  background-color: #004494;\n}\n.org-flag-icon .inactive-flag {\n  background-color: #acacac;\n}\n.org-flag-icon span {\n  display: block;\n  width: 24px;\n  height: 24px;\n  margin: 0 auto;\n}\n@media screen and (max-width: 767px) {\n  .org-flag-icon {\n    display: block;\n  }\n}\n/*# sourceMappingURL=org-flag-icon.component.css.map */\n'] }]
  }], null, { flag: [{
    type: Input
  }], on: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OrgFlagIconComponent, { className: "OrgFlagIconComponent", filePath: "src/app/features/notification/org-flags-summary/org-flag-icon/org-flag-icon.component.ts", lineNumber: 11 });
})();

// src/app/features/notification/org-flags-summary/org-flags-summary.component.ts
function OrgFlagsSummaryComponent_For_27_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "strong", 14);
    \u0275\u0275listener("mouseover", function OrgFlagsSummaryComponent_For_27_Conditional_2_Template_strong_mouseover_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      \u0275\u0275nextContext();
      const popover_r2 = \u0275\u0275reference(5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openPopover($event, popover_r2));
    })("focus", function OrgFlagsSummaryComponent_For_27_Conditional_2_Template_strong_focus_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      \u0275\u0275nextContext();
      const popover_r2 = \u0275\u0275reference(5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openPopover($event, popover_r2));
    });
    \u0275\u0275element(1, "app-country", 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const org_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("country", org_r4["organization"]["description"])("isocode", org_r4["organization"]["code"]);
  }
}
function OrgFlagsSummaryComponent_For_27_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-country", 15);
    \u0275\u0275listener("mouseover", function OrgFlagsSummaryComponent_For_27_Conditional_3_Template_app_country_mouseover_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      \u0275\u0275nextContext();
      const popover_r2 = \u0275\u0275reference(5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openPopover($event, popover_r2));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const org_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("country", org_r4["organization"]["description"])("isocode", org_r4["organization"]["code"]);
  }
}
function OrgFlagsSummaryComponent_For_27_Conditional_7_Conditional_0_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "a", 16);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const link_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("href", link_r6.link, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", link_r6.link, " ");
  }
}
function OrgFlagsSummaryComponent_For_27_Conditional_7_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, OrgFlagsSummaryComponent_For_27_Conditional_7_Conditional_0_For_1_Template, 3, 2, "p", null, \u0275\u0275repeaterTrackByIdentity);
  }
  if (rf & 2) {
    const links_r7 = \u0275\u0275nextContext();
    \u0275\u0275repeater(links_r7);
  }
}
function OrgFlagsSummaryComponent_For_27_Conditional_7_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "consumers.noLinks"));
  }
}
function OrgFlagsSummaryComponent_For_27_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OrgFlagsSummaryComponent_For_27_Conditional_7_Conditional_0_Template, 2, 0)(1, OrgFlagsSummaryComponent_For_27_Conditional_7_Conditional_1_Template, 3, 3, "p");
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.length > 0 ? 0 : 1);
  }
}
function OrgFlagsSummaryComponent_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 4);
    \u0275\u0275conditionalCreate(2, OrgFlagsSummaryComponent_For_27_Conditional_2_Template, 2, 2, "strong")(3, OrgFlagsSummaryComponent_For_27_Conditional_3_Template, 1, 2, "app-country", 5);
    \u0275\u0275elementStart(4, "eui-popover", 6, 0);
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275conditionalCreate(7, OrgFlagsSummaryComponent_For_27_Conditional_7_Template, 2, 1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 7);
    \u0275\u0275element(9, "app-org-flag-icon", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 9);
    \u0275\u0275element(11, "app-org-flag-icon", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 10);
    \u0275\u0275element(13, "app-org-flag-icon", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 11);
    \u0275\u0275element(15, "app-org-flag-icon", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 12);
    \u0275\u0275element(17, "app-org-flag-icon", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td", 13);
    \u0275\u0275element(19, "app-org-flag-icon", 8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_15_0;
    const org_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.hasFlag(org_r4, ctx_r2.flagType.NOTIFYING) ? 2 : 3);
    \u0275\u0275advance(2);
    \u0275\u0275property("title", \u0275\u0275interpolate(org_r4["organization"]["description"] + " " + \u0275\u0275pipeBind1(6, 18, "notification.consumerLinks")))("position", "left")("euiSizeVariant", "xl");
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_15_0 = ctx_r2.getConsumerLinks(org_r4)) ? 7 : -1, tmp_15_0);
    \u0275\u0275advance(2);
    \u0275\u0275property("flag", "notifying")("on", ctx_r2.hasFlag(org_r4, ctx_r2.flagType.NOTIFYING));
    \u0275\u0275advance(2);
    \u0275\u0275property("flag", "origin")("on", ctx_r2.hasFlag(org_r4, ctx_r2.flagType.ORIGIN));
    \u0275\u0275advance(2);
    \u0275\u0275property("flag", "distribution")("on", ctx_r2.hasFlag(org_r4, ctx_r2.flagType.DISTRIBUTION));
    \u0275\u0275advance(2);
    \u0275\u0275property("flag", "operator")("on", ctx_r2.hasFlag(org_r4, ctx_r2.flagType.OPERATOR));
    \u0275\u0275advance(2);
    \u0275\u0275property("flag", "flagged-for-follow-up")("on", ctx_r2.hasFlag(org_r4, ctx_r2.flagType.FOR_FOLLOW_UP));
    \u0275\u0275advance(2);
    \u0275\u0275property("flag", "flagged-for-attention")("on", ctx_r2.hasFlag(org_r4, ctx_r2.flagType.FOR_ATTENTION));
  }
}
var OrgFlagsSummaryComponent = class _OrgFlagsSummaryComponent {
  constructor() {
    this.flagType = FlagType;
    this.activePopover = null;
    this.notificationUtilsService = inject(NotificationUtilsService);
  }
  hasFlag(organizationFlag, flagType) {
    return this.notificationUtilsService.hasFlag(organizationFlag, flagType);
  }
  openPopover(e, popover) {
    this.closeAllPopovers();
    this.activePopover = popover;
    popover.openPopover(e.target);
  }
  closePopover(popover) {
    popover.closePopover();
    if (this.activePopover === popover) {
      this.activePopover = null;
    }
  }
  closeAllPopovers() {
    if (this.popovers) {
      this.popovers.forEach((p) => {
        if (p.isOpen) {
          p.closePopover();
        }
      });
    }
  }
  getConsumerLinks(org) {
    return this.consumerLink?.[org?.organization?.countryNetworkOrganizationId] || [];
  }
  static {
    this.\u0275fac = function OrgFlagsSummaryComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _OrgFlagsSummaryComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _OrgFlagsSummaryComponent, selectors: [["app-org-flags-summary"]], viewQuery: function OrgFlagsSummaryComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(EuiPopoverComponent, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.popovers = _t);
      }
    }, inputs: { orgFlags: "orgFlags", consumerLink: "consumerLink" }, decls: 28, vars: 6, consts: [["popover", ""], [1, "org-flags-info"], [1, "ux-table", "ux-table--responsive", "org-flags-summary"], ["width", "50", 1, "text-center"], ["data-col", "Organisation"], [1, "hover", 3, "country", "isocode"], [3, "title", "position", "euiSizeVariant"], ["data-col", "Notifying", 1, "text-center"], [3, "flag", "on"], ["data-col", "Origin", 1, "text-center"], ["data-col", "Distribution", 1, "text-center"], ["data-col", "Operator", 1, "text-center"], ["data-col", "Flagged for fup", 1, "text-center"], ["data-col", "For attention", 1, "text-center"], [3, "mouseover", "focus"], [1, "hover", 3, "mouseover", "country", "isocode"], ["target", "_blank", "rel", "noopener noreferrer", 3, "href"]], template: function OrgFlagsSummaryComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "p", 1);
        \u0275\u0275text(1, " (N) Notifying | (O) Origin | (D) Distribution | (OP) Operator");
        \u0275\u0275element(2, "br");
        \u0275\u0275text(3, " (FFUP) Flagged for Follow-UP | (FFA) Flagged For Attention\n");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "table", 2)(5, "caption");
        \u0275\u0275text(6);
        \u0275\u0275pipe(7, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "thead")(9, "tr")(10, "th");
        \u0275\u0275text(11);
        \u0275\u0275pipe(12, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "th", 3);
        \u0275\u0275text(14, "N");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "th", 3);
        \u0275\u0275text(16, "O");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "th", 3);
        \u0275\u0275text(18, "D");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "th", 3);
        \u0275\u0275text(20, "OP");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "th", 3);
        \u0275\u0275text(22, "FFUP");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "th", 3);
        \u0275\u0275text(24, "FFA");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(25, "tbody");
        \u0275\u0275repeaterCreate(26, OrgFlagsSummaryComponent_For_27_Template, 20, 20, "tr", null, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(7, 2, "notification.flaggedOrganizations"), " ");
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 4, "notification.organisations"));
        \u0275\u0275advance(15);
        \u0275\u0275repeater(ctx.orgFlags);
      }
    }, dependencies: [SharedModule, CountryComponent, EuiPopoverComponent, OrgFlagIconComponent, TranslatePipe], styles: ["\np.org-flags-info[_ngcontent-%COMP%] {\n  font-size: calc(0.8 * var(--eui-font-size));\n  letter-spacing: 0.05em;\n  color: #595959;\n  margin: 0 0 1em 12px;\n}\ntable.org-flags-summary[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding-top: 4px;\n  padding-bottom: 4px;\n}\ntable.org-flags-summary[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   .hover[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\na[_ngcontent-%COMP%] {\n  word-wrap: break-word;\n}\n@media screen and (max-width: 991px) {\n  p.org-flags-info[_ngcontent-%COMP%] {\n    font-size: var(--eui-font-size);\n    margin: 2em 0;\n    text-align: center;\n  }\n}\n@media screen and (max-width: 767px) {\n  p.org-flags-info[_ngcontent-%COMP%] {\n    display: none;\n  }\n  table.org-flags-summary[_ngcontent-%COMP%] {\n    margin: 2em 0 0 0;\n  }\n  table.org-flags-summary[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]::before {\n    text-align: right;\n    line-height: var(--eui-font-size);\n  }\n}\n@media print {\n  p.org-flags-info[_ngcontent-%COMP%] {\n    margin-top: 4em;\n  }\n}\n/*# sourceMappingURL=org-flags-summary.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OrgFlagsSummaryComponent, [{
    type: Component,
    args: [{ selector: "app-org-flags-summary", imports: [SharedModule, OrgFlagIconComponent], standalone: true, template: `<p class="org-flags-info">
    (N) Notifying | (O) Origin | (D) Distribution | (OP) Operator<br />
    (FFUP) Flagged for Follow-UP | (FFA) Flagged For Attention
</p>

<table class="ux-table ux-table--responsive org-flags-summary">
    <caption>
        {{
            "notification.flaggedOrganizations" | translate
        }}
    </caption>
    <thead>
        <tr>
            <th>{{ "notification.organisations" | translate }}</th>
            <th width="50" class="text-center">N</th>
            <th width="50" class="text-center">O</th>
            <th width="50" class="text-center">D</th>
            <th width="50" class="text-center">OP</th>
            <th width="50" class="text-center">FFUP</th>
            <th width="50" class="text-center">FFA</th>
        </tr>
    </thead>
    <tbody>
        @for (org of orgFlags; track org) {
            <tr>
                <td data-col="Organisation">
                    @if (hasFlag(org, flagType.NOTIFYING)) {
                        <strong
                            (mouseover)="openPopover($event, popover)"
                            (focus)="openPopover($event, popover)"
                        >
                            <app-country
                                class="hover"
                                [country]="org['organization']['description']"
                                [isocode]="org['organization']['code']"
                            ></app-country>
                        </strong>
                    } @else {
                        <app-country
                            class="hover"
                            [country]="org['organization']['description']"
                            [isocode]="org['organization']['code']"
                            (mouseover)="openPopover($event, popover)"
                        ></app-country>
                    }
                    <eui-popover
                        #popover
                        title="{{
                            org['organization']['description'] +
                                ' ' +
                                ('notification.consumerLinks' | translate)
                        }}"
                        [position]="'left'"
                        [euiSizeVariant]="'xl'"
                    >
                        @if (getConsumerLinks(org); as links) {
                            @if (links.length > 0) {
                                @for (link of links; track link) {
                                    <p>
                                        <a
                                            [href]="link.link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {{ link.link }}
                                        </a>
                                    </p>
                                }
                            } @else {
                                <p>{{ "consumers.noLinks" | translate }}</p>
                            }
                        }
                    </eui-popover>
                </td>
                <td data-col="Notifying" class="text-center">
                    <app-org-flag-icon
                        [flag]="'notifying'"
                        [on]="hasFlag(org, flagType.NOTIFYING)"
                    ></app-org-flag-icon>
                </td>
                <td data-col="Origin" class="text-center">
                    <app-org-flag-icon
                        [flag]="'origin'"
                        [on]="hasFlag(org, flagType.ORIGIN)"
                    ></app-org-flag-icon>
                </td>
                <td data-col="Distribution" class="text-center">
                    <app-org-flag-icon
                        [flag]="'distribution'"
                        [on]="hasFlag(org, flagType.DISTRIBUTION)"
                    ></app-org-flag-icon>
                </td>
                <td data-col="Operator" class="text-center">
                    <app-org-flag-icon
                        [flag]="'operator'"
                        [on]="hasFlag(org, flagType.OPERATOR)"
                    ></app-org-flag-icon>
                </td>
                <td data-col="Flagged for fup" class="text-center">
                    <app-org-flag-icon
                        [flag]="'flagged-for-follow-up'"
                        [on]="hasFlag(org, flagType.FOR_FOLLOW_UP)"
                    ></app-org-flag-icon>
                </td>
                <td data-col="For attention" class="text-center">
                    <app-org-flag-icon
                        [flag]="'flagged-for-attention'"
                        [on]="hasFlag(org, flagType.FOR_ATTENTION)"
                    ></app-org-flag-icon>
                </td>
            </tr>
        }
    </tbody>
</table>
`, styles: ["/* src/app/features/notification/org-flags-summary/org-flags-summary.component.scss */\np.org-flags-info {\n  font-size: calc(0.8 * var(--eui-font-size));\n  letter-spacing: 0.05em;\n  color: #595959;\n  margin: 0 0 1em 12px;\n}\ntable.org-flags-summary td {\n  padding-top: 4px;\n  padding-bottom: 4px;\n}\ntable.org-flags-summary td .hover {\n  cursor: pointer;\n}\na {\n  word-wrap: break-word;\n}\n@media screen and (max-width: 991px) {\n  p.org-flags-info {\n    font-size: var(--eui-font-size);\n    margin: 2em 0;\n    text-align: center;\n  }\n}\n@media screen and (max-width: 767px) {\n  p.org-flags-info {\n    display: none;\n  }\n  table.org-flags-summary {\n    margin: 2em 0 0 0;\n  }\n  table.org-flags-summary td::before {\n    text-align: right;\n    line-height: var(--eui-font-size);\n  }\n}\n@media print {\n  p.org-flags-info {\n    margin-top: 4em;\n  }\n}\n/*# sourceMappingURL=org-flags-summary.component.css.map */\n"] }]
  }], null, { orgFlags: [{
    type: Input
  }], consumerLink: [{
    type: Input
  }], popovers: [{
    type: ViewChildren,
    args: [EuiPopoverComponent]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OrgFlagsSummaryComponent, { className: "OrgFlagsSummaryComponent", filePath: "src/app/features/notification/org-flags-summary/org-flags-summary.component.ts", lineNumber: 19 });
})();

// src/app/features/notification/tables/attachments-table/attachments-table.component.ts
var _2 = __toESM(require_lodash());
var import_print_js = __toESM(require_print());

// src/app/features/notification/tables/table-elements/attachment-type/attachment-type.component.ts
var AttachmentTypeComponent = class _AttachmentTypeComponent {
  constructor() {
    this.icon = "";
  }
  ngOnInit() {
    if (this.type) {
      this.getIconClass();
    } else {
      this.type = "unknown";
      this.icon = "times-circle";
    }
  }
  getIconClass() {
    let cleanType = this.type.toLowerCase().replace(/\/+/g, " ");
    cleanType = cleanType.replace(/\s+/g, "-");
    cleanType = cleanType.replace(/[()]+/g, "");
    const icons = {
      "cved-ced": "flag",
      "analytical-report": "chart-bar",
      "bills-delivery-documents": "credit-card",
      "follow-up-notification": "navigate",
      "health-certificate": "plus-circle",
      other: "file",
      "phytosanitary-certificate": "plus-circle",
      picture: "image",
      "public-warning-press-release": "exclamation-circle",
      "recipients-list": "list",
      "risk-assessment": "chart-bar",
      screenshot: "image",
      translation: "comment",
      video: "tablet"
    };
    this.icon = icons[cleanType];
  }
  static {
    this.\u0275fac = function AttachmentTypeComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AttachmentTypeComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _AttachmentTypeComponent, selectors: [["app-attachment-type"]], inputs: { type: "type" }, decls: 4, vars: 4, consts: [[1, "attachment-type"], [1, "attachment-type-text"]], template: function AttachmentTypeComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275domElementStart(0, "span", 0);
        \u0275\u0275domElement(1, "span");
        \u0275\u0275domElementStart(2, "span", 1);
        \u0275\u0275text(3);
        \u0275\u0275domElementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275classMap(\u0275\u0275interpolate1("eui-icon eui-icon-", ctx.icon));
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", ctx.type, " ");
      }
    }, styles: ["\n.attachment-type[_ngcontent-%COMP%]   .eui-icon[_ngcontent-%COMP%] {\n  margin: 0 8px 0 0;\n  position: relative;\n  top: 2px;\n}\n/*# sourceMappingURL=attachment-type.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AttachmentTypeComponent, [{
    type: Component,
    args: [{ selector: "app-attachment-type", standalone: true, template: '<span class="attachment-type">\n    <span class="eui-icon eui-icon-{{ icon }}"></span>\n    <span class="attachment-type-text">\n        {{ type }}\n    </span>\n</span>\n', styles: ["/* src/app/features/notification/tables/table-elements/attachment-type/attachment-type.component.scss */\n.attachment-type .eui-icon {\n  margin: 0 8px 0 0;\n  position: relative;\n  top: 2px;\n}\n/*# sourceMappingURL=attachment-type.component.css.map */\n"] }]
  }], null, { type: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AttachmentTypeComponent, { className: "AttachmentTypeComponent", filePath: "src/app/features/notification/tables/table-elements/attachment-type/attachment-type.component.ts", lineNumber: 9 });
})();

// src/app/features/notification/tables/attachments-table/attachments-table.component.ts
function AttachmentsTableComponent_Conditional_0_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 4);
    \u0275\u0275text(2, "Fup #");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 5);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 6);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 7);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 8);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 9);
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "translate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(5, 5, "notification.attachments.table.fileName"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(8, 7, "notification.attachments.table.type"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(11, 9, "notification.attachments.table.fileType"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(14, 11, "notification.attachments.table.size"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(17, 13, "notification.attachments.table.print"), " ");
  }
}
function AttachmentsTableComponent_Conditional_0_ng_template_6_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function AttachmentsTableComponent_Conditional_0_ng_template_6_Conditional_15_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const row_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.print(row_r4));
    });
    \u0275\u0275element(1, "eui-icon-svg", 20);
    \u0275\u0275elementEnd();
  }
}
function AttachmentsTableComponent_Conditional_0_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 11)(4, "a", 12);
    \u0275\u0275listener("click", function AttachmentsTableComponent_Conditional_0_ng_template_6_Template_a_click_4_listener() {
      const row_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openAttachment(row_r4));
    })("keyup.enter", function AttachmentsTableComponent_Conditional_0_ng_template_6_Template_a_keyup_enter_4_listener() {
      const row_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openAttachment(row_r4));
    });
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "truncate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td", 13);
    \u0275\u0275element(8, "app-attachment-type", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 15);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "uppercase");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 16);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 17);
    \u0275\u0275conditionalCreate(15, AttachmentsTableComponent_Conditional_0_ng_template_6_Conditional_15_Template, 2, 0, "button", 18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r4.fupReference !== void 0 ? row_r4.fupReference : "n/a", " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(6, 6, row_r4.filename, 36), " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("type", row_r4.type);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(11, 9, row_r4.fileType), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", row_r4.size, " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r4.type !== "Video" ? 15 : -1);
  }
}
function AttachmentsTableComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "table", 1);
    \u0275\u0275listener("sortChange", function AttachmentsTableComponent_Conditional_0_Template_table_sortChange_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sortBy($event));
    });
    \u0275\u0275elementStart(2, "caption");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, AttachmentsTableComponent_Conditional_0_ng_template_5_Template, 18, 15, "ng-template", 2)(6, AttachmentsTableComponent_Conditional_0_ng_template_6_Template, 16, 11, "ng-template", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "eui-paginator", null, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const paginatorAttachments_r6 = \u0275\u0275reference(8);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r1.documents())("paginator", paginatorAttachments_r6);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 3, "notification.attachments.table.attachments"), " ");
  }
}
function AttachmentsTableComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "notification.attachments.table.noAttachments"));
  }
}
var AttachmentsTableComponent = class _AttachmentsTableComponent {
  constructor() {
    this.documents = signal([], ...ngDevMode ? [{ debugName: "documents" }] : (
      /* istanbul ignore next */
      []
    ));
    this.attachmentUrl = "./backend/logged/attachment/";
    this.isGrowlSticky = false;
    this.isGrowlMultiple = false;
    this.growlLife = 6e3;
    this.growlPosition = "bottom-right";
    this.growlService = inject(EuiGrowlService);
  }
  ngOnInit() {
    if (this.items?.length > 0) {
      this.mapItems();
    }
  }
  ngOnChanges(changes) {
    if (changes["items"] && this.items?.length > 0) {
      this.mapItems();
    }
  }
  mapItems() {
    const items = [];
    for (const item of this.items) {
      const newItem = {
        id: this.getId(item),
        filename: this.getFilename(item),
        type: this.getType(item),
        fupReference: this.getFupReference(item),
        notificationId: this.getNotificationId(item),
        organisation: this.getOrganisation(item),
        operator: this.getOperator(item),
        fileType: this.getFileType(item),
        size: this.getSize(item)
      };
      items.push(newItem);
    }
    this.documents.set(items);
  }
  sortBy($event) {
    const { sort, order } = $event;
    this.documents.set(_2.orderBy(this.documents(), [sort], [order]));
  }
  getId(item) {
    if (item["id"] !== void 0) {
      return item["id"];
    } else {
      console.log("No id found");
      return void 0;
    }
  }
  getFilename(item) {
    if (item["filename"] !== void 0) {
      return item["filename"];
    } else {
      console.log("No filename found");
      return void 0;
    }
  }
  getType(item) {
    if (item["type"] !== void 0) {
      return item["type"];
    } else {
      console.log("No type found");
      return void 0;
    }
  }
  getFupReference(item) {
    if (item["fupReference"] !== void 0) {
      if (item["fupReference"]["fupNumber"] !== void 0) {
        return "fup" + item["fupReference"]["fupNumber"];
      }
    }
    console.log("No fupReference found");
  }
  getNotificationId(item) {
    if (item["notificationId"] !== void 0) {
      return item["notificationId"];
    } else {
      console.log("No notificationId found");
      return void 0;
    }
  }
  getOrganisation(item) {
    if (item["organizationDescription"] !== void 0) {
      return item["organizationDescription"];
    } else {
      console.log("No organizationDescription found");
      return void 0;
    }
  }
  getOperator(item) {
    if (item["operator"] !== void 0) {
      return item["operator"];
    } else {
      console.log("No operator found");
      return void 0;
    }
  }
  getFileType(item) {
    if (item["filename"] !== void 0) {
      return item["filename"].split(".").pop();
    } else {
      console.log("File extension not found as no filename was found");
      return void 0;
    }
  }
  getSize(item) {
    if (item["filesize"] !== void 0) {
      const size = item["filesize"];
      if (size > 1024 * 1024 * 1024) {
        return Math.round(size * 10 / (1024 * 1024 * 1024)) / 10 + " Go";
      }
      if (size > 1024 * 1024) {
        return Math.round(size * 10 / (1024 * 1024)) / 10 + " Mo";
      }
      if (size > 1024 * 8) {
        return Math.round(size / 1024) + " Ko";
      }
      return size + "o";
    } else {
      console.log("No filesize found");
      return void 0;
    }
  }
  print(item) {
    const itemUrl = window.location.origin + "/" + window.location.pathname.split("/")[1] + "/backend/logged/attachment/" + item.id + "/";
    const extension = item["fileType"];
    if (["pdf"].includes(extension)) {
      (0, import_print_js.default)(itemUrl);
    } else if (["jpg", "jpeg", "png", "bmp", "gif"].includes(extension)) {
      (0, import_print_js.default)({
        printable: itemUrl,
        type: "image",
        header: item["filename"],
        headerStyle: "font-family: Arial;color: #004494;font-size: 16pt;"
      });
    } else {
      this.growlService.growl({
        severity: "danger",
        summary: `Format not supported yet`,
        detail: `Only supported formats for direct printing: PDF, JPG, JPEG, PNG, BMP, GIF`
      }, this.isGrowlSticky, this.isGrowlMultiple, this.growlLife, this.growlPosition);
    }
  }
  openAttachment(item) {
    window.open(this.attachmentUrl + item.id + "/", "_blank");
  }
  static {
    this.\u0275fac = function AttachmentsTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AttachmentsTableComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _AttachmentsTableComponent, selectors: [["app-attachments-table"]], inputs: { items: "items" }, features: [\u0275\u0275NgOnChangesFeature], decls: 2, vars: 1, consts: [["paginatorAttachments", ""], ["euiTable", "", "isTableResponsive", "", 1, "notification-table", 3, "sortChange", "data", "paginator"], ["euiTemplate", "header"], ["euiTemplate", "body"], ["isSortable", "", "sortOn", "fupReference"], ["isSortable", "", "sortOn", "filename"], ["isSortable", "", "sortOn", "type"], ["isSortable", "", "sortOn", "fileType", 1, "text-center"], [1, "text-center"], [1, "text-center", "print-not"], ["data-col-label", "Fup #"], ["data-col-label", "Filename"], ["tabindex", "0", 1, "download", 3, "click", "keyup.enter"], ["data-col-label", "Type"], [3, "type"], ["data-col-label", "File type", "align", "center"], ["data-col-label", "Size", "align", "center"], ["data-col-label", "Print", "align", "center", 1, "print-not"], ["euiTooltip", "Print file", 1, "nt-small-button"], ["euiTooltip", "Print file", 1, "nt-small-button", 3, "click"], ["aria-hidden", "true", "icon", "eui-print", "size", "xs"]], template: function AttachmentsTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275conditionalCreate(0, AttachmentsTableComponent_Conditional_0_Template, 9, 5, "div")(1, AttachmentsTableComponent_Conditional_1_Template, 3, 3, "p");
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.documents().length > 0 ? 0 : 1);
      }
    }, dependencies: [SharedModule, EuiTableComponent, EuiTableSortableColComponent, EuiTemplateDirective, EuiPaginatorComponent, EuiIconSvgComponent, EuiTooltipDirective, AttachmentTypeComponent, TranslatePipe, TruncatePipe, UpperCasePipe], styles: ["\n.notification-table[_ngcontent-%COMP%]   tr.hidden-more[_ngcontent-%COMP%] {\n  display: none;\n}\n.notification-table[_ngcontent-%COMP%]   a.download[_ngcontent-%COMP%] {\n  cursor: pointer;\n  border-bottom: dashed 1px;\n}\n.notification-table[_ngcontent-%COMP%]   a.download[_ngcontent-%COMP%]:hover {\n  border-bottom-style: solid;\n}\n.nt-small-button[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-radius: 5px;\n  border: 1px solid #006fb4;\n  box-shadow: none;\n  background: #006fb4;\n  padding: 4px 6px;\n  margin: 0 auto;\n  line-height: 1em;\n  color: #ffffff;\n  font-size: 0;\n}\n.nt-small-button[_ngcontent-%COMP%]:hover, \n.nt-small-button[_ngcontent-%COMP%]:focus, \n.nt-small-button[_ngcontent-%COMP%]:active {\n  opacity: 0.85;\n}\n.nt-small-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: initial;\n  height: 1em;\n  line-height: 1em;\n  color: #ffffff;\n}\nbutton.btn-show-hide[_ngcontent-%COMP%] {\n  margin: 1em 0 0 0;\n}\n@media screen and (max-width: 767px) {\n  .notification-table[_ngcontent-%COMP%]   td[align=center][_ngcontent-%COMP%] {\n    text-align: left;\n  }\n  .nt-small-button[_ngcontent-%COMP%] {\n    margin: 0 auto;\n  }\n  button.btn-show-hide[_ngcontent-%COMP%] {\n    display: block;\n    width: 50%;\n    margin: 2em auto;\n  }\n}\n/*# sourceMappingURL=attachments-table.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AttachmentsTableComponent, [{
    type: Component,
    args: [{ selector: "app-attachments-table", imports: [SharedModule, AttachmentTypeComponent], standalone: true, template: '@if (documents().length > 0) {\n    <div>\n        <table\n            euiTable\n            isTableResponsive\n            [data]="documents()"\n            [paginator]="paginatorAttachments"\n            (sortChange)="sortBy($event)"\n            class="notification-table"\n        >\n            <caption>\n                {{\n                    "notification.attachments.table.attachments" | translate\n                }}\n            </caption>\n            <ng-template euiTemplate="header">\n                <tr>\n                    <th isSortable sortOn="fupReference">Fup #</th>\n                    <th isSortable sortOn="filename">\n                        {{ "notification.attachments.table.fileName" | translate }}\n                    </th>\n                    <th isSortable sortOn="type">\n                        {{ "notification.attachments.table.type" | translate }}\n                    </th>\n                    <!--th>Additional info</th-->\n                    <th isSortable sortOn="fileType" class="text-center">\n                        {{ "notification.attachments.table.fileType" | translate }}\n                    </th>\n                    <th class="text-center">\n                        {{ "notification.attachments.table.size" | translate }}\n                    </th>\n                    <th class="text-center print-not">\n                        {{ "notification.attachments.table.print" | translate }}\n                    </th>\n                </tr>\n            </ng-template>\n            <ng-template let-row euiTemplate="body">\n                <tr>\n                    <td data-col-label="Fup #">\n                        {{ row.fupReference !== undefined ? row.fupReference : "n/a" }}\n                    </td>\n                    <td data-col-label="Filename">\n                        <a\n                            class="download"\n                            tabindex="0"\n                            (click)="openAttachment(row)"\n                            (keyup.enter)="openAttachment(row)"\n                        >\n                            {{ row.filename | truncate: 36 }}\n                        </a>\n                    </td>\n                    <td data-col-label="Type">\n                        <app-attachment-type [type]="row.type"></app-attachment-type>\n                    </td>\n                    <td data-col-label="File type" align="center">\n                        {{ row.fileType | uppercase }}\n                    </td>\n                    <td data-col-label="Size" align="center">\n                        {{ row.size }}\n                    </td>\n                    <td data-col-label="Print" align="center" class="print-not">\n                        @if (row.type !== "Video") {\n                            <button\n                                class="nt-small-button"\n                                (click)="print(row)"\n                                euiTooltip="Print file"\n                            >\n                                <eui-icon-svg\n                                    aria-hidden="true"\n                                    icon="eui-print"\n                                    size="xs"\n                                ></eui-icon-svg>\n                            </button>\n                        }\n                    </td>\n                </tr>\n            </ng-template>\n        </table>\n        <eui-paginator #paginatorAttachments></eui-paginator>\n    </div>\n} @else {\n    <p>{{ "notification.attachments.table.noAttachments" | translate }}</p>\n}\n', styles: ["/* src/app/features/notification/tables/attachments-table/attachments-table.component.scss */\n.notification-table tr.hidden-more {\n  display: none;\n}\n.notification-table a.download {\n  cursor: pointer;\n  border-bottom: dashed 1px;\n}\n.notification-table a.download:hover {\n  border-bottom-style: solid;\n}\n.nt-small-button {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-radius: 5px;\n  border: 1px solid #006fb4;\n  box-shadow: none;\n  background: #006fb4;\n  padding: 4px 6px;\n  margin: 0 auto;\n  line-height: 1em;\n  color: #ffffff;\n  font-size: 0;\n}\n.nt-small-button:hover,\n.nt-small-button:focus,\n.nt-small-button:active {\n  opacity: 0.85;\n}\n.nt-small-button span {\n  font-size: initial;\n  height: 1em;\n  line-height: 1em;\n  color: #ffffff;\n}\nbutton.btn-show-hide {\n  margin: 1em 0 0 0;\n}\n@media screen and (max-width: 767px) {\n  .notification-table td[align=center] {\n    text-align: left;\n  }\n  .nt-small-button {\n    margin: 0 auto;\n  }\n  button.btn-show-hide {\n    display: block;\n    width: 50%;\n    margin: 2em auto;\n  }\n}\n/*# sourceMappingURL=attachments-table.component.css.map */\n"] }]
  }], null, { items: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AttachmentsTableComponent, { className: "AttachmentsTableComponent", filePath: "src/app/features/notification/tables/attachments-table/attachments-table.component.ts", lineNumber: 19 });
})();

// src/app/features/notification/tables/measures-table/measures-table.component.ts
var _3 = __toESM(require_lodash());

// src/app/features/notification/tables/table-elements/product-info/product-info.component.ts
var _c02 = ["popoverProduct"];
function ProductInfoComponent_For_3_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "rasffDate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const info_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, info_r2["value"]), " ");
  }
}
function ProductInfoComponent_For_3_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "capitaliseFirstLetter");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const info_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, info_r2["value"]), " ");
  }
}
function ProductInfoComponent_For_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 3)(1, "h3");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ProductInfoComponent_For_3_Conditional_0_Conditional_4_Template, 3, 3, "p")(5, ProductInfoComponent_For_3_Conditional_0_Conditional_5_Template, 3, 3, "p");
    \u0275\u0275elementStart(6, "button", 4);
    \u0275\u0275pipe(7, "translate");
    \u0275\u0275listener("click", function ProductInfoComponent_For_3_Conditional_0_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const info_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.copyToClipboard(info_r2["value"]));
    });
    \u0275\u0275element(8, "eui-icon-svg", 5);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "translate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const info_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 4, info_r2["label"]));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(info_r2["label"] === "notification.product.info.expiryDate" ? 4 : 5);
    \u0275\u0275advance(2);
    \u0275\u0275property("euiTooltip", \u0275\u0275pipeBind1(7, 6, "actions.copyClipboard"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(10, 8, "actions.copyClipboard"), " ");
  }
}
function ProductInfoComponent_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ProductInfoComponent_For_3_Conditional_0_Template, 11, 10, "div", 3);
  }
  if (rf & 2) {
    const info_r2 = ctx.$implicit;
    \u0275\u0275conditional(info_r2["value"] !== void 0 ? 0 : -1);
  }
}
var ProductInfoComponent = class _ProductInfoComponent {
  constructor() {
    this.weight = void 0;
    this.isGrowlSticky = false;
    this.isGrowlMultiple = false;
    this.growlLife = 2e3;
    this.position = "bottom-right";
    this.growlService = inject(EuiGrowlService);
    this.translate = inject(TranslateService);
  }
  ngOnInit() {
    if (this.productInfo["weight"] !== void 0) {
      if (this.productInfo["weightUnit"] !== void 0) {
        this.weight = `${this.productInfo["weight"]} ${this.productInfo["weightUnit"]}`;
      } else {
        this.weight = this.productInfo["weight"];
      }
    }
    this.infos = [
      {
        label: "notification.product.info.expiryDate",
        value: this.productInfo["expiryDate"]
      },
      {
        label: "notification.product.info.aspect",
        value: this.productInfo["aspect"]
      },
      ...this.userType === "private" ? [
        {
          label: "notification.product.info.temperature",
          value: this.productInfo["temperature"]
        }
      ] : [],
      {
        label: "notification.product.info.label",
        value: this.productInfo["nameOnLabel"]
      },
      {
        label: "notification.product.info.otherLabel",
        value: this.productInfo["labelling"]
      },
      {
        label: "notification.product.info.weightVolume",
        value: this.weight
      },
      ...this.userType === "private" ? [
        {
          label: "notification.product.info.barcode",
          value: this.productInfo["barcode"]
        },
        {
          label: "notification.product.info.brand",
          value: this.productInfo["brand"]
        }
      ] : []
    ];
    if (this.hasOnlyUndefinedValues(this.infos)) {
      this.infos = [
        {
          label: "notification.product.info.noData.title",
          value: this.translate.instant("notification.product.info.noData.message")
        }
      ];
    }
  }
  // returns true iff for all items
  // item['value'] is undefined
  hasOnlyUndefinedValues(arr) {
    for (const item of arr) {
      if (item["value"] !== void 0) {
        return false;
      }
    }
    return true;
  }
  copyToClipboard(value) {
    navigator.clipboard.writeText(String(value));
    this.onClipboardCopy();
  }
  onClipboardCopy() {
    this.growlService.growl({
      severity: "success",
      summary: "Copied to clipboard",
      detail: ""
    }, this.isGrowlSticky, this.isGrowlMultiple, this.growlLife, this.position);
  }
  openPopover(e) {
    this.popover.openPopover(e.target);
  }
  static {
    this.\u0275fac = function ProductInfoComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProductInfoComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _ProductInfoComponent, selectors: [["app-product-info"]], viewQuery: function ProductInfoComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c02, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.popover = _t.first);
      }
    }, inputs: { title: "title", productInfo: "productInfo", userType: "userType" }, decls: 7, vars: 4, consts: [["popoverProduct", ""], [3, "title"], ["tabindex", "0", 1, "product-more-info", 3, "click", "keyup.enter"], [1, "notification-popover-entry"], [1, "copy", 3, "click", "euiTooltip"], ["aria-hidden", "true", "icon", "ecl-copy:ecl", "size", "xs"]], template: function ProductInfoComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "eui-popover", 1, 0);
        \u0275\u0275repeaterCreate(2, ProductInfoComponent_For_3_Template, 1, 1, null, null, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "a", 2);
        \u0275\u0275listener("click", function ProductInfoComponent_Template_a_click_4_listener($event) {
          return ctx.openPopover($event);
        })("keyup.enter", function ProductInfoComponent_Template_a_keyup_enter_4_listener($event) {
          return ctx.openPopover($event);
        });
        \u0275\u0275text(5);
        \u0275\u0275pipe(6, "capitaliseFirstLetter");
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("title", ctx.title);
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.infos);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(6, 2, ctx.title), "\n");
      }
    }, dependencies: [SharedModule, EuiIconSvgComponent, EuiPopoverComponent, EuiTooltipDirective, TranslatePipe, CapitaliseFirstLetterPipe, RasffDatePipe], styles: ["\na.product-more-info[_ngcontent-%COMP%] {\n  cursor: pointer;\n  border-bottom: dashed 1px;\n}\na.product-more-info[_ngcontent-%COMP%]:hover {\n  border-bottom-style: solid;\n}\n/*# sourceMappingURL=product-info.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProductInfoComponent, [{
    type: Component,
    args: [{ selector: "app-product-info", imports: [SharedModule], standalone: true, template: `<eui-popover #popoverProduct [title]="title">
    @for (info of infos; track info) {
        @if (info["value"] !== undefined) {
            <div class="notification-popover-entry">
                <h3>{{ info["label"] | translate }}</h3>
                @if (info["label"] === "notification.product.info.expiryDate") {
                    <p>
                        {{ info["value"] | rasffDate }}
                    </p>
                } @else {
                    <p>
                        {{ info["value"] | capitaliseFirstLetter }}
                    </p>
                }
                <button
                    class="copy"
                    (click)="copyToClipboard(info['value'])"
                    [euiTooltip]="'actions.copyClipboard' | translate"
                >
                    <eui-icon-svg aria-hidden="true" icon="ecl-copy:ecl" size="xs"></eui-icon-svg>
                    {{ "actions.copyClipboard" | translate }}
                </button>
            </div>
        }
    }
</eui-popover>
<a
    class="product-more-info"
    tabindex="0"
    (click)="openPopover($event)"
    (keyup.enter)="openPopover($event)"
>
    {{ title | capitaliseFirstLetter }}
</a>
`, styles: ["/* src/app/features/notification/tables/table-elements/product-info/product-info.component.scss */\na.product-more-info {\n  cursor: pointer;\n  border-bottom: dashed 1px;\n}\na.product-more-info:hover {\n  border-bottom-style: solid;\n}\n/*# sourceMappingURL=product-info.component.css.map */\n"] }]
  }], null, { title: [{
    type: Input
  }], productInfo: [{
    type: Input
  }], userType: [{
    type: Input
  }], popover: [{
    type: ViewChild,
    args: ["popoverProduct"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductInfoComponent, { className: "ProductInfoComponent", filePath: "src/app/features/notification/tables/table-elements/product-info/product-info.component.ts", lineNumber: 15 });
})();

// src/app/features/notification/tables/measures-table/measures-table.component.ts
function MeasuresTableComponent_Conditional_0_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 5);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 6);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 7);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 8);
    \u0275\u0275text(11, "URL");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(3, 3, "notification.measure.table.country"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(6, 5, "notification.measure.table.action"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 7, "notification.measure.table.productName"), " ");
  }
}
function MeasuresTableComponent_Conditional_0_ng_template_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-country", 9);
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("country", row_r3.country)("isocode", row_r3.isoCode);
  }
}
function MeasuresTableComponent_Conditional_0_ng_template_6_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-product-info", 10);
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("title", row_r3.productName)("productInfo", row_r3.productInfo)("userType", ctx_r1.auth);
  }
}
function MeasuresTableComponent_Conditional_0_ng_template_6_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "capitaliseFirstLetter");
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", row_r3.productName !== void 0 ? \u0275\u0275pipeBind1(1, 1, row_r3.productName) : "n/a", " ");
  }
}
function MeasuresTableComponent_Conditional_0_ng_template_6_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 15);
    \u0275\u0275pipe(1, "translate");
    \u0275\u0275listener("click", function MeasuresTableComponent_Conditional_0_ng_template_6_Conditional_13_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const row_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.copy(row_r3.url));
    });
    \u0275\u0275element(2, "eui-icon-svg", 16);
    \u0275\u0275text(3, " copy to clipboard ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("euiTooltip", \u0275\u0275interpolate(\u0275\u0275pipeBind1(1, 2, "notification.measure.table.copyUrl")));
  }
}
function MeasuresTableComponent_Conditional_0_ng_template_6_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 13);
    \u0275\u0275element(1, "eui-icon-svg", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("href", row_r3.url, \u0275\u0275sanitizeUrl)("euiTooltip", row_r3.url);
  }
}
function MeasuresTableComponent_Conditional_0_ng_template_6_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " None ");
  }
}
function MeasuresTableComponent_Conditional_0_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275conditionalCreate(3, MeasuresTableComponent_Conditional_0_ng_template_6_Conditional_3_Template, 1, 2, "app-country", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275pipe(5, "translate");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "capitaliseFirstLetter");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275pipe(9, "translate");
    \u0275\u0275conditionalCreate(10, MeasuresTableComponent_Conditional_0_ng_template_6_Conditional_10_Template, 1, 3, "app-product-info", 10)(11, MeasuresTableComponent_Conditional_0_ng_template_6_Conditional_11_Template, 2, 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 11);
    \u0275\u0275conditionalCreate(13, MeasuresTableComponent_Conditional_0_ng_template_6_Conditional_13_Template, 4, 4, "button", 12);
    \u0275\u0275conditionalCreate(14, MeasuresTableComponent_Conditional_0_ng_template_6_Conditional_14_Template, 2, 2, "a", 13)(15, MeasuresTableComponent_Conditional_0_ng_template_6_Conditional_15_Template, 1, 0);
    \u0275\u0275elementStart(16, "span", 14);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const row_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(2, 9, "notification.measure.table.country"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r3.country !== void 0 ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(5, 11, "notification.measure.table.action"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r3.action !== void 0 ? \u0275\u0275pipeBind1(7, 13, row_r3.action) : "n/a", " ");
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(9, 15, "notification.measure.table.productName"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.auth === "private" ? 10 : 11);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(row_r3.url !== void 0 ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(row_r3.url !== void 0 ? 14 : 15);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", row_r3.url, " ");
  }
}
function MeasuresTableComponent_Conditional_0_ng_template_7_Template(rf, ctx) {
}
function MeasuresTableComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "table", 1);
    \u0275\u0275listener("sortChange", function MeasuresTableComponent_Conditional_0_Template_table_sortChange_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sortBy($event));
    });
    \u0275\u0275elementStart(2, "caption");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, MeasuresTableComponent_Conditional_0_ng_template_5_Template, 12, 9, "ng-template", 2)(6, MeasuresTableComponent_Conditional_0_ng_template_6_Template, 18, 17, "ng-template", 3)(7, MeasuresTableComponent_Conditional_0_ng_template_7_Template, 0, 0, "ng-template", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "eui-paginator", null, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const paginatorMeasures_r5 = \u0275\u0275reference(9);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r1.measuresTaken())("paginator", paginatorMeasures_r5);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 3, "notification.measure.title"), " ");
  }
}
function MeasuresTableComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "notification.noMeasuresFound"));
  }
}
var MeasuresTableComponent = class _MeasuresTableComponent {
  constructor() {
    this.measuresTaken = signal([], ...ngDevMode ? [{ debugName: "measuresTaken" }] : (
      /* istanbul ignore next */
      []
    ));
    this.isGrowlSticky = false;
    this.isGrowlMultiple = false;
    this.growlLife = 2e3;
    this.position = "bottom-right";
    this.notificationUtilsService = inject(NotificationUtilsService);
    this.growlService = inject(EuiGrowlService);
  }
  ngOnInit() {
    if (this.items?.length > 0 && this.auth) {
      this.flattenItemsByMeasures();
      this.mapItems();
    }
  }
  ngOnChanges(changes) {
    if ((changes["items"] || changes["auth"]) && this.items?.length > 0 && this.auth) {
      this.flattenItemsByMeasures();
      this.mapItems();
    }
  }
  mapItems() {
    const items = [];
    for (const item of this.items) {
      const country = this.getCountry(item);
      const newItem = {
        country: country ? country["organizationName"] : void 0,
        isoCode: country ? country["isoCode"] : void 0,
        action: this.getAction(item),
        productName: this.notificationUtilsService.getProductName(item),
        productInfo: this.notificationUtilsService.getProductInfo(item),
        url: this.getUrl(item)
        // productInfo:       this.getProductInfo(item),
      };
      items.push(newItem);
    }
    this.measuresTaken.set(items);
  }
  sortBy($event) {
    const { sort, order } = $event;
    this.measuresTaken.set(_3.orderBy(this.measuresTaken(), [sort], [order]));
  }
  getCountry(item) {
    if (item["measures"] !== void 0) {
      if (item["measures"][0] !== void 0) {
        return item["measures"][0]["takenBy"];
      } else {
        return item["measures"]["takenBy"];
      }
    }
  }
  getAction(item) {
    if (item["measures"] !== void 0) {
      if (item["measures"][0] !== void 0) {
        if (item["measures"][0]["actionTaken"] !== void 0) {
          return item["measures"][0]["actionTaken"]["description"];
        } else {
          return void 0;
        }
      } else {
        if (item["measures"]["actionTaken"] !== void 0) {
          return item["measures"]["actionTaken"]["description"];
        } else {
          return void 0;
        }
      }
    }
  }
  getUrl(item) {
    if (item["measures"] !== void 0) {
      if (item["measures"][0] !== void 0) {
        return item["measures"][0]["url"];
      } else {
        return item["measures"]["url"];
      }
    }
  }
  flattenItemsByMeasures() {
    const items = [];
    for (const item of this.items) {
      if (item["measures"] !== void 0) {
        if (Array.isArray(item["measures"])) {
          for (const measure of item["measures"]) {
            const newItem = Object.assign({}, item);
            newItem["measures"] = measure;
            items.push(newItem);
          }
        } else {
          const newItem = Object.assign({}, item);
          items.push(newItem);
        }
      }
    }
    this.items = items;
  }
  copy(text) {
    navigator.clipboard.writeText(String(text));
    this.growlService.growl({
      severity: "success",
      summary: "Copied to clipboard",
      detail: ""
    }, this.isGrowlSticky, this.isGrowlMultiple, this.growlLife, this.position);
  }
  static {
    this.\u0275fac = function MeasuresTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _MeasuresTableComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _MeasuresTableComponent, selectors: [["app-measures-table"]], inputs: { items: "items", auth: "auth" }, features: [\u0275\u0275NgOnChangesFeature], decls: 2, vars: 1, consts: [["paginatorMeasures", ""], ["euiTable", "", "isTableResponsive", "", 1, "notification-table", 3, "sortChange", "data", "paginator"], ["euiTemplate", "header"], ["euiTemplate", "body"], ["euiTemplate", "footer"], ["isSortable", "", "sortOn", "country"], ["isSortable", "", "sortOn", "action"], ["isSortable", "", "sortOn", "productName"], [1, "text-center"], [3, "country", "isocode"], [3, "title", "productInfo", "userType"], ["data-col-label", "Url", "align", "center"], [1, "url-button", "print-not", 3, "euiTooltip"], ["target", "_blank", "rel", "noopener", 1, "url-button", "print-not", 3, "href", "euiTooltip"], [1, "print-only"], [1, "url-button", "print-not", 3, "click", "euiTooltip"], ["aria-hidden", "true", "icon", "ecl-copy:ecl", "size", "xs"], ["icon", "eui-sign-out"]], template: function MeasuresTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275conditionalCreate(0, MeasuresTableComponent_Conditional_0_Template, 10, 5, "div")(1, MeasuresTableComponent_Conditional_1_Template, 3, 3, "p");
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.measuresTaken().length > 0 ? 0 : 1);
      }
    }, dependencies: [SharedModule, CountryComponent, EuiTableComponent, EuiTableSortableColComponent, EuiTemplateDirective, EuiPaginatorComponent, EuiIconSvgComponent, EuiTooltipDirective, ProductInfoComponent, TranslatePipe, CapitaliseFirstLetterPipe], styles: ["\n.url-button[_ngcontent-%COMP%] {\n  display: inline-block;\n  border-radius: 5px;\n  border: 1px solid var(--eui-color-info);\n  box-shadow: none;\n  background: var(--eui-color-info);\n  padding: 4px 6px;\n  margin: 0 6px;\n  line-height: 1em;\n  font-size: 0;\n}\n.url-button[_ngcontent-%COMP%]:hover, \n.url-button[_ngcontent-%COMP%]:focus, \n.url-button[_ngcontent-%COMP%]:active {\n  background: var(--eui-color-info-light);\n  border-color: rgb(0, 80, 129);\n}\n.url-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: initial;\n  height: 1em;\n  line-height: 1em;\n}\n.notification-table[_ngcontent-%COMP%]   tr.hidden-more[_ngcontent-%COMP%] {\n  display: none;\n}\n@media screen and (max-width: 767px) {\n  td[data-col=Url][_ngcontent-%COMP%] {\n    text-align: left;\n  }\n  .url-button[_ngcontent-%COMP%] {\n    margin: 0 6px 0 0;\n  }\n  button.btn-show-hide[_ngcontent-%COMP%] {\n    display: block;\n    width: 50%;\n    margin: 2em auto;\n  }\n}\n/*# sourceMappingURL=measures-table.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MeasuresTableComponent, [{
    type: Component,
    args: [{ selector: "app-measures-table", imports: [SharedModule, ProductInfoComponent], standalone: true, template: `@if (measuresTaken().length > 0) {
    <div>
        <table
            euiTable
            isTableResponsive
            [data]="measuresTaken()"
            [paginator]="paginatorMeasures"
            (sortChange)="sortBy($event)"
            class="notification-table"
        >
            <caption>
                {{
                    "notification.measure.title" | translate
                }}
            </caption>
            <ng-template euiTemplate="header">
                <tr>
                    <th isSortable sortOn="country">
                        {{ "notification.measure.table.country" | translate }}
                    </th>
                    <th isSortable sortOn="action">
                        {{ "notification.measure.table.action" | translate }}
                    </th>
                    <th isSortable sortOn="productName">
                        {{ "notification.measure.table.productName" | translate }}
                    </th>
                    <th class="text-center">URL</th>
                </tr>
            </ng-template>
            <ng-template let-row euiTemplate="body">
                <tr>
                    <td [attr.data-col-label]="'notification.measure.table.country' | translate">
                        @if (row.country !== undefined) {
                            <app-country
                                [country]="row.country"
                                [isocode]="row.isoCode"
                            ></app-country>
                        }
                    </td>
                    <td [attr.data-col-label]="'notification.measure.table.action' | translate">
                        {{
                            row.action !== undefined ? (row.action | capitaliseFirstLetter) : "n/a"
                        }}
                    </td>
                    <td
                        [attr.data-col-label]="'notification.measure.table.productName' | translate"
                    >
                        @if (auth === "private") {
                            <app-product-info
                                [title]="row.productName"
                                [productInfo]="row.productInfo"
                                [userType]="auth"
                            ></app-product-info>
                        } @else {
                            {{
                                row.productName !== undefined
                                    ? (row.productName | capitaliseFirstLetter)
                                    : "n/a"
                            }}
                        }
                    </td>
                    <td data-col-label="Url" align="center">
                        @if (row.url !== undefined) {
                            <button
                                class="url-button print-not"
                                (click)="copy(row.url)"
                                euiTooltip="{{ 'notification.measure.table.copyUrl' | translate }}"
                            >
                                <eui-icon-svg
                                    aria-hidden="true"
                                    icon="ecl-copy:ecl"
                                    size="xs"
                                ></eui-icon-svg>
                                copy to clipboard
                            </button>
                        }
                        @if (row.url !== undefined) {
                            <a
                                class="url-button print-not"
                                [href]="row.url"
                                target="_blank"
                                rel="noopener"
                                [euiTooltip]="row.url"
                            >
                                <eui-icon-svg icon="eui-sign-out"></eui-icon-svg>
                            </a>
                        } @else {
                            None
                        }
                        <span class="print-only">
                            {{ row.url }}
                        </span>
                    </td>
                </tr>
            </ng-template>
            <ng-template euiTemplate="footer"> </ng-template>
        </table>
        <eui-paginator #paginatorMeasures></eui-paginator>
    </div>
} @else {
    <p>{{ "notification.noMeasuresFound" | translate }}</p>
}
`, styles: ["/* src/app/features/notification/tables/measures-table/measures-table.component.scss */\n.url-button {\n  display: inline-block;\n  border-radius: 5px;\n  border: 1px solid var(--eui-color-info);\n  box-shadow: none;\n  background: var(--eui-color-info);\n  padding: 4px 6px;\n  margin: 0 6px;\n  line-height: 1em;\n  font-size: 0;\n}\n.url-button:hover,\n.url-button:focus,\n.url-button:active {\n  background: var(--eui-color-info-light);\n  border-color: rgb(0, 80, 129);\n}\n.url-button span {\n  font-size: initial;\n  height: 1em;\n  line-height: 1em;\n}\n.notification-table tr.hidden-more {\n  display: none;\n}\n@media screen and (max-width: 767px) {\n  td[data-col=Url] {\n    text-align: left;\n  }\n  .url-button {\n    margin: 0 6px 0 0;\n  }\n  button.btn-show-hide {\n    display: block;\n    width: 50%;\n    margin: 2em auto;\n  }\n}\n/*# sourceMappingURL=measures-table.component.css.map */\n"] }]
  }], null, { items: [{
    type: Input
  }], auth: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MeasuresTableComponent, { className: "MeasuresTableComponent", filePath: "src/app/features/notification/tables/measures-table/measures-table.component.ts", lineNumber: 19 });
})();

// src/app/features/notification/tables/products-table/products-table.component.ts
var _4 = __toESM(require_lodash());

// src/app/features/notification/tables/table-elements/product-relation-icon/product-relation-icon.component.ts
var ProductRelationIconComponent = class _ProductRelationIconComponent {
  constructor() {
    this.cssClass = "";
  }
  ngOnInit() {
    this.cssClass = this.relation.toLowerCase();
    this.cssClass = this.cssClass.replace(/\s+/g, "-");
    this.cssClass = this.cssClass.replace(/[()/]+/g, "");
  }
  static {
    this.\u0275fac = function ProductRelationIconComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProductRelationIconComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _ProductRelationIconComponent, selectors: [["app-product-relation-icon"]], inputs: { relation: "relation" }, decls: 3, vars: 6, consts: [[1, "product-relation-icon", 3, "euiTooltip"]], template: function ProductRelationIconComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "span", 0);
        \u0275\u0275pipe(1, "capitaliseFirstLetter");
        \u0275\u0275element(2, "span");
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("euiTooltip", \u0275\u0275interpolate(\u0275\u0275pipeBind1(1, 4, ctx.relation)));
        \u0275\u0275advance(2);
        \u0275\u0275classMap(ctx.cssClass);
      }
    }, dependencies: [SharedModule, EuiTooltipDirective, CapitaliseFirstLetterPipe], styles: ['\n.product-relation-icon[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  display: block;\n  position: relative;\n  top: -2px;\n}\n.product-relation-icon[_ngcontent-%COMP%]   .additional-lots[_ngcontent-%COMP%] {\n  background-image: url("./media/additional-lots.svg");\n}\n.product-relation-icon[_ngcontent-%COMP%]   .different-variety[_ngcontent-%COMP%] {\n  background-image: url("./media/different-variety.svg");\n}\n.product-relation-icon[_ngcontent-%COMP%]   .ingredient[_ngcontent-%COMP%] {\n  background-image: url("./media/ingredient.svg");\n}\n.product-relation-icon[_ngcontent-%COMP%]   .processed-product[_ngcontent-%COMP%] {\n  background-image: url("./media/processed-product.svg");\n}\n.product-relation-icon[_ngcontent-%COMP%]   .raw-material[_ngcontent-%COMP%] {\n  background-image: url("./media/raw-material.svg");\n}\n.product-relation-icon[_ngcontent-%COMP%]   .same-consignment[_ngcontent-%COMP%] {\n  background-image: url("./media/same-consignment.svg");\n}\n.product-relation-icon[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  background: transparent url("./media/default-product-relation.svg") no-repeat center center;\n  background-size: contain;\n}\n/*# sourceMappingURL=product-relation-icon.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProductRelationIconComponent, [{
    type: Component,
    args: [{ selector: "app-product-relation-icon", imports: [SharedModule], standalone: true, template: '<span class="product-relation-icon" euiTooltip="{{ relation | capitaliseFirstLetter }}">\n    <span [class]="cssClass"> </span>\n</span>\n', styles: ['/* src/app/features/notification/tables/table-elements/product-relation-icon/product-relation-icon.component.scss */\n.product-relation-icon {\n  width: 24px;\n  height: 24px;\n  display: block;\n  position: relative;\n  top: -2px;\n}\n.product-relation-icon .additional-lots {\n  background-image: url("./media/additional-lots.svg");\n}\n.product-relation-icon .different-variety {\n  background-image: url("./media/different-variety.svg");\n}\n.product-relation-icon .ingredient {\n  background-image: url("./media/ingredient.svg");\n}\n.product-relation-icon .processed-product {\n  background-image: url("./media/processed-product.svg");\n}\n.product-relation-icon .raw-material {\n  background-image: url("./media/raw-material.svg");\n}\n.product-relation-icon .same-consignment {\n  background-image: url("./media/same-consignment.svg");\n}\n.product-relation-icon span {\n  display: block;\n  width: 100%;\n  height: 100%;\n  background: transparent url("./media/default-product-relation.svg") no-repeat center center;\n  background-size: contain;\n}\n/*# sourceMappingURL=product-relation-icon.component.css.map */\n'] }]
  }], null, { relation: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductRelationIconComponent, { className: "ProductRelationIconComponent", filePath: "src/app/features/notification/tables/table-elements/product-relation-icon/product-relation-icon.component.ts", lineNumber: 11 });
})();

// src/app/features/notification/tables/table-elements/sampling-info/sampling-info.component.ts
var _c03 = ["popoverSampling"];
function SamplingInfoComponent_For_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "h3");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "capitaliseFirstLetter");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 5);
    \u0275\u0275pipe(7, "translate");
    \u0275\u0275listener("click", function SamplingInfoComponent_For_4_Conditional_0_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const info_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.copyToClipboard(info_r2["value"]));
    });
    \u0275\u0275element(8, "eui-icon-svg", 6);
    \u0275\u0275text(9, " copy to clipboard ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const info_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(info_r2["label"]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 4, info_r2["value"]));
    \u0275\u0275advance(2);
    \u0275\u0275property("euiTooltip", \u0275\u0275interpolate(\u0275\u0275pipeBind1(7, 6, "actions.copyClipboard")));
  }
}
function SamplingInfoComponent_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SamplingInfoComponent_For_4_Conditional_0_Template, 10, 8, "div", 4);
  }
  if (rf & 2) {
    const info_r2 = ctx.$implicit;
    \u0275\u0275conditional(info_r2["value"] !== void 0 ? 0 : -1);
  }
}
var SamplingInfoComponent = class _SamplingInfoComponent {
  constructor() {
    this.analyticalResult = void 0;
    this.hazardCategory = void 0;
    this.isGrowlSticky = false;
    this.isGrowlMultiple = false;
    this.growlLife = 2e3;
    this.position = "bottom-right";
    this.growlService = inject(EuiGrowlService);
    this.translate = inject(TranslateService);
  }
  ngOnInit() {
    if (this.sampling["analyticalResult"] !== void 0) {
      if (this.sampling["unit"] !== void 0) {
        this.analyticalResult = `${this.sampling["analyticalResult"]} ${this.sampling["unit"]}`;
      } else {
        this.analyticalResult = this.sampling["analyticalResult"];
      }
    }
    this.infos = [
      {
        label: this.translate.instant("notification.finding.table.finding"),
        value: this.sampling["name"]
      },
      {
        label: this.translate.instant("notification.finding.table.findingType"),
        value: this.sampling["findingCatalogue"]?.findingType
      },
      {
        label: this.translate.instant("notification.finding.table.analyticalResults"),
        value: this.analyticalResult
      },
      {
        label: this.translate.instant("notification.finding.table.maximum"),
        value: this.sampling["maxPermittedLvl"]
      }
    ];
    if (this.hasOnlyUndefinedValues(this.infos)) {
      this.infos = [
        {
          label: "notification.product.info.noData.title",
          value: this.translate.instant("notification.product.info.noData.message")
        }
      ];
    }
  }
  // returns true iff for all items
  // item['value'] is undefined
  hasOnlyUndefinedValues(arr) {
    for (const item of arr) {
      if (item["value"] !== void 0) {
        return false;
      }
    }
    return true;
  }
  copyToClipboard(value) {
    navigator.clipboard.writeText(String(value));
    this.onClipboardCopy();
  }
  onClipboardCopy() {
    this.growlService.growl({
      severity: "success",
      summary: "Copied to clipboard",
      detail: ""
    }, this.isGrowlSticky, this.isGrowlMultiple, this.growlLife, this.position);
  }
  openPopover(e) {
    this.popover.openPopover(e.target);
  }
  static {
    this.\u0275fac = function SamplingInfoComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SamplingInfoComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _SamplingInfoComponent, selectors: [["app-sampling-info"]], viewQuery: function SamplingInfoComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c03, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.popover = _t.first);
      }
    }, inputs: { sampling: "sampling" }, decls: 11, vars: 11, consts: [["popoverSampling", ""], [3, "title"], ["tabindex", "0", 1, "sampling-more-info", "print-not", 3, "click", "keyup.enter", "euiTooltip"], [1, "print-only"], [1, "notification-popover-entry"], [1, "copy", 3, "click", "euiTooltip"], ["aria-hidden", "true", "icon", "ecl-copy:ecl", "size", "xs"]], template: function SamplingInfoComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "eui-popover", 1, 0);
        \u0275\u0275pipe(2, "rasffDate");
        \u0275\u0275repeaterCreate(3, SamplingInfoComponent_For_4_Template, 1, 1, null, null, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "a", 2);
        \u0275\u0275pipe(6, "capitaliseFirstLetter");
        \u0275\u0275listener("click", function SamplingInfoComponent_Template_a_click_5_listener($event) {
          return ctx.openPopover($event);
        })("keyup.enter", function SamplingInfoComponent_Template_a_keyup_enter_5_listener($event) {
          return ctx.openPopover($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "span", 3);
        \u0275\u0275text(8);
        \u0275\u0275pipe(9, "capitaliseFirstLetter");
        \u0275\u0275element(10, "br");
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("title", \u0275\u0275interpolate1("Sampling ", \u0275\u0275pipeBind1(2, 5, ctx.sampling == null ? null : ctx.sampling["samplingDate"])));
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.infos);
        \u0275\u0275advance(2);
        \u0275\u0275property("euiTooltip", \u0275\u0275interpolate(\u0275\u0275pipeBind1(6, 7, ctx.sampling["name"])));
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 9, ctx.sampling["name"]));
      }
    }, dependencies: [SharedModule, EuiIconSvgComponent, EuiPopoverComponent, EuiTooltipDirective, TranslatePipe, CapitaliseFirstLetterPipe, RasffDatePipe], styles: ['\na.sampling-more-info[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  display: inline-block;\n  background: transparent url("./media/sampling.svg") no-repeat center center;\n  background-size: contain;\n  position: relative;\n  top: 2px;\n  print-color-adjust: exact;\n  -webkit-print-color-adjust: exact;\n}\n/*# sourceMappingURL=sampling-info.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SamplingInfoComponent, [{
    type: Component,
    args: [{ selector: "app-sampling-info", imports: [SharedModule], standalone: true, template: `<eui-popover #popoverSampling title="Sampling {{ sampling?.['samplingDate'] | rasffDate }}">
    @for (info of infos; track info) {
        @if (info["value"] !== undefined) {
            <div class="notification-popover-entry">
                <h3>{{ info["label"] }}</h3>
                <p>{{ info["value"] | capitaliseFirstLetter }}</p>
                <button
                    class="copy"
                    (click)="copyToClipboard(info['value'])"
                    euiTooltip="{{ 'actions.copyClipboard' | translate }}"
                >
                    <eui-icon-svg aria-hidden="true" icon="ecl-copy:ecl" size="xs"></eui-icon-svg>
                    copy to clipboard
                </button>
            </div>
        }
    }
</eui-popover>

<a
    class="sampling-more-info print-not"
    tabindex="0"
    (click)="openPopover($event)"
    (keyup.enter)="openPopover($event)"
    euiTooltip="{{ sampling['name'] | capitaliseFirstLetter }}"
>
</a>

<span class="print-only"> {{ sampling["name"] | capitaliseFirstLetter }}<br /> </span>
`, styles: ['/* src/app/features/notification/tables/table-elements/sampling-info/sampling-info.component.scss */\na.sampling-more-info {\n  width: 24px;\n  height: 24px;\n  display: inline-block;\n  background: transparent url("./media/sampling.svg") no-repeat center center;\n  background-size: contain;\n  position: relative;\n  top: 2px;\n  print-color-adjust: exact;\n  -webkit-print-color-adjust: exact;\n}\n/*# sourceMappingURL=sampling-info.component.css.map */\n'] }]
  }], null, { sampling: [{
    type: Input
  }], popover: [{
    type: ViewChild,
    args: ["popoverSampling"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SamplingInfoComponent, { className: "SamplingInfoComponent", filePath: "src/app/features/notification/tables/table-elements/sampling-info/sampling-info.component.ts", lineNumber: 15 });
})();

// src/app/features/notification/tables/table-elements/operator-icon/operator-icon.component.ts
var _c04 = ["popoverOperator"];
function OperatorIconComponent_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const idItem_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", idItem_r1 == null ? null : idItem_r1.operatorIdentifierTypeCatalogue == null ? null : idItem_r1.operatorIdentifierTypeCatalogue.description, " : ", idItem_r1 == null ? null : idItem_r1.organizationCode, " ");
  }
}
function OperatorIconComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function OperatorIconComponent_For_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "a", 6);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const url_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("href", url_r2, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", url_r2, " ");
  }
}
function OperatorIconComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function OperatorIconComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 7);
    \u0275\u0275listener("click", function OperatorIconComponent_Conditional_32_Template_a_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.openPopover($event));
    })("keyup.enter", function OperatorIconComponent_Conditional_32_Template_a_keyup_enter_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.openPopover($event));
    });
    \u0275\u0275elementStart(1, "span", 8);
    \u0275\u0275pipe(2, "capitaliseFirstLetter");
    \u0275\u0275element(3, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 9);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "capitaliseFirstLetter");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("euiTooltip", \u0275\u0275interpolate(\u0275\u0275pipeBind1(2, 5, ctx_r3.role)));
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r3.cssClass);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(6, 7, ctx_r3.role), " ");
  }
}
function OperatorIconComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 10);
    \u0275\u0275listener("click", function OperatorIconComponent_Conditional_33_Template_a_click_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.openPopover($event));
    })("keyup.enter", function OperatorIconComponent_Conditional_33_Template_a_keyup_enter_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.openPopover($event));
    });
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "capitaliseFirstLetter");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, ctx_r3.operator.legalEntity.name), " ");
  }
}
function OperatorIconComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, " n/a ");
    \u0275\u0275elementEnd();
  }
}
var OperatorIconComponent = class _OperatorIconComponent {
  constructor() {
    this.displayRole = false;
    this.displayName = false;
    this.role = "";
    this.cssClass = "";
    this.isGrowlSticky = false;
    this.isGrowlMultiple = false;
    this.growlLife = 2e3;
    this.position = "bottom-right";
  }
  ngOnInit() {
    if (this.operator.role !== void 0 && this.operator.role !== "") {
      this.role = this.operator.role.toLowerCase();
      this.cssClass = this.role.replace(/\s+/g, "-");
      this.cssClass = this.cssClass.replace(/[()]+/g, "");
      this.cssClass = this.cssClass.replace(/\/]+/g, "-");
    } else {
      this.role = "unknown";
    }
    if (this.operator.selectedActorLocationId) {
      const locationSelected = this.operator.locations.find((location) => location.actorLocationId === this.operator.selectedActorLocationId);
      this.location = locationSelected;
    }
    if (this.operator.contactDetails) {
      const urlValues = [];
      for (const key in this.operator.contactDetails) {
        if (Object.prototype.hasOwnProperty.call(this.operator.contactDetails, key)) {
          const detailsArray = this.operator.contactDetails[key];
          detailsArray.forEach((item) => {
            if (item.itemDefinitionCode === "URL") {
              urlValues.push(item.value);
            }
          });
        }
      }
      this.urls = urlValues;
    }
  }
  openPopover(e) {
    this.popover.openPopover(e.target);
  }
  static {
    this.\u0275fac = function OperatorIconComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _OperatorIconComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _OperatorIconComponent, selectors: [["app-operator-icon"]], viewQuery: function OperatorIconComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c04, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.popover = _t.first);
      }
    }, inputs: { operator: "operator", displayRole: "displayRole", displayName: "displayName" }, decls: 35, vars: 23, consts: [["popoverOperator", ""], ["euiSizeAuto", "true", 3, "title"], [1, "notification-popover-entry"], [3, "country", "isocode"], ["tabindex", "0"], ["tabindex", "0", 1, "operator-more-info"], ["target", "_blank", "rel", "noopener", 3, "href"], ["tabindex", "0", 3, "click", "keyup.enter"], [1, "operator-icon", 3, "euiTooltip"], [1, "operator-icon-text"], ["tabindex", "0", 1, "operator-more-info", 3, "click", "keyup.enter"]], template: function OperatorIconComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "eui-popover", 1, 0)(2, "div", 2)(3, "h3");
        \u0275\u0275text(4);
        \u0275\u0275pipe(5, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "p");
        \u0275\u0275text(7);
        \u0275\u0275pipe(8, "capitaliseFirstLetter");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(9, "div", 2)(10, "h3");
        \u0275\u0275text(11);
        \u0275\u0275pipe(12, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "p");
        \u0275\u0275text(14);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "p");
        \u0275\u0275text(16);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "p");
        \u0275\u0275element(18, "app-country", 3);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(19, "div", 2)(20, "h3");
        \u0275\u0275text(21);
        \u0275\u0275pipe(22, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(23, OperatorIconComponent_For_24_Template, 2, 2, "p", null, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275conditionalCreate(25, OperatorIconComponent_Conditional_25_Template, 2, 0, "p");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(26, "div", 2)(27, "h3");
        \u0275\u0275text(28, "Urls");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(29, OperatorIconComponent_For_30_Template, 3, 2, "p", null, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275conditionalCreate(31, OperatorIconComponent_Conditional_31_Template, 2, 0, "p");
        \u0275\u0275elementEnd()();
        \u0275\u0275conditionalCreate(32, OperatorIconComponent_Conditional_32_Template, 7, 9, "a", 4);
        \u0275\u0275conditionalCreate(33, OperatorIconComponent_Conditional_33_Template, 3, 3, "a", 5);
        \u0275\u0275conditionalCreate(34, OperatorIconComponent_Conditional_34_Template, 2, 0, "span");
      }
      if (rf & 2) {
        \u0275\u0275property("title", ctx.role);
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 15, "notification.operator.info.name"));
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(8, 17, ctx.operator.legalEntity.name), " ");
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 19, "notification.operator.info.location"));
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.location == null ? null : ctx.location.address);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate2("", ctx.location == null ? null : ctx.location.postalCode, " ", ctx.location == null ? null : ctx.location.city);
        \u0275\u0275advance(2);
        \u0275\u0275property("country", ctx.operator.legalEntity.countryNetworkOrganization == null ? null : ctx.operator.legalEntity.countryNetworkOrganization.organizationName)("isocode", ctx.operator.legalEntity.countryNetworkOrganization == null ? null : ctx.operator.legalEntity.countryNetworkOrganization.isoCode);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(22, 21, "notification.operator.info.identifiers"));
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.operator.identifiers == null ? null : ctx.operator.identifiers.slice(0, 5));
        \u0275\u0275advance(2);
        \u0275\u0275conditional((ctx.operator.identifiers == null ? null : ctx.operator.identifiers.length) > 5 ? 25 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275repeater(ctx.urls == null ? null : ctx.urls.slice(0, 5));
        \u0275\u0275advance(2);
        \u0275\u0275conditional((ctx.urls == null ? null : ctx.urls.length) > 5 ? 31 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.displayRole ? 32 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.displayName && ctx.operator.legalEntity.name !== void 0 ? 33 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.displayName && ctx.operator.legalEntity.name === "" ? 34 : -1);
      }
    }, dependencies: [SharedModule, CountryComponent, EuiPopoverComponent, EuiTooltipDirective, TranslatePipe, CapitaliseFirstLetterPipe], styles: ['\n.operator-icon[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  display: inline-block;\n  position: relative;\n  top: -2px;\n  margin: 0 6px 0 0;\n  print-color-adjust: exact;\n  -webkit-print-color-adjust: exact;\n}\n.operator-icon[_ngcontent-%COMP%]   .consignor[_ngcontent-%COMP%] {\n  background-image: url("./media/consignor.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .e-platform-e-marketplace[_ngcontent-%COMP%] {\n  background-image: url("./media/e-platform-e-marketplace.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .e-trader[_ngcontent-%COMP%] {\n  background-image: url("./media/e-trader.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .exporter[_ngcontent-%COMP%] {\n  background-image: url("./media/exporter.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .farmer[_ngcontent-%COMP%] {\n  background-image: url("./media/farmer.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .horeca-catering[_ngcontent-%COMP%] {\n  background-image: url("./media/horeca-catering.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .importer[_ngcontent-%COMP%] {\n  background-image: url("./media/importer.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .manufacturer[_ngcontent-%COMP%] {\n  background-image: url("./media/manufacturer.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .packer-filler[_ngcontent-%COMP%] {\n  background-image: url("./media/packer-filler.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .producer[_ngcontent-%COMP%] {\n  background-image: url("./media/producer.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .recipient-consignee[_ngcontent-%COMP%] {\n  background-image: url("./media/recipient-consignee.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .retailer[_ngcontent-%COMP%] {\n  background-image: url("./media/retailer.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .storage[_ngcontent-%COMP%] {\n  background-image: url("./media/storage.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .supplier[_ngcontent-%COMP%] {\n  background-image: url("./media/supplier.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .trader-broker[_ngcontent-%COMP%] {\n  background-image: url("./media/trader-broker.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .transporter[_ngcontent-%COMP%] {\n  background-image: url("./media/transporter.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   .wholesaler[_ngcontent-%COMP%] {\n  background-image: url("./media/wholesaler.svg");\n}\n.operator-icon[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  background: transparent url("./media/default.svg") no-repeat center center;\n  background-size: contain;\n}\n.operator-icon-text[_ngcontent-%COMP%] {\n  display: inline-block;\n  line-height: 24px;\n  margin: 0 0 0 8px;\n  position: relative;\n  top: -5px;\n}\na.operator-more-info[_ngcontent-%COMP%] {\n  cursor: pointer;\n  border-bottom: dashed 1px;\n}\na.operator-more-info[_ngcontent-%COMP%]:hover {\n  border-bottom-style: solid;\n}\n/*# sourceMappingURL=operator-icon.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OperatorIconComponent, [{
    type: Component,
    args: [{ selector: "app-operator-icon", imports: [SharedModule], standalone: true, template: '<eui-popover #popoverOperator [title]="role" euiSizeAuto="true">\n    <div class="notification-popover-entry">\n        <h3>{{ "notification.operator.info.name" | translate }}</h3>\n        <p>\n            {{ operator.legalEntity.name | capitaliseFirstLetter }}\n        </p>\n    </div>\n    <div class="notification-popover-entry">\n        <h3>{{ "notification.operator.info.location" | translate }}</h3>\n        <p>{{ location?.address }}</p>\n        <p>{{ location?.postalCode }} {{ location?.city }}</p>\n        <p>\n            <app-country\n                [country]="operator.legalEntity.countryNetworkOrganization?.organizationName"\n                [isocode]="operator.legalEntity.countryNetworkOrganization?.isoCode"\n            >\n            </app-country>\n        </p>\n    </div>\n    <div class="notification-popover-entry">\n        <h3>{{ "notification.operator.info.identifiers" | translate }}</h3>\n        @for (idItem of operator.identifiers?.slice(0, 5); track idItem) {\n            <p>\n                {{ idItem?.operatorIdentifierTypeCatalogue?.description }} :\n                {{ idItem?.organizationCode }}\n            </p>\n        }\n        @if (operator.identifiers?.length > 5) {\n            <p>...</p>\n        }\n    </div>\n    <div class="notification-popover-entry">\n        <h3>Urls</h3>\n        @for (url of urls?.slice(0, 5); track url) {\n            <p>\n                <a [href]="url" target="_blank" rel="noopener">\n                    {{ url }}\n                </a>\n            </p>\n        }\n        @if (urls?.length > 5) {\n            <p>...</p>\n        }\n    </div>\n</eui-popover>\n\n@if (displayRole) {\n    <a tabindex="0" (click)="openPopover($event)" (keyup.enter)="openPopover($event)">\n        <span class="operator-icon" euiTooltip="{{ role | capitaliseFirstLetter }}">\n            <span class="{{ cssClass }}"> </span>\n        </span>\n        <span class="operator-icon-text">\n            {{ role | capitaliseFirstLetter }}\n        </span>\n    </a>\n}\n\n@if (displayName && operator.legalEntity.name !== undefined) {\n    <a\n        class="operator-more-info"\n        tabindex="0"\n        (click)="openPopover($event)"\n        (keyup.enter)="openPopover($event)"\n    >\n        {{ operator.legalEntity.name | capitaliseFirstLetter }}\n    </a>\n}\n@if (displayName && operator.legalEntity.name === "") {\n    <span> n/a </span>\n}\n', styles: ['/* src/app/features/notification/tables/table-elements/operator-icon/operator-icon.component.scss */\n.operator-icon {\n  width: 24px;\n  height: 24px;\n  display: inline-block;\n  position: relative;\n  top: -2px;\n  margin: 0 6px 0 0;\n  print-color-adjust: exact;\n  -webkit-print-color-adjust: exact;\n}\n.operator-icon .consignor {\n  background-image: url("./media/consignor.svg");\n}\n.operator-icon .e-platform-e-marketplace {\n  background-image: url("./media/e-platform-e-marketplace.svg");\n}\n.operator-icon .e-trader {\n  background-image: url("./media/e-trader.svg");\n}\n.operator-icon .exporter {\n  background-image: url("./media/exporter.svg");\n}\n.operator-icon .farmer {\n  background-image: url("./media/farmer.svg");\n}\n.operator-icon .horeca-catering {\n  background-image: url("./media/horeca-catering.svg");\n}\n.operator-icon .importer {\n  background-image: url("./media/importer.svg");\n}\n.operator-icon .manufacturer {\n  background-image: url("./media/manufacturer.svg");\n}\n.operator-icon .packer-filler {\n  background-image: url("./media/packer-filler.svg");\n}\n.operator-icon .producer {\n  background-image: url("./media/producer.svg");\n}\n.operator-icon .recipient-consignee {\n  background-image: url("./media/recipient-consignee.svg");\n}\n.operator-icon .retailer {\n  background-image: url("./media/retailer.svg");\n}\n.operator-icon .storage {\n  background-image: url("./media/storage.svg");\n}\n.operator-icon .supplier {\n  background-image: url("./media/supplier.svg");\n}\n.operator-icon .trader-broker {\n  background-image: url("./media/trader-broker.svg");\n}\n.operator-icon .transporter {\n  background-image: url("./media/transporter.svg");\n}\n.operator-icon .wholesaler {\n  background-image: url("./media/wholesaler.svg");\n}\n.operator-icon span {\n  display: block;\n  width: 100%;\n  height: 100%;\n  background: transparent url("./media/default.svg") no-repeat center center;\n  background-size: contain;\n}\n.operator-icon-text {\n  display: inline-block;\n  line-height: 24px;\n  margin: 0 0 0 8px;\n  position: relative;\n  top: -5px;\n}\na.operator-more-info {\n  cursor: pointer;\n  border-bottom: dashed 1px;\n}\na.operator-more-info:hover {\n  border-bottom-style: solid;\n}\n/*# sourceMappingURL=operator-icon.component.css.map */\n'] }]
  }], null, { operator: [{
    type: Input
  }], displayRole: [{
    type: Input
  }], displayName: [{
    type: Input
  }], popover: [{
    type: ViewChild,
    args: ["popoverOperator"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OperatorIconComponent, { className: "OperatorIconComponent", filePath: "src/app/features/notification/tables/table-elements/operator-icon/operator-icon.component.ts", lineNumber: 13 });
})();

// src/app/features/notification/tables/table-elements/measure-flag/measure-flag.component.ts
function MeasureFlagComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 0);
    \u0275\u0275pipe(1, "linkHttp");
    \u0275\u0275element(2, "span", 3);
    \u0275\u0275pipe(3, "lowercase");
    \u0275\u0275pipe(4, "uppercase");
    \u0275\u0275pipe(5, "capitaliseFirstLetter");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("href", \u0275\u0275interpolate(\u0275\u0275pipeBind1(1, 7, ctx_r0.url)), \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(\u0275\u0275interpolate1("eui-flag-icon eui-flag-icon-", \u0275\u0275pipeBind1(3, 9, ctx_r0.isoCode)));
    \u0275\u0275property("euiTooltip", \u0275\u0275interpolate(\u0275\u0275pipeBind1(4, 11, ctx_r0.isoCode) + ": " + \u0275\u0275pipeBind1(5, 13, ctx_r0.action)));
  }
}
function MeasureFlagComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 3);
    \u0275\u0275pipe(1, "lowercase");
    \u0275\u0275pipe(2, "uppercase");
    \u0275\u0275pipe(3, "capitaliseFirstLetter");
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap(\u0275\u0275interpolate1("measure-flag eui-flag-icon eui-flag-icon-", \u0275\u0275pipeBind1(1, 5, ctx_r0.isoCode)));
    \u0275\u0275property("euiTooltip", \u0275\u0275interpolate(\u0275\u0275pipeBind1(2, 7, ctx_r0.isoCode) + ": " + \u0275\u0275pipeBind1(3, 9, ctx_r0.action)));
  }
}
var MeasureFlagComponent = class _MeasureFlagComponent {
  constructor() {
    this.isoCode = "";
    this.action = "";
    this.url = "";
  }
  ngOnInit() {
    if (this.measure["takenBy"] === void 0 || this.measure["actionTaken"] === void 0) {
      return;
    }
    this.isoCode = this.measure["takenBy"]["isoCode"];
    this.action = this.measure["actionTaken"]["description"] !== void 0 ? this.measure["actionTaken"]["description"] : "Unknown measure";
    this.url = this.measure["url"] !== void 0 ? this.measure["url"] : "";
  }
  static {
    this.\u0275fac = function MeasureFlagComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _MeasureFlagComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _MeasureFlagComponent, selectors: [["app-measure-flag"]], inputs: { measure: "measure" }, decls: 9, vars: 12, consts: [["target", "_blank", "rel", "noopener", 1, "measure-flag", "print-not", 3, "href"], [3, "class", "euiTooltip"], [1, "print-only"], [3, "euiTooltip"]], template: function MeasureFlagComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275conditionalCreate(0, MeasureFlagComponent_Conditional_0_Template, 6, 15, "a", 0)(1, MeasureFlagComponent_Conditional_1_Template, 4, 11, "span", 1);
        \u0275\u0275elementStart(2, "div", 2);
        \u0275\u0275element(3, "span");
        \u0275\u0275pipe(4, "lowercase");
        \u0275\u0275text(5);
        \u0275\u0275pipe(6, "uppercase");
        \u0275\u0275pipe(7, "capitaliseFirstLetter");
        \u0275\u0275element(8, "br");
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.url !== "" ? 0 : 1);
        \u0275\u0275advance(3);
        \u0275\u0275classMap(\u0275\u0275interpolate1("eui-flag-icon eui-flag-icon-", \u0275\u0275pipeBind1(4, 6, ctx.isoCode)));
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate2(" ", \u0275\u0275pipeBind1(6, 8, ctx.isoCode), " (", \u0275\u0275pipeBind1(7, 10, ctx.action), ")");
      }
    }, dependencies: [SharedModule, EuiTooltipDirective, LinkHttpPipe, CapitaliseFirstLetterPipe, UpperCasePipe, LowerCasePipe], styles: ["\n.measure-flag[_ngcontent-%COMP%] {\n  margin-right: 4px;\n}\n/*# sourceMappingURL=measure-flag.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MeasureFlagComponent, [{
    type: Component,
    args: [{ selector: "app-measure-flag", imports: [SharedModule], standalone: true, template: `@if (url !== "") {
    <a class="measure-flag print-not" href="{{ url | linkHttp }}" target="_blank" rel="noopener">
        <span
            class="eui-flag-icon eui-flag-icon-{{ isoCode | lowercase }}"
            euiTooltip="{{ (isoCode | uppercase) + ': ' + (action | capitaliseFirstLetter) }}"
        >
        </span>
    </a>
} @else {
    <span
        class="measure-flag eui-flag-icon eui-flag-icon-{{ isoCode | lowercase }}"
        euiTooltip="{{ (isoCode | uppercase) + ': ' + (action | capitaliseFirstLetter) }}"
    ></span>
}

<div class="print-only">
    <span class="eui-flag-icon eui-flag-icon-{{ isoCode | lowercase }}"></span>
    {{ isoCode | uppercase }}
    ({{ action | capitaliseFirstLetter }})<br />
</div>
`, styles: ["/* src/app/features/notification/tables/table-elements/measure-flag/measure-flag.component.scss */\n.measure-flag {\n  margin-right: 4px;\n}\n/*# sourceMappingURL=measure-flag.component.css.map */\n"] }]
  }], null, { measure: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MeasureFlagComponent, { className: "MeasureFlagComponent", filePath: "src/app/features/notification/tables/table-elements/measure-flag/measure-flag.component.ts", lineNumber: 11 });
})();

// src/app/features/notification/tables/products-table/products-table.component.ts
function ProductsTableComponent_ng_template_4_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "notification.product.table.brand"));
  }
}
function ProductsTableComponent_ng_template_4_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "notification.product.table.traceability"), " ");
  }
}
function ProductsTableComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr");
    \u0275\u0275element(1, "th");
    \u0275\u0275elementStart(2, "th", 4);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 5);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, ProductsTableComponent_ng_template_4_Conditional_8_Template, 3, 3, "th");
    \u0275\u0275elementStart(9, "th", 6);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(15, ProductsTableComponent_ng_template_4_Conditional_15_Template, 3, 3, "th");
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "translate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 7, "notification.product.table.category"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(7, 9, "notification.product.table.name"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.auth === "private" ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(11, 11, "notification.product.table.distributionStatus"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 13, "notification.product.table.finding"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.auth === "private" ? 15 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(18, 15, "notification.product.table.measuresTaken"), " ");
  }
}
function ProductsTableComponent_ng_template_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "app-product-relation-icon", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("relation", row_r2.productRelation);
  }
}
function ProductsTableComponent_ng_template_5_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \xA0 ");
  }
}
function ProductsTableComponent_ng_template_5_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td");
    \u0275\u0275pipe(1, "translate");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "capitaliseFirstLetter");
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(1, 2, "notification.product.table.brand"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r2.productInfo["brand"] ? \u0275\u0275pipeBind1(3, 4, row_r2.productInfo["brand"]) : \u0275\u0275pipeBind1(4, 6, "notification.product.table.unknownBrand"), " ");
  }
}
function ProductsTableComponent_ng_template_5_Conditional_20_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-sampling-info", 9);
  }
  if (rf & 2) {
    const finding_r3 = ctx.$implicit;
    \u0275\u0275property("sampling", finding_r3);
  }
}
function ProductsTableComponent_ng_template_5_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275repeaterCreate(1, ProductsTableComponent_ng_template_5_Conditional_20_For_2_Template, 1, 1, "app-sampling-info", 9, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(row_r2.findings);
  }
}
function ProductsTableComponent_ng_template_5_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " None ");
  }
}
function ProductsTableComponent_ng_template_5_Conditional_22_Conditional_2_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-operator-icon", 11);
  }
  if (rf & 2) {
    const operator_r4 = ctx.$implicit;
    \u0275\u0275property("operator", operator_r4)("displayRole", true);
  }
}
function ProductsTableComponent_ng_template_5_Conditional_22_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275repeaterCreate(1, ProductsTableComponent_ng_template_5_Conditional_22_Conditional_2_For_2_Template, 1, 2, "app-operator-icon", 11, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(row_r2.operators);
  }
}
function ProductsTableComponent_ng_template_5_Conditional_22_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " None ");
  }
}
function ProductsTableComponent_ng_template_5_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td");
    \u0275\u0275pipe(1, "translate");
    \u0275\u0275conditionalCreate(2, ProductsTableComponent_ng_template_5_Conditional_22_Conditional_2_Template, 3, 0, "div", 10)(3, ProductsTableComponent_ng_template_5_Conditional_22_Conditional_3_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(1, 2, "notification.product.table.traceability"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r2.operators !== void 0 ? 2 : 3);
  }
}
function ProductsTableComponent_ng_template_5_Conditional_25_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-measure-flag", 12);
  }
  if (rf & 2) {
    const measure_r5 = ctx.$implicit;
    \u0275\u0275property("measure", measure_r5);
  }
}
function ProductsTableComponent_ng_template_5_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275repeaterCreate(1, ProductsTableComponent_ng_template_5_Conditional_25_For_2_Template, 1, 1, "app-measure-flag", 12, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(row_r2.measures);
  }
}
function ProductsTableComponent_ng_template_5_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " None ");
  }
}
function ProductsTableComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275conditionalCreate(3, ProductsTableComponent_ng_template_5_Conditional_3_Template, 2, 1, "div")(4, ProductsTableComponent_ng_template_5_Conditional_4_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "capitaliseFirstLetter");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275pipe(10, "translate");
    \u0275\u0275element(11, "app-product-info", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, ProductsTableComponent_ng_template_5_Conditional_12_Template, 5, 8, "td");
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275pipe(14, "translate");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "capitaliseFirstLetter");
    \u0275\u0275pipe(17, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275pipe(19, "translate");
    \u0275\u0275conditionalCreate(20, ProductsTableComponent_ng_template_5_Conditional_20_Template, 3, 0, "div")(21, ProductsTableComponent_ng_template_5_Conditional_21_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(22, ProductsTableComponent_ng_template_5_Conditional_22_Template, 4, 4, "td");
    \u0275\u0275elementStart(23, "td");
    \u0275\u0275pipe(24, "translate");
    \u0275\u0275conditionalCreate(25, ProductsTableComponent_ng_template_5_Conditional_25_Template, 3, 0, "div")(26, ProductsTableComponent_ng_template_5_Conditional_26_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(2, 16, "notification.product.table.relation"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r2.productRelation !== void 0 ? 3 : 4);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(6, 18, "notification.product.table.category"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r2.productCategory ? \u0275\u0275pipeBind1(8, 20, row_r2.productCategory) : "n/a", " ");
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(10, 22, "notification.product.table.name"));
    \u0275\u0275advance(2);
    \u0275\u0275property("title", row_r2.productName)("productInfo", row_r2.productInfo)("userType", ctx_r0.auth);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.auth === "private" ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(14, 24, "notification.product.table.distributionStatus"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r2.distributionStatus ? \u0275\u0275pipeBind1(16, 26, row_r2.distributionStatus) : \u0275\u0275pipeBind1(17, 28, "notification.product.table.unknown"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(19, 30, "notification.product.table.finding"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r2.findings !== void 0 ? 20 : 21);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.auth === "private" ? 22 : -1);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(24, 32, "notification.product.table.measuresTaken"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r2.measures !== void 0 ? 25 : 26);
  }
}
var ProductsTableComponent = class _ProductsTableComponent {
  constructor() {
    this.products = signal([], ...ngDevMode ? [{ debugName: "products" }] : (
      /* istanbul ignore next */
      []
    ));
    this.notificationUtilsService = inject(NotificationUtilsService);
  }
  ngOnInit() {
    if (this.items?.length > 0 && this.auth) {
      this.mapItems();
    }
  }
  ngOnChanges(changes) {
    if ((changes["items"] || changes["auth"]) && this.items?.length > 0 && this.auth) {
      this.mapItems();
    }
  }
  sortBy($event) {
    const { sort, order } = $event;
    this.products.set(_4.orderBy(this.products(), [sort], [order]));
  }
  mapItems() {
    const items = [];
    if (this.auth === "private") {
      for (const item of this.items) {
        const newItem = {
          productRelation: this.getProductRelation(item),
          productCategory: this.getProductCategory(item),
          productName: this.notificationUtilsService.getProductName(item),
          productInfo: this.notificationUtilsService.getProductInfo(item),
          distributionStatus: this.getDistributionStatus(item),
          findings: this.getHazards(item),
          operators: this.getOperators(item),
          measures: this.getMeasures(item)
        };
        items.push(newItem);
      }
    } else {
      for (const item of this.items) {
        const newItem = {
          productRelation: this.getProductRelation(item),
          productCategory: this.getProductCategory(item),
          productName: this.notificationUtilsService.getProductName(item),
          productInfo: this.notificationUtilsService.getProductInfo(item),
          distributionStatus: this.getDistributionStatus(item),
          findings: this.getHazards(item),
          measures: this.getMeasures(item)
        };
        items.push(newItem);
      }
    }
    this.products.set(items);
  }
  getProductRelation(item) {
    if (item["productRelation"] !== void 0) {
      if (item["productRelation"]["description"] !== void 0) {
        return item["productRelation"]["description"];
      }
    }
    return void 0;
  }
  getDistributionStatus(item) {
    if (item["distributionStatus"] !== void 0 && item["distributionStatus"]["description"] !== void 0) {
      return item["distributionStatus"]["description"];
    }
    return void 0;
  }
  getHazards(item) {
    if (item["findings"] !== void 0 && item["findings"]["length"] > 0) {
      return item["findings"];
    }
    return void 0;
  }
  getMeasures(item) {
    if (item["measures"] !== void 0) {
      if (item["measures"]["length"] > 0) {
        return item["measures"];
      }
    }
    return void 0;
  }
  getProductCategory(item) {
    if (item["productCategory"] !== void 0) {
      if (item["productCategory"]["description"] !== void 0) {
        return item["productCategory"]["description"];
      }
    }
    return void 0;
  }
  getOperators(item) {
    const operators = [];
    if (item["consignments"] !== void 0 && item["consignments"]["length"] > 0) {
      for (const consignment of item["consignments"]) {
        if (consignment["operators"] !== void 0 && consignment["operators"]["length"] > 0) {
          for (const operator of consignment["operators"]) {
            operators.push(operator);
          }
        }
      }
    } else {
      return void 0;
    }
    return operators;
  }
  static {
    this.\u0275fac = function ProductsTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProductsTableComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _ProductsTableComponent, selectors: [["app-products-table"]], inputs: { items: "items", auth: "auth" }, features: [\u0275\u0275NgOnChangesFeature], decls: 8, vars: 5, consts: [["paginatorProducts", ""], ["euiTable", "", "isTableResponsive", "", 1, "notification-table", 3, "sortChange", "data", "paginator"], ["euiTemplate", "header"], ["euiTemplate", "body"], ["isSortable", "", "sortOn", "productCategory"], ["isSortable", "", "sortOn", "productName"], ["isSortable", "", "sortOn", "distributionStatus"], [3, "title", "productInfo", "userType"], [3, "relation"], [3, "sampling"], [1, "eui-u-flex", "eui-u-flex-justify-content-evenly", "eui-u-flex-wrap"], [3, "operator", "displayRole"], [3, "measure"]], template: function ProductsTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "table", 1);
        \u0275\u0275listener("sortChange", function ProductsTableComponent_Template_table_sortChange_0_listener($event) {
          return ctx.sortBy($event);
        });
        \u0275\u0275elementStart(1, "caption");
        \u0275\u0275text(2);
        \u0275\u0275pipe(3, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275template(4, ProductsTableComponent_ng_template_4_Template, 19, 17, "ng-template", 2)(5, ProductsTableComponent_ng_template_5_Template, 27, 34, "ng-template", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275element(6, "eui-paginator", null, 0);
      }
      if (rf & 2) {
        const paginatorProducts_r6 = \u0275\u0275reference(7);
        \u0275\u0275property("data", ctx.products())("paginator", paginatorProducts_r6);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(3, 3, "notification.products"), " ");
      }
    }, dependencies: [
      SharedModule,
      EuiTableComponent,
      EuiTableSortableColComponent,
      EuiTemplateDirective,
      EuiPaginatorComponent,
      ProductRelationIconComponent,
      SamplingInfoComponent,
      OperatorIconComponent,
      MeasureFlagComponent,
      ProductInfoComponent,
      TranslatePipe,
      CapitaliseFirstLetterPipe
    ], styles: ["\ntd[_ngcontent-%COMP%] {\n  padding-bottom: 4px !important;\n}\n@media screen and (max-width: 767px) {\n  .notification-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]::before {\n    line-height: var(--eui-font-size);\n  }\n}\n/*# sourceMappingURL=products-table.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProductsTableComponent, [{
    type: Component,
    args: [{ selector: "app-products-table", imports: [
      SharedModule,
      ProductRelationIconComponent,
      SamplingInfoComponent,
      OperatorIconComponent,
      MeasureFlagComponent,
      ProductInfoComponent
    ], standalone: true, template: `<table
    euiTable
    isTableResponsive
    [data]="products()"
    [paginator]="paginatorProducts"
    (sortChange)="sortBy($event)"
    class="notification-table"
>
    <caption>
        {{
            "notification.products" | translate
        }}
    </caption>

    <ng-template euiTemplate="header">
        <tr>
            <th></th>
            <th isSortable sortOn="productCategory">
                {{ "notification.product.table.category" | translate }}
            </th>
            <th isSortable sortOn="productName">
                {{ "notification.product.table.name" | translate }}
            </th>
            @if (auth === "private") {
                <th>{{ "notification.product.table.brand" | translate }}</th>
            }
            <th isSortable sortOn="distributionStatus">
                {{ "notification.product.table.distributionStatus" | translate }}
            </th>
            <th>{{ "notification.product.table.finding" | translate }}</th>
            @if (auth === "private") {
                <th>
                    {{ "notification.product.table.traceability" | translate }}
                </th>
            }
            <th>
                {{ "notification.product.table.measuresTaken" | translate }}
            </th>
        </tr>
    </ng-template>

    <ng-template let-row euiTemplate="body">
        <tr>
            <td [attr.data-col-label]="'notification.product.table.relation' | translate">
                @if (row.productRelation !== undefined) {
                    <div>
                        <app-product-relation-icon
                            [relation]="row.productRelation"
                        ></app-product-relation-icon>
                    </div>
                } @else {
                    &nbsp;
                }
            </td>

            <td [attr.data-col-label]="'notification.product.table.category' | translate">
                {{ row.productCategory ? (row.productCategory | capitaliseFirstLetter) : "n/a" }}
            </td>

            <td [attr.data-col-label]="'notification.product.table.name' | translate">
                <app-product-info
                    [title]="row.productName"
                    [productInfo]="row.productInfo"
                    [userType]="auth"
                ></app-product-info>
            </td>

            @if (auth === "private") {
                <td [attr.data-col-label]="'notification.product.table.brand' | translate">
                    {{
                        row.productInfo["brand"]
                            ? (row.productInfo["brand"] | capitaliseFirstLetter)
                            : ("notification.product.table.unknownBrand" | translate)
                    }}
                </td>
            }

            <td [attr.data-col-label]="'notification.product.table.distributionStatus' | translate">
                {{
                    row.distributionStatus
                        ? (row.distributionStatus | capitaliseFirstLetter)
                        : ("notification.product.table.unknown" | translate)
                }}
            </td>

            <td [attr.data-col-label]="'notification.product.table.finding' | translate">
                @if (row.findings !== undefined) {
                    <div>
                        @for (finding of row.findings; track finding) {
                            <app-sampling-info [sampling]="finding"></app-sampling-info>
                        }
                    </div>
                } @else {
                    None
                }
            </td>

            @if (auth === "private") {
                <td [attr.data-col-label]="'notification.product.table.traceability' | translate">
                    @if (row.operators !== undefined) {
                        <div class="eui-u-flex eui-u-flex-justify-content-evenly eui-u-flex-wrap">
                            @for (operator of row.operators; track operator) {
                                <app-operator-icon [operator]="operator" [displayRole]="true">
                                </app-operator-icon>
                            }
                        </div>
                    } @else {
                        None
                    }
                </td>
            }

            <td [attr.data-col-label]="'notification.product.table.measuresTaken' | translate">
                @if (row.measures !== undefined) {
                    <div>
                        @for (measure of row.measures; track measure) {
                            <app-measure-flag [measure]="measure"></app-measure-flag>
                        }
                    </div>
                } @else {
                    None
                }
            </td>
        </tr>
    </ng-template>
</table>

<eui-paginator #paginatorProducts></eui-paginator>
`, styles: ["/* src/app/features/notification/tables/products-table/products-table.component.scss */\ntd {\n  padding-bottom: 4px !important;\n}\n@media screen and (max-width: 767px) {\n  .notification-table td::before {\n    line-height: var(--eui-font-size);\n  }\n}\n/*# sourceMappingURL=products-table.component.css.map */\n"] }]
  }], null, { items: [{
    type: Input
  }], auth: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductsTableComponent, { className: "ProductsTableComponent", filePath: "src/app/features/notification/tables/products-table/products-table.component.ts", lineNumber: 28 });
})();

// src/app/features/notification/tables/findings-table/findings-table.component.ts
var _5 = __toESM(require_lodash());
function FindingsTableComponent_Conditional_0_ng_template_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 7);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 8);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 2, "notification.finding.table.productName"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(5, 4, "notification.finding.table.sampling"), " ");
  }
}
function FindingsTableComponent_Conditional_0_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr");
    \u0275\u0275conditionalCreate(1, FindingsTableComponent_Conditional_0_ng_template_5_Conditional_1_Template, 6, 6);
    \u0275\u0275elementStart(2, "th", 4);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 5);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 6);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 6);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "translate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.userType === "private" ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 5, "notification.finding.table.finding"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(7, 7, "notification.finding.table.findingType"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(10, 9, "notification.finding.table.analyticalResults"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(13, 11, "notification.finding.table.maximum"), " ");
  }
}
function FindingsTableComponent_Conditional_0_ng_template_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td");
    \u0275\u0275pipe(1, "translate");
    \u0275\u0275element(2, "app-product-info", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "rasffDate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(1, 6, "notification.finding.table.productName"));
    \u0275\u0275advance(2);
    \u0275\u0275property("title", row_r3 == null ? null : row_r3.productName)("productInfo", row_r3 == null ? null : row_r3.productInfo)("userType", ctx_r1.userType);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(4, 8, "notification.finding.table.sampling"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(7, 10, row_r3 == null ? null : row_r3.samplingDate), " ");
  }
}
function FindingsTableComponent_Conditional_0_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr");
    \u0275\u0275conditionalCreate(1, FindingsTableComponent_Conditional_0_ng_template_6_Conditional_1_Template, 8, 12);
    \u0275\u0275elementStart(2, "td");
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "capitaliseFirstLetter");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275pipe(8, "translate");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "capitaliseFirstLetter");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 9);
    \u0275\u0275pipe(12, "translate");
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "capitaliseFirstLetter");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 9);
    \u0275\u0275pipe(16, "translate");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.userType === "private" ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(3, 10, "notification.finding.table.finding"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((row_r3 == null ? null : row_r3.findingName) !== void 0 ? \u0275\u0275pipeBind1(6, 12, row_r3 == null ? null : row_r3.findingName) : "n/a");
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(8, 14, "notification.finding.table.findingType"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", (row_r3 == null ? null : row_r3.findingType) !== void 0 ? \u0275\u0275pipeBind1(10, 16, row_r3 == null ? null : row_r3.findingType) : "n/a", " ");
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(12, 18, "notification.finding.table.analyticalResults"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", (row_r3 == null ? null : row_r3.analyticalResult) !== void 0 ? \u0275\u0275pipeBind1(14, 20, row_r3 == null ? null : row_r3.analyticalResult) : "n/a", " ", (row_r3 == null ? null : row_r3.unit) !== void 0 ? row_r3 == null ? null : row_r3.unit : "", " ");
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(16, 22, "notification.finding.table.maximum"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", (row_r3 == null ? null : row_r3.maxPermittedLvl) !== void 0 ? row_r3 == null ? null : row_r3.maxPermittedLvl : "n/a", " ");
  }
}
function FindingsTableComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "table", 1);
    \u0275\u0275listener("sortChange", function FindingsTableComponent_Conditional_0_Template_table_sortChange_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sortBy($event));
    });
    \u0275\u0275elementStart(2, "caption");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, FindingsTableComponent_Conditional_0_ng_template_5_Template, 14, 13, "ng-template", 2)(6, FindingsTableComponent_Conditional_0_ng_template_6_Template, 18, 24, "ng-template", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "eui-paginator", null, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const paginatorFindings_r4 = \u0275\u0275reference(8);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r1.findings())("paginator", paginatorFindings_r4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 3, "notification.findings"), " ");
  }
}
function FindingsTableComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "notification.finding.table.noHazards"));
  }
}
var FindingsTableComponent = class _FindingsTableComponent {
  constructor() {
    this.notificationUtilsService = inject(NotificationUtilsService);
    this.findings = signal([], ...ngDevMode ? [{ debugName: "findings" }] : (
      /* istanbul ignore next */
      []
    ));
  }
  ngOnInit() {
    if (this.items?.length > 0 && this.userType) {
      this.flattenItemsByFindings();
      this.mapItems();
    }
  }
  ngOnChanges(changes) {
    if ((changes["items"] || changes["userType"]) && this.items?.length > 0 && this.userType) {
      this.flattenItemsByFindings();
      this.mapItems();
    }
  }
  sortBy($event) {
    const { sort, order } = $event;
    this.findings.set(_5.orderBy(this.findings(), [sort], [order]));
  }
  mapItems() {
    const items = [];
    for (const item of this.items) {
      const findings = item.findings;
      const newItem = {
        productName: this.notificationUtilsService.getProductName(item),
        productInfo: this.notificationUtilsService.getProductInfo(item),
        samplingDate: findings?.samplingDate,
        findingName: findings?.name || void 0,
        findingType: findings?.findingCatalogue?.findingType,
        analyticalResult: findings?.analyticalResult || void 0,
        maxPermittedLvl: findings?.maxPermittedLvl || void 0,
        unit: findings?.unit || void 0
      };
      items.push(newItem);
    }
    this.findings.set(items);
  }
  flattenItemsByFindings() {
    const items = [];
    for (const item of this.items) {
      if (item["findings"] !== void 0) {
        if (Array.isArray(item["findings"])) {
          for (const finding of item["findings"]) {
            const newItem = Object.assign({}, item);
            newItem["findings"] = finding;
            items.push(newItem);
          }
        } else {
          const newItem = Object.assign({}, item);
          items.push(newItem);
        }
      }
    }
    this.items = items;
  }
  static {
    this.\u0275fac = function FindingsTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _FindingsTableComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _FindingsTableComponent, selectors: [["app-findings-table"]], inputs: { items: "items", userType: "userType" }, features: [\u0275\u0275NgOnChangesFeature], decls: 2, vars: 1, consts: [["paginatorFindings", ""], ["euiTable", "", "isTableResponsive", "", 1, "notification-table", 3, "sortChange", "data", "paginator"], ["euiTemplate", "header"], ["euiTemplate", "body"], ["isSortable", "", "sortOn", "findingName"], ["isSortable", "", "sortOn", "findingType"], [1, "text-right"], ["isSortable", "", "sortOn", "productName"], ["isSortable", "", "sortOn", "samplingDate"], ["align", "right"], [3, "title", "productInfo", "userType"]], template: function FindingsTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275conditionalCreate(0, FindingsTableComponent_Conditional_0_Template, 9, 5, "div")(1, FindingsTableComponent_Conditional_1_Template, 3, 3, "p");
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.findings().length > 0 ? 0 : 1);
      }
    }, dependencies: [SharedModule, EuiTableComponent, EuiTableSortableColComponent, EuiTemplateDirective, EuiPaginatorComponent, ProductInfoComponent, TranslatePipe, CapitaliseFirstLetterPipe, RasffDatePipe], styles: ["\n@media screen and (max-width: 767px) {\n  .notification-table[_ngcontent-%COMP%]   td[align=right][_ngcontent-%COMP%] {\n    text-align: left;\n  }\n}\n/*# sourceMappingURL=findings-table.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FindingsTableComponent, [{
    type: Component,
    args: [{ selector: "app-findings-table", imports: [SharedModule, ProductInfoComponent], standalone: true, template: `@if (findings().length > 0) {
    <div>
        <table
            euiTable
            isTableResponsive
            [data]="findings()"
            [paginator]="paginatorFindings"
            (sortChange)="sortBy($event)"
            class="notification-table"
        >
            <caption>
                {{
                    "notification.findings" | translate
                }}
            </caption>
            <ng-template euiTemplate="header">
                <tr>
                    @if (userType === "private") {
                        <th isSortable sortOn="productName">
                            {{ "notification.finding.table.productName" | translate }}
                        </th>
                        <th isSortable sortOn="samplingDate">
                            {{ "notification.finding.table.sampling" | translate }}
                        </th>
                    }

                    <th isSortable sortOn="findingName">
                        {{ "notification.finding.table.finding" | translate }}
                    </th>
                    <th isSortable sortOn="findingType">
                        {{ "notification.finding.table.findingType" | translate }}
                    </th>
                    <th class="text-right">
                        {{ "notification.finding.table.analyticalResults" | translate }}
                    </th>
                    <th class="text-right">
                        {{ "notification.finding.table.maximum" | translate }}
                    </th>
                </tr>
            </ng-template>
            <ng-template let-row euiTemplate="body">
                <tr>
                    @if (userType === "private") {
                        <td
                            [attr.data-col-label]="
                                'notification.finding.table.productName' | translate
                            "
                        >
                            <app-product-info
                                [title]="row?.productName"
                                [productInfo]="row?.productInfo"
                                [userType]="userType"
                            ></app-product-info>
                        </td>
                        <td
                            [attr.data-col-label]="
                                'notification.finding.table.sampling' | translate
                            "
                        >
                            <span>
                                {{ row?.samplingDate | rasffDate }}
                            </span>
                        </td>
                    }

                    <td [attr.data-col-label]="'notification.finding.table.finding' | translate">
                        <strong>{{
                            row?.findingName !== undefined
                                ? (row?.findingName | capitaliseFirstLetter)
                                : "n/a"
                        }}</strong>
                    </td>
                    <td
                        [attr.data-col-label]="'notification.finding.table.findingType' | translate"
                    >
                        {{
                            row?.findingType !== undefined
                                ? (row?.findingType | capitaliseFirstLetter)
                                : "n/a"
                        }}
                    </td>
                    <td
                        [attr.data-col-label]="
                            'notification.finding.table.analyticalResults' | translate
                        "
                        align="right"
                    >
                        {{
                            row?.analyticalResult !== undefined
                                ? (row?.analyticalResult | capitaliseFirstLetter)
                                : "n/a"
                        }}
                        {{ row?.unit !== undefined ? row?.unit : "" }}
                    </td>
                    <td
                        [attr.data-col-label]="'notification.finding.table.maximum' | translate"
                        align="right"
                    >
                        {{ row?.maxPermittedLvl !== undefined ? row?.maxPermittedLvl : "n/a" }}
                    </td>
                </tr>
            </ng-template>
        </table>
        <eui-paginator #paginatorFindings></eui-paginator>
    </div>
} @else {
    <p>{{ "notification.finding.table.noHazards" | translate }}</p>
}
`, styles: ["/* src/app/features/notification/tables/findings-table/findings-table.component.scss */\n@media screen and (max-width: 767px) {\n  .notification-table td[align=right] {\n    text-align: left;\n  }\n}\n/*# sourceMappingURL=findings-table.component.css.map */\n"] }]
  }], null, { items: [{
    type: Input
  }], userType: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FindingsTableComponent, { className: "FindingsTableComponent", filePath: "src/app/features/notification/tables/findings-table/findings-table.component.ts", lineNumber: 21 });
})();

// src/app/features/notification/tables/traceability-table/traceability-table.component.ts
var _6 = __toESM(require_lodash());

// src/app/features/notification/tables/table-elements/border-info/border-info.component.ts
var _c05 = ["popoverBorderInfo"];
function BorderInfoComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 5);
    \u0275\u0275listener("click", function BorderInfoComponent_Conditional_20_Template_a_click_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openPopover($event));
    })("keyup.enter", function BorderInfoComponent_Conditional_20_Template_a_keyup_enter_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openPopover($event));
    })("focus", function BorderInfoComponent_Conditional_20_Template_a_focus_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openPopover($event));
    });
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275pipe(3, "capitaliseFirstLetter");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(3, 3, \u0275\u0275pipeBind1(2, 1, "notification.traceability.table.borderControl.role." + (ctx_r1.border.bcp == null ? null : ctx_r1.border.bcp.role))), " ");
  }
}
function BorderInfoComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, " n/a ");
    \u0275\u0275elementEnd();
  }
}
var BorderInfoComponent = class _BorderInfoComponent {
  openPopover(e) {
    this.popover.openPopover(e.target);
  }
  static {
    this.\u0275fac = function BorderInfoComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _BorderInfoComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _BorderInfoComponent, selectors: [["app-border-info"]], viewQuery: function BorderInfoComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c05, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.popover = _t.first);
      }
    }, inputs: { border: "border" }, decls: 22, vars: 19, consts: [["popoverBorderInfo", ""], ["euiSizeAuto", "true", 3, "title"], [1, "notification-popover-entry"], [3, "country", "isocode"], ["tabindex", "0", 1, "operator-more-info"], ["tabindex", "0", 1, "operator-more-info", 3, "click", "keyup.enter", "focus"]], template: function BorderInfoComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "eui-popover", 1, 0);
        \u0275\u0275pipe(2, "translate");
        \u0275\u0275elementStart(3, "div", 2)(4, "h3");
        \u0275\u0275text(5);
        \u0275\u0275pipe(6, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "p");
        \u0275\u0275text(8);
        \u0275\u0275pipe(9, "capitaliseFirstLetter");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "div", 2)(11, "h3");
        \u0275\u0275text(12);
        \u0275\u0275pipe(13, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "p");
        \u0275\u0275text(15);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "p");
        \u0275\u0275text(17);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "p");
        \u0275\u0275element(19, "app-country", 3);
        \u0275\u0275elementEnd()()();
        \u0275\u0275conditionalCreate(20, BorderInfoComponent_Conditional_20_Template, 4, 5, "a", 4);
        \u0275\u0275conditionalCreate(21, BorderInfoComponent_Conditional_21_Template, 2, 0, "span");
      }
      if (rf & 2) {
        \u0275\u0275property("title", \u0275\u0275pipeBind1(2, 11, "notification.traceability.table.borderControl.role." + (ctx.border.bcp == null ? null : ctx.border.bcp.role)));
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 13, "notification.operator.info.name"));
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 15, ctx.border.bcp == null ? null : ctx.border.bcp.legalEntity == null ? null : ctx.border.bcp.legalEntity.name), " ");
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 17, "notification.operator.info.location"));
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.border.bcp == null ? null : ctx.border.bcp.locations[0] == null ? null : ctx.border.bcp.locations[0].address);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate2(" ", ctx.border.bcp == null ? null : ctx.border.bcp.locations[0] == null ? null : ctx.border.bcp.locations[0].postalCode, " ", ctx.border.bcp == null ? null : ctx.border.bcp.locations[0] == null ? null : ctx.border.bcp.locations[0].city, " ");
        \u0275\u0275advance(2);
        \u0275\u0275property("country", ctx.border.bcp == null ? null : ctx.border.bcp.legalEntity == null ? null : ctx.border.bcp.legalEntity.countryNetworkOrganization == null ? null : ctx.border.bcp.legalEntity.countryNetworkOrganization.organizationName)("isocode", ctx.border.bcp == null ? null : ctx.border.bcp.legalEntity == null ? null : ctx.border.bcp.legalEntity.countryNetworkOrganization == null ? null : ctx.border.bcp.legalEntity.countryNetworkOrganization.isoCode);
        \u0275\u0275advance();
        \u0275\u0275conditional((ctx.border.bcp == null ? null : ctx.border.bcp.legalEntity == null ? null : ctx.border.bcp.legalEntity.name) !== void 0 ? 20 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional((ctx.border.bcp == null ? null : ctx.border.bcp.role) === void 0 ? 21 : -1);
      }
    }, dependencies: [SharedModule, CountryComponent, EuiPopoverComponent, TranslatePipe, CapitaliseFirstLetterPipe], styles: ["\na.operator-more-info[_ngcontent-%COMP%] {\n  cursor: pointer;\n  border-bottom: dashed 1px;\n}\na.operator-more-info[_ngcontent-%COMP%]:hover {\n  border-bottom-style: solid;\n}\n/*# sourceMappingURL=border-info.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BorderInfoComponent, [{
    type: Component,
    args: [{ selector: "app-border-info", imports: [SharedModule], standalone: true, template: `<eui-popover
    #popoverBorderInfo
    [title]="
        'notification.traceability.table.borderControl.role.' + border.bcp?.role
            | translate
    "
    euiSizeAuto="true"
>
    <div class="notification-popover-entry">
        <h3>{{ "notification.operator.info.name" | translate }}</h3>
        <p>
            {{ border.bcp?.legalEntity?.name | capitaliseFirstLetter }}
        </p>
    </div>
    <div class="notification-popover-entry">
        <h3>{{ "notification.operator.info.location" | translate }}</h3>
        <p>{{ border.bcp?.locations[0]?.address }}</p>
        <p>
            {{ border.bcp?.locations[0]?.postalCode }}
            {{ border.bcp?.locations[0]?.city }}
        </p>
        <p>
            <app-country
                [country]="
                    border.bcp?.legalEntity?.countryNetworkOrganization
                        ?.organizationName
                "
                [isocode]="
                    border.bcp?.legalEntity?.countryNetworkOrganization?.isoCode
                "
            >
            </app-country>
        </p>
    </div>
</eui-popover>
@if (border.bcp?.legalEntity?.name !== undefined) {
    <a
        class="operator-more-info"
        tabindex="0"
        (click)="openPopover($event)"
        (keyup.enter)="openPopover($event)"
        (focus)="openPopover($event)"
    >
        {{
            "notification.traceability.table.borderControl.role." +
                border.bcp?.role
                | translate
                | capitaliseFirstLetter
        }}
    </a>
}
@if (border.bcp?.role === undefined) {
    <span> n/a </span>
}
`, styles: ["/* src/app/features/notification/tables/table-elements/border-info/border-info.component.scss */\na.operator-more-info {\n  cursor: pointer;\n  border-bottom: dashed 1px;\n}\na.operator-more-info:hover {\n  border-bottom-style: solid;\n}\n/*# sourceMappingURL=border-info.component.css.map */\n"] }]
  }], null, { border: [{
    type: Input
  }], popover: [{
    type: ViewChild,
    args: ["popoverBorderInfo"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BorderInfoComponent, { className: "BorderInfoComponent", filePath: "src/app/features/notification/tables/table-elements/border-info/border-info.component.ts", lineNumber: 14 });
})();

// src/app/features/notification/tables/traceability-table/traceability-table.component.ts
function TraceabilityTableComponent_Conditional_0_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 4);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 5);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 6);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 7);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 8);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 9);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "translate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(3, 7, "notification.traceability.table.productName"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(6, 9, "notification.product.info.bcpRole"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 11, "notification.traceability.table.operatorRole"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(12, 13, "notification.traceability.table.operator"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(15, 15, "notification.traceability.table.lot"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(18, 17, "notification.traceability.table.chedRef"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(21, 19, "notification.traceability.table.origin"), " ");
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-product-info", 10);
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("title", row_r3.productName)("productInfo", row_r3.productInfo)("userType", ctx_r1.userType);
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " No product name ");
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-border-info", 11);
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("border", row_r3.border);
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " n/a ");
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-operator-icon", 12);
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("operator", row_r3.operator)("displayRole", true);
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " n/a ");
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-country", 13);
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("noName", true)("isocode", row_r3.operator == null ? null : row_r3.operator.legalEntity == null ? null : row_r3.operator.legalEntity.countryNetworkOrganization == null ? null : row_r3.operator.legalEntity.countryNetworkOrganization.isoCode)("country", row_r3.operator == null ? null : row_r3.operator.legalEntity == null ? null : row_r3.operator.legalEntity.countryNetworkOrganization == null ? null : row_r3.operator.legalEntity.countryNetworkOrganization.organizationName);
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-operator-icon", 14);
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("operator", row_r3.operator)("displayName", true);
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Unknown ");
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r3.lotNumber, " ");
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " n/a ");
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r3.chedReference, " ");
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " n/a ");
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-country", 15);
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("noName", true)("country", row_r3.originCountry.organizationName)("isocode", row_r3.originCountry.isoCode);
  }
}
function TraceabilityTableComponent_Conditional_0_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275conditionalCreate(3, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_3_Template, 1, 3, "app-product-info", 10)(4, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_4_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275conditionalCreate(7, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_7_Template, 1, 1, "app-border-info", 11)(8, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_8_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275pipe(10, "translate");
    \u0275\u0275conditionalCreate(11, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_11_Template, 1, 2, "app-operator-icon", 12)(12, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_12_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275pipe(14, "translate");
    \u0275\u0275conditionalCreate(15, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_15_Template, 1, 3, "app-country", 13);
    \u0275\u0275conditionalCreate(16, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_16_Template, 1, 2, "app-operator-icon", 14)(17, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_17_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275pipe(19, "translate");
    \u0275\u0275conditionalCreate(20, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_20_Template, 2, 1, "span")(21, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_21_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td");
    \u0275\u0275pipe(23, "translate");
    \u0275\u0275conditionalCreate(24, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_24_Template, 2, 1, "span")(25, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_25_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "td");
    \u0275\u0275pipe(27, "translate");
    \u0275\u0275conditionalCreate(28, TraceabilityTableComponent_Conditional_0_ng_template_6_Conditional_28_Template, 1, 3, "app-country", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(2, 15, "notification.traceability.table.productName"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r3.productName !== void 0 ? 3 : 4);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(6, 17, "notification.traceability.table.bcpRole"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r3.border !== void 0 ? 7 : 8);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(10, 19, "notification.traceability.table.operatorRole"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r3.operator !== void 0 ? 11 : 12);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(14, 21, "notification.traceability.table.operator"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r3.operator !== void 0 && (row_r3.operator == null ? null : row_r3.operator.legalEntity) !== void 0 ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(row_r3.operator !== void 0 ? 16 : 17);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(19, 23, "notification.traceability.table.lot"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r3.lotNumber !== void 0 ? 20 : 21);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(23, 25, "notification.traceability.table.chedRef"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r3.chedReference !== void 0 ? 24 : 25);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(27, 27, "notification.traceability.table.origin"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(row_r3.originCountry !== void 0 ? 28 : -1);
  }
}
function TraceabilityTableComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "table", 1);
    \u0275\u0275listener("sortChange", function TraceabilityTableComponent_Conditional_0_Template_table_sortChange_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sortBy($event));
    });
    \u0275\u0275elementStart(2, "caption");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, TraceabilityTableComponent_Conditional_0_ng_template_5_Template, 22, 21, "ng-template", 2)(6, TraceabilityTableComponent_Conditional_0_ng_template_6_Template, 29, 29, "ng-template", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "eui-paginator", null, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const paginatorTraceability_r4 = \u0275\u0275reference(8);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r1.traceabilities())("paginator", paginatorTraceability_r4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 3, "notification.traceability"), " ");
  }
}
function TraceabilityTableComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "notification.traceability.table.noConsignements"));
  }
}
var TraceabilityTableComponent = class _TraceabilityTableComponent {
  constructor() {
    this.traceabilities = signal([], ...ngDevMode ? [{ debugName: "traceabilities" }] : (
      /* istanbul ignore next */
      []
    ));
    this.notificationUtilsService = inject(NotificationUtilsService);
  }
  ngOnInit() {
    if (this.items?.length > 0) {
      this.flattenItemsByOperator();
      this.mapItems();
    }
  }
  ngOnChanges(changes) {
    if (changes["items"] && this.items?.length > 0) {
      this.flattenItemsByOperator();
      this.mapItems();
    }
  }
  mapItems() {
    const items = [];
    for (const item of this.items) {
      const newItem = {
        productName: this.notificationUtilsService.getProductName(item),
        productInfo: this.notificationUtilsService.getProductInfo(item),
        // since we've flattened the structure
        // we'll always have 1 consign. and 1 op.
        operator: this.getOperator(item),
        lotNumber: this.getLotNumber(item),
        originCountry: this.getOriginCountry(item),
        chedReference: this.getChedReference(item),
        border: item["border"]
      };
      items.push(newItem);
    }
    this.traceabilities.set(items);
  }
  sortBy($event) {
    const { sort, order } = $event;
    this.traceabilities.set(_6.orderBy(this.traceabilities(), [sort], [order]));
  }
  getOperator(item) {
    if (item["consignments"] !== void 0 && item["consignments"]["length"] > 0) {
      if (item["consignments"][0]["operators"] !== void 0 && item["consignments"][0]["operators"]["length"] > 0) {
        return item["consignments"][0]["operators"][0];
      }
    }
    return void 0;
  }
  getLotNumber(item) {
    if (item["consignments"] && item["consignments"]["length"] > 0) {
      if (item["consignments"][0]["lotNumber"]) {
        return item["consignments"][0]["lotNumber"];
      }
    }
    return void 0;
  }
  getChedReference(item) {
    if (item["consignments"] && item["consignments"]["length"] > 0) {
      if (item["consignments"][0]["chedNumber"]) {
        return item["consignments"][0]["chedNumber"];
      }
    }
    return void 0;
  }
  getOriginCountry(item) {
    if (item["consignments"] && item["consignments"]["length"] > 0) {
      if (item["consignments"][0]["originCountry"]) {
        return item["consignments"][0]["originCountry"];
      }
    }
    return void 0;
  }
  flattenItemsByOperator() {
    const items = [];
    for (const item of this.items) {
      if (item["consignments"] !== void 0 && item["consignments"]["length"] > 0) {
        for (const consignment of item["consignments"]) {
          if (consignment["operators"] !== void 0 && consignment["operators"]["length"] > 0) {
            for (const operator of consignment["operators"]) {
              const newItem = Object.assign({}, item);
              newItem["consignments"] = [];
              newItem["consignments"][0] = Object.assign({}, consignment);
              newItem["consignments"][0]["operators"] = [];
              newItem["consignments"][0]["operators"][0] = Object.assign({}, operator);
              items.push(newItem);
            }
          } else {
            const newItem = Object.assign({}, item);
            newItem["consignments"] = [];
            newItem["consignments"][0] = Object.assign({}, consignment);
            items.push(newItem);
          }
        }
      }
    }
    this.items = items;
  }
  static {
    this.\u0275fac = function TraceabilityTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TraceabilityTableComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _TraceabilityTableComponent, selectors: [["app-traceability-table"]], inputs: { items: "items", userType: "userType" }, features: [\u0275\u0275NgOnChangesFeature], decls: 2, vars: 1, consts: [["paginatorTraceability", ""], ["euiTable", "", "isTableResponsive", "", 1, "notification-table", 3, "sortChange", "data", "paginator"], ["euiTemplate", "header"], ["euiTemplate", "body"], ["isSortable", "", "sortOn", "productName"], ["sortable", "", "sortOn", "bcpRole"], ["isSortable", "", "sortOn", "operator.role"], ["isSortable", "", "sortOn", "operator.name"], ["isSortable", "", "sortOn", "lotNumber"], ["sortable", "", "sortOn", "chedReference"], [3, "title", "productInfo", "userType"], [3, "border"], [3, "operator", "displayRole"], [3, "noName", "isocode", "country"], [3, "operator", "displayName"], [3, "noName", "country", "isocode"]], template: function TraceabilityTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275conditionalCreate(0, TraceabilityTableComponent_Conditional_0_Template, 9, 5, "div")(1, TraceabilityTableComponent_Conditional_1_Template, 3, 3, "p");
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.traceabilities().length > 0 ? 0 : 1);
      }
    }, dependencies: [SharedModule, CountryComponent, EuiTableComponent, EuiTableSortableColComponent, EuiTemplateDirective, EuiPaginatorComponent, ProductInfoComponent, OperatorIconComponent, BorderInfoComponent, TranslatePipe], styles: ["\n/*# sourceMappingURL=traceability-table.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TraceabilityTableComponent, [{
    type: Component,
    args: [{ selector: "app-traceability-table", imports: [SharedModule, ProductInfoComponent, OperatorIconComponent, BorderInfoComponent], standalone: true, template: `@if (traceabilities().length > 0) {
    <div>
        <table
            euiTable
            isTableResponsive
            [data]="traceabilities()"
            [paginator]="paginatorTraceability"
            (sortChange)="sortBy($event)"
            class="notification-table"
        >
            <caption>
                {{
                    "notification.traceability" | translate
                }}
            </caption>
            <ng-template euiTemplate="header">
                <tr>
                    <th isSortable sortOn="productName">
                        {{ "notification.traceability.table.productName" | translate }}
                    </th>
                    <th sortable sortOn="bcpRole">
                        {{ "notification.product.info.bcpRole" | translate }}
                    </th>
                    <th isSortable sortOn="operator.role">
                        {{ "notification.traceability.table.operatorRole" | translate }}
                    </th>
                    <th isSortable sortOn="operator.name">
                        {{ "notification.traceability.table.operator" | translate }}
                    </th>
                    <th isSortable sortOn="lotNumber">
                        {{ "notification.traceability.table.lot" | translate }}
                    </th>
                    <th sortable sortOn="chedReference">
                        {{ "notification.traceability.table.chedRef" | translate }}
                    </th>
                    <th>
                        {{ "notification.traceability.table.origin" | translate }}
                    </th>
                </tr>
            </ng-template>
            <ng-template let-row euiTemplate="body">
                <tr>
                    <td
                        [attr.data-col-label]="
                            'notification.traceability.table.productName' | translate
                        "
                    >
                        @if (row.productName !== undefined) {
                            <app-product-info
                                [title]="row.productName"
                                [productInfo]="row.productInfo"
                                [userType]="userType"
                            ></app-product-info>
                        } @else {
                            No product name
                        }
                    </td>
                    <td
                        [attr.data-col-label]="
                            'notification.traceability.table.bcpRole' | translate
                        "
                    >
                        @if (row.border !== undefined) {
                            <app-border-info [border]="row.border"></app-border-info>
                        } @else {
                            n/a
                        }
                    </td>
                    <td
                        [attr.data-col-label]="
                            'notification.traceability.table.operatorRole' | translate
                        "
                    >
                        @if (row.operator !== undefined) {
                            <app-operator-icon
                                [operator]="row.operator"
                                [displayRole]="true"
                            ></app-operator-icon>
                        } @else {
                            n/a
                        }
                    </td>
                    <td
                        [attr.data-col-label]="
                            'notification.traceability.table.operator' | translate
                        "
                    >
                        @if (
                            row.operator !== undefined && row.operator?.legalEntity !== undefined
                        ) {
                            <app-country
                                [noName]="true"
                                [isocode]="
                                    row.operator?.legalEntity?.countryNetworkOrganization?.isoCode
                                "
                                [country]="
                                    row.operator?.legalEntity?.countryNetworkOrganization
                                        ?.organizationName
                                "
                            ></app-country>
                        }
                        @if (row.operator !== undefined) {
                            <app-operator-icon
                                [operator]="row.operator"
                                [displayName]="true"
                            ></app-operator-icon>
                        } @else {
                            Unknown
                        }
                    </td>
                    <td [attr.data-col-label]="'notification.traceability.table.lot' | translate">
                        @if (row.lotNumber !== undefined) {
                            <span>
                                {{ row.lotNumber }}
                            </span>
                        } @else {
                            n/a
                        }
                    </td>
                    <td
                        [attr.data-col-label]="
                            'notification.traceability.table.chedRef' | translate
                        "
                    >
                        @if (row.chedReference !== undefined) {
                            <span>
                                {{ row.chedReference }}
                            </span>
                        } @else {
                            n/a
                        }
                    </td>
                    <td
                        [attr.data-col-label]="'notification.traceability.table.origin' | translate"
                    >
                        @if (row.originCountry !== undefined) {
                            <app-country
                                [noName]="true"
                                [country]="row.originCountry.organizationName"
                                [isocode]="row.originCountry.isoCode"
                            ></app-country>
                        }
                    </td>
                </tr>
            </ng-template>
        </table>
        <eui-paginator #paginatorTraceability></eui-paginator>
    </div>
} @else {
    <p>{{ "notification.traceability.table.noConsignements" | translate }}</p>
}
`, styles: ["/* src/app/features/notification/tables/traceability-table/traceability-table.component.scss */\n/*# sourceMappingURL=traceability-table.component.css.map */\n"] }]
  }], null, { items: [{
    type: Input
  }], userType: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TraceabilityTableComponent, { className: "TraceabilityTableComponent", filePath: "src/app/features/notification/tables/traceability-table/traceability-table.component.ts", lineNumber: 19 });
})();

// src/app/features/notification/notification.component.ts
function NotificationComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 0)(2, "h1");
    \u0275\u0275text(3, "Loading...");
    \u0275\u0275elementEnd()()();
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275element(1, "app-country", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const notification_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("country", notification_r1["notifyingCountry"]["description"])("isocode", notification_r1["notifyingCountry"]["code"])("flag", true);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275element(1, "eui-icon-svg", 24);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(3, 1, "notification.withdrawn"), " ");
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275element(1, "eui-icon-svg", 25);
    \u0275\u0275text(2, " EC validated ");
    \u0275\u0275elementEnd();
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_23_Conditional_4_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-country", 28);
  }
  if (rf & 2) {
    const org_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275property("country", org_r2["organization"]["description"])("isocode", org_r2["organization"]["code"])("flag", true)("additionalText", (ctx_r2.hasFlag(org_r2, ctx_r2.flagType.NOTIFYING) ? "(n)" : "") + (ctx_r2.hasFlag(org_r2, ctx_r2.flagType.ORIGIN) ? "(o)" : "") + (ctx_r2.hasFlag(org_r2, ctx_r2.flagType.DISTRIBUTION) ? "(d)" : "") + (ctx_r2.hasFlag(org_r2, ctx_r2.flagType.OPERATOR) ? "(op)" : "") + (ctx_r2.hasFlag(org_r2, ctx_r2.flagType.FOR_FOLLOW_UP) ? "(ffup)" : "") + (ctx_r2.hasFlag(org_r2, ctx_r2.flagType.FOR_ATTENTION) ? "(ffa)" : ""));
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_23_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275repeaterCreate(1, NotificationComponent_Conditional_1_Conditional_0_Conditional_23_Conditional_4_For_2_Template, 1, 4, "app-country", 28, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const notification_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(notification_r1["organizationFlags"]);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_23_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind1(2, 1, "notification.noOrgFound"), "/p>");
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "h2");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, NotificationComponent_Conditional_1_Conditional_0_Conditional_23_Conditional_4_Template, 3, 0, "div", 26)(5, NotificationComponent_Conditional_1_Conditional_0_Conditional_23_Conditional_5_Template, 3, 3, "p");
    \u0275\u0275elementStart(6, "p", 27);
    \u0275\u0275text(7, " (n) Notifying | (o) Origin | (d) Distribution | (op) Operator");
    \u0275\u0275element(8, "br");
    \u0275\u0275text(9, " (ffup) Flagged for Follow-Up | (ffa) Flagged For Attention ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const notification_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 2, "notification.organisations"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(notification_r1["organizations"] !== void 0 ? 4 : 5);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_24_Template(rf, ctx) {
}
function NotificationComponent_Conditional_1_Conditional_0_For_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-nt-item", 11);
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("title", item_r4["label"])("info", ctx_r2.getDetail(item_r4.key));
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_30_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-nt-item", 11);
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("title", item_r5["label"])("info", ctx_r2.getDetail(item_r5.key));
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_30_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-nt-item", 11);
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("title", item_r6["label"])("info", ctx_r2.getDetail(item_r6.key));
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275repeaterCreate(1, NotificationComponent_Conditional_1_Conditional_0_Conditional_30_For_2_Template, 1, 2, "app-nt-item", 11, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275element(3, "div", 29);
    \u0275\u0275repeaterCreate(4, NotificationComponent_Conditional_1_Conditional_0_Conditional_30_For_5_Template, 1, 2, "app-nt-item", 11, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.layout["mainInfo"]["topRight"]);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.layout["mainInfo"]["bottomRight"]);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_31_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-org-flags-summary", 30);
  }
  if (rf & 2) {
    const notification_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("orgFlags", notification_r1.organizationFlags)("consumerLink", notification_r1.localConsumerLinksByCountry);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_31_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "notification.noOrgFound"));
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275conditionalCreate(1, NotificationComponent_Conditional_1_Conditional_0_Conditional_31_Conditional_1_Template, 1, 2, "app-org-flags-summary", 30)(2, NotificationComponent_Conditional_1_Conditional_0_Conditional_31_Conditional_2_Template, 3, 3, "p");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const notification_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(notification_r1["organizations"] !== void 0 ? 1 : 2);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_32_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "app-attachments-table", 31);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const notification_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("items", notification_r1["attachments"]);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_32_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "notification.attachments.noData"), " ");
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 19)(2, "h2");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, NotificationComponent_Conditional_1_Conditional_0_Conditional_32_Conditional_5_Template, 2, 1, "div")(6, NotificationComponent_Conditional_1_Conditional_0_Conditional_32_Conditional_6_Template, 3, 3, "p");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const notification_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 2, "notification.attachments.documents"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(notification_r1["attachments"] && notification_r1["attachments"]["length"] > 0 ? 5 : 6);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-nt-item", 16);
    \u0275\u0275pipe(1, "translate");
  }
  if (rf & 2) {
    const notification_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("title", \u0275\u0275interpolate(\u0275\u0275pipeBind1(1, 4, "notification.riskDecision")))("info", notification_r1["risk"]["riskDecision"] !== void 0 ? notification_r1["risk"]["riskDecision"] : "Not defined")("customClass", notification_r1["risk"]["riskDecision"].replace(" ", "-"));
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-nt-item", 11);
    \u0275\u0275pipe(1, "translate");
  }
  if (rf & 2) {
    const notification_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("title", \u0275\u0275interpolate(\u0275\u0275pipeBind1(1, 3, "notification.observations")))("info", notification_r1["risk"]["hazardObserved"] !== void 0 ? notification_r1["risk"]["hazardObserved"] : "Not defined");
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-nt-item", 11);
    \u0275\u0275pipe(1, "translate");
  }
  if (rf & 2) {
    const notification_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("title", \u0275\u0275interpolate(\u0275\u0275pipeBind1(1, 3, "notification.persAffected")))("info", notification_r1["risk"]["numberOfPersonsAffected"] !== void 0 ? "" + notification_r1["risk"]["numberOfPersonsAffected"] : "---");
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-nt-item", 11);
    \u0275\u0275pipe(1, "translate");
  }
  if (rf & 2) {
    const notification_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("title", \u0275\u0275interpolate(\u0275\u0275pipeBind1(1, 3, "notification.symptoms")))("info", notification_r1["risk"]["typeOfIllness"] !== void 0 ? notification_r1["risk"]["typeOfIllness"] : "Unknown");
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "app-measures-table", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r2.allProducts)("auth", ctx_r2.userType);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "notification.noMeasuresTaken"));
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "app-followups-table", 33);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const notification_r1 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("items", notification_r1.followups)("notifId", notification_r1.id)("additionalInfo", notification_r1.additionalInformations)("userType", ctx_r2.userType)("orgFlags", notification_r1.organizationFlags)("auth", ctx_r2.userType);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "notification.noFollowUps"));
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "app-products-table", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r2.allProducts)("auth", ctx_r2.userType);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "notification.noProducts"));
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "app-findings-table", 34);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r2.allProducts)("userType", ctx_r2.userType);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "notification.noProducts"));
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_69_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "app-traceability-table", 34);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r2.allProducts)("userType", ctx_r2.userType);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_69_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "notification.noProducts"));
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 19)(2, "h2");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, NotificationComponent_Conditional_1_Conditional_0_Conditional_69_Conditional_5_Template, 2, 2, "div")(6, NotificationComponent_Conditional_1_Conditional_0_Conditional_69_Conditional_6_Template, 3, 3, "p");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 2, "notification.traceability"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.allProducts && ctx_r2.allProducts["length"] > 0 ? 5 : 6);
  }
}
function NotificationComponent_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 2)(2, "div", 3)(3, "h1");
    \u0275\u0275text(4);
    \u0275\u0275element(5, "br");
    \u0275\u0275elementStart(6, "span", 4);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "capitaliseFirstLetter");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "p", 5);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "translate");
    \u0275\u0275pipe(12, "rasffDate");
    \u0275\u0275pipe(13, "translate");
    \u0275\u0275conditionalCreate(14, NotificationComponent_Conditional_1_Conditional_0_Conditional_14_Template, 2, 3, "span");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "translate");
    \u0275\u0275pipe(17, "rasffDate");
    \u0275\u0275conditionalCreate(18, NotificationComponent_Conditional_1_Conditional_0_Conditional_18_Template, 4, 3, "span", 6)(19, NotificationComponent_Conditional_1_Conditional_0_Conditional_19_Template, 3, 0, "span", 7);
    \u0275\u0275element(20, "br")(21, "br");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(22, "div", 8);
    \u0275\u0275conditionalCreate(23, NotificationComponent_Conditional_1_Conditional_0_Conditional_23_Template, 10, 4, "div", 9)(24, NotificationComponent_Conditional_1_Conditional_0_Conditional_24_Template, 0, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 10)(26, "div", 3);
    \u0275\u0275repeaterCreate(27, NotificationComponent_Conditional_1_Conditional_0_For_28_Template, 1, 2, "app-nt-item", 11, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275element(29, "div", 8);
    \u0275\u0275conditionalCreate(30, NotificationComponent_Conditional_1_Conditional_0_Conditional_30_Template, 6, 0, "div", 12);
    \u0275\u0275conditionalCreate(31, NotificationComponent_Conditional_1_Conditional_0_Conditional_31_Template, 3, 1, "div", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(32, NotificationComponent_Conditional_1_Conditional_0_Conditional_32_Template, 7, 4, "div", 13);
    \u0275\u0275elementStart(33, "div", 14)(34, "div", 15)(35, "h2");
    \u0275\u0275text(36);
    \u0275\u0275pipe(37, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(38, NotificationComponent_Conditional_1_Conditional_0_Conditional_38_Template, 2, 6, "app-nt-item", 16);
    \u0275\u0275conditionalCreate(39, NotificationComponent_Conditional_1_Conditional_0_Conditional_39_Template, 2, 5, "app-nt-item", 11);
    \u0275\u0275conditionalCreate(40, NotificationComponent_Conditional_1_Conditional_0_Conditional_40_Template, 2, 5, "app-nt-item", 11);
    \u0275\u0275conditionalCreate(41, NotificationComponent_Conditional_1_Conditional_0_Conditional_41_Template, 2, 5, "app-nt-item", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "div", 17)(43, "h2");
    \u0275\u0275text(44);
    \u0275\u0275pipe(45, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(46, NotificationComponent_Conditional_1_Conditional_0_Conditional_46_Template, 2, 2, "div")(47, NotificationComponent_Conditional_1_Conditional_0_Conditional_47_Template, 3, 3, "p");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(48, "div", 18)(49, "div", 19)(50, "h2");
    \u0275\u0275text(51);
    \u0275\u0275pipe(52, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(53, NotificationComponent_Conditional_1_Conditional_0_Conditional_53_Template, 2, 6, "div")(54, NotificationComponent_Conditional_1_Conditional_0_Conditional_54_Template, 3, 3, "p");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(55, "div", 20)(56, "div", 19)(57, "h2");
    \u0275\u0275text(58);
    \u0275\u0275pipe(59, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(60, NotificationComponent_Conditional_1_Conditional_0_Conditional_60_Template, 2, 2, "div")(61, NotificationComponent_Conditional_1_Conditional_0_Conditional_61_Template, 3, 3, "p");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(62, "div", 21)(63, "div", 19)(64, "h2");
    \u0275\u0275text(65);
    \u0275\u0275pipe(66, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(67, NotificationComponent_Conditional_1_Conditional_0_Conditional_67_Template, 2, 2, "div")(68, NotificationComponent_Conditional_1_Conditional_0_Conditional_68_Template, 3, 3, "p");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(69, NotificationComponent_Conditional_1_Conditional_0_Conditional_69_Template, 7, 4, "div", 22);
    \u0275\u0275element(70, "app-back-to-top-link");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const notification_r1 = ctx;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(notification_r1.notificationStatus === "ec_withdrawn" ? "withdrawn container" : "container");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" Notification ", notification_r1["reference"]);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(8, 29, notification_r1["subject"]), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3(" ", \u0275\u0275pipeBind1(11, 31, "notification.notified"), " ", \u0275\u0275pipeBind1(12, 33, notification_r1["ecValidationDate"]), " ", \u0275\u0275pipeBind1(13, 35, "notification.by"), " ");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(notification_r1["notifyingCountry"] ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" | ", \u0275\u0275pipeBind1(16, 37, "notification.lastUpdate"), " ", \u0275\u0275pipeBind1(17, 39, notification_r1["lastUpdate"]), " ");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(notification_r1.notificationStatus === "ec_withdrawn" ? 18 : 19);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r2.userType === "public" ? 23 : 24);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.layout["mainInfo"]["left"]);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.userType === "public" ? 30 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.userType === "private" ? 31 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.userType === "private" ? 32 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(37, 41, "notification.risk"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(notification_r1["risk"] !== void 0 ? 38 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(notification_r1["risk"] !== void 0 ? 39 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(notification_r1["risk"] !== void 0 ? 40 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(notification_r1["risk"] !== void 0 ? 41 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(45, 43, "notification.measures"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.allProducts && ctx_r2.allProducts["length"] > 0 ? 46 : 47);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(52, 45, "notification.followUps"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(notification_r1.followups && notification_r1.followups.length > 0 ? 53 : 54);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(59, 47, "notification.products"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.allProducts && ctx_r2.allProducts["length"] > 0 ? 60 : 61);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(66, 49, "notification.findings"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.allProducts && ctx_r2.allProducts["length"] > 0 ? 67 : 68);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.userType === "private" ? 69 : -1);
  }
}
function NotificationComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, NotificationComponent_Conditional_1_Conditional_0_Template, 71, 51, "div", 1);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r2.notification()) ? 0 : -1, tmp_1_0);
  }
}
var NotificationComponent = class _NotificationComponent {
  constructor() {
    this.notification = signal(null, ...ngDevMode ? [{ debugName: "notification" }] : (
      /* istanbul ignore next */
      []
    ));
    this.allProducts = [{}];
    this.layout = null;
    this.loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
      /* istanbul ignore next */
      []
    ));
    this.userType = "public";
    this.flagType = FlagType;
    this.euiPermissionService = inject(EuiPermissionService);
    this.notificationService = inject(NotificationService);
    this.notificationUtilsService = inject(NotificationUtilsService);
    this.route = inject(ActivatedRoute);
    this.router = inject(Router);
    this.translateService = inject(TranslateService);
    this.titleService = inject(Title);
  }
  ngOnInit() {
    if (this.router.url.includes("logged/notification")) {
      if (this.euiPermissionService.checkRight("16_ViewNotification")) {
        this.userType = "private";
      }
    }
    this.loadNotificationLayout();
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      this.loadNotificationLayout();
    });
  }
  hasFlag(organizationFlag, flagType) {
    return this.notificationUtilsService.hasFlag(organizationFlag, flagType);
  }
  loadNotificationLayout() {
    this.layout = this.getLayout();
    this.getNotification();
  }
  // used for layout cf. notification-layout.ts
  getDetail(key) {
    try {
      const normalizedKey = key.replace(/\[(\w+)\]/g, ".$1").replace(/^\./, "");
      const details = normalizedKey.split(".").reduce((o, i) => o != null ? o[i] : void 0, this.notification());
      if (key === "ecValidationDate") {
        return details ? details.split(" ")[0] : "";
      }
      return details;
    } catch (error) {
      console.info(" ** error for KEY ** " + key);
      console.error(error);
    }
  }
  findNotifyingCountry(notification) {
    if (notification["organizationFlags"] !== void 0) {
      for (const flag of notification["organizationFlags"]) {
        if (this.notificationUtilsService.hasFlag(flag, FlagType.NOTIFYING)) {
          return flag["organization"];
        }
      }
    }
    return { description: "unknown" };
  }
  getLayout() {
    switch (this.userType) {
      case "public":
        return NOTIFICATION_LAYOUT_PUBLIC;
      case "private":
        return NOTIFICATION_LAYOUT_LOGGED;
      case "non_member":
        return NOTIFICATION_LAYOUT_NON_MEMBER;
    }
  }
  getOrganizations(notification) {
    if (notification["organizationFlags"] !== void 0) {
      return notification["organizationFlags"].map((x) => x["organization"]);
    } else {
      return void 0;
    }
  }
  getAllProducts() {
    const notification = this.notification();
    let products = [];
    if (notification?.product !== void 0) {
      const productCopy = Object.assign({}, notification.product);
      products.push(productCopy);
      if (productCopy.relatedProducts !== void 0) {
        if (productCopy.relatedProducts.length > 0) {
          products = products.concat(productCopy.relatedProducts);
        }
      }
    }
    return products;
  }
  checkAndReplaceMissingValue(notification, field, defaultValue) {
    if (notification[field] !== void 0) {
      return notification[field];
    } else {
      return defaultValue;
    }
  }
  populateMissingFields(notification) {
    const newNotification = Object.assign({}, notification);
    newNotification["reference"] = this.checkAndReplaceMissingValue(newNotification, "reference", "(ref. not found)");
    newNotification["subject"] = this.checkAndReplaceMissingValue(newNotification, "subject", "-- No subject --");
    newNotification["ecValidationDate"] = this.checkAndReplaceMissingValue(newNotification, "ecValidationDate", "(no EC validation date)");
    newNotification["lastUpdate"] = this.checkAndReplaceMissingValue(newNotification, "lastUpdate", "not specified");
    if (newNotification["product"]["distributionStatus"] !== void 0) {
      if (newNotification["product"]["distributionStatus"]["description"] === void 0) {
        newNotification["product"]["distributionStatus"]["description"] = "Unknown";
      }
    } else {
      newNotification["product"]["distributionStatus"] = {
        description: "Unknown"
      };
    }
    return newNotification;
  }
  getNotification() {
    const id = +this.route.snapshot.paramMap.get("id");
    const reference = this.route.snapshot.queryParams["reference"];
    if (this.userType === "private") {
      if (id) {
        this.notificationService.getPrivateNotificationById(id).subscribe((res) => this.handleNotificationResponse(res));
      } else if (reference) {
        this.notificationService.getPrivateNotificationByReference(reference).subscribe((res) => this.handleNotificationResponse(res));
      }
    } else {
      if (id) {
        this.notificationService.getPublicNotificationById(id).subscribe((res) => this.handleNotificationResponse(res));
      } else if (reference) {
        this.notificationService.getPublicNotificationByReference(reference).subscribe((res) => this.handleNotificationResponse(res));
      }
    }
  }
  handleNotificationResponse(res) {
    this.notification.set(res);
    this.allProducts = this.getAllProducts();
    const notification = this.notification();
    notification["notifyingCountry"] = this.findNotifyingCountry(notification);
    notification["organizations"] = this.getOrganizations(notification);
    this.notification.set(this.populateMissingFields(notification));
    this.loading.set(false);
    this.updatePageTitle();
  }
  updatePageTitle() {
    const notification = this.notification();
    if (notification) {
      const reference = notification["reference"] || "";
      const subject = notification["subject"] || "";
      const title = `Notification ${reference} - ${subject}`;
      this.titleService.setTitle(title);
    }
  }
  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
  static {
    this.\u0275fac = function NotificationComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NotificationComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _NotificationComponent, selectors: [["ng-component"]], decls: 2, vars: 1, consts: [[1, "container"], [3, "class"], [1, "page-title", "row"], [1, "col-xl-6", "col-lg-6", "col-12"], [1, "notification-subject"], [1, "notification-byline"], [1, "byline-withdrawn"], [1, "byline-validated"], [1, "col-xl-1", "col-lg-1", "col-12"], ["id", "notification-organisations", 1, "col-xl-5", "col-lg-5", "col-12"], ["id", "main-info", 1, "row"], [3, "title", "info"], [1, "col-xl-5", "col-lg-5", "col-12"], ["id", "attachments", 1, "row", "nt-section"], ["id", "main-additional"], [1, "col-xl-5", "col-lg-5", "col-md-5", "col-sm-12", "col-12", "col-print-12", "risk-table"], [3, "title", "info", "customClass"], [1, "col-xl-6", "col-lg-6", "col-md-6", "col-sm-12", "col-12", "col-print-12", "measures-table"], ["id", "followups", 1, "row", "nt-section"], [1, "col-xl-12", "col-lg-12", "col-12"], ["id", "products", 1, "row", "nt-section"], ["id", "findings", 1, "row", "nt-section"], ["id", "traceability", 1, "row", "nt-section"], [3, "country", "isocode", "flag"], ["icon", "ecl-close-filled:ecl", "size", "xs"], ["icon", "ecl-check-filled:ecl", "size", "xs"], [1, "organisations-list"], [1, "org-flags-info"], [3, "country", "isocode", "flag", "additionalText"], [1, "nt-item-spacer"], [3, "orgFlags", "consumerLink"], [3, "items"], [3, "items", "auth"], [3, "items", "notifId", "additionalInfo", "userType", "orgFlags", "auth"], [3, "items", "userType"]], template: function NotificationComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275conditionalCreate(0, NotificationComponent_Conditional_0_Template, 4, 0, "div")(1, NotificationComponent_Conditional_1_Template, 1, 1);
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.loading() ? 0 : 1);
      }
    }, dependencies: [
      SharedModule,
      CountryComponent,
      BackToTopLinkComponent,
      EuiIconSvgComponent,
      FollowupsTableComponent,
      NtItemComponent,
      OrgFlagsSummaryComponent,
      AttachmentsTableComponent,
      MeasuresTableComponent,
      ProductsTableComponent,
      FindingsTableComponent,
      TraceabilityTableComponent,
      TranslatePipe,
      CapitaliseFirstLetterPipe,
      RasffDatePipe
    ], styles: ["/* src/app/features/notification/notification.component.scss */\n@media print {\n  .eui-app-main-content {\n    margin-top: 0px;\n  }\n  .container {\n    margin-left: -15px;\n  }\n}\n@page {\n  margin: 0;\n}\nh2 {\n  margin-bottom: 1em;\n}\n.container.withdrawn {\n  background-image:\n    linear-gradient(\n      135deg,\n      #efefef 25%,\n      #ffffff 25%,\n      #ffffff 50%,\n      #efefef 50%,\n      #efefef 75%,\n      #ffffff 75%,\n      #ffffff 100%);\n  background-size: 32px 32px;\n  padding-top: 12px;\n  padding-bottom: 16px;\n}\n.container.withdrawn #main-info {\n  background: #ffffff;\n  padding: 16px 16px;\n  margin: 0 0.65vw;\n}\n.container.withdrawn h2 {\n  border: none;\n}\n.page-title {\n  margin: 0 0 24px 0;\n}\n.page-title h1 .notification-subject {\n  display: block;\n  font-size: 20px;\n  font-weight: 500;\n  text-transform: none;\n}\n.page-title p.notification-byline {\n  font-size: 13px;\n  line-height: 14px;\n  color: #333333;\n  margin-top: 0;\n}\n.page-title p.notification-byline .byline-withdrawn {\n  color: #da2131;\n}\n.page-title p.notification-byline .byline-validated {\n  color: #467a39;\n}\n.page-title p.notification-byline .eui-icon {\n  position: relative;\n  top: 2px;\n}\n.page-title #export-list {\n  position: relative;\n  top: -3px;\n  height: 42px;\n  display: inline-block;\n  margin: 0 0 0 8px;\n}\n.page-title #export-list img {\n  display: inline-block;\n  height: 100%;\n  width: auto;\n  margin-right: 8px;\n  transition: opacity 150ms ease-out;\n}\n.page-title #export-list img:hover {\n  cursor: pointer;\n  opacity: 0.75;\n}\n.page-title #notification-organisations {\n  font-size: 14px;\n  color: #333333;\n}\n.page-title #notification-organisations h2 {\n  width: 100%;\n  font-size: 14px;\n  font-weight: 700;\n  color: #000000;\n  border-bottom: #000000 solid 1px;\n  padding-bottom: 3px;\n}\n.page-title #notification-organisations .organisations-list {\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: row;\n}\n.page-title #notification-organisations .organisations-list app-country {\n  margin-right: 8px;\n  margin-bottom: 8px;\n}\np.org-flags-info {\n  font-size: calc(0.8 * var(--eui-font-size));\n  letter-spacing: 0.05em;\n  color: #595959;\n  margin: 0 0 1em 0;\n}\n.nt-section h2 {\n  font-size: 21px;\n  color: #595959;\n  border-bottom: #595959 solid 1px;\n  padding-bottom: 5px;\n}\n.nt-section table {\n  width: 100%;\n}\n.nt-section table tr {\n  margin-bottom: 0.5em;\n  height: 2em;\n  border-bottom: #cbcbcb solid 1px;\n  transition: all 150ms ease-out;\n}\n.nt-section table tr:hover {\n  border-color: #909090;\n  color: #000000;\n}\n.nt-section table th {\n  font-weight: 700;\n}\n#products thead,\n#attachments thead {\n  font-size: 0.8em !important;\n}\n@media print {\n  #products thead,\n  #attachments thead {\n    font-size: 0.6em !important;\n  }\n}\n#main-additional {\n  background: #f5f5f5;\n  display: flex;\n  justify-content: space-between;\n}\n#main-additional > div {\n  padding-bottom: 2em;\n}\n#main-additional h2 {\n  font-size: 21px;\n  color: #909090;\n  border-bottom: #004494 solid 1px;\n  padding-bottom: 5px;\n  color: #004494;\n}\n#main-additional .notification-table tr,\n#main-additional .notification-table td {\n  background: #f5f5f5;\n}\n.nt-item-spacer {\n  height: 2em;\n  margin-bottom: 0.5em;\n  border-bottom: transparent solid 1px;\n}\nbutton.copy {\n  color: #000000;\n  font-size: 0;\n}\nbutton.copy span {\n  color: #000000;\n  font-size: initial;\n}\n@media screen and (max-width: 991px) {\n  .page-title h1 {\n    text-align: center;\n    width: 100%;\n    margin-bottom: 0;\n  }\n  .page-title h1 span.notification-subject {\n    margin: 1em 0 0 0;\n    line-height: 1.25em;\n  }\n  .page-title p.notification-byline {\n    text-align: center;\n    line-height: 1.5em;\n  }\n  .page-title #export-list {\n    position: static;\n    top: 0;\n    display: flex;\n    justify-content: space-around;\n    width: 100%;\n    margin: 0 auto 0 auto;\n  }\n  .page-title #export-list img {\n    width: 54px;\n    height: auto;\n    margin: 0 auto;\n  }\n  .page-title #notification-organisations {\n    margin-top: 2.5em;\n    padding: 0;\n    font-size: 14px;\n  }\n  .page-title #notification-organisations h2 {\n    border-color: #cbcbcb;\n  }\n}\n@media screen and (max-width: 767px) {\n  h2 {\n    text-align: center;\n  }\n  #notification-organisations h2 {\n    text-align: left;\n  }\n  #main-additional {\n    padding-right: 24px;\n    margin-right: -24px;\n    display: block;\n  }\n  #main-additional > div {\n    padding-left: 0;\n    padding-right: 0;\n  }\n}\n@media print {\n  * {\n    transition: none !important;\n  }\n  #main-additional {\n    width: initial;\n    margin: 0 auto;\n    padding: 2em 0;\n    background: none;\n    display: block;\n  }\n  #main-additional .notification-table tr,\n  #main-additional .notification-table td {\n    background: none;\n  }\n  #main-additional .notification-table.risk-table {\n    display: block;\n    width: 100%;\n    float: none;\n    clear: both;\n  }\n  #main-additional .notification-table.measures-table {\n    display: block;\n    width: 100%;\n    float: none;\n    clear: both;\n  }\n}\n/*# sourceMappingURL=notification.component.css.map */\n"], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationComponent, [{
    type: Component,
    args: [{ encapsulation: ViewEncapsulation.None, imports: [
      SharedModule,
      FollowupsTableComponent,
      NtItemComponent,
      OrgFlagsSummaryComponent,
      AttachmentsTableComponent,
      MeasuresTableComponent,
      ProductsTableComponent,
      FindingsTableComponent,
      TraceabilityTableComponent
    ], standalone: true, template: `@if (loading()) {
    <div>
        <div class="container">
            <h1>Loading...</h1>
        </div>
    </div>
} @else {
    @if (notification(); as notification) {
        <div
            [class]="
                notification.notificationStatus === 'ec_withdrawn'
                    ? 'withdrawn container'
                    : 'container'
            "
        >
            <div class="page-title row">
                <!-- REMEMBER to put the columns back to 4 for this div once the EXPORT BUTTONS are done -->
                <!-- <div class="col-xl-4 col-lg-4 col-12"> -->
                <div class="col-xl-6 col-lg-6 col-12">
                    <h1>
                        Notification {{ notification["reference"] }}<br />
                        <span class="notification-subject">
                            {{ notification["subject"] | capitaliseFirstLetter }}
                        </span>
                    </h1>
                    <p class="notification-byline">
                        {{ "notification.notified" | translate }}
                        {{ notification["ecValidationDate"] | rasffDate }}
                        {{ "notification.by" | translate }}
                        @if (notification["notifyingCountry"]) {
                            <span>
                                <app-country
                                    [country]="notification['notifyingCountry']['description']"
                                    [isocode]="notification['notifyingCountry']['code']"
                                    [flag]="true"
                                >
                                </app-country>
                            </span>
                        }
                        | {{ "notification.lastUpdate" | translate }}
                        {{ notification["lastUpdate"] | rasffDate }}
                        @if (notification.notificationStatus === "ec_withdrawn") {
                            <span class="byline-withdrawn">
                                <eui-icon-svg icon="ecl-close-filled:ecl" size="xs"></eui-icon-svg>
                                {{ "notification.withdrawn" | translate }}
                            </span>
                        } @else {
                            <span class="byline-validated">
                                <eui-icon-svg icon="ecl-check-filled:ecl" size="xs"></eui-icon-svg>
                                EC validated
                            </span>
                        }
                        <!-- by {{ notification.lastUpdatedCountry | countryFlag : true }} -->
                        <br />
                        <br />
                    </p>
                </div>
                <!--       <div class="col-xl-2 col-lg-2 col-12">
        <div id="export-list">
          <a (click)="export_xls();">
            <img src="assets/icons/icon_xls.svg" />
          </a>
          <a (click)="export_xml()">
            <img src="assets/icons/icon_xml.svg" />
          </a>
          <a (click)="export_print()">
            <img src="assets/icons/icon_print.svg" />
          </a>
        </div>
      </div> -->
                <div class="col-xl-1 col-lg-1 col-12">
                    <!-- just a spacing div -->
                </div>
                @if (userType === "public") {
                    <div class="col-xl-5 col-lg-5 col-12" id="notification-organisations">
                        <h2>{{ "notification.organisations" | translate }}</h2>
                        @if (notification["organizations"] !== undefined) {
                            <div class="organisations-list">
                                @for (org of notification["organizationFlags"]; track org) {
                                    <app-country
                                        [country]="org['organization']['description']"
                                        [isocode]="org['organization']['code']"
                                        [flag]="true"
                                        [additionalText]="
                                            (hasFlag(org, flagType.NOTIFYING) ? '(n)' : '') +
                                            (hasFlag(org, flagType.ORIGIN) ? '(o)' : '') +
                                            (hasFlag(org, flagType.DISTRIBUTION) ? '(d)' : '') +
                                            (hasFlag(org, flagType.OPERATOR) ? '(op)' : '') +
                                            (hasFlag(org, flagType.FOR_FOLLOW_UP) ? '(ffup)' : '') +
                                            (hasFlag(org, flagType.FOR_ATTENTION) ? '(ffa)' : '')
                                        "
                                    ></app-country>
                                }
                            </div>
                        } @else {
                            <p>{{ "notification.noOrgFound" | translate }}/p></p>
                        }
                        <p class="org-flags-info">
                            (n) Notifying | (o) Origin | (d) Distribution | (op) Operator<br />
                            (ffup) Flagged for Follow-Up | (ffa) Flagged For Attention
                        </p>
                    </div>
                } @else {}
            </div>
            <div id="main-info" class="row">
                <div class="col-xl-6 col-lg-6 col-12">
                    @for (item of layout["mainInfo"]["left"]; track item) {
                        <app-nt-item
                            [title]="item['label']"
                            [info]="getDetail(item.key)"
                        ></app-nt-item>
                    }
                </div>
                <div class="col-xl-1 col-lg-1 col-12">
                    <!-- just a spacing div -->
                </div>
                @if (userType === "public") {
                    <div class="col-xl-5 col-lg-5 col-12">
                        @for (item of layout["mainInfo"]["topRight"]; track item) {
                            <app-nt-item
                                [title]="item['label']"
                                [info]="getDetail(item.key)"
                            ></app-nt-item>
                        }
                        <div class="nt-item-spacer"></div>
                        @for (item of layout["mainInfo"]["bottomRight"]; track item) {
                            <app-nt-item
                                [title]="item['label']"
                                [info]="getDetail(item.key)"
                            ></app-nt-item>
                        }
                    </div>
                }
                @if (userType === "private") {
                    <div class="col-xl-5 col-lg-5 col-12">
                        @if (notification["organizations"] !== undefined) {
                            <app-org-flags-summary
                                [orgFlags]="notification.organizationFlags"
                                [consumerLink]="notification.localConsumerLinksByCountry"
                            ></app-org-flags-summary>
                        } @else {
                            <p>{{ "notification.noOrgFound" | translate }}</p>
                        }
                    </div>
                }
            </div>
            @if (userType === "private") {
                <div id="attachments" class="row nt-section">
                    <div class="col-xl-12 col-lg-12 col-12">
                        <h2>
                            {{ "notification.attachments.documents" | translate }}
                        </h2>
                        @if (
                            notification["attachments"] && notification["attachments"]["length"] > 0
                        ) {
                            <div>
                                <app-attachments-table
                                    [items]="notification['attachments']"
                                ></app-attachments-table>
                            </div>
                        } @else {
                            <p>
                                {{ "notification.attachments.noData" | translate }}
                            </p>
                        }
                    </div>
                </div>
            }
            <div id="main-additional">
                <div class="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12 col-print-12 risk-table">
                    <h2>{{ "notification.risk" | translate }}</h2>
                    @if (notification["risk"] !== undefined) {
                        <app-nt-item
                            title="{{ 'notification.riskDecision' | translate }}"
                            [info]="
                                notification['risk']['riskDecision'] !== undefined
                                    ? notification['risk']['riskDecision']
                                    : 'Not defined'
                            "
                            [customClass]="notification['risk']['riskDecision'].replace(' ', '-')"
                        ></app-nt-item>
                    }
                    @if (notification["risk"] !== undefined) {
                        <app-nt-item
                            title="{{ 'notification.observations' | translate }}"
                            [info]="
                                notification['risk']['hazardObserved'] !== undefined
                                    ? notification['risk']['hazardObserved']
                                    : 'Not defined'
                            "
                        ></app-nt-item>
                    }
                    @if (notification["risk"] !== undefined) {
                        <app-nt-item
                            title="{{ 'notification.persAffected' | translate }}"
                            [info]="
                                notification['risk']['numberOfPersonsAffected'] !== undefined
                                    ? '' + notification['risk']['numberOfPersonsAffected']
                                    : '---'
                            "
                        ></app-nt-item>
                    }
                    @if (notification["risk"] !== undefined) {
                        <app-nt-item
                            title="{{ 'notification.symptoms' | translate }}"
                            [info]="
                                notification['risk']['typeOfIllness'] !== undefined
                                    ? notification['risk']['typeOfIllness']
                                    : 'Unknown'
                            "
                        ></app-nt-item>
                    }
                </div>
                <div
                    class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 col-print-12 measures-table"
                >
                    <h2>{{ "notification.measures" | translate }}</h2>
                    @if (allProducts && allProducts["length"] > 0) {
                        <div>
                            <app-measures-table
                                [items]="allProducts"
                                [auth]="userType"
                            ></app-measures-table>
                        </div>
                    } @else {
                        <p>{{ "notification.noMeasuresTaken" | translate }}</p>
                    }
                </div>
            </div>
            <div id="followups" class="row nt-section">
                <div class="col-xl-12 col-lg-12 col-12">
                    <h2>{{ "notification.followUps" | translate }}</h2>
                    @if (notification.followups && notification.followups.length > 0) {
                        <div>
                            <app-followups-table
                                [items]="notification.followups"
                                [notifId]="notification.id"
                                [additionalInfo]="notification.additionalInformations"
                                [userType]="userType"
                                [orgFlags]="notification.organizationFlags"
                                [auth]="userType"
                            ></app-followups-table>
                        </div>
                    } @else {
                        <p>{{ "notification.noFollowUps" | translate }}</p>
                    }
                </div>
            </div>
            <div id="products" class="row nt-section">
                <div class="col-xl-12 col-lg-12 col-12">
                    <h2>{{ "notification.products" | translate }}</h2>
                    @if (allProducts && allProducts["length"] > 0) {
                        <div>
                            <app-products-table
                                [items]="allProducts"
                                [auth]="userType"
                            ></app-products-table>
                        </div>
                    } @else {
                        <p>{{ "notification.noProducts" | translate }}</p>
                    }
                </div>
            </div>
            <div id="findings" class="row nt-section">
                <div class="col-xl-12 col-lg-12 col-12">
                    <h2>{{ "notification.findings" | translate }}</h2>
                    @if (allProducts && allProducts["length"] > 0) {
                        <div>
                            <app-findings-table
                                [items]="allProducts"
                                [userType]="userType"
                            ></app-findings-table>
                        </div>
                    } @else {
                        <p>{{ "notification.noProducts" | translate }}</p>
                    }
                </div>
            </div>
            @if (userType === "private") {
                <div id="traceability" class="row nt-section">
                    <div class="col-xl-12 col-lg-12 col-12">
                        <h2>{{ "notification.traceability" | translate }}</h2>
                        @if (allProducts && allProducts["length"] > 0) {
                            <div>
                                <app-traceability-table
                                    [items]="allProducts"
                                    [userType]="userType"
                                ></app-traceability-table>
                            </div>
                        } @else {
                            <p>{{ "notification.noProducts" | translate }}</p>
                        }
                    </div>
                </div>
            }
            <app-back-to-top-link></app-back-to-top-link>
        </div>
    }
}
`, styles: ["/* src/app/features/notification/notification.component.scss */\n@media print {\n  .eui-app-main-content {\n    margin-top: 0px;\n  }\n  .container {\n    margin-left: -15px;\n  }\n}\n@page {\n  margin: 0;\n}\nh2 {\n  margin-bottom: 1em;\n}\n.container.withdrawn {\n  background-image:\n    linear-gradient(\n      135deg,\n      #efefef 25%,\n      #ffffff 25%,\n      #ffffff 50%,\n      #efefef 50%,\n      #efefef 75%,\n      #ffffff 75%,\n      #ffffff 100%);\n  background-size: 32px 32px;\n  padding-top: 12px;\n  padding-bottom: 16px;\n}\n.container.withdrawn #main-info {\n  background: #ffffff;\n  padding: 16px 16px;\n  margin: 0 0.65vw;\n}\n.container.withdrawn h2 {\n  border: none;\n}\n.page-title {\n  margin: 0 0 24px 0;\n}\n.page-title h1 .notification-subject {\n  display: block;\n  font-size: 20px;\n  font-weight: 500;\n  text-transform: none;\n}\n.page-title p.notification-byline {\n  font-size: 13px;\n  line-height: 14px;\n  color: #333333;\n  margin-top: 0;\n}\n.page-title p.notification-byline .byline-withdrawn {\n  color: #da2131;\n}\n.page-title p.notification-byline .byline-validated {\n  color: #467a39;\n}\n.page-title p.notification-byline .eui-icon {\n  position: relative;\n  top: 2px;\n}\n.page-title #export-list {\n  position: relative;\n  top: -3px;\n  height: 42px;\n  display: inline-block;\n  margin: 0 0 0 8px;\n}\n.page-title #export-list img {\n  display: inline-block;\n  height: 100%;\n  width: auto;\n  margin-right: 8px;\n  transition: opacity 150ms ease-out;\n}\n.page-title #export-list img:hover {\n  cursor: pointer;\n  opacity: 0.75;\n}\n.page-title #notification-organisations {\n  font-size: 14px;\n  color: #333333;\n}\n.page-title #notification-organisations h2 {\n  width: 100%;\n  font-size: 14px;\n  font-weight: 700;\n  color: #000000;\n  border-bottom: #000000 solid 1px;\n  padding-bottom: 3px;\n}\n.page-title #notification-organisations .organisations-list {\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: row;\n}\n.page-title #notification-organisations .organisations-list app-country {\n  margin-right: 8px;\n  margin-bottom: 8px;\n}\np.org-flags-info {\n  font-size: calc(0.8 * var(--eui-font-size));\n  letter-spacing: 0.05em;\n  color: #595959;\n  margin: 0 0 1em 0;\n}\n.nt-section h2 {\n  font-size: 21px;\n  color: #595959;\n  border-bottom: #595959 solid 1px;\n  padding-bottom: 5px;\n}\n.nt-section table {\n  width: 100%;\n}\n.nt-section table tr {\n  margin-bottom: 0.5em;\n  height: 2em;\n  border-bottom: #cbcbcb solid 1px;\n  transition: all 150ms ease-out;\n}\n.nt-section table tr:hover {\n  border-color: #909090;\n  color: #000000;\n}\n.nt-section table th {\n  font-weight: 700;\n}\n#products thead,\n#attachments thead {\n  font-size: 0.8em !important;\n}\n@media print {\n  #products thead,\n  #attachments thead {\n    font-size: 0.6em !important;\n  }\n}\n#main-additional {\n  background: #f5f5f5;\n  display: flex;\n  justify-content: space-between;\n}\n#main-additional > div {\n  padding-bottom: 2em;\n}\n#main-additional h2 {\n  font-size: 21px;\n  color: #909090;\n  border-bottom: #004494 solid 1px;\n  padding-bottom: 5px;\n  color: #004494;\n}\n#main-additional .notification-table tr,\n#main-additional .notification-table td {\n  background: #f5f5f5;\n}\n.nt-item-spacer {\n  height: 2em;\n  margin-bottom: 0.5em;\n  border-bottom: transparent solid 1px;\n}\nbutton.copy {\n  color: #000000;\n  font-size: 0;\n}\nbutton.copy span {\n  color: #000000;\n  font-size: initial;\n}\n@media screen and (max-width: 991px) {\n  .page-title h1 {\n    text-align: center;\n    width: 100%;\n    margin-bottom: 0;\n  }\n  .page-title h1 span.notification-subject {\n    margin: 1em 0 0 0;\n    line-height: 1.25em;\n  }\n  .page-title p.notification-byline {\n    text-align: center;\n    line-height: 1.5em;\n  }\n  .page-title #export-list {\n    position: static;\n    top: 0;\n    display: flex;\n    justify-content: space-around;\n    width: 100%;\n    margin: 0 auto 0 auto;\n  }\n  .page-title #export-list img {\n    width: 54px;\n    height: auto;\n    margin: 0 auto;\n  }\n  .page-title #notification-organisations {\n    margin-top: 2.5em;\n    padding: 0;\n    font-size: 14px;\n  }\n  .page-title #notification-organisations h2 {\n    border-color: #cbcbcb;\n  }\n}\n@media screen and (max-width: 767px) {\n  h2 {\n    text-align: center;\n  }\n  #notification-organisations h2 {\n    text-align: left;\n  }\n  #main-additional {\n    padding-right: 24px;\n    margin-right: -24px;\n    display: block;\n  }\n  #main-additional > div {\n    padding-left: 0;\n    padding-right: 0;\n  }\n}\n@media print {\n  * {\n    transition: none !important;\n  }\n  #main-additional {\n    width: initial;\n    margin: 0 auto;\n    padding: 2em 0;\n    background: none;\n    display: block;\n  }\n  #main-additional .notification-table tr,\n  #main-additional .notification-table td {\n    background: none;\n  }\n  #main-additional .notification-table.risk-table {\n    display: block;\n    width: 100%;\n    float: none;\n    clear: both;\n  }\n  #main-additional .notification-table.measures-table {\n    display: block;\n    width: 100%;\n    float: none;\n    clear: both;\n  }\n}\n/*# sourceMappingURL=notification.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NotificationComponent, { className: "NotificationComponent", filePath: "src/app/features/notification/notification.component.ts", lineNumber: 48 });
})();

// src/app/features/notification/notification-routing.module.ts
var NotificationRoutingModule = class _NotificationRoutingModule {
  static {
    this.\u0275fac = function NotificationRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NotificationRoutingModule)();
    };
  }
  static {
    this.\u0275mod = /** @pureOrBreakMyCode */
    \u0275\u0275defineNgModule({ type: _NotificationRoutingModule });
  }
  static {
    this.\u0275inj = /** @pureOrBreakMyCode */
    \u0275\u0275defineInjector({ imports: [RouterModule.forChild([{ path: "", component: NotificationComponent }])] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationRoutingModule, [{
    type: NgModule,
    args: [{
      imports: [RouterModule.forChild([{ path: "", component: NotificationComponent }])]
    }]
  }], null, null);
})();

// src/app/features/notification/tables/table-sort-button/table-sort-button.component.ts
var TableSortButtonComponent = class _TableSortButtonComponent {
  constructor() {
    this.sortBy = "";
    this.sort = new EventEmitter();
  }
  clicked(direction) {
    const sortObject = { field: this.sortBy, direction };
    this.sort.emit(sortObject);
  }
  static {
    this.\u0275fac = function TableSortButtonComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TableSortButtonComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _TableSortButtonComponent, selectors: [["app-table-sort-button"]], inputs: { sortBy: "sortBy" }, outputs: { sort: "sort" }, decls: 2, vars: 0, consts: [["euiTooltip", "Order first to last", 1, "eui-icon", "eui-icon-arrow-down", "ux-u-font-size-h6"], ["euiTooltip", "Order last to first", 1, "eui-icon", "eui-icon-arrow-up", "ux-u-font-size-h6"]], template: function TableSortButtonComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275element(0, "span", 0)(1, "span", 1);
      }
    }, dependencies: [SharedModule, EuiTooltipDirective], styles: ["\n.eui-icon-arrow-down[_ngcontent-%COMP%], \n.eui-icon-arrow-up[_ngcontent-%COMP%] {\n  margin: auto 0 auto 6px;\n  color: #bdbdbd;\n  transition: color 150ms ease-out;\n}\n.eui-icon-arrow-down[_ngcontent-%COMP%]:hover, \n.eui-icon-arrow-down[_ngcontent-%COMP%]:focus, \n.eui-icon-arrow-down[_ngcontent-%COMP%]:active, \n.eui-icon-arrow-up[_ngcontent-%COMP%]:hover, \n.eui-icon-arrow-up[_ngcontent-%COMP%]:focus, \n.eui-icon-arrow-up[_ngcontent-%COMP%]:active {\n  cursor: pointer;\n  color: #000000;\n}\n@media screen and (max-width: 991px) {\n  .eui-icon-arrow-down[_ngcontent-%COMP%], \n   .eui-icon-arrow-up[_ngcontent-%COMP%] {\n    margin: 0;\n    color: #ffffff;\n    transition: color 150ms ease-out;\n    padding: 8px 8px;\n    border-radius: 3px;\n    background: #006fb4;\n  }\n}\n/*# sourceMappingURL=table-sort-button.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TableSortButtonComponent, [{
    type: Component,
    args: [{ selector: "app-table-sort-button", imports: [SharedModule], standalone: true, template: '<span class="eui-icon eui-icon-arrow-down ux-u-font-size-h6" euiTooltip="Order first to last">\n</span>\n<span class="eui-icon eui-icon-arrow-up ux-u-font-size-h6" euiTooltip="Order last to first"> </span>\n', styles: ["/* src/app/features/notification/tables/table-sort-button/table-sort-button.component.scss */\n.eui-icon-arrow-down,\n.eui-icon-arrow-up {\n  margin: auto 0 auto 6px;\n  color: #bdbdbd;\n  transition: color 150ms ease-out;\n}\n.eui-icon-arrow-down:hover,\n.eui-icon-arrow-down:focus,\n.eui-icon-arrow-down:active,\n.eui-icon-arrow-up:hover,\n.eui-icon-arrow-up:focus,\n.eui-icon-arrow-up:active {\n  cursor: pointer;\n  color: #000000;\n}\n@media screen and (max-width: 991px) {\n  .eui-icon-arrow-down,\n  .eui-icon-arrow-up {\n    margin: 0;\n    color: #ffffff;\n    transition: color 150ms ease-out;\n    padding: 8px 8px;\n    border-radius: 3px;\n    background: #006fb4;\n  }\n}\n/*# sourceMappingURL=table-sort-button.component.css.map */\n"] }]
  }], null, { sortBy: [{
    type: Input
  }], sort: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TableSortButtonComponent, { className: "TableSortButtonComponent", filePath: "src/app/features/notification/tables/table-sort-button/table-sort-button.component.ts", lineNumber: 13 });
})();

// src/app/features/notification/notification.module.ts
var Module = class _Module {
  static {
    this.\u0275fac = function Module_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _Module)();
    };
  }
  static {
    this.\u0275mod = /** @pureOrBreakMyCode */
    \u0275\u0275defineNgModule({ type: _Module });
  }
  static {
    this.\u0275inj = /** @pureOrBreakMyCode */
    \u0275\u0275defineInjector({ imports: [
      NotificationRoutingModule,
      SharedModule,
      NotificationComponent,
      NtItemComponent,
      OrgFlagsSummaryComponent,
      OrgFlagIconComponent,
      AttachmentsTableComponent,
      MeasuresTableComponent,
      FindingsTableComponent,
      FollowupsTableComponent,
      ProductsTableComponent,
      TraceabilityTableComponent,
      ProductInfoComponent,
      SamplingInfoComponent,
      ProductRelationIconComponent,
      FupTypeIconComponent,
      OperatorIconComponent,
      MeasureFlagComponent,
      TableSortButtonComponent,
      OperatorIconComponent
    ] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Module, [{
    type: NgModule,
    args: [{
      imports: [
        NotificationRoutingModule,
        SharedModule,
        NotificationComponent,
        NtItemComponent,
        OrgFlagsSummaryComponent,
        OrgFlagIconComponent,
        AttachmentsTableComponent,
        MeasuresTableComponent,
        FindingsTableComponent,
        FollowupsTableComponent,
        ProductsTableComponent,
        TraceabilityTableComponent,
        AttachmentTypeComponent,
        ProductInfoComponent,
        SamplingInfoComponent,
        ProductRelationIconComponent,
        FupTypeIconComponent,
        OperatorIconComponent,
        MeasureFlagComponent,
        TableSortButtonComponent,
        OperatorIconComponent
      ],
      exports: [OperatorIconComponent],
      providers: []
    }]
  }], null, null);
})();
export {
  Module
};
//# sourceMappingURL=chunk-7UJMJRHB.js.map
