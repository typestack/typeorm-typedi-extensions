import { Constructable, Container } from 'typedi';
import { ConnectionNotFoundError } from '../errors/manager-not-found.error';
import ConnectionManager from '../connection-manager.class';

/**
 * Injects the `EntityManager` object using TypeDI's container.
 * This decorator can be used both as class property decorator or constructor parameter decorator.
 */
export function InjectManager(connectionName: string = 'default'): CallableFunction {
  return function (object: Object, propertyName: string | symbol, index?: number): void {
    Container.registerHandler({
      object: object as Constructable<unknown>,
      index: index,
      propertyName: propertyName as string,
      value: containerInstance => {
        const datasource = ConnectionManager.getDatasource();

        if (!datasource) {
          throw new ConnectionNotFoundError(connectionName);
        }

        return ConnectionManager.getManager(); 
      },
    });
  };
}
