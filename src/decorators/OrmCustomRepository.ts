import { ConnectionManager } from "typeorm";
import { Container } from "typedi";

/**
 * Allows to inject a custom Repository using typedi's Container.
 * Use it to get the repository class decorated with @EntityRepository decorator.
 */
export function OrmCustomRepository(): ParameterDecorator;
/**
 * Allows to inject a custom Repository using typedi's Container.
 * Use it to get the repository class decorated with @EntityRepository decorator.
 */
export function OrmCustomRepository(connectionName: string): ParameterDecorator;
/**
 * Allows to inject a custom Repository using typedi's Container.
 * Use it to get the repository class decorated with @EntityRepository decorator.
 */
export function OrmCustomRepository(className: Function, connectionName?: string): ParameterDecorator;

export function OrmCustomRepository(classNameOrConnectionName?: Function|string, connectionName?: string): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        let clsName: Function;
        let conName = "default";

        // parse overloaded parameters
        if (typeof classNameOrConnectionName === "string") {
            conName = classNameOrConnectionName;
        } else if (typeof classNameOrConnectionName === "function") {
            clsName = classNameOrConnectionName;
            if (connectionName) {
                conName = connectionName;
            }
        }

        // get reflected param type
        if (!clsName) {
            try {
                clsName = Reflect.getOwnMetadata("design:paramtypes", target, propertyKey)[parameterIndex];
            } catch (err) {
                throw new Error(
                    `Cannot get reflected type for "${propertyKey}" parameter of ${target.constructor.name} class. ` +
                    `Make sure you have turned on an "emitDecoratorMetadata": true, option in tsconfig.json. ` +
                    `Also make sure you have imported "reflect-metadata" on top of the main entry file in your application.`
                );
            }
        }
        
        // register new handler for injection
        Container.registerHandler({
            object: target,
            index: parameterIndex,
            propertyName: propertyKey as string,
            value: () => {
                const connectionManager = Container.get(ConnectionManager);
                if (!connectionManager.has(conName))
                    throw new Error(
                        `Cannot get connection "${conName}" from the connection manager. ` +
                        `Make sure you have created such connection. Also make sure you have called useContainer(Container) ` +
                        `in your application before you established a connection and importing any entity.`
                    );

                const connection = connectionManager.get(conName);
                return connection.getCustomRepository(clsName);
            }
        });
    };
}
