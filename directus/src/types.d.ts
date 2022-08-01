import type { Accountability } from '@directus/shared/src/types/accountability';
import type { Request } from 'express';
import type { Knex } from 'knex';

export type { PanelConfig } from '@directus/shared/src/types/panels';
export type { DisplayConfig } from '@directus/shared/src/types/displays';
export type { HookConfig } from '@directus/shared/src/types/hooks';
export type { InterfaceConfig } from '@directus/shared/src/types/interfaces';
export type { LayoutConfig } from '@directus/shared/src/types/layouts';
export type { ModuleConfig } from '@directus/shared/src/types/modules';
export type { EndpointConfig } from '@directus/shared/src/types/endpoints';
export type { Accountability } from '@directus/shared/src/types/accountability';

export interface RequestWithAccountability extends Request {
    accountability: Accountability;
}

export type MigrationFunction = (knex: Knex) => Promise<void>;
export interface MigrationConfig {
    up: MigrationFunction;
    down: MigrationFunction;
}
