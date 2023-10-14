<script>
import OrganizationChart from './../components/OrganizationChart.vue';
import OrganizationInfo from '@/assets/files/organization-chart-1.json';

export default {
	name: 'OrganizationView',
	components: {
		OrganizationChart,
	},
	data() {
		return {
			organization: null,
		};
	},
	created() {
		this.organization = OrganizationInfo;
	},
};
</script>

<template>
	<main class="flex justify-center items-center flex-grow p-3 bg-neutral-100">
		<OrganizationChart
			:chart-info="organization"
			:children-property="'employees'"
		/>
	</main>
</template>
