<script>
import OrganizationTree from "./OrganizationTree.vue";

export default {
    name: 'OrganizationChart',
    components: {
        OrganizationTree
    },
    props: {
        chartInfo: {
            type: Object,
            default: () => ({})
        },
    },
    data() {
        return {
        }
    }
}
</script>

<template>
    <section class="w-full p-2">
        <OrganizationTree :levelInfo="chartInfo"/>
    </section>
</template>