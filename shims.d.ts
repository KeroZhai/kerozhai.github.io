import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    frontmatter: any
    createdTime: Date
    createdTimestamp: number
    updatedTime: Date
    updatedTimestamp: number
  }
}
