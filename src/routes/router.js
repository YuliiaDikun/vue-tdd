import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../pages/HomePage.vue";
import Login from "../pages/Login.vue";
import SignUp from "../pages/SignUp.vue";
import UserPage from "../pages/User.vue";
import AccountActivationPage from "../pages/AccountActivationPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: HomePage,
    },
    {
      path: "/signup",
      component: SignUp,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/user/:id",
      component: UserPage,
    },
    {
      path: "/activate/:token",
      component: AccountActivationPage,
    },
  ],
});
export default router;
