import { Component, InjectionKey } from "vue";

// list of known injection keys for providing overrides

export const HeaderInjectionKey: InjectionKey<Component> = Symbol('Header');
export const FooterInjectionKey: InjectionKey<Component> = Symbol('Footer');

export const EntityTabsInjectionKey: InjectionKey<Component> = Symbol('EntityTabs');