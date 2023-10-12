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
        childrenProperty: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            clicked: false,
            scale: {
                factor: 0.1,
                min: 0.1,
                max: 3
            },
            cursorPos:{
                x: 0,
                y: 0
            },
            chartParameters: {
                scale: 1,
                start: {
                    x:0,
                    y:0
                },
                end: {
                    x: 0,
                    y: 0
                },
                offset: {
                    left: 0,
                    top: 0,
                },
                currentTransformOrigin: {
                    x: 0,
                    y: 0
                },
                transformOrigin: {
                    x: 0,
                    y: 0
                }
            },
            showDebugPoints : false,
            query: {
                name: ''
            }
        }
    },
    computed:{
        containerRef() {
            return this.$refs.container;
        },
        containerRect() {
            return this.containerRef.getBoundingClientRect();
        },
        chartRef() {
            return this.$refs.chart;
        },
        offset () {
            return this.chartParameters.offset;
        },
        currentScale() {
            return this.chartParameters.scale;
        },
        currentTransformOrigin() {
            return this.chartParameters.currentTransformOrigin;
        },
        transformOrigin() {
            return this.chartParameters.transformOrigin;
        },
        cursorPosition() {
            return this.cursorPos;
        },
        styleDrag(){
            return {
                top: `${this.offset.top}px`,
                left: `${this.offset.left}px`,
                translate: `${this.offset.left}px ${this.offset.top}px`,
            }
        },
        styleZoom(){
            return {
                transform: `scale(${this.currentScale})`,
            }
        },
        styleTransformOrigin() {
            return {
                transformOrigin: `${this.transformOrigin.x}px ${this.transformOrigin.y}px`
            }
        },
        subordinates(){
            return this.chartInfo[this.childrenProperty];
        }
    },
    methods: {
        startDrag(event) {
            const { clientX, clientY } = event.type === 'touchstart' ? event.touches[0] : event;
            this.clicked = true;
            this.chartParameters.start = {x: clientX, y: clientY };
            this.getTransformOrigin(event);
        },
        dragChart(event) {
            const { clientX, clientY } = event.type === 'touchmove' ? event.touches[0] : event;;
            const { offsetTop, offsetLeft } = this.chartRef;
            
            this.cursorCoordinates(event);
            this.getTransformOrigin(event);

            if (this.clicked) {
                this.chartParameters.end = { x: this.chartParameters.start.x - clientX, y: this.chartParameters.start.y - clientY };
                this.chartParameters.start = { x: clientX, y: clientY };
                this.chartParameters.offset = { top: offsetTop - this.chartParameters.end.y, left: offsetLeft - this.chartParameters.end.x };
            }
        },
        endDrag(event) {
            this.clicked = false;
            this.chartParameters.start = {x: 0, y: 0 };
            this.getTransformOrigin(event);
        },
        zoomChart (event) {
            const { wheelDeltaY } = event;

            event.preventDefault();

            let positionScaleAux = this.chartParameters.scale;

            positionScaleAux += wheelDeltaY > 0 ? this.scale.factor : -this.scale.factor;

            if ( positionScaleAux >= this.scale.min && positionScaleAux <= this.scale.max ) {
                this.setCurrentTransformOrigin();
                this.chartParameters.scale = Number(positionScaleAux.toFixed(1));    
            }
        },
        getTransformOrigin(event){
            const x = (event.clientX - (this.offset.left * 2) - this.containerRef.offsetLeft);
            const y = (event.clientY - (this.offset.top * 2) - this.containerRef.offsetTop);


            const scaledX = Number(((this.cursorPosition.x - this.transformOrigin.x) / this.currentScale).toFixed(2));
            const scaledY = Number(((this.cursorPosition.y - this.transformOrigin.y) / this.currentScale).toFixed(2));

            // this.chartParameters.transformOrigin = { x, y };
            this.chartParameters.currentTransformOrigin = { x, y };
        },
        setCurrentTransformOrigin(){
            this.chartParameters.transformOrigin = { ...this.chartParameters.currentTransformOrigin  };
        },
        cursorCoordinates(event){
            const x = event.clientX - this.containerRect.left;
            const y = event.clientY - this.containerRect.top;

            this.cursorPos = { x, y };
        },
        centerChart(){
            this.chartParameters.offset = { left: 0, top: 0 };
            this.chartParameters.scale = 1;
        }
    }
}
</script>

<template>
    <article 
        :class="`relative border border-neutral-300 rounded-xl overflow-hidden w-full h-full bg-neutral-50 shadow-inner flex justify-center items-center ${!clicked ? 'cursor-grab' : 'cursor-grabbing'}`"
        ref="container"
        @mousedown="startDrag" 
        @mousemove="dragChart"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @wheel="zoomChart"
    >
            <!-- 
            @touchstart="startDrag" 
            @touchmove="dragChart"
            @touchend="endDrag" -->
        <div v-if="showDebugPoints" class="absolute rounded-full w-4 h-4 border-2 border-blue-600 bg-blue-600" :style="{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }"></div>
        
        <section 
            ref="chart" 
            :class="`absolute w-full h-full flex justify-center items-center p-4 ${showDebugPoints ? 'border border-red-600' : ''}`" 
            :style="[styleDrag, styleZoom, styleTransformOrigin]"
        >
            <div v-if="showDebugPoints" class="absolute rounded-full w-4 h-4 border-2 border-red-600 bg-red-600" :style="{ left: `${currentTransformOrigin.x}px`, top: `${currentTransformOrigin.y}px` }"></div>
            <div v-if="showDebugPoints" class="absolute rounded-full w-4 h-4 border-2 border-green-600 bg-green-600" :style="{ left: `${transformOrigin.x}px`, top: `${transformOrigin.y}px` }"></div>

            <OrganizationTree 
                :sub-tree-info="chartInfo"
                :index="0"
                :number-of-children="subordinates.length"
                :children-property="childrenProperty"
                :query-selector="query"
            />
        </section>

        <div class="absolute top-4 right-4 flex flex-col gap-3">
            <button 
                type="button" 
                class="text-neutral-100 bg-blue-700 font-medium rounded-2xl text-sm px-5 py-2.5"
                @click="centerChart"
            >
                CENTER
            </button>

            <input 
                v-model="query.name"
                type="text"
                class="rounded-2xl px-4 border border-blue-700 outline-none text-blue-800 h-10"
                placeholder="Find by name"
            />

        </div>

        <div v-if="showDebugPoints" class="absolute top-4 left-4 w-60 flex flex-col justify-center items-stretch gap-3">
            <p class="text-md font-bold px-1 rounded border border-black-600">{{ `Scale: ${currentScale}` }}</p>
            <p class="text-md font-bold px-1 rounded border border-blue-600">{{ `x: ${cursorPosition.x}px y: ${cursorPosition.y}px` }}</p>
            <p class="text-md font-bold px-1 rounded border border-red-600">{{ `x: ${currentTransformOrigin.x}px y: ${currentTransformOrigin.y}px` }}</p>
            <p class="text-md font-bold px-1 rounded border border-green-600">{{ `x: ${transformOrigin.x}px y: ${transformOrigin.y}px` }}</p>
            <p class="text-md font-bold px-1 rounded border border-black-600">{{ `left: ${this.offset.left}px  top: ${this.offset.top}px` }}</p>
        </div>
    </article>
</template>