import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { isPartnerPortalRole } from '@/lib/roles'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true, title: 'Dashboard' },
    },
    {
      path: '/shuttles',
      name: 'shuttles',
      component: () => import('@/views/ShuttlesView.vue'),
      meta: { requiresAuth: true, title: 'Shuttles' },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('@/views/TransactionsView.vue'),
      meta: { requiresAuth: true, title: 'Transactions' },
    },
    {
      path: '/schedules',
      name: 'schedules',
      component: () => import('@/views/SchedulesView.vue'),
      meta: { requiresAuth: true, title: 'Schedules' },
    },
    {
      path: '/withdrawals',
      name: 'withdrawals',
      component: () => import('@/views/WithdrawalsView.vue'),
      meta: { requiresAuth: true, title: 'Withdrawals' },
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized) {
    await auth.initialize()
  }

  if (to.meta.guest) {
    if (auth.isAuthenticated && auth.canUsePortal) {
      return { name: 'dashboard' }
    }
    return true
  }

  if (to.meta.requiresAuth) {
    if (!auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (!auth.user) {
      try {
        await auth.fetchCurrentUser()
      } catch {
        await auth.logout()
        return { name: 'login' }
      }
    }
    if (!isPartnerPortalRole(auth.roleId)) {
      await auth.logout()
      return { name: 'login', query: { reason: 'forbidden' } }
    }
  }

  return true
})

export default router
