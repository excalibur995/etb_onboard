import { ComponentType } from 'react';

import { TextWidget } from '../sdui/TextWidget';
import { ButtonWidget } from '../sdui/ButtonWidget';
import { BadgeWidget } from '../sdui/BadgeWidget';
import { BannerWidget } from '../sdui/BannerWidget';
import { SectionLabelWidget } from '../sdui/SectionLabelWidget';
import { ItemListWidget } from '../sdui/ItemListWidget';
import { ReviewCardWidget } from '../sdui/ReviewCardWidget';
import { TextInputWidget } from '../sdui/TextInputWidget';
import { RadioGroupWidget } from '../sdui/RadioGroupWidget';
import { CheckboxListWidget } from '../sdui/CheckboxListWidget';
import { DropdownWidget } from '../sdui/DropdownWidget';
import { LinkWidget } from '../sdui/LinkWidget';
import { HeroWidget } from '../sdui/HeroWidget';
import { RichTextWidget } from '../sdui/RichTextWidget';
import { PasscodeInputWidget } from '../sdui/PasscodeInputWidget';
import { SlideToConfirmWidget } from '../sdui/SlideToConfirmWidget';
import { TabGroupWidget } from '../sdui/TabGroupWidget';
import { MoneyDisplayWidget, MoneyInputWidget } from '../sdui/MoneyWidget';
import { ImagePreviewWidget } from '../sdui/ImagePreviewWidget';
import { CameraCaptureWidget } from '../sdui/CameraCaptureWidget';
import { AccountSelectorWidget } from '../sdui/AccountSelectorWidget';
import { CascadingSelectWidget } from '../sdui/CascadingSelectWidget';
import { LocalStateWidget } from '../sdui/LocalStateWidget';
import {
  DropdownAsyncWidget,
  RadioGroupAsyncWidget,
  CheckboxListAsyncWidget,
} from '../sdui/AsyncSelectorWidgets';

const registry: Record<string, ComponentType<any> | undefined> = {
  // Text & display
  'ui.text': TextWidget,
  'ui.rich-text': RichTextWidget,
  'ui.section-label': SectionLabelWidget,
  'ui.badge': BadgeWidget,
  'ui.banner': BannerWidget,
  'ui.hero': HeroWidget,
  'ui.money-display': MoneyDisplayWidget,
  'ui.image-preview': ImagePreviewWidget,
  'ui.icon-text': undefined, // existing; wired separately

  // Actions
  'ui.button': ButtonWidget,
  'ui.link': LinkWidget,
  'ui.slide-to-confirm': SlideToConfirmWidget,

  // Inputs - static
  'ui.text-input': TextInputWidget,
  'ui.radio-group': RadioGroupWidget,
  'ui.checkbox-list': CheckboxListWidget,
  'ui.dropdown': DropdownWidget,
  'ui.passcode-input': PasscodeInputWidget,
  'ui.money-input': MoneyInputWidget,
  'ui.cascading-select': CascadingSelectWidget,

  // Inputs - async / live data
  'ui.radio-group-async': RadioGroupAsyncWidget,
  'ui.checkbox-list-async': CheckboxListAsyncWidget,
  'ui.dropdown-async': DropdownAsyncWidget,
  'ui.account-selector': AccountSelectorWidget,

  // Lists & selections
  'ui.item-list': ItemListWidget,
  'ui.tab-group': TabGroupWidget,

  // Review & summary
  'ui.review-card': ReviewCardWidget,

  // Camera
  'ui.camera-capture': CameraCaptureWidget,

  // Non-visual
  'ui.local-state': LocalStateWidget,

  // Remaining stubs
  'ui.progress-bar': undefined,
};

export const getComponent = (
  componentName: string,
): ComponentType<any> | undefined => {
  const Component = registry[componentName];
  if (!Component) {
    console.warn(`[SDUI] Unregistered component: ${componentName}`);
    return undefined;
  }
  return Component;
};

export const registerComponent = (
  componentName: string,
  component: ComponentType<any>,
) => {
  registry[componentName] = component;
};
