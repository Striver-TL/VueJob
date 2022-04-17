window.onload = () => {
  let { ref, reactive, onBeforeMount, watch, computed } = Vue;
  let app = Vue.createApp({
    setup() {
      // 信息处理部分代码---------------------------------------------------------------------------------
      // userinfos 所有员工信息
      // showUserinfos 显示的员工信息
      // deleteIndex 用于存储要删除的用户信息索引
      // showConfirm 是否显示确认删除模态框
      // showEditor 是否显示编辑模态框
      // edtiorItem 用于存储被编辑的员工信息
      // changeIndex 用于存储被编辑的员工信息索引
      // keyword 搜索关键字
      // showMessage 显示消息提示模态框
      // message 消息提示模态框的文本内容
      let userinfos = reactive([]);
      let showUserinfos = reactive([]);
      let deleteIndex = ref(-1);
      let showConfirm = ref(false);
      let showEditor = ref(false);
      let editorItem = reactive(new UserInfo());
      let changeIndex = ref(-1);
      let keyword = ref("");
      let showMessage = ref(false);
      let message = ref("");

      // 方法---------------------------------------
      // 获取数据
      let getUserinfos = () => {
        new Promise((resolve) => {
          resolve(
            '[{"id":"1","name":"alice","gender":"女","job":"前端","skill":["Bootstrap","Vue","CSS"]},{"id":"2","name":"bob","gender":"男","job":"服务端","skill":["Spring Boot","MySQL","MangoDB"]},{"id":"3","name":"king","gender":"男","job":"设计","skill":["Angular","React"]},{"id":"4","name":"mike","gender":"男","job":"前端","skill":["Bootstrap","Vue","React","CSS"]},{"id":"5","name":"mary","gender":"女","job":"自动化测试","skill":["Python"]},{"gender":"男","job":"后端","name":"jack","id":"6","skill":["Spring Boot","MySQL","python"]},{"gender":"女","job":"后端","name":"catherine","id":"7","skill":["Spring Boot","MongoDB","MySQL","python"]},{"gender":"男","job":"前端","name":"charles","id":"8","skill":["Bootstrap","Vue","Angular","CSS"]},{"gender":"女","job":"游戏开发","name":"elizabeth","id":"9","skill":["python"]},{"gender":"男","job":"自动化测试","name":"edwin","id":"10","skill":["python"]},{"gender":"女","job":"前端","name":"Diana","id":"11","skill":["Vue","React","CSS"]},{"gender":"男","job":"前端","name":"Xiao Ming","id":"12","skill":["Vue","React","CSS"]},{"gender":"保密","job":"后端","name":"Xiao Hong","id":"13","skill":["Spring Boot","MongoDB","MySQL","python"]},{"gender":"男","job":"自动化测试","name":"Xiao Jun","id":"14","skill":["python"]},{"gender":"女","job":"服务端","name":"Xiao Fang","id":"15","skill":["Spring Boot","MongoDB","python"]},{"gender":"男","job":"后端","name":"Li Si","id":"16","skill":["Spring Boot","MongoDB","MySQL"]},{"gender":"女","job":"前端","name":"Wang Hui","id":"17","skill":["Bootstrap","Vue","Angular","React","Spring Boot","MongoDB","MySQL","CSS"]}]'
          );
        })
          .then((data) => {
            userinfos.push.apply(userinfos, JSON.parse(data));
          })
          .catch(() => { });
      };
      // 添加员工信息
      let addUserInfo = (userInfo, initCallback) => {
        if (validator(userInfo)) {
          initCallback();
          userinfos.push(userInfo);
        }
      };
      // 移除员工信息
      let removeUser = () => {
        userinfos.splice(deleteIndex.value, 1);
        showConfirm.value = false;
      };
      // 确认删除方法
      let alertConfirm = (userInfo) => {
        showConfirm.value = true;
        deleteIndex.value = userinfos.indexOf(userInfo);
      };
      // 编辑员工信息
      let editorUser = (userInfo) => {
        // 复制信息
        cloneObject(userInfo, editorItem);
        // 显示出编辑模态框
        showEditor.value = true;
        // 编辑的员工信息索引
        changeIndex.value = userinfos.indexOf(userInfo);
      };
      let changeUserInfo = (data) => {
        // 修改员工信息
        userinfos.splice(data.index, 1, data.userInfo);
        // 关闭编辑员工信息模态框
        showEditor.value = false;
      };
      // 用户对象验证器
      let validator = (userInfo) => {
        // 这里将技能数据合并到员工信息数据中
        // 数据对象验证结果集
        let validResult = userInfo.validator(),
          // 通过验证状态
          flag = true;
        for (let key in validResult) {
          // 有任意一项不通过状态转为false
          if (!validResult[key]) {
            flag = false;
          }
        }
        // 判断是否重复编号
        let idAgin = userinfos.filter((e) => {
          return e.id === userInfo.id;
        }).length;
        // 如果有重复编号
        if (idAgin > 0) {
          validResult.id = false;
          flag = false;
        }
        // 如果验证不通过分别判断是哪里未通过验证
        if (!flag) {
          if (!validResult.id) {
            if (userInfo.id === "") {
              message.value = "编号不能为空";
            } else if (idAgin) {
              message.value = "编号不能重复";
            } else {
              message.value = "编号格式不正确";
            }
          } else if (!validResult.name) {
            if (userInfo.name === "") {
              message.value = "姓名不能为空";
            } else {
              message.value = "姓名格式不正确";
            }
          } else if (!validResult.gender) {
            message.value = "请选择性别";
          } else if (!validResult.job) {
            message.value = "请选择职业";
          } else if (!validResult.skill) {
            message.value = "请选择技能";
          }
          showMessage.value = true;
        }
        return flag;
      };
      // 过滤员工信息
      let filterUserInfo = () => {
        // 如果没有进行关键字搜索则为所有员工信息
        // 有关键字搜索的话遍历每个员工信息的每一项数据如有包含关键字则返回该员工数据
        let result =
          keyword.value === ""
            ? userinfos
            : userinfos.filter((userInfo) => {
              let flag = false;
              for (let key in userInfo) {
                // 这是对于数组类型的数据进行匹配，例如skill
                if (
                  Object.prototype.toString.call(userInfo[key]) ===
                  "[object Array]"
                ) {
                  userInfo[key].forEach((e) => {
                    if (e.indexOf(keyword.value) !== -1) flag = true;
                  });
                } else if (
                  userInfo[key].toString().indexOf(keyword.value) !== -1
                )
                  flag = true;
              }
              return flag;
            });
        // 将过滤的结果放入到显示用户信息结果集中
        showUserinfos.splice(0, showUserinfos.length, ...result);
      };
      // -------------------------------------------
      getUserinfos();
      // 监听员工数据集，有变化就过滤数据
      watch(userinfos, () => {
        filterUserInfo();
      });

      // 绑定前钩子函数
      onBeforeMount(() => {
        filterUserInfo();
      });
      // -------------------------------------------------------------------------------------------



      // 翻页部分代码--------------------------------------------------------------------------------
      // data
      // showCount 每一页显示的数据数量
      // showPage 当前显示的页数（从0开始）
      // pageButtonCount 显示的按钮数量
      // showButton 当前的按钮组数（从0开始）
      let showCount = 4;
      let showPage = ref(0);
      let pageButtonCount = 4;
      let showButton = ref(0);


      // 计算属性
      // 获取最大页数
      let getMaxPage = computed(() =>
        Math.ceil(showUserinfos.length / showCount)
      );
      // 返回该页数的数据
      let getPageUserinfo = computed(() =>
        showUserinfos.slice(
          showPage.value * showCount,
          (showPage.value + 1) * showCount
        )
      );
      // 获取按钮最大页数
      let getButtonMaxPage = computed(() =>
        Math.ceil(getMaxPage.value / pageButtonCount)
      );
      // 获取当前显示的按钮
      let showPageButtonCount = computed(() => {
        return (showButton.value + 1) * pageButtonCount > getMaxPage.value
          ? pageButtonCount -
          ((showButton.value + 1) * pageButtonCount - getMaxPage.value)
          : pageButtonCount;
      });

      // 通过watch处理边界情况（当最大页数变小时而正在展示之前的最大页数（越界））
      watch(getMaxPage, (newVal) => {
        if (showPage.value > newVal - 1) {
          showPage.value = newVal - 1;
          showButton.value = Math.ceil(showPage.value / pageButtonCount) - 1;
        }
      });

      // 方法

      // 翻页
      let changePage = (pageIndex) => {
        showButton.value = pageIndex;
      };

      // -------------------------------------------------------------------------------------------
      return {
        userinfos,
        showConfirm,
        showEditor,
        editorItem,
        changeIndex,
        showUserinfos,
        keyword,
        showCount,
        showPage,
        getPageUserinfo,
        pageButtonCount,
        getButtonMaxPage,
        showButton,
        showPageButtonCount,
        showMessage,
        message,
        alertConfirm,
        validator,
        addUserInfo,
        removeUser,
        changeUserInfo,
        editorUser,
        filterUserInfo,
        changePage,
        getMaxPage,
      };
    },
    components: {
      ...components,
    },
    template: `
    <div class="title">
        <div class="container">
          <h1>人力资源管理平台</h1>
          <span class="title-label">@牛耳教育</span>
        </div>
      </div>
      <div class="container">
        <div class="content">
          <div class="create box">
            <PeopleInfo :isChange="-1" @submitinfo="addUserInfo">
              <template v-slot:title>
                <h3>录入员工信息</h3>
              </template>
              <template v-slot:btn="slotProps">
                <button class="btn btn-success" @click="slotProps.toSubmit">
                  创建
                </button>
              </template>
            </PeopleInfo>
          </div>
          <div class="manage">
            <div class="search clearfix">
              <input
                type="text"
                placeholder="请输入搜索关键字"
                name="search"
                class="form-control pull-left"
                v-model="keyword"
              />
              <button class="btn btn-default pull-left" @click="filterUserInfo">搜索</button>
            </div>
            <div class="userlist">
              <ul class="userlist-head text-center">
                <li>
                  <span>编号</span>
                  <span>姓名</span>
                  <span>性别</span>
                  <span>职位</span>
                  <span>专业技能</span>
                  <span>操作</span>
                </li>
              </ul>
              <ul class="userlist-content text-center">
                <li v-for="item, index in getPageUserinfo" :key="index">
                  <span>{{item.id}}</span>
                  <span>{{item.name}}</span>
                  <span>{{item.gender}}</span>
                  <span>{{item.job}}</span>
                  <span class="skill">
                    <span
                      class="skill-item"
                      v-for="s, index in item.skill"
                      :key="index"
                      >{{s}}</span
                    >
                  </span>
                  <span>
                    <button
                      @click="editorUser(item)"
                      class="btn btn-success"
                    >
                      编辑
                    </button>
                    <button @click="alertConfirm(item)" class="btn btn-danger">
                      删除
                    </button>
                  </span>
                </li>
                <li
                  class="userlist-empty"
                  v-if="!showUserinfos.length"
                >无员工信息</li>
              </ul>
            </div>
            <div class="page" v-show="showUserinfos.length">
              <div class="page-btn clearfix">
                <button class="pull-left" style="font-size: 10px;" @click="changePage(showButton - 1)" :disabled="showButton === 0">&lt;&lt;</button>
                <button class="pull-left" v-for="number, index in showPageButtonCount" :class="{checked: showPage === index + showButton * pageButtonCount}" @click="showPage = index + showButton * pageButtonCount">{{index + 1 + showButton * pageButtonCount}}</button>
                <button class="pull-left" style="font-size: 10px;" @click="changePage(showButton + 1)" :disabled="showButton === getButtonMaxPage - 1">&gt;&gt;</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertMessage :show="showConfirm" @close="showConfirm = false">
        <template v-slot:default>
          <div style="width: 300px">
            <h4 style="line-height: 50px; text-align: center;margin-top: 10px;">
              确定删除此员工的信息？
            </h4>
            <div class="clearfix" style="padding: 0 50px">
              <button
                class="btn btn-success pull-left"
                @click="showConfirm = false"
              >
                取消
              </button>
              <button
                class="btn btn-danger pull-right"
                @click="removeUser"
              >
                确定
              </button>
            </div>
          </div>
        </template>
      </AlertMessage>

      <AlertMessage :show="showEditor" @close="showEditor = false">
        <template v-slot:default>
          <PeopleInfo
            :isChange="changeIndex"
            :changeUserInfo="editorItem"
            @submitinfo="changeUserInfo"
          >
            <template v-slot:title>
              <h3>编辑员工资料</h3>
              <hr/>
            </template>
            <template v-slot:btn="slotProps">
              <hr/>
              <div class="editor-btn pull-right">
                <button class="btn" @click="showEditor = false">取消</button>
                <button class="btn btn-success" @click="slotProps.toSubmit()">保存</button>
              </div>
            </template>
          </PeopleInfo>
        </template>
      </AlertMessage>

      <AlertMessage :show="showMessage" @close="showMessage = false">
        <template v-slot:default>
          <div class="message">
            <h3>{{message}}</h3>
            <button class="btn btn-warning" @click="showMessage = false">确定</button>
          </div>
        </template>
      </AlertMessage>
    `,
  }).mount("#app");
};
