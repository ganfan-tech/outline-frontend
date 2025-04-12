import path from "path";
import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { webpackStats } from "rollup-plugin-webpack-stats";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const devProxyServer = "http://localhost:3000";

export default () =>
  defineConfig({
    root: "./",
    publicDir: "./server/static",
    server: {
      port: 7001,
      host: true,
      proxy: {
        "^/api": {
          target: devProxyServer,
          xfwd: true,
        },
        "^/memos.api.v1": {
          target: devProxyServer,
          xfwd: true,
        },
        "^/file": {
          target: devProxyServer,
          xfwd: true,
        },
      },
      fs: { strict: true },
    },
    plugins: [
      // https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#readme
      react({
        babel: {
          env: {
            production: {
              plugins: [
                [
                  "babel-plugin-styled-components",
                  {
                    displayName: false,
                  },
                ],
              ],
            },
          },
          plugins: [
            [
              "babel-plugin-styled-components",
              {
                displayName: true,
                fileName: false,
              },
            ],
          ],
          parserOpts: {
            plugins: ["decorators-legacy", "classProperties"],
          },
        },
      }),
      // https://github.com/sapphi-red/vite-plugin-static-copy#readme
      viteStaticCopy({
        targets: [
          {
            src: "./public/images",
            dest: "./",
          },
        ],
      }),
      // Generate a stats.json file for webpack that will be consumed by RelativeCI
      webpackStats(),
    ],
    optimizeDeps: {
      esbuildOptions: {
        keepNames: true,
        define: {
          global: "globalThis",
        },
      },
    },
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./app"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
    build: {
      outDir: "./build/app",
      manifest: true,
      sourcemap: true,
      minify: "terser",
      // Prevent asset inling as it does not conform to CSP rules
      assetsInlineLimit: 0,
      target: browserslistToEsbuild(),
      reportCompressedSize: false,
      terserOptions: {
        keep_classnames: true,
        keep_fnames: true,
      },
      rollupOptions: {
        input: {
          index: "./app/index.tsx",
        },
        output: {
          assetFileNames: "assets/[name].[hash][extname]",
          chunkFileNames: "assets/[name].[hash].js",
          entryFileNames: "assets/[name].[hash].js",
        },
      },
    },
  });
