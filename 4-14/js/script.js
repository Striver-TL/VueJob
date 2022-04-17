(() => {
    const { createApp, reactive, defineComponent, onBeforeMount, computed } = Vue
    // 信息添加组件
    const AddComponent = defineComponent({
        props: {
            // 数据验证器（必传）
            validator: {
                type: Function,
                required: true
            }
        },
        setup(prop, context) {
            // 用于存储用户信息
            const userinfo = reactive({})
            // 数据初始化
            const init = () => {
                userinfo.name = "";
                userinfo.age = "";
            }
            // 数据提交方法
            const toSubmit = () => {
                let validResult = prop.validator(userinfo);
                if (validResult.name === null) {
                    alert("姓名不能为空");
                } else if (validResult.name === false) {
                    alert("姓名只能包含中英文");
                } else if (validResult.age === null) {
                    alert("年龄不能为空");
                } else if (validResult.age === false) {
                    alert("年龄输入错误");
                } else {
                    context.emit("userinfo-submit", {...userinfo});
                    init();
                }
            }

            // 绑定前钩子函数
            // 数据初始化
            onBeforeMount(init)
            return {
                userinfo,
                init,
                toSubmit
            }
        },
        template: `
            <div class="add">
                <div>
                    <span>姓名</span>
                    <input type="text" placeholder="请输入姓名" name="name" v-model="userinfo.name" />
                </div>
                <div>
                    <span>年龄</span>
                    <input type="text" placeholder="请输入年龄" name="age" v-model="userinfo.age" />
                </div>
                <div>
                    <input type="button" @click="toSubmit" class="btn btn-primary" value="提交信息">
                </div>
            </div>
        `
    })

    // 信息展示组件
    const ShowComponent = defineComponent({
        props: {
            // 数据集
            userinfos: {
                // 数组类型
                type: Array,
                // 必传
                required: true
            }
        },
        setup(prop, context) {
            // 删除数据方法
            const deleteUserinfo = index => {
                context.emit("userinfo-delete", index);
            }
            return {
                deleteUserinfo
            }
        },
        template: `
        <div class="show">
            <table class="table">
                <thead>
                    <tr>
                        <td>名字</td>
                        <td>年龄</td>
                        <td>操作</td>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="userinfos.length">
                        <tr v-for="userinfo, index in userinfos" :key="index">
                            <td>{{userinfo.name}}</td>
                            <td>{{userinfo.age}}</td>
                            <td><button @click="deleteUserinfo(index)" class="btn btn-warning">删除</button></td>
                        </tr>
                    </template>
                    <tr v-else>
                        <td colspan="3">暂无信息</td>
                    </tr>
                </tbody>
            </table>
        </div>
        `
    })

    // Vue根组件主要用于构建页面及数据管理
    createApp({
        setup() {
            // 用户数据集
            const userinfos = reactive([]);
            let title = "添加信息，年龄占比";

            // 青年人占比计算属性（百分比）
            const puberRatio = computed(() => 
                Math.floor(userinfos.filter(e => 
                    e.age > 16 && e.age < 25
                ).length / (userinfos.length ? userinfos.length : 1)* 100)
            )

            // 操作数据集的方法
            // 获取数据
            const getUserinfos = () => {
                // 异步获取（由于是模拟获取数据暂不考虑reject）
                new Promise((resolve) => {
                    // 返回JSON数据
                    resolve('[{"name": "小花", "age": 23}, {"name": "李俊", "age": 16}]')
                })
                    .then(data => {
                        // 将获取的数据添加到数据集众
                        userinfos.push.apply(userinfos, JSON.parse(data));
                    })
            }

            // 添加数据
            const addUserinfo = userinfo => {
                userinfo.age = parseInt(userinfo.age);
                userinfos.push(userinfo);
            }

            // 删除数据
            const deleteUserinfo = index => {
                userinfos.splice(index, 1);
            }

            // 用户数据验证器
            const validator = userinfo => {
                let { name, age } = userinfo;
                let result = {
                    name: true,
                    age: true
                }
                if (name === "") {
                    result.name = null;
                } else if (!/^[\u4E00-\u9FA5A-Za-z]+$/.test(name)) {
                    result.name = false;
                }
                if (age === "") {
                    result.age = null;
                } else if (/[^\d]/g.test(age) || age <= 0) {
                    result.age = false;
                }
                return result;
            }

            // 渲染前数据初始化
            onBeforeMount(() => {
                getUserinfos();
            })

            return {
                userinfos,
                addUserinfo,
                getUserinfos,
                deleteUserinfo,
                validator,
                title,
                puberRatio
            }
        },
        components: {
            AddComponent,
            ShowComponent
        },
        template: `
        <div class="container">
        <h1 class="title">{{title}}</h1>
        <div class="progress progress-striped">
          <div
            class="progress-bar progress-bar-danger"
            role="progressbar"
            :aria-valuenow="puberRatio"
            aria-valuemin="0"
            aria-valuemax="100"
            :style="{
                    width: puberRatio + '%'
                }"
          >
            青年人占比{{ puberRatio }}%
          </div>
        </div>
        <div class="content clearfix">
          <add-component
            :validator="validator"
            @userinfo-submit="addUserinfo"
            class="pull-left"
          ></add-component>
          <show-component
            :userinfos="userinfos"
            @userinfo-delete="deleteUserinfo"
            class="pull-left"
          ></show-component>
        </div>
      </div>
        `
    }).mount("#app");

})();