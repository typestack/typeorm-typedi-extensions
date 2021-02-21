import { Container as TypeDIContainer } from 'typedi';
import { ConnectionManager } from 'typeorm';
import { TypeDIContainerProvider } from './container-provider.class';

export * from './decorators/inject-connection.decorator';
export * from './decorators/inject-manager.decorator';
export * from './decorators/inject-repository.decorator';

/**
 * We need to set imported TypeORM classes before requesting them, otherwise we
 * would receive a "ServiceNotFoundError" above TypeDI 0.9.1 from the decorators.
 */
TypeDIContainer.set({ id: ConnectionManager, type: ConnectionManager });

/**
 * We export the current container implementation what transforms function
 * calls between the TypeORM container format and TypeDI.
 */
export const Container = new TypeDIContainerProvider();
