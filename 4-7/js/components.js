const { UserInfo, components, cloneObject } = (() => {
  /**
   * 对象的克隆
   * @author TengLong
   * @param { Object } origin 被克隆对象
   * @param { Object } target 目标对象
   */

  const cloneObject = (origin, target) => {
    for (let key in origin) {
      if (Object.prototype.toString.call(origin[key]) === "[object Array]") {
        target[key] = origin[key].concat();
        console.log(1111)
      } else {
        target[key] = origin[key];
      }
    }
  };

  /**
   * 员工信息类
   * @author TengLong
   * @constructor
   */
  class UserInfo {
    constructor() {
      this.id = this.name = this.job = this.gender = "";
      this.skill = [];
    }
    /**
     * 数据验证器
     * @returns { Object<String, Boolean> } 包含每个信息是否通过验证
     */
    validator() {
      let result = {
        id: true,
        name: true,
        job: true,
        gender: true,
        skill: true,
      };
      if (this.id === "") result.id = false;
      if (this.name.trim().replace(/\s{2,}/g, " ") === " " || this.name === "")
        result.name = false;
      if (this.job === "") result.job = false;
      if (this.gender === "") result.gender = false;
      if (!this.skill.length) result.skill = false;
      return result;
    }
  }

  const components = {
    /**
     * 模态框组件
     * @author TengLong
     *
     */
    AlertMessage: {
      props: {
        // 是否显示模态框
        show: {
          type: Boolean,
          required: false,
          value: false,
        },
      },
      methods: {
        // 关闭模态框，通知父组件进行关闭（保证开关都由提供者管理）
        closeMotal() {
          this.$emit("close");
        },
      },
      template: `
                <div class="motalbox" v-if="show">
                    <div class="motalbox-content">
                        <slot name="default"></slot>
                        <span class="motalbox-close" @click="closeMotal"></span>
                    </div>
                </div>
            `,
    },

    /**
     * 员工信息组件
     * @author TengLong
     */
    PeopleInfo: {
      props: {
        // 是否为更改操作
        isChange: {
          type: Number,
          required: true,
          value: -1,
        },
        // 更改的源数据
        changeUserInfo: {
          type: UserInfo,
          required: false,
          value: null,
        },
      },
      created() {
        // 初始化数据
        this.init();
        // 如果是编辑页面并且传入了被编辑的数据
        if (this.isChange > -1 && this.changeUserInfo) {
          // 克隆对象
          cloneObject(this.changeUserInfo, this.userInfo);
        }
      },
      data() {
        return {
          // 员工信息
          userInfo: null,
          select: {
            gender: ["男", "女", "保密"],
            skill: [
              "Bootstrap",
              "Vue",
              "Angular",
              "React",
              "Spring Boot",
              "MongoDB",
              "MySQL",
              "python",
              "CSS",
            ],
            job: [
              "服务端",
              "设计",
              "前端",
              "后端",
              "运维",
              "自动化测试",
              "游戏开发",
              "大数据",
            ],
          },
          // 技能数据先与员工信息分离为了方便数据绑定，提交之前进行合并
          // skill: null,
          // 数据验证机结果集
          validResult: {},
        };
      },
      methods: {
        init() {
          this.userInfo = new UserInfo();
          for (let key in this.userInfo) {
            this.validResult[key] = true;
          }
        },
        // 控制编号只能为数字
        onlyNumber() {
          this.userInfo.id = this.userInfo.id.replace(/[^\d]/g, "");
        },
        // 数据提交方法
        toSubmit() {
          // 创建新的员工信息
          let userInfo = new UserInfo();
          cloneObject(this.userInfo, userInfo);
          // isChange > -1表示这是编辑的数据
          this.isChange > -1
            ? this.$emit("submitinfo", {
              index: this.isChange,
              userInfo,
            })
            : this.$emit("submitinfo", userInfo, this.init.bind(this));
        },
        // 技能数据排序（保证顺序一致）
        sortSkill() {
          this.userInfo.skill.sort(
            (a, b) =>
              this.select.skill.indexOf(a) - this.select.skill.indexOf(b)
          );
        },
      },
      template: `
        <div class="userinfo">
            <slot name="title"></slot>
            <div class="userinfo-form">
                <div :class="['userinfo-id', validResult.id ? '' : 'has-error']" v-if="isChange < 0">
                    <span>编号</span>
                    <input type="text" class="form-control"  placeholder="输入员工编号" name="id" @input="onlyNumber" v-model="userInfo.id"/>
                </div>
                <div :class="['userinfo-name', validResult.name ? '' : 'has-error']">
                    <span>姓名</span>
                    <input type="text" class="form-control"  placeholder="输入员工姓名" name="name" v-model="userInfo.name">
                </div>
                <div :class="['userinfo-job', validResult.job ? '' : 'has-error']">
                    <span>职位</span>
                    <select v-model="userInfo.job" class="form-control">
                        <option value=""></option>
                        <option v-for="item, index in select.job" :key="index" :value="item">{{item}}</option>
                    </select>
                </div>
                <div :class="['userinfo-gender', validResult.gender ? '' : 'has-error']">
                    <span>性别</span>
                    <div class="radio">
                        <label v-for="item, index in select.gender" :key="index">
                            <input type="radio" name="gender" :value="item" v-model="userInfo.gender"/>
                            <span>{{item}}</span>
                        </label>
                    </div>
                </div>
                <div :class="['userinfo-skill', validResult.skill ? '' : 'has-error']">
                    <span>专业技能</span>
                    <div class="checkbox">
                        <label v-for="item, index in select.skill" :key="index">
                            <input type="checkbox" :value="item" @change="sortSkill" v-model="userInfo.skill"/>
                            <span>{{item}}</span>
                        </label>
                    </div>
                </div>
            </div>
            <slot name="btn" :toSubmit="toSubmit" :init="init"></slot>
        </div>
        `,
    },

    /**
     * 员工管理组件
     * @author TengLong
     */
    // PeopleManage: {},
  };

  for (let key in components) {
    components[key] = Vue.defineComponent(components[key]);
  }

  return {
    UserInfo,
    components,
    cloneObject,
  };
})();
