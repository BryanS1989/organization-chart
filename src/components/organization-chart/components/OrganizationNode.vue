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
    <section class="border rounded-2xl mx-4 w-80">
        <header class="border-b px-4 py-2 bg-neutral-800 rounded-t-2xl">
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