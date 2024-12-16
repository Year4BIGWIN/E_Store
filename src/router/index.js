import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/user/HomeView.vue';
import SignIn from '../views/user/auth/SignIn.vue';
import SignUp from '../views/user/auth/SignUp.vue';
import Cart from '../views/user/MyCart.vue';
import Profile from '../views/user/Profile.vue';
import DashBoard from '@/views/admin/DashBoard.vue';
import AboutView from '@/views/user/AboutView.vue';
import Product from '@/views/admin/Product.vue';
import User from '@/views/admin/User.vue';
import Order from '@/views/admin/Order.vue';
import Cookies from 'universal-cookie';
import ProductPage from '@/views/user/ProductPage.vue';
import ProductDetail from '@/views/user/ProductDetail.vue';

// Create an instance of Cookies
const cookies = new Cookies();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
      meta: { requiresAuth: true } // Auth required
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true } // Auth required
    },
    { path: '/productdetail', name: 'productDetail', component: ProductDetail },

    {
      path: '/products',  
      name: 'products',
      component: ProductPage,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoard,
      meta: { requiresAuth: true, requiresAdmin: true } // Admin only
    },
    { 
      path: '/product',
      name: 'product',
      component: Product,
      meta: { requiresAuth: true, requiresAdmin: true } // Admin only
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      meta: { requiresAuth: true, requiresAdmin: true } // Admin only
    },
    {
      path: '/order',
      name: 'order',
      component: Order, 
      meta: { requiresAuth: true, requiresAdmin: true } // Admin only
    },
  ]
});



// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!cookies.get('auth_token'); // Retrieve auth token
  const userRole = cookies.get('role'); // Retrieve role from cookies // Should show the token     // Should show 'admin'


  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if user is not authenticated
    next({ name: 'login' });
  } else if (to.meta.requiresAuth && to.meta.requiresAdmin) {
    // Check authentication and admin role
    if (isAuthenticated && userRole === 'ADMIN') {
      next(); // Allow access if admin
    } else {
      next({ name: 'home' }); // Redirect to home if not admin
    }
  } else {
    next(); // Proceed as normal
  }
});

export default router;
