import {
  OrganizationService
} from "./chunk-2WIGVTXQ.js";
import {
  ListComponent
} from "./chunk-GJLNF3HT.js";
import "./chunk-JVSHWEAP.js";
import {
  Component,
  CountryComponent,
  EuiCardComponent,
  EuiCardContentComponent,
  EuiCardHeaderComponent,
  EuiCardHeaderTitleComponent,
  EuiIconSvgComponent,
  EuiPaginatorComponent,
  EuiPopoverComponent,
  EuiTableComponent,
  EuiTableSortableColComponent,
  EuiTemplateDirective,
  NgModule,
  RouterLink,
  RouterModule,
  SharedModule,
  TranslatePipe,
  TranslateService,
  UserService,
  ViewChild,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
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
  ɵɵviewQuery
} from "./chunk-JBC2RXAS.js";

// src/app/features/consumers/consumers.component.ts
var _c0 = ["euiTable"];
var _c1 = (a0) => [a0];
var _c2 = (a0) => ({ consumerId: a0 });
var _c3 = (a0) => ({ country: a0 });
var _c4 = (a0, a1) => ({ country: a0, link: a1 });
function ConsumersComponent_ng_template_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 11);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 12);
    \u0275\u0275text(5, "ISO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 12);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 12);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 12);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "translate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(3, 4, "consumers.table.country"), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(8, 6, "consumers.table.nb"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(11, 8, "consumers.table.actions"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(14, 10, "consumers.table.portal"), " ");
  }
}
function ConsumersComponent_ng_template_16_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "a", 22);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const link_r5 = ctx.$implicit;
    const row_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("href", link_r5, \u0275\u0275sanitizeUrl);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind2(2, 3, "consumers.table.goToPortal", \u0275\u0275pureFunction2(6, _c4, row_r3.description, link_r5)));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(link_r5);
  }
}
function ConsumersComponent_ng_template_16_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "consumers.noLinks"), " ");
  }
}
function ConsumersComponent_ng_template_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementStart(3, "a", 13);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275listener("keydown.enter", function ConsumersComponent_ng_template_16_Template_a_keydown_enter_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onEnter($event));
    });
    \u0275\u0275element(5, "app-country", 14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td", 15);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275pipe(9, "translate");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275pipe(12, "translate");
    \u0275\u0275elementStart(13, "div", 16)(14, "a", 17);
    \u0275\u0275pipe(15, "translate");
    \u0275\u0275listener("click", function ConsumersComponent_ng_template_16_Template_a_click_14_listener() {
      const row_r3 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openRSS(row_r3.id));
    })("keydown.enter", function ConsumersComponent_ng_template_16_Template_a_keydown_enter_14_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onEnter($event));
    });
    \u0275\u0275element(16, "eui-icon-svg", 18);
    \u0275\u0275text(17, " RSS ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275pipe(19, "translate");
    \u0275\u0275elementStart(20, "span", 19);
    \u0275\u0275pipe(21, "translate");
    \u0275\u0275listener("click", function ConsumersComponent_ng_template_16_Template_span_click_20_listener($event) {
      \u0275\u0275restoreView(_r1);
      const popover_r4 = \u0275\u0275reference(24);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openPopover($event, popover_r4));
    })("keydown.enter", function ConsumersComponent_ng_template_16_Template_span_keydown_enter_20_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onEnter($event));
    });
    \u0275\u0275element(22, "eui-icon-svg", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "eui-popover", 21, 2)(25, "div");
    \u0275\u0275repeaterCreate(26, ConsumersComponent_ng_template_16_For_27_Template, 4, 9, "p", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275conditionalCreate(28, ConsumersComponent_ng_template_16_Conditional_28_Template, 3, 3, "p");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const row_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(2, 20, "consumers.table.country"));
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(37, _c1, row_r3.description))("queryParams", \u0275\u0275pureFunction1(39, _c2, row_r3.id));
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind2(4, 22, "consumers.table.country.viewDetails", \u0275\u0275pureFunction1(41, _c3, row_r3.description)));
    \u0275\u0275advance(2);
    \u0275\u0275property("country", row_r3.description)("isocode", row_r3.code)("size", 1)("flag", true);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r3.code);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(9, 25, "consumers.table.nb"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r3.numberOfNotifications, " ");
    \u0275\u0275advance();
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(12, 27, "consumers.table.actions"));
    \u0275\u0275advance(3);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind2(15, 29, "consumers.table.rss.open", \u0275\u0275pureFunction1(43, _c3, row_r3.description)));
    \u0275\u0275advance(4);
    \u0275\u0275attribute("data-col-label", \u0275\u0275pipeBind1(19, 32, "consumers.table.portal"));
    \u0275\u0275advance(2);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind2(21, 34, "consumers.table.link.openModal", \u0275\u0275pureFunction1(45, _c3, row_r3.description)));
    \u0275\u0275advance(2);
    \u0275\u0275property("fillColor", (row_r3.links == null ? null : row_r3.links.length) ? "" : "neutral");
    \u0275\u0275advance();
    \u0275\u0275property("title", row_r3.description + " Link" + ((row_r3.links == null ? null : row_r3.links.length) > 1 ? "s" : ""))("position", "right")("euiSizeVariant", "xl");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(row_r3.links);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!(row_r3.links == null ? null : row_r3.links.length) ? 28 : -1);
  }
}
var ConsumersComponent = class _ConsumersComponent {
  constructor() {
    this.organizationService = inject(OrganizationService);
    this.userService = inject(UserService);
    this.translateService = inject(TranslateService);
    this.organizations = [];
    this.filteredOrganizations = signal([], ...ngDevMode ? [{ debugName: "filteredOrganizations" }] : (
      /* istanbul ignore next */
      []
    ));
    this.rssLink = "./backend/public/consumer/rss/";
    this.rssLinkLogged = "./backend/logged/consumer/rss/";
  }
  ngOnInit() {
    this.loadMarkets();
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      this.loadMarkets();
    });
  }
  loadMarkets() {
    const user = this.userService.getSignal()();
    const markets$ = user?.fullName ? this.organizationService.getMarketsLogged() : this.organizationService.getMarkets();
    markets$.subscribe((markets) => {
      this.organizations = markets.organizations;
      this.filteredOrganizations.set([...this.organizations]);
    });
  }
  openRSS(id) {
    const user = this.userService.getSignal()();
    const baseRssLink = user?.fullName ? this.rssLinkLogged : this.rssLink;
    const rssLink = `${baseRssLink}${id === -1 ? "all" : id}/${this.translateService.currentLang}/`;
    window.open(rssLink, "_blank");
  }
  // accessibility
  onEnter(event) {
    event.preventDefault();
    event.target.click();
  }
  openPopover(e, popover) {
    popover.openPopover(e.target);
  }
  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
  static {
    this.\u0275fac = function ConsumersComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ConsumersComponent)();
    };
  }
  static {
    this.\u0275cmp = /** @pureOrBreakMyCode */
    \u0275\u0275defineComponent({ type: _ConsumersComponent, selectors: [["ng-component"]], viewQuery: function ConsumersComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c0, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.euiTable = _t.first);
      }
    }, decls: 19, vars: 9, consts: [["euiTable", ""], ["paginator", ""], ["popover", ""], [1, "container"], [1, "page-title", "row"], [1, "col-xl-12", "col-lg-12", "col-12"], ["id", "main-info"], ["euiTable", "", "isTableResponsive", "", 3, "data", "paginator"], ["euiTemplate", "header"], ["euiTemplate", "body"], [3, "pageSize"], ["isSortable", "", "defaultOrder", "", "sortOrder", "asc", "sortOn", "description", 1, "eui-u-text-left", "eui-u-width-10"], [1, "eui-u-text-left", "eui-u-width-10"], [3, "keydown.enter", "routerLink", "queryParams"], ["aria-hidden", "true", 3, "country", "isocode", "size", "flag"], ["data-col-label", "ISO"], [1, "eui-u-flex"], ["tabindex", "0", 1, "rss", 3, "click", "keydown.enter"], ["aria-hidden", "true", "icon", "rss:regular", "fillColor", "primary", "size", "s"], ["tabindex", "0", 1, "link", 3, "click", "keydown.enter"], ["aria-hidden", "true", "icon", "ecl-chain:ecl", 3, "fillColor"], [3, "title", "position", "euiSizeVariant"], ["target", "_blank", 3, "href"]], template: function ConsumersComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 3)(1, "div", 4)(2, "div", 5)(3, "h1");
        \u0275\u0275text(4);
        \u0275\u0275pipe(5, "translate");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(6, "div", 6)(7, "eui-card")(8, "eui-card-header")(9, "eui-card-header-title");
        \u0275\u0275text(10);
        \u0275\u0275pipe(11, "translate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "eui-card-content")(13, "table", 7, 0);
        \u0275\u0275template(15, ConsumersComponent_ng_template_15_Template, 15, 12, "ng-template", 8)(16, ConsumersComponent_ng_template_16_Template, 29, 47, "ng-template", 9);
        \u0275\u0275elementEnd();
        \u0275\u0275element(17, "eui-paginator", 10, 1);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        const paginator_r6 = \u0275\u0275reference(18);
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 5, "consumers.title"));
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(11, 7, "consumers.subtitle"), " ");
        \u0275\u0275advance(3);
        \u0275\u0275property("data", ctx.filteredOrganizations())("paginator", paginator_r6);
        \u0275\u0275advance(4);
        \u0275\u0275property("pageSize", 50);
      }
    }, dependencies: [SharedModule, CountryComponent, RouterLink, EuiTableComponent, EuiTableSortableColComponent, EuiTemplateDirective, EuiCardComponent, EuiCardHeaderComponent, EuiCardHeaderTitleComponent, EuiCardContentComponent, EuiPaginatorComponent, EuiIconSvgComponent, EuiPopoverComponent, TranslatePipe], styles: ["/* src/app/features/consumers/consumers.component.scss */\n#main-info a {\n  text-decoration: none;\n}\n#main-info a:focus-visible,\n#main-info span:focus-visible {\n  outline: none;\n  padding: 6px;\n  border: 2px solid var(--eui-c-primary);\n  border-radius: 6px;\n}\n#main-info .rss {\n  cursor: pointer;\n  color: var(--eui-c-primary);\n}\n#main-info .link {\n  cursor: pointer;\n  color: var(--eui-c-primary);\n}\na {\n  word-wrap: break-word;\n}\n@media screen and (max-width: 767px) {\n  .cs-countries-list {\n    display: block;\n  }\n}\n@media screen and (max-width: 540px) {\n  .cs-countries-list {\n    display: block;\n  }\n}\n/*# sourceMappingURL=consumers.component.css.map */\n"], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConsumersComponent, [{
    type: Component,
    args: [{ encapsulation: ViewEncapsulation.None, imports: [SharedModule], standalone: true, template: `<div class="container">
    <div class="page-title row">
        <div class="col-xl-12 col-lg-12 col-12">
            <h1>{{ "consumers.title" | translate }}</h1>
        </div>
    </div>
    <div id="main-info">
        <eui-card>
            <eui-card-header>
                <eui-card-header-title>
                    {{ "consumers.subtitle" | translate }}
                </eui-card-header-title>
            </eui-card-header>
            <eui-card-content>
                <table
                    #euiTable
                    euiTable
                    isTableResponsive
                    [data]="filteredOrganizations()"
                    [paginator]="paginator"
                >
                    <ng-template euiTemplate="header">
                        <tr>
                            <th
                                class="eui-u-text-left eui-u-width-10"
                                isSortable
                                defaultOrder
                                sortOrder="asc"
                                sortOn="description"
                            >
                                {{ "consumers.table.country" | translate }}
                            </th>
                            <th class="eui-u-text-left eui-u-width-10">ISO</th>
                            <th class="eui-u-text-left eui-u-width-10">
                                {{ "consumers.table.nb" | translate }}
                            </th>
                            <th class="eui-u-text-left eui-u-width-10">
                                {{ "consumers.table.actions" | translate }}
                            </th>
                            <th class="eui-u-text-left eui-u-width-10">
                                {{ "consumers.table.portal" | translate }}
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template let-row euiTemplate="body">
                        <tr>
                            <td [attr.data-col-label]="'consumers.table.country' | translate">
                                <a
                                    [routerLink]="[row.description]"
                                    (keydown.enter)="onEnter($event)"
                                    [attr.aria-label]="
                                        'consumers.table.country.viewDetails'
                                            | translate: { country: row.description }
                                    "
                                    [queryParams]="{ consumerId: row.id }"
                                >
                                    <app-country
                                        [country]="row.description"
                                        [isocode]="row.code"
                                        aria-hidden="true"
                                        [size]="1"
                                        [flag]="true"
                                    >
                                    </app-country>
                                </a>
                            </td>
                            <td data-col-label="ISO">{{ row.code }}</td>
                            <td [attr.data-col-label]="'consumers.table.nb' | translate">
                                {{ row.numberOfNotifications }}
                            </td>
                            <td [attr.data-col-label]="'consumers.table.actions' | translate">
                                <div class="eui-u-flex">
                                    <a
                                        class="rss"
                                        (click)="openRSS(row.id)"
                                        (keydown.enter)="onEnter($event)"
                                        [attr.aria-label]="
                                            'consumers.table.rss.open'
                                                | translate
                                                    : {
                                                          country: row.description,
                                                      }
                                        "
                                        tabindex="0"
                                    >
                                        <eui-icon-svg
                                            aria-hidden="true"
                                            icon="rss:regular"
                                            fillColor="primary"
                                            size="s"
                                        ></eui-icon-svg>
                                        RSS
                                    </a>
                                </div>
                            </td>
                            <td [attr.data-col-label]="'consumers.table.portal' | translate">
                                <span
                                    class="link"
                                    (click)="openPopover($event, popover)"
                                    (keydown.enter)="onEnter($event)"
                                    [attr.aria-label]="
                                        'consumers.table.link.openModal'
                                            | translate: { country: row.description }
                                    "
                                    tabindex="0"
                                >
                                    <eui-icon-svg
                                        aria-hidden="true"
                                        icon="ecl-chain:ecl"
                                        [fillColor]="row.links?.length ? '' : 'neutral'"
                                    />
                                </span>
                                <eui-popover
                                    #popover
                                    [title]="
                                        row.description +
                                        ' Link' +
                                        (row.links?.length > 1 ? 's' : '')
                                    "
                                    [position]="'right'"
                                    [euiSizeVariant]="'xl'"
                                >
                                    <div>
                                        @for (link of row.links; track link) {
                                            <p>
                                                <a
                                                    [href]="link"
                                                    target="_blank"
                                                    [attr.aria-label]="
                                                        'consumers.table.goToPortal'
                                                            | translate
                                                                : {
                                                                      country: row.description,
                                                                      link: link,
                                                                  }
                                                    "
                                                    >{{ link }}</a
                                                >
                                            </p>
                                        }
                                        @if (!row.links?.length) {
                                            <p>
                                                {{ "consumers.noLinks" | translate }}
                                            </p>
                                        }
                                    </div>
                                </eui-popover>
                            </td>
                        </tr>
                    </ng-template>
                </table>
                <eui-paginator #paginator [pageSize]="50"></eui-paginator>
            </eui-card-content>
        </eui-card>
    </div>
</div>
`, styles: ["/* src/app/features/consumers/consumers.component.scss */\n#main-info a {\n  text-decoration: none;\n}\n#main-info a:focus-visible,\n#main-info span:focus-visible {\n  outline: none;\n  padding: 6px;\n  border: 2px solid var(--eui-c-primary);\n  border-radius: 6px;\n}\n#main-info .rss {\n  cursor: pointer;\n  color: var(--eui-c-primary);\n}\n#main-info .link {\n  cursor: pointer;\n  color: var(--eui-c-primary);\n}\na {\n  word-wrap: break-word;\n}\n@media screen and (max-width: 767px) {\n  .cs-countries-list {\n    display: block;\n  }\n}\n@media screen and (max-width: 540px) {\n  .cs-countries-list {\n    display: block;\n  }\n}\n/*# sourceMappingURL=consumers.component.css.map */\n"] }]
  }], null, { euiTable: [{
    type: ViewChild,
    args: ["euiTable"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConsumersComponent, { className: "ConsumersComponent", filePath: "src/app/features/consumers/consumers.component.ts", lineNumber: 26 });
})();

// src/app/features/consumers/consumers-routing.module.ts
var ConsumersRoutingModule = class _ConsumersRoutingModule {
  static {
    this.\u0275fac = function ConsumersRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ConsumersRoutingModule)();
    };
  }
  static {
    this.\u0275mod = /** @pureOrBreakMyCode */
    \u0275\u0275defineNgModule({ type: _ConsumersRoutingModule });
  }
  static {
    this.\u0275inj = /** @pureOrBreakMyCode */
    \u0275\u0275defineInjector({ imports: [RouterModule.forChild([
      { path: "", component: ConsumersComponent },
      {
        path: ":country",
        component: ListComponent,
        data: { label: "list.notification" },
        canActivate: []
      }
    ])] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConsumersRoutingModule, [{
    type: NgModule,
    args: [{
      imports: [
        RouterModule.forChild([
          { path: "", component: ConsumersComponent },
          {
            path: ":country",
            component: ListComponent,
            data: { label: "list.notification" },
            canActivate: []
          }
        ])
      ]
    }]
  }], null, null);
})();

// src/app/features/consumers/consumers.module.ts
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
    \u0275\u0275defineInjector({ imports: [ConsumersRoutingModule, SharedModule, RouterModule] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Module, [{
    type: NgModule,
    args: [{
      imports: [ConsumersRoutingModule, SharedModule, RouterModule],
      declarations: [],
      providers: []
    }]
  }], null, null);
})();
export {
  Module
};
//# sourceMappingURL=chunk-GJQMOZWY.js.map
