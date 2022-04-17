window.onload = () => {
  new Vue({
    el: "#app",
    data: {
      // 商品分类初始为
      productData: [],
      //
      specialData: [],
      // 当前显示商品数据位置
      showIndex: 0,
      // banner数据指针
      bannerData: [],
      // 当前显示banner图位置
      bannerIndex: 0,
      // 特价专区跑马灯
      special: {
        cloneData: [],
        width: 0,
        listWidth: 0,
        itemWidth: 0,
        showCount: 0,
        left: 0,
      },
    },
    computed: {
      // 获取产品显示的数据
      productShowData() {
        // 取到指定的数据并随机排序
        return this.productData[this.showIndex].data.sort(
          () => Math.random() - 0.5
        );
      },
      computeSpecialLeft() {
        return `left: ${-this.special.left}px`;
      },
      computeSpecialBarLeft() {
        return `left: ${this.special.left / this.special.listWidth * 100}%`
      }
    },
    methods: {
      navItemClickHandle(index) {
        this.showIndex = index;
      },
      // 轮播图的方法
      ...(() => {
        let timer = null,
          duration = 3000;
        return {
          bannerToPlay() {
            if (timer) return;
            timer = setInterval(() => {
              this.toChangeBanner(
                (this.bannerIndex + 1) % this.bannerData.length
              );
            }, duration);
          },
          bannerStopPlay() {
            if (!timer) return;
            clearInterval(timer);
            timer = null;
          },
          // 轮播图防抖切换
          toChangeBanner: (() => {
            let timer = null,
              duration = 500;
            return function (index) {
              if (timer) return;
              this.bannerIndex = index;
              // 防抖
              timer = setTimeout(() => {
                clearTimeout(timer);
                timer = null;
              }, duration);
            };
          })(),
          bannerCircleHandle(index) {
            this.bannerIndex = index;
          },
        };
      })(),

      // 特价专区的方法
      ...(() => {
        let timer = null,
          duration = 10,
          speed = 1,
          canMove = false
        return {
          specialToPlay() {
            if (timer) return;
            // 防抖
            timer = setTimeout(() => {
              // 平移
              timer = setInterval(() => {
                let num = this.special.left + speed;
                this.special.left = num < this.special.listWidth ? num : 0
              }, duration);
            }, 500);
          },
          specialStopPlay() {
            if (!timer) return;
            clearInterval(timer);
            timer = null;
          },
          // 拖動條
          barMouseDownHandle() {
            canMove = true
          },
          barMouseUpHandle() {
            canMove = false
          },
          barMouseMoveHandle(e) {
            if (!canMove) return;
            let left = e.target.offsetLeft + (e.offsetX - this.special.barWidth / 2);
            if (left > this.special.barBoxWidth) {
              left = this.special.barBoxWidth
            } else if (left < 0) {
              left = 0
            }
            this.special.left = (left / this.special.barBoxWidth) * this.special.listWidth
          },
          initSpecial() {
            let list = document.getElementById("j-special-list");
            // 获取商品列表宽度
            this.special.listWidth = list.clientWidth;
            // 获取容器宽度
            this.special.width = document.getElementById(
              "j-special-container"
            ).clientWidth;
            // 获取每个商品宽度
            this.special.itemWidth = list.firstElementChild.clientWidth
            // 计算可显示商品数量
            this.special.showCount = Math.ceil(
              this.special.width / this.special.itemWidth
            );
            let array = []
            if (this.special.specialData % 2) {
              this.special.listWidth += this.special.itemWidth
              array.push(this.specialData[Math.floor(this.specialData.length / 2)])
            }
            Array.prototype.push.apply(
              this.specialData,
              array.concat(
                this.specialData.slice(0, this.special.showCount)
              )
            );
            
            let specialBar = document.getElementById("j-special-bar");
            this.special.barBoxWidth = specialBar.clientWidth - (this.special.itemWidth / this.special.listWidth * specialBar.clientWidth);
            this.special.barWidth = this.special.itemWidth / this.special.listWidth * this.special.barBoxWidth;
          },
        };
      })(),
    },
    mounted() {
      this.bannerToPlay();
      this.initSpecial();
      this.specialToPlay();
    },
    components: {
      // 图片预加载组件
      LazyLoad: {
        name: "LazyLoad",
        props: {
          src: String,
        },
        data() {
          return {
            // 是否已经加载
            isLoad: false,
          };
        },
        mounted() {
          // 图片预加载
          let img = new Image();
          img.id = "pic";
          img.onload = () => {
            // 加载完毕
            this.isLoad = true;
          };
          // 添加图片路径加载图片
          img.src = this.$props.src;
        },
        template: `
        <div>
          <img :src="src" v-if="isLoad" @/>
          <slot name="default"></slot>  
        </div>`,
      },
    },
    created() {
      this.productData = [
        {
          title: "精品推荐",
          data: [
            {
              name: "ROG幻16 2022 第12代英特尔酷睿16英寸设计师高性能游戏笔记本电脑(i7-12700H 16G 512G RTX3060 2.5K165Hz)",
              img: "1d6011ce58512b90.jpg",
              desc: "【2022新品上市！3月16日22点到手价10999！】双显三模！DDR5内存！P3广色域2.5K、165Hz全能屏！",
              href: "javascript:void(0)",
              price: 10999,
              priceOld: 11399,
            },
            {
              name: "【拉斐官方旗舰店】拉斐庄园珍藏2009原酒进口红酒干红葡萄酒 750ml*6瓶红酒整箱 醒酒器礼盒套装",
              img: "0687546484c1a72d.jpg",
              desc: "【活动特惠购】满减活动自2022年3月1号起至3月31号截止 【品牌官方直营】下单就送酒具套装，破损包赔",
              price: 298,
              priceOld: 329,
              href: "javascript:void(0)",
            },
            {
              name: "松下(Panasonic)超薄旗舰洗烘一体10公斤变频滚筒洗衣机光动银除菌除螨纳诺怡除味WiFi控制 超薄设计XQG100-SD139",
              img: "0d9242ea318e0154.jpg",
              desc: "【支持线下比价】【晒单赠松下电烤箱】【超薄系列旗舰款，光动银，双极除螨，纳诺怡护理】【会员积分换好礼】",
              price: 7123,
              priceOld: 7498,
              href: "javascript:void(0)",
            },
            {
              name: "Apple iPad Pro 11英寸平板电脑 2021年款(128G WLAN版/M1芯片Liquid视网膜屏/MHQT3CH/A) 银色",
              img: "cd63e7ddce052274.jpg",
              desc: "【以旧换新至高补贴450元】学习娱乐两不误，货量有限，你值得拥有的一台iPad！",
              price: 6199,
              href: "javascript:void(0)",
            },
            {
              name: "新边界 高端原味混合坚果400g混合果仁孕期每日坚果罐装纯坚果腰果开心果仁巴旦木仁脱衣核桃仁碧根果仁",
              img: "61356f14d0c376e6.jpg",
              desc: "新疆龙头企业直供·HACCP认证·ISO22000认证·新边界每日坚果，7种坚果蜜饯搭配，多种营养，第二件立减10元",
              price: 49.9,
              href: "javascript:void(0)",
            },
          ],
        },
        {
          title: "数码电器",
          data: [
            {
              name: "丹拿DYNAUDIO汽车音响 ESOTAN 212 二分频 高音中音低音喇叭升级改装套装",
              img: "310fa6b4f6e81f03.jpg",
              desc: "丹拿DYNAUDIO汽车音响 ESOTAN 212 二分频 高音中音低音喇叭升级改装套装",
              price: 2620,
              href: "javascript:void(0)",
            },
            {
              name: "全新飞利浦（PHILIPS）搅拌机HR2872/00、HR2874/00家用迷你榨汁机 搅拌机+随行杯 HR2872/00",
              img: "2c0fb0ffdc14ee52.jpg",
              desc: "全新原装，飞利浦厂家一手货源！当天16点之前下单正常发货！",
              price: 233,
              href: "javascript:void(0)",
            },
            {
              name: "美的（Midea）大黄蜂 智能电饭煲电饭锅一人食多功能1.6L迷你宿舍萌趣全自动多功能可拆洗FB16M161",
              img: "9ca81ada02a96ab1.jpg",
              desc: "【家电超级新品季】价保30天！365天换新机！到手价仅149元！【限量200台，数量有限，先到先得】一键保温！365天换新机！",
              price: 149,
              href: "javascript:void(0)",
            },
            {
              name: "华为 HUAWEI Mate 40 RS 保时捷设计 典藏版麒麟9000芯片 红外测温功能12GB+512GB陶瓷黑5G全网通手机",
              img: "7c00f3864a965ec1.jpg",
              desc: "【华为Mate40RS典藏版】保时捷设计,典藏版麒麟9000芯片,红外测温功能；",
              price: 13999,
              href: "javascript:void(0)",
            },
            {
              name: "索尼（SONY）HXR-NX80 1.0 英寸CMOS 手持式4K摄录一体机 小巧便携 12倍光学 专业级摄录机 官方标配",
              img: "e9f33a50b4f03fb4.jpg",
              desc: "索尼（SONY）HXR-NX80 1.0 英寸CMOS 手持式4K摄录一体机 小巧便携 ",
              price: 13899,
              href: "javascript:void(0)",
            },
            {
              name: "七彩虹（Colorful）iGame GeForce RTX 3050 Ultra W DUO OC 8G 1822Mhz 电竞游戏显卡",
              img: "9aa2b85927fbe2a6.jpg",
              desc: "iGame GeForce RTX 3050 Ultra W DUO OC 8G 1822Mhz",
              price: 2699,
              href: "javascript:void(0)",
            },
            {
              name: "华为 HUAWEI nova 8 Pro 麒麟985 5G SoC芯片 8GB+128GB 绮境森林全网通5G手机套餐一（无充电器和数据线）",
              img: "60290aa23faadfac.jpg",
              desc: "【华为nova8pro】限时优惠200元，到手价3599元！",
              price: 3599,
              priceOld: 3799,
              href: "javascript:void(0)",
            },
            {
              name: "AOC AGON 27英寸 2K 240Hz IPS HDR1000 快速液晶1ms MiniLED TypeC65W HDMI2.1 PS5游戏电竞显示器 AG274QZM",
              img: "ffbdeb5a7933c733.jpg",
              desc: "240Hz高刷新miniLED！HDR1000超感体验，65W-TypeC，附遮光罩、人机控制器！",
              price: 8499,
              href: "javascript:void(0)",
            },
          ],
        },
        {
          title: "居家优品",
          data: [
            {
              name: "福可安一次性医用口罩100只（50只/包*2）防沙尘成人学生男女防细菌医用级透气3层含熔喷布防飞沫雾霾可定制",
              desc: "【一次性医用防护】【采用三层防护过滤】【可定制】",
              img: "d36cf41378f149c5.jpg",
              price: 15.9,
              href: "javascript:void(0)",
            },
            {
              name: "雅高 扫把簸箕套装家用仿猪鬃毛软毛笤帚扫帚",
              desc: "【家居清洁用具好货日】清洁用具好物限时抢，品牌特卖，进口品质好货",
              img: "63998795902bdfd1.jpg",
              price: 16.9,
              href: "javascript:void(0)",
            },
            {
              name: "超大孤品保值 系黄锡如大师设计礼品瓷金龙献瑞花瓶摆件",
              desc: "由聚鑫堂陶瓷发货, 并提供售后服务",
              img: "bd44d1d3ba3758c4.jpg",
              price: 26666,
              href: "javascript:void(0)",
            },
            {
              name: "四季沐歌 MICOE 淋浴增压花洒喷头套装 加压单手持花洒卫浴莲蓬头M-HS104",
              desc: "39元抢网红热销款单手持花洒，单手一键式切换三挡出水 点击搭配花洒软管更实惠！",
              img: "ca0bc9a08f2a9b56.jpg",
              price: 26.5,
              href: "javascript:void(0)",
            },
            {
              name: "得力(deli)直液笔签字笔 0.5mm全针管中性笔 商务办公学生水笔走珠笔 黑色 12支/盒S856",
              desc: "0元入会 享多重福利",
              img: "304a6bf2fe1508dd.jpg",
              price: 15.9,
              href: "javascript:void(0)",
            },
          ],
        },
        {
          title: "超市百货",
          data: [
            {
              name: "金龙鱼 长粒香大米 东北大米 臻选长粒香大米2.5kg",
              img: "669de2e3dccee91f.jpg",
              desc: "购买1件可优惠换购热销商品 ",
              price: 25.9,
              href: "javascript:void(0)",
            },
            {
              name: "六泰 毛尖绿茶茶叶绿茶雨前精装嫩芽春茶250g(125g*2罐）",
              img: "f1b89e383296fa4d.jpg",
              desc: "绿茶热卖榜TOP！到手仅需：￥99！ ",
              price: 93,
              priceOld: 99,
              href: "javascript:void(0)",
            },
            {
              name: "寰球渔市 黑虎虾（16-20只）400g/盒装 净重400g 老虎虾 海鲜水产 火锅 烧烤食材",
              img: "8c5186cf375cb096.jpg",
              desc: "满2件，总价打8折；满3件，总价打7折",
              price: 49.9,
              priceOld: 59.9,
              href: "javascript:void(0)",
            },
            {
              name: "小猪佩奇毛绒玩具娃娃公仔布娃娃儿童安抚外出包 16cm卡通粉色佩奇圆形斜跨钱包",
              img: "9deb7126c8854789.jpg",
              desc: "小猪佩奇毛绒玩具娃娃公仔布娃娃儿童安抚外出包",
              price: 18.8,
              priceOld: 19.9,
              href: "javascript:void(0)",
            },
            {
              name: "尚烤佳 烧烤炉 电烤炉 烤串机 可分体电烧烤炉 烧烤架 电烤盘 涮烤一体炉 多功能电火锅",
              img: "718141c10de70b38.jpg",
              desc: "【热销爆款】煎烤涮，一炉三用，分体设计，方便清洗，全分体烤涮锅",
              price: 196,
              href: "javascript:void(0)",
            },
            {
              name: "思念腊汁肉饼陕西风味880g8个半成品早餐速食速冻食品生鲜",
              img: "7c147b33d303c58b.jpg",
              desc: "早餐速食速冻食品生鲜",
              price: 38.9,
              priceOld: 39.9,
              href: "javascript:void(0)",
            },
          ],
        },
      ];

      this.bannerData = [
        {
          img: "20220106-1cc7ad1973a74984988c9b6f9b5d4d27926dad45f8e94a87.jpg",
          name: "百货",
          href: "javascript:void(0)",
        },
        {
          img: "164698250790042635.png",
          name: "苹果13",
          href: "javascript:void(0)",
        },
        {
          img: "20200720-59b99b9398884daabd2e9d18424f373a711269f9c49745b2.jpg",
          name: "创维",
          href: "javascript:void(0)",
        },
        {
          img: "164741601056111945.png",
          name: "大牌折扣",
          href: "javascript:void(0)",
        },
      ];

      this.specialData = [
        {
          name: "宽松薄款时尚连帽短款百搭卫衣",
          desc: "1年最低价",
          price: 32,
          img: "14597f5d6ced0ab8.jpg!q70.jpg.webp",
          href: "javascript:void(0)",
        },
        {
          name: "水杨酸棉片刷痘肌黑头",
          desc: "51天最低价",
          price: 33,
          img: "f1e1e60b85ff097e.jpg!q70.jpg.webp",
          href: "javascript:void(0)",
        },
        {
          name: "厨房勺盖一体调味罐调料盒套装",
          desc: "312天最低价",
          price: 7.9,
          img: "552e5dc63433ab77.jpg!q70.jpg.webp",
          href: "javascript:void(0)",
        },
        {
          name: "法国进口车载香氛 净味除甲醛",
          desc: "35天最低价",
          price: 49.9,
          img: "af7e214d71c012da.jpg!q70.jpg.webp",
          href: "javascript:void(0)",
        },
        {
          name: "太太乐免洗对折胶棉拖把2个头",
          desc: "1年最低价",
          price: 17.9,
          img: "5ec537a253d22229.jpg!q70.jpg.webp",
          href: "javascript:void(0)",
        },
        {
          name: "寻味君 武鸣沃柑 9斤",
          desc: "1年最低价",
          price: 29.8,
          img: "b4ab324770c4c9be.jpg!q70.jpg.webp",
          href: "javascript:void(0)",
        },
        {
          name: "舒楠鲜生 泰国进口金枕头榴莲",
          desc: "169天最低价",
          price: 116,
          img: "56649a3bbc48d9ba.jpg!q70.jpg.webp",
          href: "javascript:void(0)",
        },
        {
          name: "原切草饲西冷200g送牛肉丸250g",
          desc: "170天最低价",
          price: 99,
          img: "21b84e214802f506.jpg!q70.jpg.webp",
          href: "javascript:void(0)",
        },
      ];
    },
  });
};
