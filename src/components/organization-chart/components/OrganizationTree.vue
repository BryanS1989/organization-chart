<script>
import OrganizationNode from "./OrganizationNode.vue";

export default {
    name: 'OrganizationTree',
    components: {
        OrganizationNode
    },
    props: {
        levelInfo: {
            type: Object,
            default: () => ({})
        },
        level: {
            type: Number,
            default: 0,
        },
        index: {
            type: Number,
            default: 0,
        },
        last: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            localLevel: 0
        }
    },
    computed: {
        nextLevel(){
            return this.localLevel + 1;
        },
        subordinates(){
            return this.levelInfo.employees ?? [];
        },
        firstChild() {
            return this.index === 0;
        },
        lastChild() {
            return this.last;
        },
        connectionUpwardsLeftClasss() {
            if (this.firstChild) {
                return 'w-full border-t-0';
            } else if (this.lastChild) {
                return 'w-full border-t';
            } else {
                return 'w-1/2 border-t';
            }
        },
        connectionUpwardsCenterClasss () {
            if ( this.firstChild ) {
                return 'w-10 border-l border-t rounded-tl-xl' ;
            } else if ( this.lastChild ) {
                return 'w-10 border-r border-t rounded-tr-xl';
            } else {
                return 'w-0 border';
            }
        },
        connectionUpwardsRightClasss() {
            if (this.firstChild) {
                return 'w-full border-t ';
            } else if (this.lastChild) {
                return 'w-full  ';
            } else {
                return 'w-1/2 border-t';
            }
        },
    },
    created() {
        this.localLevel = this.level;
    },
}
</script>

<template>
    <section class="subtree w-fit flex flex-col justify-around items-center">
        <div v-if="level !== 0" class="connectors flex w-full">
            <div :class="`connection-upwards-left w-1/2 h-8 my-auto ${ connectionUpwardsLeftClasss }`"/>
            <div :class="`connection-upwards-center h-8 ${ connectionUpwardsCenterClasss }`"/>
            <div :class="`connection-upwards-right w-1/2 h-8 my-auto ${ connectionUpwardsRightClasss } `"/>
        </div>

        <OrganizationNode :employeeInfo="levelInfo" :level="level"  :index="index"/>

        <div v-if="subordinates.length" class="connection-downwards w-0 h-8 border" />

        <section class="tree w-full flex justify-around items-start">
                <OrganizationTree 
                    v-for="(subTree, subTreeIndex) in subordinates" 
                    :key="subTreeIndex" 
                    :levelInfo="subTree" 
                    :level="nextLevel" 
                    :index="subTreeIndex"
                    :last="subTreeIndex === (subordinates.length - 1)"
                />
        </section>
    </section>
</template>

<style scoped>
</style>