pg-simple-migration
===================

Simple migration tool using pg-promise

## Install

```sh
$ npm install pg-simple-migration
```

## Use

### Environment Variables

| Environment Variables |  Description          |
| --------------------- | --------------------- |
| DB_HOST               | Postgres ip address or domain name |
| DB_DATABASE           | Name of database to connect to |
| DB_USER               | Username of database user |
| DB_PASSWORD           | Password of database user |
| MIGRATIONS_PATH       | Path of the migration files |

### Commands

Create migaration file

```sh
$ npx pg-simple-migration create [comment]
```

Execute migarations

```sh
$ npx pg-simple-migration up
```


## License

[MIT License](http://www.opensource.org/licenses/MIT).