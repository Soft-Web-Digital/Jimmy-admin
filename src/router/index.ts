import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '../stores/auth'

const router = createRouter({

  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      redirect: "/dashboards/analytical",
      component: () => import("@/layouts/full/FullLayout.vue"),
      children: [
        {
          name: "Analytical",
          path: "/dashboards/analytical",
          component: () =>
            import("@/views/dashboards/analytical/Analytical.vue"),
            meta: { requiresAuth: true}
        },
        {
          name: "Profile",
          path: "/user/profile",
          component: () => import("@/views/profile.vue"),
          meta: { requiresAuth: true}
        },
  
        {
          name: "Apps",
          path: "/withdrawals/all",
          component: () => import("@/views/withdrawals/all.vue"),
          meta: { requiresAuth: true}
        },
        {
          name: "viewWithdrawals",
          path: "/withdrawals/:id",
          component: () => import("@/views/withdrawals/view-withdrawals/Index.vue"),
          meta: { requiresAuth: true}
        },

        {
          name: "AssetsTransaction",
          path: "/asset/transaction",
          component: () => import("@/views/asset/all-transactions.vue"),
          meta: { requiresAuth: true}
        },
        {
          name: "TopTraders",
          path: "/top-traders/transaction",
          component: () => import("@/views/top-traders/all-transactions.vue"),
          meta: { requiresAuth: true}
        },
        {
          name: "ViewAssetsTransaction",
          path: "/asset/transaction/:id",
          component: () => import("@/views/asset/transaction-view.vue"),
          meta: { requiresAuth: true},
          props:true
        },
        {
          name: "GiftCardTransaction",
          path: "/giftcards/transaction",
          component: () => import("@/views/giftcards/transaction.vue"),
           meta: { requiresAuth: true}
        },
        {
          name: "Test",
          path: "/giftcards/test",
          component: () => import("@/views/test.vue"),
           meta: { requiresAuth: true}
        },
        {
          name: "RelatedGiftCards",
          path: "/giftcards/related-transactions/:id",
          component: () => import("@/views/giftcards/related-giftcards.vue"),
           meta: { requiresAuth: true},
           props:true
        },
        {
          name: "ViewGiftCardTransaction",
          path: "/giftcards/transaction/:id",
          component: () => import("@/views/giftcards/view-transaction/Index.vue"),
          meta: { requiresAuth: true },
          props:true
        },
        {
          name: "GiftCardCategory",
          path: "/giftcards/categories",
          component: () => import("@/views/giftcards/category.vue"),
          meta: { requiresAuth: true}
        },
        {
          name: "GiftCardCategoryView",
          path: "/giftcards/view-transactions/category/:id",
          component: () => import("@/views/giftcards/view-transaction/categories.vue"),
          props:true,
          meta: { requiresAuth: true }
        },
        {
          name: "GiftCardProducts",
          path: "/giftcards/products",
          component: () => import("@/views/giftcards/products.vue"),
           meta: { requiresAuth: true}
        },

        {
          name: "Admin",
          path: "/admin",
          component: () => import("@/views/admin/index.vue"),
          meta: { requiresAuth: true}
        },
        {
          name: "Bank",
          path: "/system-bank",
          component: () => import("@/views/system-bank/index.vue"),
          meta: { requiresAuth: true}
        },
        {
          name: "Banners",
          path: "/banners",
          component: () => import("@/views/banners.vue"),
          meta: { requiresAuth: true}
        },

        {
          name: "Notifications",
          path: "/notifications/all",
          component: () =>
            import("@/views/all-notifications.vue"),
            meta: { requiresAuth: true}
        },
        {
          name: "Announcements",
          path: "/announcements",
          component: () =>
            import("@/views/annoucements.vue"),
            meta: { requiresAuth: true}
        },
        {
          name: "RolesandPermissions",
          path: "/roles",
          component: () =>
            import("@/views/roles/roles-permission.vue"),
            meta: { requiresAuth: true}
        },
        {
          name: "Create Role",
          path: "/roles/create-role",
          component: () =>
            import("@/views/roles/create-role.vue"),
        },
        {
          name: "Users",
          path: "/user/all",
          component: () =>
            import("@/views/users.vue"),
            meta: { requiresAuth: true}
        },
        {
          name: "UserDetails",
          path: "/user/:id",
          component: () =>
            import("@/views/user-details.vue"),
            props:true,
            meta: { requiresAuth: true}
        },
        {
          name: "Countries",
          path: "/countries/all",
          component: () =>
            import("@/views/country-management.vue"),
            meta: { requiresAuth: true}
        },
        {
          name: "Currencies",
          path: "/currencies/all",
          component: () =>
            import("@/views/currency.vue"),
            meta: { requiresAuth: true}
        },
        {
          name: "Assets",
          path: "/assets/all",
          component: () =>
            import("@/views/asset/assets.vue"),
            meta: { requiresAuth: true}
        },
        {
          name: "Network",
          path: "/networks/all",
          component: () =>
            import("@/views/network.vue"),
            meta: { requiresAuth: true}
        },
        {
          name: "System data",
          path: "/system-data",
          component: () =>
            import("@/views/system-data.vue"),
            meta: { requiresAuth: true}
        },
        {
          name: "App Version",
          path: "/app-version",
          component: () =>
            import("@/views/app-version.vue"),
            meta: { requiresAuth: true}
        },
        {
          name: "Trading Settings",
          path: "/trading-settings",
          component: () =>
            import("@/views/trading-settings.vue"),
            meta: { requiresAuth: true}
        },
        {
          name: "Referral Management",
          path: "/referrals-management",
          component: () =>
            import("@/views/referral-man.vue"),
            meta: { requiresAuth: true}
        },
      ],
    },
    {
      path: "/authentication",
      component: () => import("@/layouts/blank/BlankLayout.vue"),
      children: [
        {
          name: "Login",
          path: "/auth/login",
          component: () => import("@/views/authentication/FullLogin.vue"),
          meta: { requiresAuth: false}
        },
        {
          name: "Two Fa",
          path: "/authentication/verify-two-fa",
          component: () => import("@/views/authentication/VerifiyTwoFa.vue"),
           meta: { requiresAuth: false}
        },
        {
          name: "Error",
          path: "/authentication/error",
          component: () => import("@/views/authentication/Error.vue"),
          meta: { requiresAuth: false}
        },
        {
          name: "ResetPassword",
          path: "/authentication/reset-password",
          component: () => import("@/views/authentication/reset-password/index.vue"),
          meta: { requiresAuth: false}
        },
        {
          name: "ResetCode",
          path: "/authentication/request-reset-code",
          component: () => import("@/views/authentication/ResetCode.vue"),
          meta: { requiresAuth: false}
        },
      ],
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    
    return savedPosition || {top:0, behavior:'smooth'}
  }
});




router.beforeEach((to, from, next) => {
  const store  = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !store.isLoggedIn) {
    next('/auth/login')
  } else {
    next()
  }
})


export default router;
