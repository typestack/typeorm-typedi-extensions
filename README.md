# TypeDI Service container integration with TypeORM

This extension for TypeORM provides handy decorators that can be used with [typedi](https://github.com/pleerock/typedi).

## Installation

* Install module:

`npm install typeorm-typedi-extensions --save`

* Install TypeDI:

`npm install typedi --save`

* Configure in your app TypeORM to use TypeDI Container, before you create a connection:

```typescript
import "reflect-metadata";
import {createConnection, useContainer} from "typeorm";
import {Container} from "typedi";

useContainer(Container);
createConnection({ 
    /// ....
}); 
```

* That's all, start using decorators!


## Usage

All decorators can be used on properties and constructor arguments, e.g. you can use both
property and constructor injection.

### @OrmConnection

Injects `Connection` from where you can access anything in your connection.

Example using property injection:

```typescript
import {Service} from "typedi";
import {Connection} from "typeorm";
import {OrmConnection} from "typeorm-typedi-extensions";

@Service()
export class PostRepository {
    
    @OrmConnection()
    private connection: Connection;
    
}
```

Example using constructor injection:

```typescript
import {Service} from "typedi";
import {Connection} from "typeorm";
import {OrmConnection} from "typeorm-typedi-extensions";

@Service()
export class PostRepository {
    
    constructor(@OrmConnection() private connection: Connection) {
    }
    
}
```

Optionally, you can specify a connection name in the decorator parameters.

### @OrmEntityManager

Injects `EntityManager` from where you can access any entity in your connection. 

Example using property injection:

```typescript
import {Service} from "typedi";
import {EntityManager} from "typeorm";
import {OrmEntityManager} from "typeorm-typedi-extensions";

@Service()
export class PostRepository {
    
    @OrmEntityManager()
    private entityManager: EntityManager;
    
}
```

Example using constructor injection:

```typescript
import {Service} from "typedi";
import {EntityManager} from "typeorm";
import {OrmEntityManager} from "typeorm-typedi-extensions";

@Service()
export class PostRepository {
    
    constructor(@OrmEntityManager() private entityManager: EntityManager) {
    }
    
}
```

Optionally, you can specify a connection name in the decorator parameters.

### @OrmRepository

Injects `Repository` of some Entity.

If you want to inject custom Repository (class decorated with `@EntityRepository` decorator), use `OrmCustomRepository` instead.

Example using property injection:

```typescript
import {Service} from "typedi";
import {Repository} from "typeorm";
import {OrmRepository} from "typeorm-typedi-extensions";
import "../entity/Post";

@Service()
export class PostRepository {
    
    @OrmRepository(Post)
    private repository: Repository<Post>;
    
}
```

Example using constructor injection:

```typescript
import {Service} from "typedi";
import {Repository} from "typeorm";
import {OrmRepository} from "typeorm-typedi-extensions";
import "../entity/Post";

@Service()
export class PostRepository {
    
    constructor(@OrmRepository(Post) private repository: Repository<Post>) {
    }
    
}
```
Optionally, you can specify a connection name in the decorator parameters.

### @OrmCustomRepository

Injects custom `Repository` of some Entity. Be aware that you have to create the class which extends the generic `Repository<T>` and decorate it with `EntityRepository<T>` decorator.

Example using constructor injection:

```typescript
import { Service } from "typedi";
import { Repository, EntityRepository } from "typeorm";
import { OrmCustomRepository } from "typeorm-typedi-extensions";
import "../entity/user";

// create custom Repository class
@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
    public findByEmail(email: string) {
        return this.findOne({ email });
    }
    
}

@Service()
export class PostService {

    // using constructor injection
    constructor(
        @OrmCustomRepository(UserRepository)
        private readonly userRepository: UserRepository
    )

    public userExist(user: User): boolean {
        return this.userRepository.findByEmail(user.email) ? true : false;
    }

}
```

Optionally, you can specify a connection name in the decorator parameters.

### @OrmTreeRepository

Injects `TreeRepository` of some Entity.

Example using property injection:

```typescript
import {Service} from "typedi";
import {TreeRepository} from "typeorm";
import {OrmTreeRepository} from "typeorm-typedi-extensions";
import "../entity/Post";

@Service()
export class PostRepository {
    
    @OrmTreeRepository(Post)
    private repository: TreeRepository<Post>;
    
}
```

Example using constructor injection:

```typescript
import {Service} from "typedi";
import {TreeRepository} from "typeorm";
import {OrmTreeRepository} from "typeorm-typedi-extensions";
import "../entity/Post";

@Service()
export class PostRepository {
    
    constructor(@OrmTreeRepository(Post) private repository: TreeRepository<Post>) {
    }
    
}
```

Optionally, you can specify a connection name in the decorator parameters.

### @OrmSpecificRepository

Injects `SpecificRepository` of some Entity.

Example using property injection:

```typescript
import {Service} from "typedi";
import {SpecificRepository} from "typeorm";
import {OrmSpecificRepository} from "typeorm-typedi-extensions";
import "../entity/Post";

@Service()
export class PostRepository {
    
    @OrmSpecificRepository(Post)
    private repository: SpecificRepository<Post>;
    
}
```

Example using constructor injection:

```typescript
import {Service} from "typedi";
import {SpecificRepository} from "typeorm";
import {OrmSpecificRepository} from "typeorm-typedi-extensions";
import "../entity/Post";

@Service()
export class PostRepository {
    
    constructor(@OrmSpecificRepository(Post) private repository: SpecificRepository<Post>) {
    }
    
}
```

Optionally, you can specify a connection name in the decorator parameters.

## Samples

Take a look on samples in [./sample](sample) for examples of usages.
