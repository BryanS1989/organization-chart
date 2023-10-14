<script>
import OrganizationTree from './OrganizationTree.vue';

export default {
	name: 'OrganizationChart',
	components: {
		OrganizationTree,
	},
	props: {
		chartInfo: {
			type: Object,
			default: () => ({}),
		},
		childrenProperty: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			clicked: false,
			scale: {
				factor: 0.1,
				min: 0.1,
				max: 3,
			},
			cursorPos: {
				x: 0,
				y: 0,
			},
			chartParameters: {
				move: {
					start: {
						x: 0,
						y: 0,
					},
					end: {
						x: 0,
						y: 0,
					},
					offset: {
						left: 0,
						top: 0,
					},
				},
				zoom: {
					scale: 1,
					transformOrigin: {
						x: 0,
						y: 0,
					},
					currentTransformOrigin: {
						x: 0,
						y: 0,
					},
				},
			},
			showDebugPoints: false,
			query: {
				name: '',
				email: '',
			},
		};
	},
	computed: {
		containerRef() {
			return this.$refs.container;
		},
		containerRect() {
			return this.containerRef.getBoundingClientRect();
		},
		chartRef() {
			return this.$refs.chart;
		},
		initialPosition() {
			return this.chartParameters.move.start;
		},
		finalPosition() {
			return this.chartParameters.move.end;
		},
		offset() {
			return this.chartParameters.move.offset;
		},
		currentScale() {
			return this.chartParameters.zoom.scale;
		},
		currentTransformOrigin() {
			return this.chartParameters.zoom.currentTransformOrigin;
		},
		transformOrigin() {
			return this.chartParameters.zoom.transformOrigin;
		},
		cursorPosition() {
			return this.cursorPos;
		},
		styleDrag() {
			return {
				top: `${this.offset.top}px`,
				left: `${this.offset.left}px`,
				translate: `${this.offset.left}px ${this.offset.top}px`,
			};
		},
		styleZoom() {
			return {
				transform: `scale(${this.currentScale})`,
			};
		},
		styleTransformOrigin() {
			return {
				transformOrigin: `${this.transformOrigin.x}% ${this.transformOrigin.y}%`,
			};
		},
		styleOffset() {
			return {
				left: `${this.currentTransformOrigin.x}%`,
				top: `${this.currentTransformOrigin.y}%`,
			};
		},
		subordinates() {
			return this.chartInfo[this.childrenProperty];
		},
	},
	methods: {
		setInitialPosition(x, y) {
			this.chartParameters.move.start.x = x;
			this.chartParameters.move.start.y = y;
		},
		setFinalPosition(x, y) {
			this.chartParameters.move.end.x = x;
			this.chartParameters.move.end.y = y;
		},
		setOffset(left, top) {
			this.chartParameters.move.offset.left = left;
			this.chartParameters.move.offset.top = top;
		},
		startDrag(event) {
			const { clientX, clientY } = event.type === 'touchstart' ? event.touches[0] : event;

			// Possible dragging start
			this.clicked = true;

			// Get cursor position on click down
			this.setInitialPosition(clientX, clientY);
		},
		dragChart(event) {
			const { clientX, clientY } = event.type === 'touchmove' ? event.touches[0] : event;
			const { offsetTop, offsetLeft } = this.chartRef;

			this.cursorCoordinates(event);

			// Check if user still holding click
			if (!this.clicked) return;

			// Get the distance between last position and current cursor position
			this.setFinalPosition(
				this.initialPosition.x - clientX,
				this.initialPosition.y - clientY
			);

			this.setInitialPosition(clientX, clientY);

			this.setOffset(offsetLeft - this.finalPosition.x, offsetTop - this.finalPosition.y);
		},
		endDrag() {
			// User ends drag
			this.clicked = false;

			// Initialize initial position
			this.setInitialPosition(0, 0);
		},
		zoomChart(event) {
			const { wheelDeltaY } = event;

			event.preventDefault();

			let positionScaleAux = this.currentScale;

			// Check zoom in or zoom out
			positionScaleAux += wheelDeltaY > 0 ? this.scale.factor : -this.scale.factor;

			// Set scale limits
			positionScaleAux = Math.max(this.scale.min, positionScaleAux);
			positionScaleAux = Math.min(this.scale.max, positionScaleAux);

			this.setCurrentTransformOrigin();
			this.chartParameters.zoom.scale = Number(positionScaleAux.toFixed(1));
		},
		cursorCoordinates(event) {
			const x = event.clientX - this.containerRect.left;
			const y = event.clientY - this.containerRect.top;

			this.cursorPos = { x, y };

			this.getTransformOrigin(event);
		},
		getTransformOrigin(event) {
			const x = event.clientX - this.offset.left * 2 - this.containerRef.offsetLeft;
			const y = event.clientY - this.offset.top * 2 - this.containerRef.offsetTop;

			const side = this.containerRect.right - this.containerRect.left;

			// FIXME: TransformOrigin does not work, still different than cursor position
			this.chartParameters.zoom.currentTransformOrigin = {
				x: Number(((x - this.containerRect.left) / side).toFixed(2)) * 100,
				y: Number(((y - this.containerRect.top) / side).toFixed(2)) * 100,
			};
		},
		setCurrentTransformOrigin() {
			this.chartParameters.zoom.transformOrigin = {
				...this.currentTransformOrigin,
			};
		},
		centerChart() {
			this.setOffset(0, 0);
			this.chartParameters.zoom.scale = 1;
		},
	},
};
</script>

<template>
	<article
		:class="`relative border border-neutral-300 rounded-xl overflow-hidden w-full h-full bg-neutral-50 shadow-inner flex justify-center items-center ${
			!clicked ? 'cursor-grab' : 'cursor-grabbing'
		}`"
		ref="container"
		@mousedown.prevent="startDrag"
		@mousemove="dragChart"
		@mouseup="endDrag"
		@mouseleave="endDrag"
		@wheel="zoomChart"
	>
		<!-- 
            @touchstart="startDrag" 
            @touchmove="dragChart"
            @touchend="endDrag" -->
		<div
			v-if="showDebugPoints"
			class="absolute rounded-full w-4 h-4 border-2 border-blue-600 bg-blue-600"
			:style="{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }"
		></div>

		<section
			ref="chart"
			:class="`absolute w-full h-full flex justify-center items-center p-4 ${
				showDebugPoints ? 'border border-red-600' : ''
			}`"
			:style="[styleDrag, styleZoom, styleTransformOrigin]"
		>
			<div
				v-if="showDebugPoints"
				class="absolute rounded-full w-4 h-4 border-2 border-red-600 bg-red-600"
				:style="[styleOffset]"
			></div>

			<OrganizationTree
				v-if="!showDebugPoints"
				:sub-tree-info="chartInfo"
				:index="0"
				:number-of-children="subordinates.length"
				:children-property="childrenProperty"
				:query-selector="query"
			/>
		</section>

		<aside
			class="absolute top-2 right-2 flex flex-col gap-3 px-3 py-4 shadow-md rounded-3xl bg-neutral-100"
			@mousedown.stop
		>
			<button
				type="button"
				class="text-neutral-100 bg-blue-700 font-medium rounded-2xl text-sm px-5 py-2.5 select-none"
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

			<input
				v-model="query.email"
				type="text"
				class="rounded-2xl px-4 border border-blue-700 outline-none text-blue-800 h-10"
				placeholder="Find by email"
			/>
		</aside>

		<div
			v-if="showDebugPoints"
			class="absolute top-4 left-4 w-60 flex flex-col justify-center items-stretch gap-3"
		>
			<p class="text-md font-bold px-1 rounded border border-black-600">
				{{ `Scale: ${currentScale}` }}
			</p>
			<p class="text-md font-bold px-1 rounded border border-blue-600">
				{{ `x: ${cursorPosition.x}px y: ${cursorPosition.y}px` }}
			</p>
			<p class="text-md font-bold px-1 rounded border border-red-600">
				{{ `x: ${currentTransformOrigin.x}px y: ${currentTransformOrigin.y}px` }}
			</p>
			<p class="text-md font-bold px-1 rounded border border-black-600">
				{{ `left: ${offset.left}px  top: ${offset.top}px` }}
			</p>
		</div>
	</article>
</template>
