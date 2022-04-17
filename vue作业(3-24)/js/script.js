window.onload = () => {
    new Vue({
        el: "#app",
        data: {
            userinfo: [],
            isChange: false,
            user: null,
            date: new Date()
        },
        created() {
            this.init()
        },
        mounted() {
            setInterval(() => {
                this.date = new Date()
            }, 100)
        },
        computed: {
            nowDate() {
                let reg = /\b(?=\d$)/g
                return `${Math.floor(this.date.getHours()).toString().replace(reg, 0)} : ${Math.floor(this.date.getMinutes()).toString().replace(reg, 0)} : ${Math.floor(this.date.getSeconds()).toString().replace(reg, 0)}`
            }
        },
        methods: {
            // 学号输入规则
            idInputRule(e) {
                this.user.id = e.target.value.replace(/\D/g, "")
            },
            // 班级输入规则
            classInputRule(e) {
                this.user.classname = e.target.value.replace(" ", "")
            },
            // 数据初始化
            init() {
                this.user = {
                    id: "",
                    name: "",
                    classname: ""
                }
                this.isChange = false
            },

            /**
             * 数据验证器
             * @param { Number | undefined } index 正在修改的数据的索引 
             * @returns { Boolean } 是否通过验证
             */
            validator(index) {
                let msg = {
                    id: "学号",
                    name: "姓名",
                    classname: "班级"
                }
                this.user.name = this.user.name.replace(/(^\s+|\s+$)/g, "").replace(/\s+/g, " ")

                // 验证输入是否为空
                for (let key in this.user) {
                    if (this.user[key] === "") {
                        alert(`${msg[key]}不能为空！`)
                        return false
                    }
                }

                // 验证学号是否已存在
                for (key in this.userinfo) {
                    if (this.user.id === this.userinfo[key].id && index !== parseInt(key)) {
                        alert("学号不能重复")
                        return false
                    }
                }

                return true
            },

            // 数据添加
            add() {
                if (this.validator()) {
                    this.userinfo.push(this.user)
                    this.init()
                }
            },
            // 数据删除
            del(index) {
                this.userinfo.splice(index, 1)
                this.init()
            },
            // 切换为修改状态
            change(index) {
                this.isChange = index
                let user = this.userinfo[index]
                for (let key in user) {
                    this.user[key] = user[key]
                }
            },
            // 修改数据
            toChange(index) {
                if (this.isChange === false) return
                if (this.validator(index)) {
                    this.userinfo.splice(index, 1, this.user)
                    this.init()
                }
            }
        }
    })
}