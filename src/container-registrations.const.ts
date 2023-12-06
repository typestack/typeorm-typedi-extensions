import { Container } from 'typedi';
import { DataSource } from 'typeorm';

/** This file registers all classes from TypeORM in the default TypeDI container. */

/**
 * We need to set imported TypeORM classes before requesting them, otherwise we
 * would receive a "ServiceNotFoundError" above TypeDI 0.9.1 from the decorators.
 */
Container.set({ id: DataSource, type: DataSource });
