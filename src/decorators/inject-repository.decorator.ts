import { Repository, TreeRepository, MongoRepository, EntityTarget, ObjectType } from 'typeorm';
import { Constructable, Container, ContainerInstance } from 'typedi';

import { EntityTypeMissingError } from '../errors/entity-type-missing.error';
import { PropertyTypeMissingError } from '../errors/property-type-missing.error';
import { ParamTypeMissingError } from '../errors/param-type-missing.error';
import { ConnectionNotFoundError } from '../errors/manager-not-found.error';
import ConnectionManager from '../connection-manager.class';

type allowForceType = 'Repository' | 'MongoRepository' | 'TreeRepository' | null;

/**
 * Helper to avoid V8 compilation of anonymous function on each call of decorator.
 */
function getRepositoryHelper(
  connectionName: string,
  repositoryType: ObjectType<unknown>,
  entityType: EntityTarget<any>,
  containerInstance: ContainerInstance,
  forceType: allowForceType
) {
  const connection = ConnectionManager.getConnection();
  if (!connection) {
    throw new ConnectionNotFoundError(connectionName);
  }

  if (repositoryType === Repository || forceType === 'Repository') {
    return connection.getRepository(entityType);
  }

  if (repositoryType === MongoRepository || forceType === 'MongoRepository') {
    return connection.getMongoRepository(entityType);
  }

  if (repositoryType === TreeRepository || forceType === 'TreeRepository') {
    return connection.getTreeRepository(entityType);
  }

  return repositoryType;
}

/**
 * Injects the requested custom repository object using TypeDI's container. To make injection work without explicity
 * specifying the type in the decorator, you must annotate your properties and/or parameters with the correct type!
 *
 * ```ts
 * class SampleClass {
 *  \@InjectRepository()
 *   userRepository: UserRepository;
 *
 *   constructor(@InjectRepository() private userRepository: UserRepository) {}
 * }
 * ```
 */
export function InjectRepository(): CallableFunction;
export function InjectRepository(connectionName: string): CallableFunction;

/**
 * Injects the requested `Repository`, `MongoRepository`, `TreeRepository` object using TypeDI's container.
 * To make injection work without explicity specifying the type in the decorator, you must annotate your properties
 * and/or parameters with the correct type!
 *
 * ```ts
 * class SampleClass {
 *  \@InjectRepository(User)
 *   userRepository: Repository<User>;
 *
 *   constructor(@InjectRepository(User) private userRepository: Repository<User>) {}
 * }
 * ```
 */
export function InjectRepository(entityType: Function): CallableFunction;

/**
 * Injects the requested `Repository`, `MongoRepository`, `TreeRepository` object using TypeDI's container forced.
 *
 * ```ts
 * class SampleClass {
 *  \@InjectRepository(User, "Repository")
 *   userRepository: Repository<User>;
 *
 *   constructor(@InjectRepository(User, "Repository") private userRepository: Repository<User>) {}
 * }
 * ```
 */
export function InjectRepository(entityType: Function, forceType: allowForceType): CallableFunction;

/**
 * Injects the requested `Repository`, `MongoRepository`, `TreeRepository` object using TypeDI's container.
 * To make injection work without explicity specifying the type in the decorator, you must annotate your properties
 * and/or parameters with the correct type!
 *
 * ```ts
 * class SampleClass {
 *  \@InjectRepository(User, "test-conn")
 *   userRepository: Repository<User>;
 *
 *   constructor(@InjectRepository(User, "test-conn") private userRepository: Repository<User>) {}
 * }
 * ```
 */
export function InjectRepository(
  entityType: Function,
  forceType: allowForceType,
  connectionName: string
): CallableFunction;
export function InjectRepository(
  entityTypeOrConnectionName?: Function | string,
  forceType: allowForceType = null,
  paramConnectionName = 'default'
): CallableFunction {
  return (object: object, propertyName: string | symbol, index?: number): void => {
    let entityType: Function | undefined;
    let connectionName: string;
    let repositoryType: Function;

    // handle first parameter overload
    connectionName = paramConnectionName;
    if (typeof entityTypeOrConnectionName === 'string') {
      connectionName = entityTypeOrConnectionName;
    } else if (typeof entityTypeOrConnectionName === 'function') {
      entityType = entityTypeOrConnectionName;
    }

    if (Reflect?.getOwnMetadata == undefined) {
      throw new Error('Reflect.getOwnMetadata is not defined. Make sure to import the `reflect-metadata` package!');
    }

    if (index !== undefined) {
      /** The decorator has been applied to a constructor parameter. */
      const paramTypes: Function[] | undefined = Reflect.getOwnMetadata('design:paramtypes', object, propertyName);

      if (!paramTypes || !paramTypes[index]) {
        throw new ParamTypeMissingError(object, propertyName as string, index);
      }

      repositoryType = paramTypes[index];
    } else {
      /** The decorator has been applied to a class property. */
      const propertyType: Function | undefined = Reflect.getOwnMetadata('design:type', object, propertyName);

      if (!propertyType) {
        throw new PropertyTypeMissingError(object, propertyName as string);
      }

      repositoryType = propertyType;
    }

    switch (repositoryType) {
      case Repository:
      case MongoRepository:
      case TreeRepository:
        if (!entityType) {
          throw new EntityTypeMissingError(object, propertyName as string, index);
        }
    }

    const forcedType = !!forceType ? forceType : null;

    Container.registerHandler({
      object: object as Constructable<unknown>,
      index: index,
      propertyName: propertyName as string,
      value: containerInstance =>
        getRepositoryHelper(connectionName, repositoryType, entityType!, containerInstance, forcedType),
    });
  };
}
