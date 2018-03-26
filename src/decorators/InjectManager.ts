import {ConnectionManager} from "typeorm";
import {Container} from "typedi";

/**
 * Allows to inject an EntityManager using typedi's Container.
 */
export function InjectManager(connectionName: string = "default"): Function {
    return function(object: Object|Function, propertyName: string, index?: number) {
        Container.registerHandler({ object, index, propertyName, value: () => {
            const connectionManager = Container.get(ConnectionManager);
            if (!connectionManager.has(connectionName))
                throw new Error(`Cannot get connection "${connectionName}" from the connection manager. ` +
                  `Make sure you have created such connection. Also make sure you have called useContainer(Container) ` +
                  `in your application before you established a connection and importing any entity.`);

            const connection = connectionManager.get(connectionName);
            const entityManager = connection.manager;
            if (!entityManager)
                throw new Error(`Entity manager was not found on "${connectionName}" connection. ` +
                  `Make sure you correctly setup connection and container usage.`);

            return entityManager;
        }});
    };
}
