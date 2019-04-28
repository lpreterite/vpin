import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'
import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'

import pkg from './package.json'

const sourcemap = true

const plugins = []
if(process.env.BUILD === 'production'){
	plugins.push(terser({ sourcemap }))
}

export default [
	{
		input: 'src/main.js',
		output: [
			{ name: 'vpin', file: pkg.main, format: 'cjs', exports: 'named', sourcemap },
			{ name: 'vpin', file: pkg.module, format: 'es', exports: 'named', sourcemap }
		],
        plugins: [
			resolve(),
            commonjs(),
			css(),
			vue({ css: false }),
			...plugins
        ]
	},
	{
		input: 'src/main.js',
		output: [
            { name: 'vpin', file: pkg.pkg, format: 'umd', exports: 'named', sourcemap },
		],
        plugins: [
			resolve(),
            commonjs(),
			css(),
			vue({ css: false }),
			babel({ exclude: 'node_modules/**', runtimeHelpers: true }),
			...plugins
		]
	}
]