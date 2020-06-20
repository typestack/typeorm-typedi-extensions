import {ConnectionManager, ContainerInstance} from "typeorm";
import {Container} from "typedi";

/**
 * Allows to inject an Connection using typedi's Container.
 */
export function InjectConnection(connectionName: string = "default"): Function {
    return function(object: Object|Function, propertyName: string, index?: number) {
        Container.registerHandler({ object, index, propertyName, value: (containerInstance: ContainerInstance) => {
            const connectionManager = containerInstance.get(ConnectionManager);
            if (!connectionManager.has(connectionName))
                throw new Error(`Cannot get connection "${connectionName}" from the connection manager. ` +
                  `Make sure you have created such connection. Also make sure you have called useContainer(Container) ` +
                  `in your application before you established a connection and importing any entity.`);

            return connectionManager.get(connectionName);
        }});
    };
}
