import { createRouter, createWebHistory } from "vue-router";
import Cookies from "universal-cookie";

// Lazy load all route components for better code splitting
const HomeView = () => import("../views/user/HomeView.vue");
const SignIn = () => import("../views/user/auth/SignIn.vue");
const SignUp = () => import("../views/user/auth/SignUp.vue");
const Cart = () => import("../views/user/MyCart.vue");
const Profile = () => import("../views/user/Profile.vue");
const DashBoard = () => import("@/views/admin/DashBoard.vue");
const AboutView = () => import("@/views/user/AboutView.vue");
const Product = () => import("@/views/admin/Product.vue");
const User = () => import("@/views/admin/User.vue");
const Order = () => import("@/views/admin/Order.vue");
const ProductPage = () => import("@/views/user/ProductPage.vue");
const ProductDetail = () => import("@/views/user/ProductDetail.vue");
const Other = () => import("@/views/admin/Other.vue");
const ForgotPassword = () => import("@/views/user/auth/ForgotPassword.vue");
const ResetPassword = () => import("@/views/user/auth/ResetPassword.vue");
const SearchProduct = () => import("@/components/SearchProduct.vue");


// Create an instance of Cookies
const cookies = new Cookies();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/login",
      name: "login",
      component: SignIn,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUp,
    },
    {
      path: "/cart",
      name: "cart",
      component: Cart,
      meta: { requiresAuth: true }, // Auth required
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: { requiresAuth: true }, // Auth required
    },
    {
      path: "/productdetail/:id", // Add dynamic segment :id
      name: "productDetail",
      component: ProductDetail,
    },

    {
      path: "/products",
      name: "products",
      component: ProductPage,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashBoard,
      meta: { requiresAuth: true, requiresAdmin: true }, // Admin only
    },
    {
      path: "/product",
      name: "product",
      component: Product,
      meta: { requiresAuth: true, requiresAdmin: true }, // Admin only
    },
    {
      path: "/user",
      name: "user",
      component: User,
      meta: { requiresAuth: true, requiresAdmin: true }, // Admin only
    },
    {
      path: "/order",
      name: "order",
      component: Order,
      meta: { requiresAuth: true, requiresAdmin: true }, // Admin only
    },
    {
      path: "/other",
      name: "other",
      component: Other,
      meta: { requiresAuth: true, requiresAdmin: true }, // Admin only
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: ForgotPassword,
    },
    {
      path: "/resetpassword",
      name: "ResetPassword",
      component: ResetPassword,
    },
    {
      path: "/search",
      name: "search",
      component: SearchProduct,
      props: (route) => ({
        query: route.query.q,
      }),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!cookies.get("auth_token"); // Retrieve auth token
  const userRole = cookies.get("role"); // Retrieve role from cookies // Should show the token     // Should show 'admin'

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if user is not authenticated
    next({ name: "login" });
  } else if (to.meta.requiresAuth && to.meta.requiresAdmin) {
    // Check authentication and admin role
    if (isAuthenticated && userRole === "ADMIN") {
      next(); // Allow access if admin
    } else {
      next({ name: "home" }); // Redirect to home if not admin
    }
  } else {
    next(); // Proceed as normal
  }
});

export default router;
