import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import GoodsList from '@/components/views/GoodsList'
import ServiceTable from '@/components/views/ServiceTable'
import CategoryList from '@/components/views/CategoryList'
import ServiceList from '@/components/views/ServiceList'
import CqList from '@/components/views/CqList'
import UserList from '@/components/views/UserList'
import Comments from '@/components/views/Comments'
import GoodsOrdersList from '@/components/views/GoodsOrdersList'
import ServiceOrderList from '@/components/views/ServiceOrderList'
import Notice from '@/components/views/Notice'
import Chart from '@/components/views/Chart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect:'/chart',
      children:[
        {
          path: '/chart',
          name: 'Chart',
          component: Chart
        }, {
          path: '/goodsList',
          name: 'GoodsList',
          component: GoodsList
        }, {
          path: '/serviceTable',
          name: 'ServiceTable',
          component: ServiceTable
        }, {
          path: '/categoryList',
          name: 'CategoryList',
          component: CategoryList
        }, {
          path: '/serviceList',
          name: 'ServiceList',
          component: ServiceList
        }, {
          path: '/cqList',
          name: 'CqList',
          component: CqList
        }, {
          path: '/userList',
          name: 'UserList',
          component: UserList
        },{
          path: '/comments',
          name: 'Comments',
          component: Comments
        },{
          path: '/goodsOrdersList',
          name: 'GoodsOrdersList',
          component: GoodsOrdersList
        },{
          path: '/serviceOrderList',
          name: 'ServiceOrderList',
          component: ServiceOrderList
        },{
          path: '/notice',
          name: 'Notice',
          component: Notice
        }
      ]
    },
  ]
})
