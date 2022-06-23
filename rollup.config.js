import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

import vue from "rollup-plugin-vue";
import css from "rollup-plugin-css-only";

import pkg from "./package.json";

const name = "vpin";

const plugins = [
  resolve(),
  commonjs(),
  vue({ css: false }),
  css({ output: `${name}.css` })
];
/**
 * key为包名称，value为全局引用的值
 * example: const globals = { jquery: "$" };
 */
const globals = {};

export default [
  {
    input: "src/main.js",
    output: [
      { //cjs setting
        name,
        file: pkg.main,
        format: "cjs",
        exports: "named",
        globals
      },
      { //esm setting
        name,
        file: pkg.module,
        format: "es",
        exports: "named",
        globals
      },
    ],
    plugins,
    external: Object.keys(globals),
  },
  {
    input: "src/brower.js",
    output: [
      { //umd setting
        name:name.replace("-","_"),
        file: `dist/${name}.umd.js`,
        format: "umd",
        exports: "named",
        extend: true,
        compact: true
      },
    ],
    plugins: [...plugins, babel()]
  },
  {
    input: "src/brower.js",
    output: [
      { //umd setting
        name:name.replace("-","_"),
        file: `dist/${name}.umd.min.js`,
        format: "umd",
        exports: "named",
        extend: true,
        compact: true
      },
    ],
    plugins: [...plugins, babel(), terser({ output: { comments: false } })]
  }
];
