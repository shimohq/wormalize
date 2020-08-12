declare function wormalize(): any;
/*!
 * Copyright 2018 yangjunbao <yangjunbao@shimo.im>. All rights reserved.
 * @since 2018-08-14 14:58:08
 */

declare module 'wormalize' {
  export class Schema {
    readonly name: string;
    readonly idProperty: string;
    readonly isPlain: boolean;

    constructor(name: string, idProperty?: string);

    define(properties: Record<string, Schema | [Schema]>): void;

    forEachNestedSchema(
      iter: (
        value: [string, Schema | [Schema]],
        index: number,
        context: this,
      ) => void,
    ): void;
  }

  export type TSchema = { [P: string]: TSchema } | [Schema] | Schema;

  export interface Entity<K extends string | number = string> {
    result: K[];
    entities: Record<string, Record<string, any>>;
  }

  export function wormalize<K extends string | number>(
    input: any,
    schema: TSchema,
  ): Entity<K>;

  export function dewormalize<K extends string | number>(
    result: K[],
    schema: TSchema,
    entities:
      | Record<string, Record<string, any>>
      | ((name: string, id: number | string) => any),
  ): any;
}
