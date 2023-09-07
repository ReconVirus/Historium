import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import styles from "rollup-plugin-styles";

const isDev = process.env.NODE_ENV === 'development';

export default {
    input: './src/Main.ts',
    output: {
        dir: isDev ? '.' : '/dist/',
        sourcemap: 'inline',
        format: 'cjs',
        exports: 'default'
    },
    external: ['obsidian', 'crypto'],
    plugins: [
        typescript(),
        styles(),
        nodeResolve({browser: true}),
        commonjs(),
    ]
};