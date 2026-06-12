import { resolve, join } from "node:path";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import stylelint from "vite-plugin-stylelint";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { NodePackageImporter } from "sass";
import { optimize } from "svgo";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  server: {
    fs: {
      allow: [".", resolve(__dirname), resolve(__dirname, "../Images")]
    }
  },
  base: "./",
  plugins: [
    stylelint({ build: true, dev: false, lintOnStart: true }),
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, "../Images/logo.svg"),
          dest: "assets",
          transform: (content) => optimize(content.toString(), { multipass: true }).data,
          watch: { reloadPage: true }
        }
      ]
    })
  ],
  publicDir: false,
  build: {
    target: "esnext",
    assetsInlineLimit: 0,
    commonjsOptions: { transformMixedEsModules: true },
    rollupOptions: {
      output: {
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  resolve: {
    preserveSymlinks: true,
    alias: [
      {
        find: /~(.+)/,
        replacement: join(process.cwd(), "node_modules/$1")
      }
    ]
  },
  optimizeDeps: {
    exclude: ["three"]
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        importers: [new NodePackageImporter()]
      }
    }
  }
});
