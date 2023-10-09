<script>

export default {
    name: 'OrganizationNode',
    components: {
    },
    props: {
        employeeInfo: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            localEmployee:{
                name: 'Jhon Doe'
            }
        }
    },
    computed: {
        properties () {
            return Object.keys(this.employeeInfo).filter((key) => !Array.isArray(this.employeeInfo[key]) && !['name', 'position'].includes(key));
        }
    },
}
</script>

<template>
    <section class="border border-blue-700 rounded-2xl w-80 select-none shadow-lg min-h-40">
        <header class="border-b px-4 py-2 bg-blue-700 rounded-t-2xl text-neutral-100">
            <h3 class="text-xl font-bold whitespace-nowrap">{{ employeeInfo.name }}</h3>
            <p class="text-xs text-thin text-left" v-show="employeeInfo.position">{{ employeeInfo.position }}</p>
        </header>

        <ul class="p-4">
            <li v-for="property in properties" :key="property">
                <span class="font-semibold">{{ property }}: </span><span class="text-xs">{{ this.employeeInfo[property] }}</span>
            </li>
        </ul>
    </section>
</template>

<style scoped>
</style>