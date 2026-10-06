# payz-docs

Customer and developer documentation for Payz, including product and privacy guidance, the API reference, and the OpenAPI specification in `spec/openapi.yaml`.

## Workspace dependency

The documentation site imports the separately maintained `payz-sdk` package. Keep both repositories in the same pnpm workspace; this repository does not vendor SDK source.

## Local development

Use Node.js 22 or newer and pnpm 10. Clone both repositories into `repos/`, then copy this repository's workspace files to the workspace root:

```sh
mkdir -p repos
git clone https://github.com/payz-world/payz-docs.git repos/payz-docs
git clone https://github.com/payz-world/payz-sdk.git repos/payz-sdk
cp repos/payz-docs/development/package.json ./package.json
cp repos/payz-docs/development/pnpm-workspace.yaml ./pnpm-workspace.yaml
cp repos/payz-docs/development/tsconfig.base.json ./tsconfig.base.json
pnpm install
```

Run the documentation site and its checks from the workspace root:

```sh
pnpm dev
pnpm typecheck
pnpm build
```

The live network and asset reference needs the Payz API routed to the same origin. Set `BASE_PATH` only when serving the site below a URL prefix; `PORT` selects the local Vite server port.

## License

This project is licensed under Apache-2.0. See [LICENSE](LICENSE) for the full license text.
