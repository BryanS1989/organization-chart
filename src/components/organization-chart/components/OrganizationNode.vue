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
            expanded: true
        }
    },
    computed: {
        properties () {
            return Object.keys(this.employeeInfo).filter((key) => !Array.isArray(this.employeeInfo[key]) && !['name', 'position'].includes(key));
        },
        subordinates() {
            return this.employeeInfo.employees ?? false;
        },
    },
    methods: {
        emitExpand(){
            this.expanded = !this.expanded;
            this.$emit('expand');
        }
    }
}
</script>

<template>
    <section class="relative border border-blue-700 rounded-2xl w-80 select-none shadow-lg min-h-40 flex flex-col flex-wrap justify-between items-stretch">
        <header class="border-b px-4 py-2 bg-blue-700 rounded-t-xl text-neutral-100">
            <h3 class="text-xl font-bold whitespace-nowrap">{{ employeeInfo.name }}</h3>
            <p class="text-xs text-thin text-left" v-show="employeeInfo.position">{{ employeeInfo.position }}</p>
        </header>

        <ul class="p-4">
            <li v-for="property in properties" :key="property">
                <span class="font-semibold">{{ property }}: </span><span class="text-xs">{{ this.employeeInfo[property] }}</span>
            </li>
        </ul>

        <footer 
            :class="`relative flex justify-center items-center ${subordinates ? 'cursor-pointer' : ''}`"
            @click="emitExpand"
        >
            <div v-if="subordinates" 
                class="absolute z-10 bg-neutral-100 border border-blue-700 rounded-full w-8 h-8 flex justify-center items-center text-blue-700" 
            >
                    <font-awesome-icon v-if="!expanded" :icon="['fas', 'chevron-down']" />
                    <font-awesome-icon v-else :icon="['fas', 'chevron-up']" />
                </div>
        </footer>
    </section>
</template>

<style scoped>
</style>