## DDP Connection

Currently the problem is that your Meteor's client still tries to connect to DDP, even if you disable websockets it tries to fallback to sockjs. You cannot have both DDP and GraphQL Websockets at the same time.

You have several options:

1.  Start your Meteor app with `DISABLE_WEBSOCKETS=true meteor run` and use the ddp-silencer
2.  Create a new minimal Meteor app that only uses npm packages and copy what is inside this package's `client/index.js` and adapt it properly

If you do not have the desire to built another app, you could use this package, which basically disabled connecting to DDP from the client at all.

What it does, it overrides the ddp-client package, and conditionally connects to DDP.

```
mkdir packages
cd packages
git clone https://github.com/cult-of-coders/ddp-silencer
```

And that's about it, used in conjunction with `DISABLE_WEBSOCKETS` is perfect.

The problem is that many useful packages in `Meteor` depend on `DDP`, it's not a problem if that happens server-side (at the expense of few hundred kbs), but it's a problem on the client, where few hundred kbs make a difference.

The logic here is that you can use `ddp-silencer`, and when your app wants to scale and it makes sense, you can think about a separate Meteor app that is designated for the client only, and from which you connect to your `api` with ease.

---

### [Table of Contents](index.md)
