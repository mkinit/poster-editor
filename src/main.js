import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import { Tabs, TabPane, Menu, MenuItem, Submenu, Button, Input, ColorPicker, Switch, InputNumber, Slider, Image, Select, Option } from 'element-ui'
Vue.use(Tabs).use(TabPane).use(Menu).use(MenuItem).use(Submenu).use(Button).use(Input).use(ColorPicker).use(Switch).use(InputNumber).use(Slider).use(Image).use(Select).use(Option)
Vue.prototype.$ELEMENT = { size: 'small' }

//element-ui API
import { Message, MessageBox, Loading } from 'element-ui'
Vue.prototype.$loading = Loading
Vue.prototype.$message = Message
Vue.prototype.$messageBox = MessageBox

new Vue({
	render: h => h(App),
}).$mount('#app')