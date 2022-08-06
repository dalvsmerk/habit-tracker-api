# RESTful API for HabitTracker

## How to run

### Development

```shell
npm ci
npm run migrate:up
npm run watch
```

### Production

```shell
npm ci --omit=dev
npm run migrate:up
npm start
```
