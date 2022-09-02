import { readJsonStream } from '@comake/skl-app-server';
import type { TypeOrmDataMapper } from '@comake/skl-app-server';
import type { Repository } from 'typeorm';
import { GetUserHandler } from '../../../../src/server/routing/GetUserHandler';

describe('A GetUserHandler', (): void => {
  let dataMapper: TypeOrmDataMapper;
  let handler: GetUserHandler;
  let getRepository: () => Repository<any>;
  let repository: Repository<any>;
  let setHeader: any;
  let hasHeader: any;
  let findResponse: any;

  beforeEach(async(): Promise<void> => {
    repository = {
      findOneBy: jest.fn().mockImplementation((): any => findResponse),
    } as any;
    getRepository = jest.fn().mockReturnValue(repository);
    dataMapper = { getRepository } as any;
    setHeader = jest.fn();
    hasHeader = jest.fn().mockReturnValue(false);
    handler = new GetUserHandler(dataMapper);
  });

  it('throws an error if the id parameter is not set in the request path params.', async(): Promise<void> => {
    const input = {
      request: {} as any,
      response: {} as any,
    };
    await expect(handler.handle(input)).rejects.toThrow('Id parameter required.');
  });

  it('throws an error if the user could not be found.', async(): Promise<void> => {
    const input = {
      request: {
        pathParams: { id: 1 },
      } as any,
      response: {} as any,
    };
    await expect(handler.handle(input)).rejects.toThrow('Could not find user with id: 1');
    expect(getRepository).toHaveBeenCalledTimes(1);
    expect(getRepository).toHaveBeenCalledWith('User');
    expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('returns an ok response with the found user.', async(): Promise<void> => {
    findResponse = { id: 1, name: 'Adler Faulkner' };
    const input = {
      request: {
        pathParams: { id: 1 },
      } as any,
      response: { setHeader, hasHeader } as any,
    };
    const res = await handler.handle(input);
    expect(res.statusCode).toBe(200);
    const json = await readJsonStream(res.data!);
    expect(json).toEqual(findResponse);
    expect(getRepository).toHaveBeenCalledTimes(1);
    expect(getRepository).toHaveBeenCalledWith('User');
    expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(setHeader).toHaveBeenCalledTimes(1);
    expect(setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
  });
});
