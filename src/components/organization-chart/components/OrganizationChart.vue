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
			intervalId: null,
			intervalTime: 3000,
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
				drag: {
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
					start: {
						x: 0,
						y: 0,
					},
					end: {
						x: 0,
						y: 0,
					},
					offset: {
						x: 0,
						y: 0,
					},
				},
			},
			showDebugPoints: true,
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
		chartDragRef() {
			return this.$refs.chartDrag;
		},
		initialPosition() {
			return this.chartParameters.drag.start;
		},
		finalPosition() {
			return this.chartParameters.drag.end;
		},
		offsetDrag() {
			return this.chartParameters.drag.offset;
		},
		currentScale() {
			return this.chartParameters.zoom.scale;
		},
		initialZoom() {
			return this.chartParameters.zoom.start;
		},
		finalZoom() {
			return this.chartParameters.zoom.end;
		},
		offsetZoom() {
			return this.chartParameters.zoom.offset;
		},
		cursorPosition() {
			return this.cursorPos;
		},
		styleDrag() {
			return {
				top: `${this.offsetDrag.top}px`,
				left: `${this.offsetDrag.left}px`,
				translate: `${this.offsetDrag.left}px ${this.offsetDrag.top}px`,
			};
		},
		styleZoom() {
			return {
				transform: `translate(${this.offsetZoom.x}px, ${this.offsetZoom.y}px) scale(${this.currentScale})`,
				transformOrigin: '50% 50%',
			};
		},
		subordinates() {
			return this.chartInfo[this.childrenProperty];
		},
	},
	unmounted() {
		clearInterval(this.intervalId);
	},
	methods: {
		setInitialPosition(x, y) {
			this.chartParameters.drag.start.x = x;
			this.chartParameters.drag.start.y = y;
		},
		setFinalPosition(x, y) {
			this.chartParameters.drag.end.x = x;
			this.chartParameters.drag.end.y = y;
		},
		setOffsetDrag(left, top) {
			this.chartParameters.drag.offset.left = left;
			this.chartParameters.drag.offset.top = top;
		},
		setInitialZoom(x, y) {
			this.chartParameters.zoom.start.x = x;
			this.chartParameters.zoom.start.y = y;
		},
		setFinalZoom(x, y) {
			this.chartParameters.zoom.end.x = x;
			this.chartParameters.zoom.end.y = y;
		},
		setOffsetZoom(x, y) {
			this.chartParameters.zoom.offset.x = x;
			this.chartParameters.zoom.offset.y = y;
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
			const { offsetTop, offsetLeft } = this.chartDragRef;

			this.cursorCoordinates(event);

			if (!this.intervalId) {
				this.intervalId = setInterval(() => {
					this.setInitialZoom(this.cursorPosition.x, this.cursorPosition.y);
				}, this.intervalTime);
			}

			// Check if user still holding click
			if (!this.clicked) return;

			// Get the distance between last position and current cursor position
			this.setFinalPosition(
				this.initialPosition.x - clientX,
				this.initialPosition.y - clientY
			);

			this.setInitialPosition(clientX, clientY);

			this.setOffsetDrag(offsetLeft - this.finalPosition.x, offsetTop - this.finalPosition.y);
		},
		endDrag() {
			// User ends drag
			this.clicked = false;

			// Initialize initial position
			this.setInitialPosition(0, 0);
		},
		zoomChart(event) {
			const { wheelDeltaY, clientX, clientY } = event;
			let scaleAux = this.currentScale;

			event.preventDefault();

			// Check zoom in or zoom out
			scaleAux += wheelDeltaY > 0 ? this.scale.factor : -this.scale.factor;

			// Set scale limits
			scaleAux = Math.min(this.scale.max, Math.max(this.scale.min, scaleAux));

			if (this.currentScale !== scaleAux) {
				this.manageZoom(clientX, clientY);

				this.chartParameters.zoom.scale = Number(scaleAux.toFixed(1));
			}
		},
		manageZoom(clientX, clientY) {
			if (this.initialZoom.x - clientX > 50 || this.initialZoom.y - clientY > 50) {
				this.setFinalZoom(this.initialZoom.x - clientX, this.initialZoom.y - clientY);
			}

			// this.setInitialPosition(clientX, clientY);

			this.setOffsetZoom(this.finalZoom.x, this.finalZoom.y);
		},
		cursorCoordinates(event) {
			const x = event.clientX - this.containerRef.getBoundingClientRect().left;
			const y = event.clientY - this.containerRef.getBoundingClientRect().top;

			this.cursorPos = { x, y };
		},
		centerChart() {
			this.setOffsetDrag(0, 0);
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
			class="absolute z-10 rounded-full w-4 h-4 border-2 border-blue-600 bg-blue-600"
			:style="{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }"
		></div>

		<div
			ref="chartZoom"
			:class="`w-full h-full flex justify-center items-center p-4 ${
				showDebugPoints ? 'border border-red-600' : ''
			}`"
			:style="[styleZoom]"
		>
			<div
				ref="chartDrag"
				:class="`absolute origin-center	 w-full h-full flex justify-center items-center p-4 ${
					showDebugPoints ? 'border border-green-600' : ''
				}`"
				:style="[styleDrag]"
			>
				<OrganizationTree
					v-if="!showDebugPoints || true"
					:sub-tree-info="chartInfo"
					:index="0"
					:number-of-children="subordinates.length"
					:children-property="childrenProperty"
					:query-selector="query"
				/>
			</div>
		</div>

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
			<p class="text-md font-bold px-1 rounded border border-black-600">
				{{ `left: ${offsetDrag.left}px  top: ${offsetDrag.top}px` }}
			</p>
		</div>
	</article>
</template>
