<template>
    <div :is="tag" class="pin-container" style="position: relative;"><slot></slot></div>
</template>
<script>
export default {
    name: "PinContainer",
    props: {
        tag: {
            type: String,
            default: "div"
        }
    }
}
</script>
