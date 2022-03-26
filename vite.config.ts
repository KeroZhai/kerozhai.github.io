import { resolve } from 'path'
import type { UserConfig } from 'vite'
import fs from 'fs-extra'
// file system based routing
import Pages from 'vite-plugin-pages'
// Icons
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
// Markdown
import Markdown from 'vite-plugin-md'
import Prism from 'markdown-it-prism'
import Anchor from 'markdown-it-anchor'
// import LinkAttributes from 'markdown-it-link-attributes'
import TOC from 'markdown-it-table-of-contents'
import matter from 'gray-matter'
// Auto global component registration
import Components from 'unplugin-vue-components/vite'
// Auto import for `script setup`
// import AutoImport from 'unplugin-auto-import/vite'
// Unocss https://github.com/unocss/unocss
import Unocss from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno } from 'unocss'

import Vue from '@vitejs/plugin-vue'

// import 'prismjs/components/prism-regex'
// import 'prismjs/components/prism-javascript'
// import 'prismjs/components/prism-typescript'
// import 'prismjs/components/prism-xml-doc'
// import 'prismjs/components/prism-yaml'
// import 'prismjs/components/prism-json'
// import 'prismjs/components/prism-markdown'
// import 'prismjs/components/prism-java'
// import 'prismjs/components/prism-javadoclike'
// import 'prismjs/components/prism-javadoc'
// import 'prismjs/components/prism-jsdoc'

const config: UserConfig = {
  // 配置别名
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: `${resolve(__dirname, 'src')}/`,
      },
    ],
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      'dayjs',
      'dayjs/plugin/localizedFormat',
    ],
  },
  plugins: [
    Unocss({
      theme: {
        fontFamily: {
          sans: '"Inter", Inter var,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
        },
      },
      presets: [
        presetIcons({
          extraProperties: {
            'display': 'inline-block',
            'height': '1.2em',
            'width': '1.2em',
            'vertical-align': 'text-bottom',
          },
        }),
        // presetAttributify(),
        presetUno(),
      ],
    }),

    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Pages({
      extensions: ['vue', 'md'],
      pagesDir: 'pages',
      // NODE_ENV is undefined at start
      exclude: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? undefined : ['**/drafts/*'],
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))
        const md = fs.readFileSync(path, 'utf-8')
        const { data } = matter(md)

        route.meta = Object.assign(route.meta || {}, {
          frontmatter: data,
        })

        return route
      },
    }),

    Markdown({
      wrapperComponent: 'markdown-wrapper',
      wrapperClasses: 'prose m-auto', // TODO 未生效，待定位
      headEnabled: true, // TODO 未生效，待定位
      markdownItOptions: {
        quotes: '""\'\'',
      },
      markdownItSetup(md) {
        md.use(Prism)
        md.use(Anchor, {
          permalink: Anchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: () => ({ 'aria-hidden': 'true' }),
          }),
        })
        md.use(TOC, {
          includeLevel: [1, 2, 3],
        })
      },
    }),

    // AutoImport({
    //   imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/head'],
    // }),

    Components({
      dirs: ['src/components', 'src/layout'],
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
    }),

    Icons({
      defaultClass: 'inline',
      defaultStyle: 'vertical-align: sub;',
    }),
  ],

  ssgOptions: {
    formatting: 'minify',
    format: 'cjs',
  },
}

export default config
