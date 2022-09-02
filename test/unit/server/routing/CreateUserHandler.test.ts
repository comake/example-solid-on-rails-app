import { guardedStreamFrom, readJsonStream } from '@comake/skl-app-server';
import type { TypeOrmDataMapper } from '@comake/skl-app-server';
import type { Repository } from 'typeorm';
import { CreateUserHandler } from '../../../../src/server/routing/CreateUserHandler';

describe('A CreateUserHandler', (): void => {
  const userData = { name: 'Adler Faulkner' };
  let dataMapper: TypeOrmDataMapper;
  let handler: CreateUserHandler;
  let getRepository: () => Repository<any>;
  let repository: Repository<any>;
  let setHeader: any;
  let hasHeader: any;

  beforeEach(async(): Promise<void> => {
    repository = {
      save: jest.fn().mockImplementation((input): any => input),
      create: jest.fn().mockImplementation((input): any => input),
    } as any;
    getRepository = jest.fn().mockReturnValue(repository);
    dataMapper = { getRepository } as any;
    setHeader = jest.fn();
    hasHeader = jest.fn().mockReturnValue(false);
    handler = new CreateUserHandler(dataMapper);
  });

  it('throws an error if the user parameter is not set.', async(): Promise<void> => {
    const input = {
      request: {
        data: guardedStreamFrom(JSON.stringify({ foo: 'bar' })),
      } as any,
      response: {} as any,
    };
    await expect(handler.handle(input)).rejects.toThrow('param is missing or the value is empty: user');
  });

  it('creates a user and returns a success response with the user.', async(): Promise<void> => {
    const input = {
      request: {
        data: guardedStreamFrom(JSON.stringify({ user: userData })),
      } as any,
      response: { setHeader, hasHeader } as any,
    };
    const res = await handler.handle(input);
    expect(res.statusCode).toBe(201);
    const json = await readJsonStream(res.data!);
    expect(json).toEqual(userData);
    expect(getRepository).toHaveBeenCalledTimes(1);
    expect(getRepository).toHaveBeenCalledWith('User');
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith(userData);
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledWith(userData);
    expect(setHeader).toHaveBeenCalledTimes(1);
    expect(setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
  });
});
