import {
  CreatedResponseDescription,
  APPLICATION_JSON,
  addHeader,
  guardedStreamFromJson,
  readJsonStream,
  ParsedRequestHandler,
} from '@comake/skl-app-server';
import type { ResponseDescription, TypeOrmDataMapper, ParsedRequestHandlerInput } from '@comake/skl-app-server';
import type { User } from '../../storage/data-mapper/schemas/UserEntitySchemaFactory';

/**
 *
 */
export class CreateUserHandler extends ParsedRequestHandler {
  private readonly dataMapper: TypeOrmDataMapper;

  public constructor(dataMapper: TypeOrmDataMapper) {
    super();
    this.dataMapper = dataMapper;
  }

  public async handle(input: ParsedRequestHandlerInput): Promise<ResponseDescription> {
    const params = await readJsonStream(input.request.data);
    if (!params.user) {
      // Should validate parameters
      throw new Error('param is missing or the value is empty: user');
    }
    const userRepository = this.dataMapper.getRepository<User>('User');
    let user = userRepository.create(params.user as Partial<User>);
    user = await userRepository.save(user);
    const data = guardedStreamFromJson(user);

    addHeader(input.response, 'Content-Type', APPLICATION_JSON);
    return new CreatedResponseDescription(data);
  }
}
