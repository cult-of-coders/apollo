# 0.7.0

- Built-in support for Uploads
- Moved `schemaDirectives` and `context` to the main Apollo options and they are blended in properly

# 0.6.0

Morpher has changed the way it receives inputs, being serialised via EJSON.

# 0.5.0

If you're comming from 0.4.0, you will need to look at `initialize` from server inside [docs/settings.md](docs/settings.md) and adapt it properly.

GraphiQL has disappeared, you are now using Playground, accessible in development on:
http://localhost:3000/graphql
