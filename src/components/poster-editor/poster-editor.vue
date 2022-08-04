<template>
	<div class="c-poster-editor">
		<!-- 素材 -->
		<div class="source">
			<el-tabs tab-position="left" value="text">
				<el-tab-pane label="背景" name="background" class="tab-image">
					<div class="item" v-for="img in backgroundList" :key="img" @click="backgroundAdd(img)"><img :src="img" /></div>
				</el-tab-pane>
				<el-tab-pane label="文本" name="text" class="tab-text">
					<div class="item title-big" @click="textAdd('大标题',42,true)">大标题</div>
					<div class="item title-small" @click="textAdd('小标题',28,true)">小标题</div>
					<div class="item content" @click="textAdd('正文内容')">正文内容</div>
				</el-tab-pane>
				<el-tab-pane label="边框" name="border" class="tab-image">
					<div class="item" v-for="img in borderList" :key="img" @click="imageAdd(img)"><img :src="img" /></div>
				</el-tab-pane>
				<el-tab-pane label="表情" name="emoji" class="tab-emoji">
					<div class="item" v-for="img in emojiList" :key="img" @click="imageAdd(img)"><img :src="img" /></div>
				</el-tab-pane>
				<el-tab-pane label="头像框" name="profile-border" class="tab-image">
					<div class="item" v-for="img in profileBorderList" :key="img" @click="imageAdd(img)"><img :src="img" /></div>
				</el-tab-pane>
			</el-tabs>
		</div>
		<!-- 海报 -->
		<div class="poster-box">
			<div class="poster" @click="element_index=-1" :style="{
			width:poster_width + 'px',
			height:poster_height + 'px',
			backgroundColor:poster_bg_color,
			backgroundImage:`url(${poster_bg_image})`,
			backgroundRepeat:'no-repeat',
			backgroundPosition:`${poster_bg_image_x + 'px'} ${poster_bg_image_y + 'px'}`,
			backgroundSize:`${poster_bg_image_width}% auto`,
		}">
				<div class="element" v-for="(item,index) in elements" :key="item.id" @click.stop="" :style="{
				fontFamily:item.fontFamily,
				color:item.color,
				fontSize:item.fontSize + 'px',
				fontStyle:item.italic ? 'italic' : 'normal',
				fontWeight:item.bold ? 'bold' : 'normal',
				width: item.width ? item.width + 'px' : '',
				height: item.height ? item.height + 'px' : 'auto',
				left:item.left + 'px',
				top:item.top + 'px',
				zIndex:item.zIndex,
				transform:'rotate('+item.rotate+'deg)',
				borderRadius:`${item.borderTopLeftRadius}px ${item.borderTopRightRadius}px ${item.borderBottomRightRadius}px ${item.borderBottomLeftRadius}px`,
			}" @mousedown="select(item,index)">
					<div v-if="item.type=='text'">{{item.text}}</div>
					<img v-if="item.type=='image'" :src="item.src" />
				</div>
			</div>
		</div>
		<!-- 工具栏 -->
		<div class="tools">
			<el-tabs tab-position="top" :stretch="true" value="setting">
				<el-tab-pane label="设置" name="setting" class="tab-setting">
					<el-button @click="save">保存</el-button>
					<el-menu :default-openeds="['1','2','3']" v-if="element_index>-1">
						<el-submenu index="1">
							<template slot="title">
								<span slot="title">
									位置
								</span>
							</template>
							<el-menu-item class="location">
								<div class="item">X：<el-input type="number" v-model="elements[element_index].left"></el-input>
								</div>
								<div class="item">Y：<el-input type="number" v-model="elements[element_index].top"></el-input>
								</div>
							</el-menu-item>
						</el-submenu>
						<el-submenu index="2">
							<template slot="title">
								<span slot="title">
									样式
								</span>
							</template>
							<el-menu-item v-if="element_current.type=='text'">
								<div class="item">文本：<el-input v-model="elements[element_index].text"></el-input>
								</div>
							</el-menu-item>
							<el-menu-item v-if="element_current.type=='text'">
								<div class="item">文字大小：<el-slider :step="1" :min="8" :max="120" v-model="elements[element_index].fontSize"></el-slider>
								</div>
							</el-menu-item>
							<el-menu-item v-if="element_current.type=='text'">
								<div class="item">字体： <el-select @change="fontChange" v-model="elements[element_index].fontFamily" placeholder="请选择">
										<el-option v-for="item in fontList" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</div>
							</el-menu-item>
							<el-menu-item v-if="element_current.type=='text'">
								<div class="item">颜色：<el-color-picker @active-change="colorChange" :value="elements[element_index].color"></el-color-picker>
								</div>
							</el-menu-item>
							<el-menu-item v-if="element_current.type=='text'">
								<div class="item">斜体：<el-switch v-model="elements[element_index].italic"></el-switch>
								</div>
							</el-menu-item>
							<el-menu-item v-if="element_current.type=='text'">
								<div class="item">加粗：<el-switch v-model="elements[element_index].bold"></el-switch>
								</div>
							</el-menu-item>
							<el-menu-item v-if="element_current.type=='image'">
								<div class="item">图片大小：<el-slider :step="1" :min="10" :max="300" v-model="elements[element_index].width"></el-slider>
								</div>
							</el-menu-item>
							<el-menu-item v-if="element_current.type=='image'">
								<div class="item">左上圆角：<el-slider :step="1" :min="0" :max="300" v-model="elements[element_index].borderTopLeftRadius"></el-slider>
								</div>
							</el-menu-item>
							<el-menu-item v-if="element_current.type=='image'">
								<div class="item">右上圆角：<el-slider :step="1" :min="0" :max="300" v-model="elements[element_index].borderTopRightRadius"></el-slider>
								</div>
							</el-menu-item>
							<el-menu-item v-if="element_current.type=='image'">
								<div class="item">左下圆角：<el-slider :step="1" :min="0" :max="300" v-model="elements[element_index].borderBottomRightRadius"></el-slider>
								</div>
							</el-menu-item>
							<el-menu-item v-if="element_current.type=='image'">
								<div class="item">右下圆角：<el-slider :step="1" :min="0" :max="300" v-model="elements[element_index].borderBottomLeftRadius"></el-slider>
								</div>
							</el-menu-item>
							<!-- <el-menu-item>
								<div class="item">旋转：<el-slider :step="1" :min="0" :max="360" v-model="elements[element_index].rotate"></el-slider>
								</div>
							</el-menu-item> -->
							<el-menu-item>
								<div class="item">层级： <el-input-number v-model="elements[element_index].zIndex" :min="0" :max="1000"></el-input-number>
								</div>
							</el-menu-item>
						</el-submenu>
						<el-submenu index="3">
							<template slot="title">
								<span slot="title">
									对齐方式
								</span>
							</template>
							<el-menu-item>
								<el-button @click="setLocation('left')">左对齐</el-button>
								<el-button @click="setLocation('center','x')">水平居中</el-button>
								<el-button @click="setLocation('right')">右对齐</el-button>
							</el-menu-item>
							<el-menu-item>
								<el-button @click="setLocation('top')">上对齐</el-button>
								<el-button @click="setLocation('center','y')">垂直居中</el-button>
								<el-button @click="setLocation('bottom')">下对齐</el-button>
							</el-menu-item>
						</el-submenu>
					</el-menu>
					<el-menu v-else :default-openeds="['1','2','3']">
						<el-submenu index="1">
							<template slot="title">
								<span slot="title">
									画布预设
								</span>
							</template>
							<el-menu-item>
								<div class="item">
									<el-button @click="setPosterSize(375,375)">头像</el-button>
									<el-button @click="setPosterSize(375,667)">屏幕</el-button>
									<el-button @click="setPosterSize(667,375)">屏幕（横）</el-button>
								</div>
							</el-menu-item>
						</el-submenu>
						<el-submenu index="2">
							<template slot="title">
								<span slot="title">
									画布大小
								</span>
							</template>
							<el-menu-item class="location">
								<div class="item">宽度：<el-input type="number" v-model="poster_width"></el-input>
								</div>
								<div class="item">高度：<el-input type="number" v-model="poster_height"></el-input>
								</div>
							</el-menu-item>
						</el-submenu>
						<el-submenu index="3">
							<template slot="title">
								<span slot="title">
									背景
								</span>
							</template>
							<el-menu-item>
								<div class="item">背景颜色：<el-color-picker @active-change="bgColorChange" :value="poster_bg_color"></el-color-picker>
								</div>
							</el-menu-item>
							<el-menu-item class="background-image">
								<div class="item">
									背景图片：
									<label>
										<input type="file" accept="image/*" class="bg-image-input" @change="backgroundImageChange" />
										<el-image :src="poster_bg_image">
											<div slot="error" class="image-slot">
												选择背景
											</div>
										</el-image>
									</label>
									<el-button v-if="poster_bg_image" type="danger" @click="backgroundImageDelete">删除</el-button>
								</div>
							</el-menu-item>
							<el-menu-item>
								<div class="item">背景图大小：<el-slider :step="1" :min="100" :max="200" v-model="poster_bg_image_width"></el-slider>
								</div>
							</el-menu-item>
							<el-menu-item class="location bg">
								<div class="item">
									位置：
									X：<el-input type="number" v-model="poster_bg_image_x"></el-input>
									Y：<el-input type="number" v-model="poster_bg_image_y"></el-input>
								</div>
							</el-menu-item>
						</el-submenu>
					</el-menu>
				</el-tab-pane>
				<el-tab-pane label="图层" name="layer" class="tab-layer">
					<div class="item" :class="{current:index==element_index}" v-for="(item,index) in elements" :key="index" @click="element_index=index">
						{{index+1}}、{{item.type=='text'?item.text:'图片'}}
						<el-button type="danger" @click="layerDelete(item.id)">删除</el-button>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script>
import posterEditor from './poster-editor.js'
export default {
	...posterEditor
}
</script>
<style lang="less">
@import url('./poster-editor.less');
</style>