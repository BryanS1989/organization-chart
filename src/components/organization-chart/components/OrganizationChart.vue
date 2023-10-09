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
            scaleFactor: 0.1,
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
                },
                scale: 1,
                cursorPos: {
                    x: 0,
                    y: 0
                }
            }
        }
    },
    computed:{
        top () {
            return this.position.offset.top;
        },
        left() {
            return this.position.offset.left;
        },
        scale() {
            return this.position.scale;
        },
        cursorPos() {
            return this.position.cursorPos;
        },
        chartStyle () {
            return {
                top: `${this.top}px`,
                left: `${this.left}px`,
                transform: `scale(${this.scale}) translateX(${this.left}px) translateY(${this.top}px)`,
                transformOrigin: `${this.cursorPos.x}px ${this.cursorPos.y}px`
            }
        }
    },
    methods: {
        startDrag(event) {
            const { clientX, clientY } = event.type === 'touchstart' ? event.touches[0] : event;
            this.clicked = true;
            this.position.start = {x: clientX, y: clientY };
        },
        dragChart(event) {
            const { clientX, clientY } = event.type === 'touchmove' ? event.touches[0] : event;;
            const { offsetTop, offsetLeft } = this.$refs['org-chart'];

            if (this.clicked) {
                this.position.end = { x: this.position.start.x - clientX, y: this.position.start.y - clientY };
                this.position.start = { x: clientX, y: clientY };
                this.position.offset = { top: offsetTop - this.position.end.y, left: offsetLeft - this.position.end.x };
            }
        },
        endDrag() {
            this.clicked = false;
        },
        zoomChart (wheelEvent) {
            const { wheelDeltaY, clientX, clientY } = wheelEvent;

            this.position.cursorPos = { x: clientX, y: clientY};

            if (wheelDeltaY < 0) {
                this.position.scale -= this.scaleFactor;
            } else {
                this.position.scale += this.scaleFactor;
            }

            this.position.scale = Math.max(0.5, this.position.scale);
            this.position.scale = Math.min(2, this.position.scale);
        },
        centerChart(){
            this.position.offset.top = 0;
            this.position.offset.left = 0;
            this.position.scale = 1;
        }
    }
}
</script>

<template>
    <article 
        :class="`relative border border-neutral-300 rounded-xl overflow-hidden w-full h-full p-6 flex justify-around grow items-center bg-neutral-50 shadow-inner ${!clicked ? 'cursor-grab' : 'cursor-grabbing'}`" 
        @mousedown="startDrag" 
        @mousemove="dragChart"
        @mouseup="endDrag"
        @touchstart="startDrag" 
        @touchmove="dragChart"
        @touchend="endDrag"
        @wheel="zoomChart"
    >
        <section 
            ref="org-chart" 
            :class="`absolute w-full h-max flex justify-around items-center p-4`" 
            :style="chartStyle"
        >
            <OrganizationTree 
                :levelInfo="chartInfo"
                :index="0"
                :number-of-children="chartInfo.employees.length"
            />
        </section>

        <div class="absolute top-4 right-4">
            <button 
                type="button" 
                class="text-neutral-100 bg-blue-700 hover:bg-blue-900 font-medium rounded-2xl text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                @click="centerChart"
            >
                CENTER
            </button>
        </div>
    </article>
</template>