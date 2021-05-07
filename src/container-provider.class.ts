import { ContainedType, ContainerInterface } from 'typeorm';
import { Container, Constructable } from 'typedi';

/**
 * Class transforming between TypeDI API and the expected API by TypeORM.
 */
export class TypeDIContainerProvider implements ContainerInterface {
  get<T>(constructable: ContainedType<T>) {
    /**
     * TypeDI only resolves values for registered types, so we need to register
     * them before to requesting them from the default container.
     */
    if (!Container.has(constructable as Constructable<T>)) {
      Container.set({ id: constructable, type: constructable as Constructable<T> });
    }

    return Container.get(constructable as Constructable<T>);
  }

  /**
   * Completely resets the container by removing all previously registered services and handlers from it.
   * @param containerId
   * @returns
   */
  reset(containerId?: string | undefined) {
    return Container.reset(containerId);
  }
}
