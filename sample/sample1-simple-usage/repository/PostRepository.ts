import {Repository, EntityManager} from "typeorm";
import {Service} from "typedi";
import {Post} from "../entity/Post";
import {OrmRepository} from "../../../src/decorators/OrmRepository";
import {OrmEntityManager} from "../../../src/decorators/OrmEntityManager";

@Service()
export class PostRepository {

    @OrmEntityManager()
    private entityManager: EntityManager;

    constructor(@OrmRepository(Post) private ormRepository: Repository<Post>) {
    }

    saveUsingRepository(post: Post) {
        return this.ormRepository.persist(post);
    }

    saveUsingManager(post: Post) {
        return this.entityManager.persist(post);
    }

    findAll() {
        return this.ormRepository.find();
    }

}