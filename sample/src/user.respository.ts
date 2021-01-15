import { EntityManager, Repository } from 'typeorm';
import { Service } from 'typedi';

/**
 * It's important that we import these from the index.ts file, because the 
 * entry point file runs some setup logic for the default container. 
 */
import { InjectRepository, InjectManager } from '../../src';
import { User } from './user.entity';

@Service()
export class UserRepository {

  @InjectManager()
  private entityManager!: EntityManager;

  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  saveUsingRepository(post: User) {
    return this.repository.save(post);
  }

  saveUsingManager(post: User) {
    return this.entityManager.save(post);
  }

  findAll() {
    return this.repository.find();
  }
}
