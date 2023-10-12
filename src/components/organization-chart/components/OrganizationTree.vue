<script>
import OrganizationNode from "./OrganizationNode.vue";

export default {
    name: 'OrganizationTree',
    components: {
        OrganizationNode
    },
    props: {
        subTreeInfo: {
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
        numberOfChildren: {
            type: Number,
            default: 0,
        },
        childrenProperty: {
            type: String,
            default: ''
        },
        querySelector: {
            type: Object,
            default: () => ({})
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
            return this.subTreeInfo[this.childrenProperty] ?? [];
        },
        firstChild() {
            return this.index === 0;
        },
        evenChild(){
            return this.index % 2 === 0;
        },
        lastChild() {
            return this.index === this.numberOfChildren - 1;
        },
        parentColumnMode(){
            return this.numberOfChildren >= 5;
        },
        columnMode () {
            return this.subordinates.length >= 5;
        },
        connectionUpwardsLeftClass() {
            if (this.firstChild) {
                return 'w-full';
            } else if (this.lastChild) {
                return 'w-full border-t border-neutral-800';
            }

            return 'w-1/2 border-t border-neutral-800';
        },
        connectionUpwardsCenterClass () {
            if ( this.firstChild ) {
                return 'w-10 border-l border-t border-neutral-800 rounded-tl-xl' ;
            } else if ( this.lastChild ) {
                return 'w-10 border-r border-t border-neutral-800 rounded-tr-xl';
            }
            
            return 'w-0 border-l border-neutral-800';
        },
        connectionUpwardsRightClass() {
            if (this.firstChild) {
                return 'w-full border-t border-neutral-800';
            } else if (this.lastChild) {
                return 'w-full';
            }

            return 'w-1/2 border-t border-neutral-800';
        },
    },
    created() {
        this.localLevel = this.level;
    },
}
</script>

<template>
    <section :class="`flex-1 subtree flex flex-col justify-start items-center`">
        <div :class="`flex flex-col justify-center items-center w-full`">
            <div v-if="level !== 0" :class="`flex flex-row w-full h-10`">
                <div :class="connectionUpwardsLeftClass"/>
                <div :class="connectionUpwardsCenterClass"/>
                <div :class="connectionUpwardsRightClass"/>
            </div>

            <div :class="`px-4`">
                <OrganizationNode 
                    :ref="`node-${subTreeInfo.id}`"
                    :node-info="subTreeInfo" 
                    :level="level"  
                    :index="index"
                    :has-children="subordinates.length !== 0"
                    :query-selector="querySelector"
                    @expand="collapse = !collapse" 
                />
            </div>
        </div>

        <Transition name="fade">
            <div v-if="!collapse && subordinates.length" :class="`flex flex-col justify-start items-center`">
                <div class="flex w-full h-10">
                    <div :class="'w-1/2'"/>
                    <div :class="'w-0 border-l border-neutral-800'"/>
                    <div :class="'w-1/2'"/>
                </div>

                <section :class="`tree flex flex-row justify-center items-start`">
                        <OrganizationTree 
                            v-for="(subTree, subTreeIndex) in subordinates" 
                            :key="subTreeIndex" 
                            :sub-tree-info="subTree" 
                            :level="nextLevel" 
                            :index="subTreeIndex"
                            :number-of-children="subordinates.length"
                            :children-property="childrenProperty"
                            :query-selector="querySelector"
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