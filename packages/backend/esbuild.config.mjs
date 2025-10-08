import * as esbuild from 'esbuild';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Plugin to inline .graphql files as strings
const graphqlPlugin = {
  name: 'graphql',
  setup(build) {
    build.onLoad({ filter: /\.graphql$/ }, async (args) => {
      const contents = readFileSync(args.path, 'utf8');
      return {
        contents: `export default ${JSON.stringify(contents)}`,
        loader: 'js',
      };
    });
  },
};

await esbuild.build({
  entryPoints: ['src/handlers/graphql.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'dist/index.mjs',
  external: ['@aws-sdk/*'],
  plugins: [graphqlPlugin],
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
});
