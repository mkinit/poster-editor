<template>
	<div id="app">
		<posterEditor :font-list="fonts" :background-list="background_list" :border-list="border_list" :emoji-list="emoji_list" :profile-border-list="profile_border_list" />
	</div>
</template>
<script>
import posterEditor from '@/components/poster-editor/poster-editor.vue'
export default {
	name: 'App',
	data() {
		return {
			fonts: [{
				label: '默认',
				value: ''
			}, {
				label: 'Aa剑豪体',
				value: 'Aa剑豪体'
			}, {
				label: '铁蒺藜体',
				value: '铁蒺藜体'
			}, {
				label: '悠然小楷',
				value: '悠然小楷'
			}],
			background_list: [
				'/poster/background/1.jpg',
				'/poster/background/2.jpg',
				'/poster/background/3.jpg',
				'/poster/background/4.jpg'
			],
			border_list: [
				'/poster/border/1.png',
				'/poster/border/2.png',
				'/poster/border/3.png',
			],
			emoji_list: [
				'/poster/emoji/1.png',
				'/poster/emoji/2.png',
				'/poster/emoji/3.png',
				'/poster/emoji/4.png',
				'/poster/emoji/5.png',
				'/poster/emoji/6.png',
				'/poster/emoji/7.png',
			],
			profile_border_list: [
				'/poster/profile-border/1.png',
				'/poster/profile-border/2.png',
				'/poster/profile-border/3.png',
				'/poster/profile-border/4.png',
				'/poster/profile-border/5.png',
				'/poster/profile-border/6.png',
				'/poster/profile-border/7.png',
			]
		}
	},
	components: {
		posterEditor
	}
}
</script>
<style>
#app {}
</style>