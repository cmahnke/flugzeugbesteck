import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import stylelint from "vite-plugin-stylelint";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { NodePackageImporter } from "sass";

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
      watch: { reloadPageOnChange: true },
      targets: [
        {
          src: "images/*",
          dest: ""
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
      input: {
        main: resolve(__dirname, "index.html"),
        home: resolve(__dirname, "home.html"),
        collection: resolve(__dirname, "collection.html"),
        detail: resolve(__dirname, "detail.html"),
        about: resolve(__dirname, "about.html")
      },
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
        importers: [new NodePackageImporter()]
      }
    }
  }
});
