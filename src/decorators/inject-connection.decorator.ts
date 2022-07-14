import { ConnectionManager } from 'typeorm';
import { Container, Constructable } from 'typedi';

/**
 * Injects the `Connection` object using TypeDI's container.
 * This decorator can be used both as class property decorator or constructor parameter decorator.
 */
export function InjectConnection(connectionName: string = 'default'): CallableFunction {
  return function (object: Object, propertyName: string | symbol, index?: number): void {
    Container.registerHandler({
      object: object as Constructable<unknown>,
      index: index,
      propertyName: propertyName as string,
      value: containerInstance => {
        const connectionManager = containerInstance.get(ConnectionManager);

        return connectionManager.get(connectionName);
      },
    });
  };
}
