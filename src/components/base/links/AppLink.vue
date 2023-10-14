<template>
    <a
        v-if="isExternalLink"
        v-bind="$attrs"
        :href="to"
        target="_blank"
    >
        <slot />
    </a>

    <RouterLink
        v-else
        v-bind="$props"
        custom
        v-slot="{ isActive, href, navigate }"
    >
        <a
            v-bind="$attrs"
            :href="href"
            @click="navigate"
            :class="isActive ? activeClass : inactiveClass"
        >
            <slot />
        </a>
    </RouterLink>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
    name: 'AppLink',
    inheritAttrs: false,
    components: {
        RouterLink,
    },
    props: {
        ...RouterLink.props, // Getting all RouterLink props to extend it
        inactiveClass: String,
    },

    computed: {
        isExternalLink() {
            return typeof this.to === 'string' && this.to.startsWith('http');
        },
    },
};
</script>
