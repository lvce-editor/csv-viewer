import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'

export const bundleExtensionMain = async (input, outFile) => {
  const bundle = await rollup({
    input,
    external: ['@lvce-editor/api'],
    preserveEntrySignatures: 'strict',
    treeshake: {
      propertyReadSideEffects: false,
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        presets: [pluginTypeScript],
      }),
      nodeResolve(),
    ],
  })

  await bundle.write({
    file: outFile,
    format: 'es',
    sourcemap: false,
    inlineDynamicImports: true,
    freeze: false,
    minifyInternalExports: false,
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
    hoistTransitiveImports: false,
  })
}
