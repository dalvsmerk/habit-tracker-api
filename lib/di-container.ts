import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix/lib/classic';
import { asClass, asFunction, Lifetime } from 'awilix';
import { FastifyInstance } from 'fastify';
import knex from 'knex';
import { CacheService } from './common/services/cache.service';
import { CryptoService } from './common/services/crypto.service';
import { config } from './config';
import { HabitGoalRepository } from './habits/repositories/habit-goal.repository';
import { HabitRepository } from './habits/repositories/habit.repository';
import { HabitService } from './habits/services/habit.service';
import { UserRepository } from './identity/repositories/user.repository';
import { AuthService } from './identity/services/auth.service';
import { PasswordService } from './identity/services/password.service';
import { UserService } from './identity/services/user.service';

export function registerDependencies(server: FastifyInstance) {
  server.register(fastifyAwilixPlugin, { disposeOnClose: true, disposeOnResponse: true });

  const defaultDiOptions = {
    lifetime: Lifetime.SINGLETON,
  };

  diContainer.register({
    config: asFunction(() => config, defaultDiOptions),
    knex: asFunction(() => knex(config.db), defaultDiOptions),
    cacheService: asClass(CacheService, defaultDiOptions),
    userService: asClass(UserService, defaultDiOptions),
    passwordService: asClass(PasswordService, defaultDiOptions),
    cryptoService: asClass(CryptoService, defaultDiOptions),
    userRepository: asClass(UserRepository, defaultDiOptions),
    authService: asClass(AuthService, defaultDiOptions),
    habitRepository: asClass(HabitRepository, defaultDiOptions),
    habitGoalRepository: asClass(HabitGoalRepository, defaultDiOptions),
    habitService: asClass(HabitService, defaultDiOptions),
  });

  return diContainer;
}
