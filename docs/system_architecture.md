# 系统架构设计文档

## 核心评分系统

### 1. 基础评分模块
```
Core/
├── BasicScore/        # 基础评分（40%权重）
│   ├── Age           # 年龄评分
│   ├── Education     # 学历评分
│   ├── Career        # 职业评分
│   └── Income        # 收入评分
│
├── RegionalRules/    # 地区规则
│   ├── CityTiers     # 城市等级（一线、新一线、二三线）
│   └── Adjustments   # 地区调整系数
```

### 2. 评分标准
#### 一线城市标准
- 年龄：25-35分
- 收入：本地平均工资2倍以上满分
- 职业：重点行业加分
- 学历：本科起步，研究生/海外优势

#### 二三线城市标准
- 年龄：20-30分
- 收入：本地平均工资1.5倍以上满分
- 职业：稳定性优先
- 学历：本科标准

## 界面设计
```
Views/
├── Home/             # 首页
│   ├── Gender        # 性别选择
│   └── CityTier      # 城市等级选择
│
├── Assessment/       # 评估页面
│   ├── BasicInfo     # 基本信息
│   ├── Career        # 职业发展
│   └── Family        # 家庭背景
│
└── Result/          # 结果页面
    ├── TotalScore   # 总分展示
    └── Advice       # 建议展示
```

## 数据流转
```
简化版数据流：
用户输入 -> 地区规则适配 -> 基础评分计算 -> 结果展示
```

## 开发步骤

### 第一阶段：基础框架
- 性别选择页面
- 城市等级选择
- 基本信息采集

### 第二阶段：评分系统
- 实现基础评分逻辑
- 添加地区差异化
- 完善加分项

### 第三阶段：结果展示
- 设计结果页面
- 实现建议生成
- 优化用户体验

## 技术栈选择

### 前端技术
- Vue 3
- Vant UI
- Pinia 状态管理
- Vue Router

### 后端服务
- 照片存储服务
- AI 分析服务
- 数据加密服务
- 用户认证服务

## 安全考虑

### 数据安全
- 用户数据加密存储
- 照片安全处理
- 隐私信息保护
- 访问权限控制

### 系统安全
- 接口认证
- 数据传输加密
- 防攻击措施
- 日志监控

## 性能优化

### 前端优化
- 代码分割
- 懒加载
- 缓存策略
- 图片优化

### 服务端优化
- 数据缓存
- 并发处理
- 负载均衡
- 资源优化
