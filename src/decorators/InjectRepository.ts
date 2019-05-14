import { ConnectionManager, Repository, TreeRepository, MongoRepository } from "typeorm";
import { Container, ContainerInstance } from "typedi";

import { EntityTypeMissingError } from "../errors/EntityTypeMissingError";
import { PropertyTypeMissingError } from "../errors/PropertyTypeMissingError";
import { ParamTypeMissingError } from "../errors/ParamTypeMissingError";

/**
 * Helper to avoid V8 compilation of anonymous function on each call of decorator.
 */
function getRepository(connectionName: string, repositoryType: Function, entityType: Function, containerInstance: ContainerInstance) {
    const connectionManager = containerInstance.get(ConnectionManager);
    if (!connectionManager.has(connectionName)) {
        throw new Error(
            `Cannot get connection "${connectionName}" from the connection manager. ` +
            `Make sure you have created such connection. Also make sure you have called useContainer(Container) ` +
            `in your application before you established a connection and importing any entity.`
        );
    }
    const connection = connectionManager.get(connectionName);

    switch (repositoryType) {
        case Repository:
            return connection.getRepository(entityType);
        case MongoRepository:
            return connection.getMongoRepository(entityType);
        case TreeRepository:
            return connection.getTreeRepository(entityType);
        // if not the TypeORM's ones, there must be custom repository classes
        default:
            return connection.getCustomRepository(repositoryType);
    }
}

/**
 * Satisfy typescript compiler about universal decorators.
 */
export type ParamOrPropDecorator = (object: object, propertyName: string, index?: number) => void;

/**
 * Allows to inject a custom repository using TypeDI's Container.
 * Be aware that you have to annotate the param/property  with correct type!
 * ```ts
 * class Sample {
 *   // constructor injection
 *   constructor(
 *     \@InjectRepository()
 *      private userRepository: UserRepository,
 *   ) {}
 * 
 *   // property injection
 *  \@InjectRepository()
 *   userRepository: UserRepository;
 * }
 * ```
 */
export function InjectRepository(): ParamOrPropDecorator;
/**
 * Allows to inject a Repository, MongoRepository, TreeRepository using TypeDI's Container.
 * Be aware that you have to annotate the param/property  with correct type!
 * ```ts
 * class Sample {
 *   // constructor injection
 *   constructor(
 *     \@InjectRepository(User)
 *      private userRepository: Repository<User>,
 *   ) {}
 * 
 *   // property injection
 *  \@InjectRepository(User)
 *   userRepository: Repository<User>;
 * }
 * ```
 */
export function InjectRepository(entityType: Function): ParamOrPropDecorator;
/**
 * Allows to inject a custom repository using TypeDI's Container
 * and specify the connection name in a parameter.
 * Be aware that you have to annotate the param/property  with correct type!
 * ```ts
 * class Sample {
 *   // constructor injection
 *   constructor(
 *     \@InjectRepository("test-conn")
 *      private userRepository: UserRepository,
 *   ) {}
 * 
 *   // property injection
 *  \@InjectRepository("test-conn")
 *   userRepository: UserRepository;
 * }
 * ```
 */
export function InjectRepository(connectionName: string): ParamOrPropDecorator;
/**
 * Allows to inject a Repository, MongoRepository, TreeRepository using TypeDI's Container
 * and specify the connection name in a parameter.
 * Be aware that you have to annotate the param/property with correct type!
 * ```ts
 * class Sample {
 *   // constructor injection
 *   constructor(
 *     \@InjectRepository(User, "test-conn")
 *      private userRepository: Repository<User>,
 *   ) {}
 * 
 *   // property injection
 *  \@InjectRepository(User, "test-conn")
 *   userRepository: Repository<User>;
 * }
 * ```
 */
export function InjectRepository(entityType: Function, connectionName: string): ParamOrPropDecorator;

export function InjectRepository(entityTypeOrConnectionName?: Function|string, paramConnectionName = "default"): ParamOrPropDecorator {
    return (object: object, propertyName: string, index?: number) => {
        let entityType: Function|undefined;
        let connectionName: string;
        let repositoryType: Function;

        // handle first parameter overload
        connectionName = paramConnectionName;
        if (typeof entityTypeOrConnectionName === "string") {
            connectionName = entityTypeOrConnectionName;
        } else if (typeof entityTypeOrConnectionName === "function") {
            entityType = entityTypeOrConnectionName;
        }

        // if the decorator has been aplied to parameter (constructor injection)
        if (index !== undefined) {
            const paramTypes: Function[] | undefined = Reflect.getOwnMetadata("design:paramtypes", object, propertyName);
            if (!paramTypes || !paramTypes[index]) {
                throw new ParamTypeMissingError(object, propertyName, index);
            }
            repositoryType = paramTypes[index];
        }
        // if the parameter has been aplied to class property
        else {
            const propertyType: Function | undefined = Reflect.getOwnMetadata("design:type", object, propertyName);
            if (!propertyType) {
                throw new PropertyTypeMissingError(object, propertyName);
            }
            repositoryType = propertyType;
        }

        switch (repositoryType) {
            case Repository:
            case MongoRepository:
            case TreeRepository:
                if (!entityType) {
                    throw new EntityTypeMissingError(object, propertyName, index);
                }
        }
        
        Container.registerHandler({
            index,
            object,
            propertyName,
            value: (containerInstance) => getRepository(connectionName, repositoryType, entityType!, containerInstance),
        });
    };
}
