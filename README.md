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

### @OrmManager

Injects `EntityManager` from where you can access any entity in your connection. 

Example using property injection:

```typescript
import {Service} from "typedi";
import {EntityManager} from "typeorm";
import {OrmManager} from "typeorm-typedi-extensions";

@Service()
export class PostRepository {
    
    @OrmManager()
    private entityManager: EntityManager;
    
}
```

Example using constructor injection:

```typescript
import {Service} from "typedi";
import {EntityManager} from "typeorm";
import {OrmManager} from "typeorm-typedi-extensions";

@Service()
export class PostRepository {
    
    constructor(@OrmManager() private entityManager: EntityManager) {
    }
    
}
```

Optionally, you can specify a connection name in the decorator parameters.

### @OrmRepository

Injects `Repository`, `MongoRepository`, `TreeRepository` or custom repository of some Entity.
Be aware that the property or param decorated with `@OrmRepository` has to be annotated with repository type!

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
    
    constructor(
        @OrmRepository(Post)
        private repository: Repository<Post>
    ) {}
    
}
```
Optionally, you can specify a connection name in the decorator parameters:

```ts
@Service()
export class PostRepository {
    
    @OrmRepository(Post, "custom-con-name")
    private repository: Repository<Post>;
    
}
```

You can also inject custom `Repository` of some Entity. 
Be aware that you have to create the class which extends the generic `Repository<T>` and decorate it with `EntityRepository<T>` decorator.

Example using constructor injection:

```typescript
import { Service } from "typedi";
import { Repository, EntityRepository } from "typeorm";
import { OrmRepository } from "typeorm-typedi-extensions";
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
        @OrmRepository()
        private readonly userRepository: UserRepository,
    ) {}

    public async userExist(user: User): boolean {
        return await this.userRepository.findByEmail(user.email) ? true : false;
    }

}
```

Optionally, you can specify a connection name in the decorator parameters.

```ts
@Service()
export class PostService {
    
    @OrmRepository("custom-con-name")
    private userRepository: UserRepository;
    
}
```

## Samples

Take a look on samples in [./sample](sample) for examples of usages.
