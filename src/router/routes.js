
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
     
      { path: '/board', component: () => import('pages/Staff/BoardPage.vue') },
      { path: '/add', component: () => import('pages/Staff/CreateToolPage.vue') },
      { path: '/EqStaff', component: () => import('pages/Staff/StaffEqPage.vue') },
      { path: '/update/:id', name: 'update', component: () => import('pages/Staff/UpdatePage.vue'), props: true, },

      { path: '/signup', component: () => import('pages/SignupPage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') },

      { path: '/EqTeacher', component: () => import('pages/Teacher/EqPage.vue') },
      { path: '/home', component: () => import('pages/Teacher/HomePage.vue') },
      { path: '/cart', component: () => import('pages/Teacher/CheckoutPage.vue') },
      { path: '/history', component: () => import('pages/Teacher/ListPage.vue') },

      { path: '/test', name: 'test', component: () => import('pages/TestPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes