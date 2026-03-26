export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface MetaData {
  pagination?: PaginationMeta;
  [key: string]: any;
}

// ==========================================
// Base Models
// ==========================================

export interface JourneyAction {
  actionId: string;
  direction: 'NEXT' | 'BACK' | 'FINISH' | string;
}

export interface JourneyScreen {
  id: number;
  documentId: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  locale?: string;
  screenId: string;
  hideProgressBar: boolean;
}

export interface JourneyStep {
  id: number;
  type: 'user' | 'system' | string;
  stepCode: string;
  service?: string | null;
  operation?: string | null;
  params?: any | null;
  onSuccess?: any | null;
  onFailure?: any | null;
  maxRetry: number;
  onSubmit: JourneyAction[];
  screen?: JourneyScreen;
}

export interface JourneyExitAction {
  id: number;
  key: string;
  type: string;
  payload: any;
  analytics: any;
}

export interface Journey {
  id: number;
  documentId: string;
  slug: string;
  name: string;
  description: string | null;
  initialState: Record<string, any> | null;
  analytics: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string;
  schemaVersion: string;
  bundleVersion: string | null;
  productType: string;
  segment: string;
  owner: string | null;
  idempotencyRequired: boolean;
  checkpointEnabled: boolean;
  maxRetry: number;
  async: boolean;
  presentation: string | null;
  journeyId: string | null;
  navigator: string | null;
  onExit: JourneyExitAction | null;
  localizations?: any[];
  screens?: JourneyScreen[];
  steps?: JourneyStep[];
  preInitiateScreen: string;
}

// ==========================================
// SDUI Models
// ==========================================

export interface ScreenMeta {
  id: number;
  title: string | null;
  subtitle: string | null;
  showBack: boolean;
  showClose: boolean;
  analytics: any | null;
  onBack: any | null;
}

export interface SDUIComponent {
  __component: string;
  id: number;
  [key: string]: any; // Dynamic props depending on __component
}

export interface SDUIScreen {
  id: number;
  documentId: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  locale?: string;
  screenId: string;
  hideProgressBar: boolean;
  meta: ScreenMeta;
  header: SDUIComponent[];
  body: SDUIComponent[];
  footer: SDUIComponent[];
}

// ==========================================
// API Response Models
// ==========================================

export interface GetJourneysResponse {
  data: Journey[];
  meta: MetaData;
}

export interface GetJourneyDetailsResponse {
  data: Journey;
  meta: MetaData;
}

export interface GetScreenResponse {
  data: SDUIScreen;
  meta: MetaData;
}

// ─── SDUI primitives ─────────────────────────────────────────────────────────

export type SduiBinding = {
  id: number;
  path: string;
  scope: string;
  defaultValue: unknown | null;
  syncOnChange: boolean;
  syncDebounceMs: number;
  onClear: unknown | null;
};

export type SduiValidation = {
  id: number;
  rule: string;
  value: unknown | null;
  message: string;
};

// ─── UI Components ────────────────────────────────────────────────────────────

export type RadioOption = {
  id: number;
  key: string;
  label: string;
  description: string | null;
  icon?: string | null;
};

export type UiRadioGroup = {
  __component: 'ui.radio-group';
  id: number;
  label: string | null;
  options: RadioOption[];
  binding: SduiBinding | null;
  validation: SduiValidation[];
  visibility: unknown | null;
};

export type UiButton = {
  __component: 'ui.button';
  id: number;
  label: string;
  variant: 'primary' | 'secondary' | 'ghost' | string;
  action: ScreenAction | null;
  guardRules: unknown[];
  visibility: unknown | null;
};

// Union — extend as more component types are added
export type UiComponent = UiRadioGroup | UiButton;

// ─── Screen Meta ──────────────────────────────────────────────────────────────

export type NavigateActionPayload =
  | { direction: 'next'; navigation_type: 'push' | 'replace' | 'reset' }
  | { direction: 'back'; navigation_type: 'push' | 'replace' | 'reset' }
  | {
      direction: 'jump';
      target: string;
      navigation_type: 'push' | 'replace' | 'reset';
    };

export type GuardLogic = {
  field: string;
  op: 'notEmpty' | 'equals' | 'notEquals' | 'minLength' | string;
  value?: unknown;
};

export type GuardRule = {
  id: number;
  documentId?: string;
  ruleKey: string;
  description?: string | null;
  /** Single condition OR an array of AND conditions */
  logic: GuardLogic | GuardLogic[];
};

export type ScreenAction = {
  id: number;
  /** Matches JourneyAction.actionId in steps[].onSubmit */
  key: string;
  type: 'navigate' | 'api_call' | string;
  payload: NavigateActionPayload | Record<string, unknown> | null;
  analytics: unknown | null;
  guards: GuardRule[];
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export type Screen = {
  id: number;
  documentId: string;
  screenId: string;
  meta: ScreenMeta;
  header: UiComponent[];
  body: UiComponent[];
  footer: UiComponent[];
};
