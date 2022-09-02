import {
  OkResponseDescription,
  APPLICATION_JSON,
  NotFoundHttpError,
  addHeader,
  guardedStreamFromJson,
  ParsedRequestHandler,
} from '@comake/skl-app-server';
import type { ResponseDescription, TypeOrmDataMapper, ParsedRequestHandlerInput } from '@comake/skl-app-server';
import type { User } from '../../storage/data-mapper/schemas/UserEntitySchemaFactory';

/**
 *
 */
export class GetUserHandler extends ParsedRequestHandler {
  private readonly dataMapper: TypeOrmDataMapper;

  public constructor(dataMapper: TypeOrmDataMapper) {
    super();
    this.dataMapper = dataMapper;
  }

  public async handle(input: ParsedRequestHandlerInput): Promise<ResponseDescription> {
    if (!input.request.pathParams?.id) {
      throw new Error('Id parameter required.');
    }
    const id = Number.parseInt(input.request.pathParams.id, 10);
    const userRepository = this.dataMapper.getRepository<User>('User');
    const user = await userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundHttpError(`Could not find user with id: ${id}`);
    }

    const data = guardedStreamFromJson(user);
    addHeader(input.response, 'Content-Type', APPLICATION_JSON);
    return new OkResponseDescription(data);
  }
}
