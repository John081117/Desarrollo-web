import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'

const routes = [
    { path : '/', component: LoginView},
    { path: '/dashboard', component: DashboardView},
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})