import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import istanbul from 'rollup-plugin-istanbul'
import vue from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'

import pkg from './package.json'
let external = Object.keys(pkg.dependencies)
let plugins = [
    css(),
    vue({ css: false })
]

if (process.env.BUILD !== 'production') {
    plugins.push(istanbul({
        exclude: ['test/**/*', 'node_modules/**/*']
    }))
}

export default [
	{
		input: 'src/main.js',
		output: {
			name: 'vpin',
			file: pkg.browser,
            format: 'umd',
            exports: 'named'
		},
		plugins: [
			resolve(),
            commonjs(),
            ...plugins
		]
	},
	{
		input: 'src/main.js',
        // external: external,
        plugins: [
            commonjs(),
            ...plugins
        ],
		output: [
			{ file: pkg.main, format: 'cjs', exports: 'named' },
			{ file: pkg.module, format: 'es', exports: 'named' }
		]
	}
]