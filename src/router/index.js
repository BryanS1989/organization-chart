import { createRouter, createWebHistory } from 'vue-router';
import OrganizationView from '@/components/organization-chart/views/OrganizationView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'demo',
			component: OrganizationView,
		},
	],
});

export default router;
