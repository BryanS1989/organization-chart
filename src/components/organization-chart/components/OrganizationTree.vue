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
            localLevel: 0,
            collapse: false
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
                return 'w-full';
            } else if (this.lastChild) {
                return 'w-full border-t border-neutral-800';
            } else {
                return 'w-1/2 border-t border-neutral-800';
            }
        },
        connectionUpwardsCenterClasss () {
            if ( this.firstChild ) {
                return 'w-10 border-l border-t border-neutral-800 rounded-tl-xl' ;
            } else if ( this.lastChild ) {
                return 'w-10 border-r border-t border-neutral-800 rounded-tr-xl';
            } else {
                return 'w-0 border-l border-neutral-800';
            }
        },
        connectionUpwardsRightClasss() {
            if (this.firstChild) {
                return 'w-full border-t border-neutral-800';
            } else if (this.lastChild) {
                return 'w-full';
            } else {
                return 'w-1/2 border-t border-neutral-800';
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

        <OrganizationNode :employeeInfo="levelInfo" :level="level"  :index="index" @click="collapse = !collapse" class="cursor-pointer"/>

        <Transition name="fade">
            <div v-if="!collapse" class="w-full flex flex-col justify-around items-center">
                <div v-if="subordinates.length" class="connection-downwards w-0 h-8 border-l border-neutral-800" />

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
            </div>
        </Transition>
    </section>
</template>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>