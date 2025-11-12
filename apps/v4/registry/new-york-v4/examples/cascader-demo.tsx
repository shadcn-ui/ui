'use client'
import { Cascader } from "@/registry/new-york-v4/ui/cascader"

// 城市数据（模拟）
const cityOptions = [
  {
    value: "beijing",
    label: "北京市",
    children: [
      {
        value: "beijing-dongcheng",
        label: "东城区",
        children: [
          { value: "beijing-dongcheng-1", label: "东华门街道" },
          { value: "beijing-dongcheng-2", label: "景山街道" },
          { value: "beijing-dongcheng-3", label: "交道口街道" }
        ]
      },
      {
        value: "beijing-chaoyang",
        label: "朝阳区",
        children: [
          { value: "beijing-chaoyang-1", label: "建国门外街道" },
          { value: "beijing-chaoyang-2", label: "朝阳门外街道" },
          { value: "beijing-chaoyang-3", label: "呼家楼街道" }
        ]
      }
    ]
  },
  {
    value: "shanghai",
    label: "上海市",
    children: [
      {
        value: "shanghai-pudong",
        label: "浦东新区",
        children: [
          { value: "shanghai-pudong-1", label: "陆家嘴街道" },
          { value: "shanghai-pudong-2", label: "花木街道" },
          { value: "shanghai-pudong-3", label: "洋泾街道" }
        ]
      },
      {
        value: "shanghai-zhangjiang",
        label: "张江高科技园区",
        children: [
          { value: "shanghai-zhangjiang-1", label: "张江镇" },
          { value: "shanghai-zhangjiang-2", label: "孙桥镇" }
        ]
      }
    ]
  },
  {
    value: "guangdong",
    label: "广东省",
    children: [
      {
        value: "guangzhou",
        label: "广州市",
        children: [
          { value: "guangzhou-tianhe", label: "天河区" },
          { value: "guangzhou-haizhu", label: "海珠区" },
          { value: "guangzhou-panyu", label: "番禺区" }
        ]
      },
      {
        value: "shenzhen",
        label: "深圳市",
        children: [
          { value: "shenzhen-nanshan", label: "南山区" },
          { value: "shenzhen-futian", label: "福田区" },
          { value: "shenzhen-longgang", label: "龙岗区" }
        ]
      },
      {
        value: "dongguan",
        label: "东莞市",
        children: [
          { value: "dongguan-dongcheng", label: "东城区" },
          { value: "dongguan-nancheng", label: "南城区" },
          { value: "dongguan-changan", label: "长安镇" }
        ]
      }
    ]
  },
  {
    value: "liaoning",
    label: "辽宁省",
    children: [
      {
        value: "shenyang",
        label: "沈阳市",
        children: [
          { value: "shenyang-heping", label: "和平区" },
          { value: "shenyang-shenhe", label: "沈河区" },
          { value: "shenyang-huanggu", label: "皇姑区" }
        ]
      },
      {
        value: "dalian",
        label: "大连市",
        children: [
          { value: "dalian-zhongshan", label: "中山区" },
          { value: "dalian-xigang", label: "西岗区" },
          { value: "dalian-shinan", label: "沙河口区" }
        ]
      }
    ]
  },
  {
    value: "sichuan",
    label: "四川省",
    children: [
      {
        value: "chengdu",
        label: "成都市",
        children: [
          { value: "chengdu-jinjiang", label: "锦江区" },
          { value: "chengdu-qingyang", label: "青羊区" },
          { value: "chengdu-wuhou", label: "武侯区" }
        ]
      },
      {
        value: "mianyang",
        label: "绵阳市",
        children: [
          { value: "mianyang-fucheng", label: "涪城区" },
          { value: "mianyang-youxian", label: "游仙区" }
        ]
      }
    ]
  }
]

export default function CascaderDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">单选模式</h3>
        <Cascader
          options={cityOptions}
          placeholder="请选择城市"
          onChange={(value) => console.log("单选结果:", value)}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">多选模式</h3>
        <Cascader
          options={cityOptions}
          placeholder="请选择城市"
          multiple
          onChange={(value) => console.log("多选结果:", value)}
        />
      </div>
    </div>
  )
}