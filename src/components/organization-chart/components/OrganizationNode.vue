<script>
export default {
	name: 'OrganizationNode',
	components: {},
	emits: ['expand'],
	props: {
		nodeInfo: {
			type: Object,
			required: true,
		},
		hasChildren: {
			type: Boolean,
			default: false,
		},
		querySelector: {
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
			expanded: true,
			isHighlighted: false,
			showTotalChildren: false,
		};
	},
	computed: {
		properties() {
			return Object.keys(this.nodeInfo)
				.sort()
				.filter(
					(key) =>
						!Array.isArray(this.nodeInfo[key]) &&
						typeof this.nodeInfo[key] !== 'object' &&
						!['name', 'position'].includes(key)
				);
		},
		highlightedSectionClass() {
			return !this.isHighlighted ? 'border-blue-700' : 'border-amber-500';
		},
		highlightedHeaderClass() {
			return !this.isHighlighted ? 'bg-blue-700' : 'bg-amber-500';
		},
	},
	watch: {
		querySelector: {
			deep: true,
			handler() {
				let propertyWithInfo = [];
				let propertyFound = [];
				Object.keys(this.querySelector).map((property) => {
					let selected = false;
					switch (typeof this.querySelector[property]) {
						case 'string':
							if (this.querySelector[property].trim().length) {
								propertyWithInfo.push(property);
								selected =
									this.nodeInfo[property]
										?.toLowerCase()
										.includes(this.querySelector[property].toLowerCase()) ??
									false;
								propertyFound.push(selected);
							}
							break;

						default:
							break;
					}
				});

				this.isHighlighted =
					propertyWithInfo.length &&
					propertyFound.length === propertyWithInfo.length &&
					!propertyFound.some((selected) => selected === false);
			},
		},
	},
	methods: {
		emitExpand() {
			this.expanded = !this.expanded;
			this.$emit('expand');
		},
	},
};
</script>

<template>
	<section
		:class="`relative border ${highlightedSectionClass} rounded-2xl w-80 select-none shadow-lg min-h-40 flex flex-col flex-wrap justify-between items-stretch`"
	>
		<header
			:class="`border-b px-4 py-2 ${highlightedHeaderClass} rounded-t-xl text-neutral-100`"
		>
			<h3 class="text-xl font-bold whitespace-nowrap">{{ nodeInfo.name }}</h3>
			<p
				class="text-xs text-thin text-left"
				v-show="nodeInfo.position"
			>
				{{ nodeInfo.position }}
			</p>
		</header>

		<ul class="grow p-4 flex flex-col justify-start items-start">
			<li
				v-for="property in properties"
				:key="property"
			>
				<span class="font-semibold">{{ property }}: </span
				><span class="text-xs">{{ this.nodeInfo[property] }}</span>
			</li>
		</ul>

		<footer
			:class="`h-5 relative flex justify-center items-center ${
				hasChildren ? 'cursor-pointer' : ''
			}`"
			@click="emitExpand"
		>
			<Transition name="fade">
				<div
					v-if="hasChildren"
					class="absolute -bottom-4 z-10 bg-neutral-100 border border-blue-700 rounded-full flex justify-center items-center text-blue-700"
				>
					<p
						v-if="!expanded"
						:class="`${
							!showTotalChildren ? 'w-8' : 'w-fit'
						} h-8 px-3 flex justify-around items-center gap-1`"
						@mouseover="showTotalChildren = true"
						@mouseleave="showTotalChildren = false"
					>
						<fontAwesomeIcon :icon="['fas', 'chevron-down']" />

						<span
							v-if="showTotalChildren"
							class="whitespace-nowrap font-semibold"
						>
							{{ `+${nodeInfo[childrenProperty].length}` }}
						</span>
					</p>
					<p
						v-else
						class="w-8 h-8 px-3 flex justify-around items-center gap-1"
					>
						<fontAwesomeIcon :icon="['fas', 'chevron-up']" />
					</p>
				</div>
			</Transition>
		</footer>
	</section>
</template>

<style scoped></style>
