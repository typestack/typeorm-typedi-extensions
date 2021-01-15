import { Container } from 'typedi';
import { ConnectionManager } from 'typeorm';

/**
 * We need to set imported TypeORM classes before requesting them, otherwise we
 * would receive a "ServiceNotFoundError" above TypeDI 0.9.1.
 */
Container.set({ id: ConnectionManager, type: ConnectionManager });

export * from './decorators/InjectConnection';
export * from './decorators/InjectManager';
export * from './decorators/InjectRepository';

// deprecated aliases
export { InjectConnection as OrmConnection } from './decorators/InjectConnection';
export { InjectManager as OrmManager } from './decorators/InjectManager';
export { InjectRepository as OrmRepository } from './decorators/InjectRepository';
