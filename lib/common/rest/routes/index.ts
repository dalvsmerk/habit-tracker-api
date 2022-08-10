import { AwilixContainer } from 'awilix';
import { RouteShorthandOptionsWithHandler } from 'fastify';

export type DiRoute = (container: AwilixContainer) => RouteShorthandOptionsWithHandler;
