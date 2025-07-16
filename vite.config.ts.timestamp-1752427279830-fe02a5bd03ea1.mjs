// vite.config.ts
import { resolve } from "path";
import { loadEnv } from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/vite@5.2.12_@types+node@20.19.7_less@4.3.0_terser@5.43.1/node_modules/vite/dist/node/index.js";
import Vue from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.2.12_@types+node@20.19.7_less@4.3.0_terser@5.43.1__vue@3.4.27_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueJsx from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.2.0_vite@5.2.12_@types+node@20.19.7_less@4.3.0_terser@5.43.1__vue@3.4.27_typescript@5.4.5_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import progress from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/vite-plugin-progress@0.0.7_vite@5.2.12_@types+node@20.19.7_less@4.3.0_terser@5.43.1_/node_modules/vite-plugin-progress/dist/index.mjs";
import EslintPlugin from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/vite-plugin-eslint@1.8.1_eslint@8.57.1_vite@5.2.12_@types+node@20.19.7_less@4.3.0_terser@5.43.1_/node_modules/vite-plugin-eslint/dist/index.mjs";
import { ViteEjsPlugin } from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/vite-plugin-ejs@1.7.0_vite@5.2.12_@types+node@20.19.7_less@4.3.0_terser@5.43.1_/node_modules/vite-plugin-ejs/index.js";
import { viteMockServe } from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/vite-plugin-mock@2.9.6_mockjs@1.1.0_rollup@4.45.0_vite@5.2.12_@types+node@20.19.7_less@4.3.0_terser@5.43.1_/node_modules/vite-plugin-mock/dist/index.js";
import PurgeIcons from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/vite-plugin-purge-icons@0.10.0_vite@5.2.12_@types+node@20.19.7_less@4.3.0_terser@5.43.1_/node_modules/vite-plugin-purge-icons/dist/index.mjs";
import ServerUrlCopy from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/vite-plugin-url-copy@1.1.4_vite@5.2.12_@types+node@20.19.7_less@4.3.0_terser@5.43.1_/node_modules/vite-plugin-url-copy/dist/index.js";
import VueI18nPlugin from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/@intlify+unplugin-vue-i18n@4.0.0_rollup@4.45.0_vue-i18n@9.13.1_vue@3.4.27_typescript@5.4.5__/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { createSvgIconsPlugin } from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.2.12_@types+node@20.19.7_less@4.3.0_terser@5.43.1_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import { createStyleImportPlugin, ElementPlusResolve } from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/vite-plugin-style-import@2.0.0_vite@5.2.12_@types+node@20.19.7_less@4.3.0_terser@5.43.1_/node_modules/vite-plugin-style-import/dist/index.mjs";
import UnoCSS from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/unocss@0.60.4_postcss@8.5.6_rollup@4.45.0_vite@5.2.12_@types+node@20.19.7_less@4.3.0_terser@5.43.1_/node_modules/unocss/dist/vite.mjs";
import { visualizer } from "file:///D:/UWeb/qiluo/qiluo_vue/node_modules/.pnpm/rollup-plugin-visualizer@5.14.0_rollup@4.45.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_dirname = "D:\\UWeb\\qiluo\\qiluo_vue";
var root = process.cwd();
function pathResolve(dir) {
  return resolve(root, ".", dir);
}
var vite_config_default = ({ command, mode }) => {
  let env = {};
  const isBuild = command === "build";
  if (!isBuild) {
    env = loadEnv(process.argv[3] === "--mode" ? process.argv[4] : process.argv[3], root);
  } else {
    env = loadEnv(mode, root);
  }
  return {
    base: env.VITE_BASE_PATH,
    plugins: [
      Vue({
        script: {
          defineModel: true
        }
      }),
      VueJsx(),
      ServerUrlCopy(),
      progress(),
      env.VITE_USE_ALL_ELEMENT_PLUS_STYLE === "false" ? createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [
          {
            libraryName: "element-plus",
            esModule: true,
            resolveStyle: (name) => {
              if (name === "click-outside") {
                return "";
              }
              return `element-plus/es/components/${name.replace(/^el-/, "")}/style/css`;
            }
          }
        ]
      }) : void 0,
      EslintPlugin({
        cache: false,
        include: ["src/**/*.vue", "src/**/*.ts", "src/**/*.tsx"]
        // 检查的文件
      }),
      VueI18nPlugin({
        runtimeOnly: true,
        compositionOnly: true,
        include: [resolve(__vite_injected_original_dirname, "src/locales/**")]
      }),
      createSvgIconsPlugin({
        iconDirs: [pathResolve("src/assets/svgs")],
        symbolId: "icon-[dir]-[name]",
        svgoOptions: true
      }),
      PurgeIcons(),
      env.VITE_USE_MOCK === "true" ? viteMockServe({
        ignore: /^\_/,
        mockPath: "mock",
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer'

          setupProdMockServer()
          `
      }) : void 0,
      ViteEjsPlugin({
        title: env.VITE_APP_TITLE
      }),
      UnoCSS()
    ],
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "./src/styles/variables.module.less";',
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".less", ".css"],
      alias: [
        {
          find: "vue-i18n",
          replacement: "vue-i18n/dist/vue-i18n.cjs.js"
        },
        {
          find: /\@\//,
          replacement: `${pathResolve("src")}/`
        }
      ]
    },
    esbuild: {
      pure: env.VITE_DROP_CONSOLE === "true" ? ["console.log"] : void 0,
      drop: env.VITE_DROP_DEBUGGER === "true" ? ["debugger"] : void 0
    },
    build: {
      target: "es2015",
      outDir: env.VITE_OUT_DIR || "dist",
      sourcemap: env.VITE_SOURCEMAP === "true",
      // brotliSize: false,
      rollupOptions: {
        plugins: env.VITE_USE_BUNDLE_ANALYZER === "true" ? [visualizer()] : void 0,
        // 拆包
        output: {
          manualChunks: {
            "vue-chunks": ["vue", "vue-router", "pinia", "vue-i18n"],
            "element-plus": ["element-plus"],
            "wang-editor": ["@wangeditor/editor", "@wangeditor/editor-for-vue"],
            echarts: ["echarts", "echarts-wordcloud"]
          }
        }
      },
      cssCodeSplit: !(env.VITE_USE_CSS_SPLIT === "false"),
      cssTarget: ["chrome31"]
    },
    server: {
      port: 4e3,
      proxy: {
        // 选项写法
        "/api": {
          target: "http://127.0.0.1:5001",
          changeOrigin: true,
          rewrite: (path) => path
        }
      },
      hmr: {
        overlay: false
      },
      host: "0.0.0.0"
    },
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "vue-types",
        "element-plus/es/locale/lang/zh-cn",
        "element-plus/es/locale/lang/en",
        "@iconify/iconify",
        "@vueuse/core",
        "axios",
        "qs",
        "echarts",
        "echarts-wordcloud",
        "qrcode",
        "@wangeditor/editor",
        "@wangeditor/editor-for-vue",
        "vue-json-pretty",
        "@zxcvbn-ts/core",
        "dayjs",
        "cropperjs"
      ]
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVV2ViXFxcXHFpbHVvXFxcXHFpbHVvX3Z1ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVVdlYlxcXFxxaWx1b1xcXFxxaWx1b192dWVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VXZWIvcWlsdW8vcWlsdW9fdnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXHJcbmltcG9ydCB7IGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdHlwZSB7IFVzZXJDb25maWcsIENvbmZpZ0VudiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCBWdWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgVnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcbmltcG9ydCBwcm9ncmVzcyBmcm9tICd2aXRlLXBsdWdpbi1wcm9ncmVzcydcclxuaW1wb3J0IEVzbGludFBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnXHJcbmltcG9ydCB7IFZpdGVFanNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1lanMnXHJcbmltcG9ydCB7IHZpdGVNb2NrU2VydmUgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJ1xyXG5pbXBvcnQgUHVyZ2VJY29ucyBmcm9tICd2aXRlLXBsdWdpbi1wdXJnZS1pY29ucydcclxuaW1wb3J0IFNlcnZlclVybENvcHkgZnJvbSAndml0ZS1wbHVnaW4tdXJsLWNvcHknXHJcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gJ0BpbnRsaWZ5L3VucGx1Z2luLXZ1ZS1pMThuL3ZpdGUnXHJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJ1xyXG5pbXBvcnQgeyBjcmVhdGVTdHlsZUltcG9ydFBsdWdpbiwgRWxlbWVudFBsdXNSZXNvbHZlIH0gZnJvbSAndml0ZS1wbHVnaW4tc3R5bGUtaW1wb3J0J1xyXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJyAgXHJcblxyXG5jb25zdCByb290ID0gcHJvY2Vzcy5jd2QoKVxyXG5cclxuZnVuY3Rpb24gcGF0aFJlc29sdmUoZGlyOiBzdHJpbmcpIHtcclxuICByZXR1cm4gcmVzb2x2ZShyb290LCAnLicsIGRpcilcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHsgY29tbWFuZCwgbW9kZSB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnID0+IHtcclxuICBsZXQgZW52ID0ge30gYXMgYW55XHJcbiAgY29uc3QgaXNCdWlsZCA9IGNvbW1hbmQgPT09ICdidWlsZCdcclxuICBpZiAoIWlzQnVpbGQpIHtcclxuICAgIGVudiA9IGxvYWRFbnYocHJvY2Vzcy5hcmd2WzNdID09PSAnLS1tb2RlJyA/IHByb2Nlc3MuYXJndls0XSA6IHByb2Nlc3MuYXJndlszXSwgcm9vdClcclxuICB9IGVsc2Uge1xyXG4gICAgZW52ID0gbG9hZEVudihtb2RlLCByb290KVxyXG4gIH1cclxuICByZXR1cm4ge1xyXG4gICAgYmFzZTogZW52LlZJVEVfQkFTRV9QQVRILFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICBWdWUoe1xyXG4gICAgICAgIHNjcmlwdDoge1xyXG4gICAgICAgICAgZGVmaW5lTW9kZWw6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG4gICAgICBWdWVKc3goKSxcclxuICAgICAgU2VydmVyVXJsQ29weSgpLFxyXG4gICAgICBwcm9ncmVzcygpLFxyXG4gICAgICBlbnYuVklURV9VU0VfQUxMX0VMRU1FTlRfUExVU19TVFlMRSA9PT0gJ2ZhbHNlJ1xyXG4gICAgICAgID8gY3JlYXRlU3R5bGVJbXBvcnRQbHVnaW4oe1xyXG4gICAgICAgICAgICByZXNvbHZlczogW0VsZW1lbnRQbHVzUmVzb2x2ZSgpXSxcclxuICAgICAgICAgICAgbGliczogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxpYnJhcnlOYW1lOiAnZWxlbWVudC1wbHVzJyxcclxuICAgICAgICAgICAgICAgIGVzTW9kdWxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZVN0eWxlOiAobmFtZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2NsaWNrLW91dHNpZGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGBlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy8ke25hbWUucmVwbGFjZSgvXmVsLS8sICcnKX0vc3R5bGUvY3NzYFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICA6IHVuZGVmaW5lZCxcclxuICAgICAgRXNsaW50UGx1Z2luKHtcclxuICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgaW5jbHVkZTogWydzcmMvKiovKi52dWUnLCAnc3JjLyoqLyoudHMnLCAnc3JjLyoqLyoudHN4J10gLy8gXHU2OEMwXHU2N0U1XHU3Njg0XHU2NTg3XHU0RUY2XHJcbiAgICAgIH0pLFxyXG4gICAgICBWdWVJMThuUGx1Z2luKHtcclxuICAgICAgICBydW50aW1lT25seTogdHJ1ZSxcclxuICAgICAgICBjb21wb3NpdGlvbk9ubHk6IHRydWUsXHJcbiAgICAgICAgaW5jbHVkZTogW3Jlc29sdmUoX19kaXJuYW1lLCAnc3JjL2xvY2FsZXMvKionKV1cclxuICAgICAgfSksXHJcbiAgICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgICBpY29uRGlyczogW3BhdGhSZXNvbHZlKCdzcmMvYXNzZXRzL3N2Z3MnKV0sXHJcbiAgICAgICAgc3ltYm9sSWQ6ICdpY29uLVtkaXJdLVtuYW1lXScsXHJcbiAgICAgICAgc3Znb09wdGlvbnM6IHRydWVcclxuICAgICAgfSksXHJcbiAgICAgIFB1cmdlSWNvbnMoKSxcclxuICAgICAgZW52LlZJVEVfVVNFX01PQ0sgPT09ICd0cnVlJ1xyXG4gICAgICAgID8gdml0ZU1vY2tTZXJ2ZSh7XHJcbiAgICAgICAgICAgIGlnbm9yZTogL15cXF8vLFxyXG4gICAgICAgICAgICBtb2NrUGF0aDogJ21vY2snLFxyXG4gICAgICAgICAgICBsb2NhbEVuYWJsZWQ6ICFpc0J1aWxkLFxyXG4gICAgICAgICAgICBwcm9kRW5hYmxlZDogaXNCdWlsZCxcclxuICAgICAgICAgICAgaW5qZWN0Q29kZTogYFxyXG4gICAgICAgICAgaW1wb3J0IHsgc2V0dXBQcm9kTW9ja1NlcnZlciB9IGZyb20gJy4uL21vY2svX2NyZWF0ZVByb2R1Y3Rpb25TZXJ2ZXInXHJcblxyXG4gICAgICAgICAgc2V0dXBQcm9kTW9ja1NlcnZlcigpXHJcbiAgICAgICAgICBgXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICBWaXRlRWpzUGx1Z2luKHtcclxuICAgICAgICB0aXRsZTogZW52LlZJVEVfQVBQX1RJVExFXHJcbiAgICAgIH0pLFxyXG4gICAgICBVbm9DU1MoKVxyXG4gICAgXSxcclxuXHJcbiAgICBjc3M6IHtcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIGxlc3M6IHtcclxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiAnQGltcG9ydCBcIi4vc3JjL3N0eWxlcy92YXJpYWJsZXMubW9kdWxlLmxlc3NcIjsnLFxyXG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGV4dGVuc2lvbnM6IFsnLm1qcycsICcuanMnLCAnLnRzJywgJy5qc3gnLCAnLnRzeCcsICcuanNvbicsICcubGVzcycsICcuY3NzJ10sXHJcbiAgICAgIGFsaWFzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogJ3Z1ZS1pMThuJyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiAndnVlLWkxOG4vZGlzdC92dWUtaTE4bi5janMuanMnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAvXFxAXFwvLyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBgJHtwYXRoUmVzb2x2ZSgnc3JjJyl9L2BcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBlc2J1aWxkOiB7XHJcbiAgICAgIHB1cmU6IGVudi5WSVRFX0RST1BfQ09OU09MRSA9PT0gJ3RydWUnID8gWydjb25zb2xlLmxvZyddIDogdW5kZWZpbmVkLFxyXG4gICAgICBkcm9wOiBlbnYuVklURV9EUk9QX0RFQlVHR0VSID09PSAndHJ1ZScgPyBbJ2RlYnVnZ2VyJ10gOiB1bmRlZmluZWRcclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICB0YXJnZXQ6ICdlczIwMTUnLFxyXG4gICAgICBvdXREaXI6IGVudi5WSVRFX09VVF9ESVIgfHwgJ2Rpc3QnLFxyXG4gICAgICBzb3VyY2VtYXA6IGVudi5WSVRFX1NPVVJDRU1BUCA9PT0gJ3RydWUnLFxyXG4gICAgICAvLyBicm90bGlTaXplOiBmYWxzZSxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIHBsdWdpbnM6IGVudi5WSVRFX1VTRV9CVU5ETEVfQU5BTFlaRVIgPT09ICd0cnVlJyA/IFt2aXN1YWxpemVyKCldIDogdW5kZWZpbmVkLFxyXG4gICAgICAgIC8vIFx1NjJDNlx1NTMwNVxyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgICd2dWUtY2h1bmtzJzogWyd2dWUnLCAndnVlLXJvdXRlcicsICdwaW5pYScsICd2dWUtaTE4biddLFxyXG4gICAgICAgICAgICAnZWxlbWVudC1wbHVzJzogWydlbGVtZW50LXBsdXMnXSxcclxuICAgICAgICAgICAgJ3dhbmctZWRpdG9yJzogWydAd2FuZ2VkaXRvci9lZGl0b3InLCAnQHdhbmdlZGl0b3IvZWRpdG9yLWZvci12dWUnXSxcclxuICAgICAgICAgICAgZWNoYXJ0czogWydlY2hhcnRzJywgJ2VjaGFydHMtd29yZGNsb3VkJ11cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGNzc0NvZGVTcGxpdDogIShlbnYuVklURV9VU0VfQ1NTX1NQTElUID09PSAnZmFsc2UnKSxcclxuICAgICAgY3NzVGFyZ2V0OiBbJ2Nocm9tZTMxJ11cclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcG9ydDogNDAwMCxcclxuICAgICAgcHJveHk6IHtcclxuICAgICAgICAvLyBcdTkwMDlcdTk4NzlcdTUxOTlcdTZDRDVcclxuICAgICAgICAnL2FwaSc6IHtcclxuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6NTAwMScsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgaG1yOiB7XHJcbiAgICAgICAgb3ZlcmxheTogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgaG9zdDogJzAuMC4wLjAnXHJcbiAgICB9LFxyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgIGluY2x1ZGU6IFtcclxuICAgICAgICAndnVlJyxcclxuICAgICAgICAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgJ3Z1ZS10eXBlcycsXHJcbiAgICAgICAgJ2VsZW1lbnQtcGx1cy9lcy9sb2NhbGUvbGFuZy96aC1jbicsXHJcbiAgICAgICAgJ2VsZW1lbnQtcGx1cy9lcy9sb2NhbGUvbGFuZy9lbicsXHJcbiAgICAgICAgJ0BpY29uaWZ5L2ljb25pZnknLFxyXG4gICAgICAgICdAdnVldXNlL2NvcmUnLFxyXG4gICAgICAgICdheGlvcycsXHJcbiAgICAgICAgJ3FzJyxcclxuICAgICAgICAnZWNoYXJ0cycsXHJcbiAgICAgICAgJ2VjaGFydHMtd29yZGNsb3VkJyxcclxuICAgICAgICAncXJjb2RlJyxcclxuICAgICAgICAnQHdhbmdlZGl0b3IvZWRpdG9yJyxcclxuICAgICAgICAnQHdhbmdlZGl0b3IvZWRpdG9yLWZvci12dWUnLFxyXG4gICAgICAgICd2dWUtanNvbi1wcmV0dHknLFxyXG4gICAgICAgICdAenhjdmJuLXRzL2NvcmUnLFxyXG4gICAgICAgICdkYXlqcycsXHJcbiAgICAgICAgJ2Nyb3BwZXJqcydcclxuICAgICAgXVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStQLFNBQVMsZUFBZTtBQUN2UixTQUFTLGVBQWU7QUFFeEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGNBQWM7QUFDckIsT0FBTyxrQkFBa0I7QUFDekIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxtQkFBbUI7QUFDMUIsU0FBUyw0QkFBNEI7QUFDckMsU0FBUyx5QkFBeUIsMEJBQTBCO0FBQzVELE9BQU8sWUFBWTtBQUNuQixTQUFTLGtCQUFrQjtBQWYzQixJQUFNLG1DQUFtQztBQWlCekMsSUFBTSxPQUFPLFFBQVEsSUFBSTtBQUV6QixTQUFTLFlBQVksS0FBYTtBQUNoQyxTQUFPLFFB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
