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
            clicked: false,
            position: {
                start: {
                    x:0,
                    y:0
                },
                end: {
                    x: 0,
                    y: 0
                },
                offset: {
                    top: 0,
                    left: 0
                }
            }
        }
    },
    computed:{
        top () {
            return `${this.position.offset.top}px`;
        },
        left() {
            return `${this.position.offset.left}px`;
        },
        positionAbsolute () {
            return {
                top: this.top,
                left: this.left
            }
        }
    },
    methods: {
        startDrag(mouseEvent) {
            const { clientX, clientY } = mouseEvent;
            this.clicked = true;
            this.position.start = {x: clientX, y: clientY };
        },
        dragChart(mouseEvent) {
            const { clientX, clientY } = mouseEvent;
            const { offsetTop, offsetLeft } = this.$refs['org-chart'];

            if (this.clicked) {
                this.position.end = { x: this.position.start.x - clientX, y: this.position.start.y - clientY };
                this.position.start = { x: clientX, y: clientY };
                this.position.offset = { top: offsetTop - this.position.end.y, left: offsetLeft - this.position.end.x };
            }
        },
        endDrag(mouseEvent) {
            this.clicked = false;
        },
    }
}
</script>

<template>
    <article 
        :class="`relative border border-neutral-300 rounded-xl overflow-hidden w-full h-full p-6 flex justify-around grow items-center bg-neutral-50 shadow-inner ${!clicked ? 'cursor-grab' : 'cursor-grabbing'}`" 
        @mousedown="startDrag" 
        @touchstart="startDrag" 
        @mousemove="dragChart"
        @touchmove="dragChart"
        @mouseup="endDrag"
        @touchend="endDrag"
    >
        <section 
            ref="org-chart" 
            :class="`absolute w-full h-full flex justify-around items-center`" 
            :style="positionAbsolute"
        >
            <OrganizationTree :levelInfo="chartInfo"/>
        </section>
    </article>
</template>