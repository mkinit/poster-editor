const element_text = {
	id: 1,
	type: 'text',
	text: '标题',
	fontFamily: '',
	fontSize: 16,
	italic: false, //斜体
	bold: false, //加粗
	color: '#333333',
	left: 3,
	top: 3,
	zIndex: 0,
	rotate: 0, //旋转
}
const element_image = {
	id: 2,
	type: 'image',
	src: '',
	width: 100,
	height: 0,
	borderTopLeftRadius: 0,
	borderTopRightRadius: 0,
	borderBottomRightRadius: 0,
	borderBottomLeftRadius: 0,
	left: 3,
	top: 3,
	zIndex: 0,
	rotate: 0,
}
import { nanoid } from 'nanoid'
import html2canvas from 'html2canvas'
export default {
	name: 'c-poster-editor',
	data() {
		return {
			poster_width: 375,
			poster_height: 667,
			poster_bg_color: '#FFFFFF',
			poster_bg_image: '',
			poster_bg_image_x: 0,
			poster_bg_image_y: 0,
			poster_bg_image_width: 100,

			elements: [], //要渲染的元素
			element_index: -1, //当前选择的元素序号
		}
	},
	props: {
		/*
			字体列表，字体文件放到“应用根目录/poster/fonts”中
			{
				label: '显示的字体名称',
				value: '注册到CSS的字体名和文件名'
			}
		*/
		fontList: {
			type: Array,
			default: () => []
		},

		/*
			背景列表，图片文件放到“应用根目录/poster/background”中
		*/
		backgroundList: {
			type: Array,
			default: () => []
		},

		/*
			边框列表，图片文件放到“应用根目录/poster/border”中
		*/
		borderList: {
			type: Array,
			default: () => []
		},

		/*
			表情列表，图片文件放到“应用根目录/poster/emoji”中
		*/
		emojiList: {
			type: Array,
			default: () => []
		},

		/*
			头像框列表，图片文件放到“应用根目录/poster/profile-border”中
		*/
		profileBorderList: {
			type: Array,
			default: () => []
		},
	},
	methods: {
		//预设画布大小
		setPosterSize(width, height) {
			this.poster_width = width
			this.poster_height = height
		},

		//背景颜色
		bgColorChange(value) {
			this.poster_bg_color = value
		},

		//文本颜色
		colorChange(value) {
			this.elements[this.element_index].color = value
		},

		//切换字体
		fontChange(value) {
			if (!value || this[value]) return
			this[value] = document.createElement('style')
			this[value].type = 'text/css'
			this[value].innerText = `@font-face {font-family: '${value}';src: url('/poster/fonts/${value}.ttf');}`
			document.head.appendChild(this[value])
		},

		//添加文本
		textAdd(text = '文本', size = 16, bold = false) {
			const element = JSON.parse(JSON.stringify(element_text))
			element.id = nanoid()
			element.text = text
			element.fontSize = size
			element.bold = bold
			this.elements.push(element)
			this.element_index = this.elements.length - 1
		},

		//添加图片
		imageAdd(src) {
			const loadingInstance = this.$loading.service()
			const element = JSON.parse(JSON.stringify(element_image))
			const img = document.createElement('img')
			img.src = src
			img.onload = () => {
				const base64 = this.toBase64(img)
				element.id = nanoid()
				element.src = base64
				this.elements.push(element)
				this.element_index = this.elements.length - 1
				setTimeout(() => {
					loadingInstance.close()

				}, 0)
			}
		},
		toBase64(img) {
			var canvas = document.createElement('canvas')
			canvas.width = img.width
			canvas.height = img.height
			var ctx = canvas.getContext('2d')
			ctx.drawImage(img, 0, 0, img.width, img.height)
			return canvas.toDataURL('image/png')
		},
		//添加背景
		backgroundAdd(src) {
			const loadingInstance = this.$loading.service()
			const img = document.createElement('img')
			img.src = src
			img.onload = () => {
				const base64 = this.toBase64(img)
				setTimeout(() => {
					loadingInstance.close()
					this.poster_bg_image = base64
				}, 0)
			}
		},
		//选择本地图片背景
		backgroundImageChange(event) {
			const reads = new FileReader();
			reads.readAsDataURL(event.target.files[0])
			reads.onload = () => {
				this.poster_bg_image = reads.result
			}
		},
		//删除背景
		backgroundImageDelete() {
			this.$messageBox
				.confirm('是否删除背景', '提示', { type: 'warning' })
				.then(() => {
					this.poster_bg_image = ''
					this.$message({
						type: 'success',
						message: '背景已删除'
					})
				})
		},
		//元素的选择和拖动
		select(element, index) {
			if (event.stopPropagation) event.stopPropagation()
			if (event.preventDefault) event.preventDefault()
			event.cancelBubble = true
			event.returnValue = false

			this.element_index = index

			//点击时的鼠标坐标
			const x_click = event.clientX
			const y_click = event.clientY

			//点击时的元素坐标
			const left = element.left ? parseInt(element.left) : 0
			const top = element.top ? parseInt(element.top) : 0
			document.onmousemove = event => {

				//正在移动的鼠标坐标
				const x_move = event.clientX
				const y_move = event.clientY

				element.left = (x_move - x_click + left)
				element.top = (y_move - y_click + top)



			}
			document.onmouseup = () => {
				document.onmousemove = null
				document.onmousedown = null
			}
		},

		//生成图片保存
		save() {
			this.element_index = -1
			this.$nextTick(() => {
				html2canvas(document.querySelector('.poster'), {
					allowTaint: true, //允许跨域图片污染画布
					useCORS: true, //尝试使用 CORS 从服务器加载图像
					scale: 2,
				}).then(canvas => {
					const a = document.createElement("a");
					a.href = canvas.toDataURL();
					a.download = '海报';
					a.click();
				})
			})
		},

		//删除图层
		layerDelete(id) {
			this.$messageBox
				.confirm('是否删除图层', '提示', { type: 'warning' })
				.then(() => {
					this.element_index = -1
					const { elements } = this
					const index = elements.findIndex(element => element.id == id)
					elements.splice(index, 1)
					this.$message({
						type: 'success',
						message: '图层已删除'
					})
				})
		},

		//设置位置
		setLocation(location, direction) {
			const { poster_width, poster_height, elements, element_index } = this
			const element = document.querySelectorAll('.poster .element')[element_index]
			const width = parseInt(getComputedStyle(element).width)
			const height = parseInt(getComputedStyle(element).height)
			switch (location) {
				case 'left':
					elements[element_index].left = 0
					break
				case 'right':
					elements[element_index].left = poster_width - width
					break
				case 'top':
					elements[element_index].top = 0
					break
				case 'bottom':
					elements[element_index].top = poster_height - height
					break
				case 'center':
					switch (direction) {
						case 'x':
							elements[element_index].left = (poster_width / 2) - (width / 2)
							break
						case 'y':
							elements[element_index].top = (poster_height / 2) - (height / 2)
							break
					}
					break
			}
		},
	},
	computed: {
		element_current() {
			const { elements, element_index } = this
			if (element_index < 0) return {}
			return elements[element_index]
		}
	},
}