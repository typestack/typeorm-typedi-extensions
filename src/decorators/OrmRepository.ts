import {ConnectionManager} from "typeorm";
import {Container} from "typedi";
import {Handler} from "typedi/types/Handler";

/**
 * Allows to inject a Repository using typedi's Container.
 * If you want to inject custom Repository class decorated with @EntityRepository decorator, use OrmCustomRepository instead.
 */
export function OrmRepository(cls: Function, connectionName: string = "default"): Function {
    return function(target: Object|Function, propertyName: string, index?: number) {

        const getValue = () => {
            const connectionManager = Container.get(ConnectionManager);
            if (!connectionManager.has(connectionName))
                throw new Error(`Cannot get connection "${connectionName}" from the connection manager. ` +
                    `Make sure you have created such connection. Also make sure you have called useContainer(Container) ` +
                    `in your application before you established a connection and importing any entity.`);

            const connection = connectionManager.get(connectionName);
            return connection.getRepository(cls as any);
        };

        let handler = <Handler> {
            object: target,
            value: getValue
        };

        if (index !== undefined) {
            handler.index = index;
        }

        if (propertyName !== undefined) {
            handler.propertyName = propertyName;
        }

        Container.registerHandler(handler);

    };
}