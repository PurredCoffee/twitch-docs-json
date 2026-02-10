This Repository is intended to be used for code generation from the Twitch API documentation.

for the API, `scopes.json` needs to be manually maintained due to twitch's documentation being inconsistent in how it lists authentication requirements. The API endpoints are generated from the Twitch API documentation, and the scopes are manually sourced from scopes.json.

to generate `docs.json` run `node API/codeGen.js` and then update scopes.json if there is a warning about updated scopes (they will be marked with `TODO`). Afterwards rerun `node API/codeGen.js` to update `docs.json` with the correct scopes.

This repository currently treats the twitch docs as the source of truth, this is a bug because the docs are wrong regarding some query parameters and return types. Types will be manually patched soon!