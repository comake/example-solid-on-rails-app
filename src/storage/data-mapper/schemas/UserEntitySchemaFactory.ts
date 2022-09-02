import { baseColumnSchemaPart, TypeOrmEntitySchemaFactory } from '@comake/skl-app-server';

export interface User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
}

/**
 * An example {@link TypeOrmEntitySchemaFactory}. Models a User schema with base columns and a name.
 */
export class UserEntitySchemaFactory extends TypeOrmEntitySchemaFactory<User> {
  protected readonly schema = {
    name: 'User',
    columns: {
      ...baseColumnSchemaPart,
      name: {
        type: String,
      },
    },
  };
}
