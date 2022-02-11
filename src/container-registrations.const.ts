import { Container } from 'typedi';
import { ConnectionManager } from 'typeorm';

/** This file registers all classes from TypeORM in the default TypeDI container. */

/**
 * We need to set imported TypeORM classes before requesting them, otherwise we
 * would receive a "ServiceNotFoundError" above TypeDI 0.9.1 from the decorators.
 */
Container.set({ id: ConnectionManager, type: ConnectionManager, global: true });
