export default {
  install: (app: any) => {
    app.component('svg-icon', () => import('@/components/SvgIcon/index.vue'))
  }
}