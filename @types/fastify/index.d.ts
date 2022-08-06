/* eslint @typescript-eslint/no-unused-vars: 0 */

import fastify from 'fastify';
import { ReadUserDTO } from '../../lib/identity/services/user.service';

declare module 'fastify' {
  export interface FastifyRequest<RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    SchemaCompiler extends FastifySchema = FastifySchema,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
    ContextConfig = ContextConfigDefault,
    RequestType extends FastifyRequestType = ResolveFastifyRequestType<TypeProvider, SchemaCompiler, RouteGeneric>,
    Logger extends FastifyLoggerInstance = FastifyLoggerInstance
  > {
    user: ReadUserDTO;
  }
}
