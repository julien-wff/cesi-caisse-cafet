export type { PanelConfig } from '@directus/shared/src/types/panels';
export type { DisplayConfig } from '@directus/shared/src/types/displays';
export type { HookConfig } from '@directus/shared/src/types/hooks';
export type { InterfaceConfig } from '@directus/shared/src/types/interfaces';
export type { LayoutConfig } from '@directus/shared/src/types/layouts';
export type { ModuleConfig } from '@directus/shared/src/types/modules';
export type { EndpointConfig } from '@directus/shared/src/types/endpoints';
export type { Accountability } from '@directus/shared/src/types/accountability';

import { Accountability } from '@directus/shared/src/types/accountability';
import { Request } from 'express';

export interface RequestWithAccountability extends Request {
    accountability: Accountability;
}
