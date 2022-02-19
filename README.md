# svelte playground

This is a svelte frontend skeleton, with auth, i18n, db and ui features, that has a scalable approach and aims to be deployed configurable through a user.

This is a project from https://github.com/sveltejs/template. (Typescript usage)

To use it with backend, you need to include a .env file (see example) with supabase credentials for auth and the other services.

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

## Roadmap
- example use cases for this svelte frontend skeleton 
- inlude tests and build-minify wrapper + security relevant features.
- dockerfile and scalable configuration for usage with loadbalancers.
- auth + db wrapper with .env configuration to enable different auth-providers (firebase auth + storage, keycloak + mongodb, ...) and db providers via environment variable


## Get started

Install the dependencies...

```bash
cd svelte-auth
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:3000](http://localhost:3000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

## Tauri App

If you plan on using the Tauri implementation, please read the tutorials and information on breaking changes and security on their [website](https://tauri.studio/)

If you delete the src-tauri folder, you can create your own config with:

```bash
npm run tauri init
```

Using the included config you need to run:

```bash
npm run tauri dev
```

This will only work, if you run the dev server of the svelte webapp in a different terminal, as it uses the localhost in dev-mode.

```bash
npm run dev
```

To build your project:

```bash
npm run tauri build
```