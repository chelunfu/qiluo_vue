<script setup lang="tsx">
import { ref, computed, reactive, watch } from 'vue'
import { ScanEntities, GenerateCode, SaveFieldConfig, LoadFieldConfig } from '@/api/codegen'
import type { FieldConfig } from '@/api/codegen'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ContentWrap } from '@/components/ContentWrap'
import { BaseButton } from '@/components/Button'
import {
  ElTag,
  ElMessage,
  ElCollapse,
  ElCollapseItem,
  ElEmpty,
  ElSwitch,
  ElSelect,
  ElOption,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElTabPane,
  ElInputNumber,
  ElInput,
  ElTooltip
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { CodeEditor } from '@/components/CodeEditor'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const { t } = useI18n()

interface EntityField {
  name: string
  rust_type: string
  base_type: string
  is_primary_key: boolean
  is_optional: boolean
  is_id_field: boolean
  frontend_component: string
  show_in_list: boolean
  show_in_search: boolean
  show_in_form: boolean
  show_in_detail: boolean
  component_override: string | null
  sortable: boolean
  sort_order: string
  fk_field: string | null
  // 关联字段
  has_relation: boolean
  relation_target: string | null
  relation_display_field: string | null
}

interface EntityInfo {
  table_name: string
  model_name: string
  module_name: string
  primary_key: string
  fields: EntityField[]
}

interface ScanResult {
  module_name: string
  entities: EntityInfo[]
}

interface GeneratedFile {
  path: string
  content: string
  file_type: string
  description: string
}

interface CodeGenResult {
  entity_info: EntityInfo
  files: GeneratedFile[]
  mod_updates: Record<string, string>
}

// 组件类型选项
const componentOptions = [
  { label: 'Input 输入框', value: 'Input' },
  { label: 'InputNumber 数字输入', value: 'InputNumber' },
  { label: 'Select 下拉选择', value: 'Select' },
  { label: 'Radio 单选', value: 'Radio' },
  { label: 'Checkbox 多选', value: 'Checkbox' },
  { label: 'Switch 开关', value: 'Switch' },
  { label: 'InputPassword 密码', value: 'InputPassword' },
  { label: 'DatePicker 日期', value: 'DatePicker' },
  { label: 'TimePicker 时间', value: 'TimePicker' },
  { label: 'DateTimePicker 日期时间', value: 'DateTimePicker' },
  { label: 'Upload 上传', value: 'Upload' },
  { label: 'Textarea 文本域', value: 'Textarea' }
]

const loading = ref(false)
const scanResults = ref<ScanResult[]>([])
const expandedModules = ref<string[]>([])
const dialogVisible = ref(false)
const generateLoading = ref(false)
const generatedResult = ref<CodeGenResult | null>(null)
const activeTab = ref('')

// 字段配置相关
const configDialogVisible = ref(false)
const currentEntity = ref<EntityInfo | null>(null)

// 数据隔离开关
const enableDataScope = ref(false)
const hasDataScopeFields = ref(false)

const fieldConfigs = reactive<
  {
    field_name: string
    base_type: string
    is_primary_key: boolean
    show_in_list: boolean
    show_in_search: boolean
    show_in_form: boolean
    show_in_detail: boolean
    sortable: boolean
    sort_priority: number
    sort_order: string
    component: string
    required: boolean
    fk_field: string | null
    min_length: number | null
    max_length: number | null
    pattern: string
    pattern_message: string
    has_relation: boolean
    relation_target: string | null
    relation_display_field: string | null
  }[]
>([])

// 搜索相关
const searchParams = ref<Record<string, string>>({})
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'table_name',
    label: '表名',
    component: 'Input'
  },
  {
    field: 'module_name',
    label: '模块名',
    component: 'Input'
  }
])

const setSearchParams = (data: any) => {
  searchParams.value = data
}

// 过滤后的扫描结果
const filteredResults = computed(() => {
  const { table_name, module_name } = searchParams.value
  return scanResults.value
    .map((module) => {
      let entities = module.entities
      if (table_name) {
        entities = entities.filter((e) =>
          e.table_name.toLowerCase().includes(table_name.toLowerCase())
        )
      }
      if (module_name) {
        if (!module.module_name.toLowerCase().includes(module_name.toLowerCase())) {
          entities = []
        }
      }
      return { ...module, entities }
    })
    .filter((module) => module.entities.length > 0)
})

// 当前预览的文件内容（用于 CodeEditor）
const currentFileContent = computed(() => {
  if (!generatedResult.value) return ''
  const file = generatedResult.value.files.find((f) => f.path === activeTab.value)
  return file?.content || ''
})

// 当前预览的语言
const currentFileLang = computed(() => {
  if (!generatedResult.value) return 'plaintext'
  const file = generatedResult.value.files.find((f) => f.path === activeTab.value)
  if (!file) return 'plaintext'
  if (file.file_type === 'rust') return 'rust'
  if (file.file_type === 'typescript') return 'typescript'
  if (file.path.endsWith('.vue')) return 'html'
  return 'plaintext'
})

// 当前文件信息
const currentFile = computed(() => {
  if (!generatedResult.value) return null
  return generatedResult.value.files.find((f) => f.path === activeTab.value) || null
})

// 前后端文件分组
const backendFiles = computed(() => {
  if (!generatedResult.value) return []
  return generatedResult.value.files.filter((f) => f.file_type === 'rust')
})

const frontendFiles = computed(() => {
  if (!generatedResult.value) return []
  return generatedResult.value.files.filter((f) => f.file_type !== 'rust')
})

// 当前 Tab 组：backend / frontend
const resultTab = ref('backend')

// 切换前后端 Tab 时自动选中该组的第一个文件
watch(resultTab, (tab) => {
  const list = tab === 'backend' ? backendFiles.value : frontendFiles.value
  if (list.length > 0) {
    activeTab.value = list[0].path
  }
})

// 打开字段配置弹窗（加载已保存的配置）
const openConfigDialog = async (entity: EntityInfo) => {
  currentEntity.value = entity
  fieldConfigs.length = 0

  // 尝试加载已保存的配置
  let savedConfig: FieldConfig[] | null = null
  try {
    const res = await LoadFieldConfig({
      module_name: entity.module_name,
      table_name: entity.table_name
    })
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      savedConfig = res.data
    }
  } catch (e) {
    // 没有已保存配置，使用默认值
  }

  // 检测数据隔离字段
  const hasDeptId = entity.fields.some((f) => f.name === 'dept_id')
  const hasOwnerId = entity.fields.some((f) => f.name === 'owner_id')
  hasDataScopeFields.value = hasDeptId && hasOwnerId
  enableDataScope.value = hasDataScopeFields.value

  for (const field of entity.fields) {
    let show_in_list = field.show_in_list ?? !field.is_primary_key
    let show_in_search = field.show_in_search ?? false
    let show_in_form = field.show_in_form ?? !field.is_primary_key
    let show_in_detail = field.show_in_detail ?? true
    let sortable = field.sortable ?? false
    let sort_priority = field.sort_priority ?? 0
    let sort_order = field.sort_order || 'desc'
    let component = field.component_override || field.frontend_component || 'Input'
    let required = !field.is_optional
    let min_length: number | null = null
    let max_length: number | null = null
    let pattern = ''
    let pattern_message = ''
    let fk_field = field.fk_field
    let relation_target = field.relation_target
    let relation_display_field = field.relation_display_field

    // 如果有已保存配置，覆盖默认值
    if (savedConfig) {
      const saved = savedConfig.find((c) => c.field_name === field.name)
      if (saved) {
        show_in_list = saved.show_in_list
        show_in_search = saved.show_in_search
        show_in_form = saved.show_in_form
        show_in_detail = saved.show_in_detail
        if (saved.sortable !== undefined) sortable = saved.sortable
        if (saved.sort_priority !== undefined) sort_priority = saved.sort_priority
        if (saved.sort_order !== undefined) sort_order = saved.sort_order
        if (saved.component) {
          component = saved.component
        }
        if (saved.required !== undefined) required = saved.required
        if (saved.min_length !== undefined) min_length = saved.min_length
        if (saved.max_length !== undefined) max_length = saved.max_length
        if (saved.pattern) pattern = saved.pattern
        if (saved.pattern_message) pattern_message = saved.pattern_message
        if (saved.relation_target !== undefined) relation_target = saved.relation_target
        if (saved.relation_display_field !== undefined)
          relation_display_field = saved.relation_display_field
      }
    }

    fieldConfigs.push({
      field_name: field.name,
      base_type: field.base_type,
      is_primary_key: field.is_primary_key,
      show_in_list,
      show_in_search,
      show_in_form,
      show_in_detail,
      sortable,
      sort_priority,
      sort_order,
      component,
      required,
      min_length,
      max_length,
      pattern,
      pattern_message,
      has_relation: field.has_relation,
      fk_field,
      relation_target,
      relation_display_field
    })
  }
  configDialogVisible.value = true
}

// 确认配置并生成代码（同时保存配置）
const handleConfirmGenerate = async () => {
  if (!currentEntity.value) return
  const entity = currentEntity.value
  const configs: FieldConfig[] = fieldConfigs.map((fc) => ({
    field_name: fc.field_name,
    show_in_list: fc.show_in_list,
    show_in_search: fc.show_in_search,
    show_in_form: fc.show_in_form,
    show_in_detail: fc.show_in_detail,
    sortable: fc.sortable ? true : undefined,
    sort_priority:
      fc.sortable && fc.sort_priority > 0 ? fc.sort_priority : fc.sortable ? 1 : undefined,
    sort_order:
      fc.sortable && fc.sort_order && fc.sort_order !== 'desc' ? fc.sort_order : undefined,
    component: fc.component !== 'Input' ? fc.component : undefined,
    required: fc.required !== !fc.is_primary_key ? fc.required : undefined,
    min_length: fc.min_length ?? undefined,
    max_length: fc.max_length ?? undefined,
    pattern: fc.pattern || undefined,
    pattern_message: fc.pattern_message || undefined,
    relation_target: fc.relation_target || undefined,
    relation_display_field: fc.relation_display_field || undefined
  }))

  // 先保存配置到文件
  try {
    await SaveFieldConfig({
      module_name: entity.module_name,
      table_name: entity.table_name,
      field_config: configs
    })
  } catch (e) {
    console.warn('配置保存失败，但继续生成', e)
  }

  configDialogVisible.value = false
  generateLoading.value = true
  try {
    const res = await GenerateCode({
      module_name: entity.module_name,
      table_name: entity.table_name,
      field_config: configs,
      enable_data_scope: enableDataScope.value ? true : undefined
    })
    generatedResult.value = res.data
    // 默认选中后端 Tab 的第一个文件
    resultTab.value = 'backend'
    const firstBackend = generatedResult.value?.files?.find((f) => f.file_type === 'rust')
    const firstFile = firstBackend || generatedResult.value?.files?.[0]
    activeTab.value = firstFile?.path || ''
    if (firstBackend) resultTab.value = 'backend'
    else if (firstFile) resultTab.value = 'frontend'
    dialogVisible.value = true
  } catch (e) {
    console.error(e)
    ElMessage.error('生成失败')
  } finally {
    generateLoading.value = false
  }
}

// 创建文件树
const fileTree = computed(() => {
  if (!generatedResult.value) return []
  const files = generatedResult.value.files
  const tree: { label: string; children: { path: string; name: string }[] }[] = []

  for (const file of files) {
    const parts = file.path.split('/')
    if (parts.length >= 2) {
      const dir = parts.slice(0, -1).join('/')
      const name = parts[parts.length - 1]
      let folder = tree.find((f) => f.label === dir)
      if (!folder) {
        folder = { label: dir, children: [] }
        tree.push(folder)
      }
      folder.children.push({ path: file.path, name })
    } else {
      let folder = tree.find((f) => f.label === '/')
      if (!folder) {
        folder = { label: '/', children: [] }
        tree.push(folder)
      }
      folder.children.push({ path: file.path, name: parts[0] })
    }
  }

  return tree
})

// 展开文件树
const expandedTreeItems = ref<string[]>([])

const handleScan = async () => {
  loading.value = true
  try {
    const res = await ScanEntities()
    scanResults.value = res.data || []
    if (scanResults.value.length > 0) {
      expandedModules.value = scanResults.value.map((r) => r.module_name)
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('扫描失败')
  } finally {
    loading.value = false
  }
}

const copyCode = (content: string) => {
  navigator.clipboard.writeText(content)
  ElMessage.success('已复制')
}

// 下载单个文件
const downloadFile = (file: GeneratedFile) => {
  const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.path.split('/').pop() || file.path
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 将一组文件打包成 ZIP 下载
const downloadFilesAsZip = async (files: GeneratedFile[], zipName: string) => {
  if (files.length === 0) {
    ElMessage.warning('没有可下载的文件')
    return
  }
  const zip = new JSZip()
  for (const file of files) {
    zip.file(file.path, file.content)
  }
  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, `${zipName}.zip`)
  ElMessage.success(`已下载 ${zipName}.zip（共 ${files.length} 个文件）`)
}

// 下载一组文件（打包为 ZIP）
const downloadFiles = (files: GeneratedFile[], label: string) => {
  downloadFilesAsZip(files, label)
}

// 下载全部代码（打包为 ZIP）
const downloadAllFiles = () => {
  if (!generatedResult.value) return
  const modelName = generatedResult.value.entity_info.model_name || 'codegen'
  downloadFilesAsZip(generatedResult.value.files, modelName)
}

// 实体列表的列定义（需要 TSX 支持 slots）
const entityColumns = computed(() => [
  { field: 'model_name' as const, label: 'Model' },
  { field: 'table_name' as const, label: '表名' },
  {
    field: 'fields' as const,
    label: '字段数',
    slots: {
      default: (data: any) => data.row.fields?.length || 0
    }
  },
  {
    field: 'action' as const,
    label: '操作',
    slots: {
      default: (data: any) => (
        <BaseButton type="primary" size="small" onClick={() => openConfigDialog(data.row)}>
          配置并生成
        </BaseButton>
      )
    }
  }
])
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <h3 class="m-0">代码生成器</h3>
    <div class="mb-10px">
      <BaseButton type="primary" :loading="loading" @click="handleScan"> 扫描 Entity </BaseButton>
    </div>

    <div v-if="scanResults.length === 0 && !loading">
      <ElEmpty description="暂未发现 Entity，请先使用 sea-orm-cli 生成实体文件">
        <template #extra>
          <BaseButton type="primary" @click="handleScan">扫描</BaseButton>
        </template>
      </ElEmpty>
    </div>

    <ElCollapse v-model="expandedModules">
      <ElCollapseItem
        v-for="module in filteredResults"
        :key="module.module_name"
        :title="'模块：' + module.module_name"
        :name="module.module_name"
      >
        <Table :data="module.entities" :columns="entityColumns" :pagination="false" border />
      </ElCollapseItem>
    </ElCollapse>
  </ContentWrap>

  <!-- 字段配置对话框 -->
  <Dialog v-model="configDialogVisible" title="字段配置" width="92%" maxHeight="85vh">
    <div v-if="currentEntity">
      <h4 class="mb-10px">
        <ElTag type="success">{{ currentEntity.model_name }}</ElTag>
        <span class="ml-5px text-gray-500">{{ currentEntity.table_name }}</span>
        — 共 {{ fieldConfigs.length }} 个字段
        <span class="ml-10px text-green-500 text-xs">配置将自动保存，下次打开自动恢复</span>
      </h4>

      <div v-if="hasDataScopeFields" class="mb-10px pl-10px flex items-center gap-5px">
        <ElSwitch v-model="enableDataScope" size="small" />
        <span class="text-sm text-gray-600">启用数据隔离 (自动检测到 dept_id + owner_id 字段)</span>
      </div>

      <ElTabs type="border-card">
        <!-- ==================== Tab 1: 列表配置 ==================== -->
        <ElTabPane label="📋 列表配置" name="list">
          <p class="text-gray-400 text-sm mb-10px">配置表格中显示的列、是否可搜索、是否可排序</p>
          <ElTable :data="fieldConfigs" border stripe max-height="45vh" size="small">
            <ElTableColumn label="字段名" prop="field_name" width="150" fixed>
              <template #default="{ row }">
                <span :class="{ 'font-bold text-orange-500': row.is_primary_key }">
                  {{ row.field_name }}
                  <span v-if="row.is_primary_key" class="text-xs text-red-400">(PK)</span>
                </span>
              </template>
            </ElTableColumn>
            <ElTableColumn label="类型" prop="base_type" width="80" />
            <ElTableColumn label="列表显示" width="90" align="center">
              <template #default="{ row }">
                <ElSwitch v-model="row.show_in_list" size="small" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="可搜索" width="80" align="center">
              <template #default="{ row }">
                <ElSwitch v-model="row.show_in_search" size="small" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="可排序" width="80" align="center">
              <template #default="{ row }">
                <ElSwitch
                  v-model="row.sortable"
                  size="small"
                  @change="(val: boolean) => { if (val && row.sort_priority === 0) row.sort_priority = 1 }"
                />
              </template>
            </ElTableColumn>
            <ElTableColumn label="排序优先级" width="130" align="center">
              <template #default="{ row }">
                <ElInputNumber
                  v-model="row.sort_priority"
                  :min="0"
                  :max="99"
                  size="small"
                  controls-position="right"
                  style="width: 100px"
                  :value-on-clear="0"
                  :disabled="!row.sortable"
                  placeholder="0=不排序"
                />
              </template>
            </ElTableColumn>
            <ElTableColumn label="排序方向" width="110" align="center">
              <template #default="{ row }">
                <ElSelect
                  v-model="row.sort_order"
                  size="small"
                  :disabled="!row.sortable"
                  style="width: 80px"
                >
                  <ElOption label="倒序 ↓" value="desc" />
                  <ElOption label="正序 ↑" value="asc" />
                </ElSelect>
              </template>
            </ElTableColumn>
            <ElTableColumn label="组件类型" min-width="160">
              <template #default="{ row }">
                <ElSelect v-model="row.component" size="small" filterable>
                  <ElOption
                    v-for="opt in componentOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </ElSelect>
              </template>
            </ElTableColumn>
          </ElTable>
          <div
            v-if="fieldConfigs.filter((f) => f.show_in_list || f.show_in_search).length === 0"
            class="text-center py-20px text-gray-400"
          >
            暂无字段配置，请在下方勾选需要在表格中显示的字段
          </div>
        </ElTabPane>

        <!-- ==================== Tab 2: 表单配置（含验证规则） ==================== -->
        <ElTabPane label="✏️ 表单配置" name="form">
          <p class="text-gray-400 text-sm mb-10px">配置新增/编辑表单的字段、组件类型和验证规则</p>
          <ElTable :data="fieldConfigs" border stripe max-height="45vh" size="small">
            <ElTableColumn label="字段名" prop="field_name" width="150" fixed>
              <template #default="{ row }">
                <span :class="{ 'font-bold text-orange-500': row.is_primary_key }">
                  {{ row.field_name }}
                  <span v-if="row.is_primary_key" class="text-xs text-red-400">(PK)</span>
                </span>
              </template>
            </ElTableColumn>
            <ElTableColumn label="类型" prop="base_type" width="80" />
            <ElTableColumn label="表单显示" width="90" align="center">
              <template #default="{ row }">
                <ElSwitch v-model="row.show_in_form" size="small" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="组件类型" min-width="150">
              <template #default="{ row }">
                <ElSelect v-model="row.component" size="small" filterable>
                  <ElOption
                    v-for="opt in componentOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </ElSelect>
              </template>
            </ElTableColumn>
            <ElTableColumn label="必填" width="60" align="center">
              <template #default="{ row }">
                <ElSwitch v-model="row.required" size="small" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="最小长度" width="100" align="center">
              <template #default="{ row }">
                <ElInputNumber
                  v-model="row.min_length"
                  :min="0"
                  size="small"
                  controls-position="right"
                  style="width: 80px"
                  :value-on-clear="null"
                />
              </template>
            </ElTableColumn>
            <ElTableColumn label="最大长度" width="100" align="center">
              <template #default="{ row }">
                <ElInputNumber
                  v-model="row.max_length"
                  :min="0"
                  size="small"
                  controls-position="right"
                  style="width: 80px"
                  :value-on-clear="null"
                />
              </template>
            </ElTableColumn>
            <ElTableColumn label="正则验证" min-width="160">
              <template #default="{ row }">
                <ElInput v-model="row.pattern" placeholder="如 ^[a-z]+$" size="small" clearable />
              </template>
            </ElTableColumn>
            <ElTableColumn label="错误提示" min-width="140">
              <template #default="{ row }">
                <ElInput
                  v-model="row.pattern_message"
                  placeholder="自定义错误提示"
                  size="small"
                  clearable
                />
              </template>
            </ElTableColumn>
          </ElTable>
          <div
            v-if="fieldConfigs.filter((f) => f.show_in_form).length === 0"
            class="text-center py-20px text-gray-400"
          >
            暂无字段配置，请在上方勾选需要在表单中显示的字段
          </div>
        </ElTabPane>

        <!-- ==================== Tab 3: 详情配置 ==================== -->
        <ElTabPane label="👁️ 详情配置" name="detail">
          <p class="text-gray-400 text-sm mb-10px">配置详情页显示的字段</p>
          <ElTable :data="fieldConfigs" border stripe max-height="45vh" size="small">
            <ElTableColumn label="字段名" prop="field_name" width="150" fixed>
              <template #default="{ row }">
                <span :class="{ 'font-bold text-orange-500': row.is_primary_key }">
                  {{ row.field_name }}
                  <span v-if="row.is_primary_key" class="text-xs text-red-400">(PK)</span>
                </span>
              </template>
            </ElTableColumn>
            <ElTableColumn label="类型" prop="base_type" width="80" />
            <ElTableColumn label="详情显示" width="90" align="center">
              <template #default="{ row }">
                <ElSwitch v-model="row.show_in_detail" size="small" />
              </template>
            </ElTableColumn>
          </ElTable>
          <div
            v-if="fieldConfigs.filter((f) => f.show_in_detail).length === 0"
            class="text-center py-20px text-gray-400"
          >
            暂无字段配置
          </div>
        </ElTabPane>

        <!-- ==================== Tab 4: 关联配置 ==================== -->
        <ElTabPane label="🔗 关联配置" name="relation">
          <p class="text-gray-400 text-sm mb-10px"
            >查看和编辑字段的关联关系（自动检测自 Entity 的 Relation 枚举）</p
          >
          <ElTable
            :data="fieldConfigs.filter((f) => f.has_relation)"
            border
            stripe
            max-height="45vh"
            size="small"
          >
            <ElTableColumn label="字段名" prop="field_name" width="150" fixed>
              <template #default="{ row }">
                <span class="font-bold text-purple-500">{{ row.field_name }}</span>
                <ElTag size="small" type="warning" class="ml-5px">外键</ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn label="关联类型" width="100">
              <template #default>
                <ElTag size="small" type="primary">BelongsTo</ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn label="目标实体" prop="relation_target" min-width="160">
              <template #default="{ row }">
                <div class="flex items-center gap-5px">
                  <ElTag size="small" type="success">{{ row.relation_target || '—' }}</ElTag>
                </div>
              </template>
            </ElTableColumn>
            <ElTableColumn label="外键字段" prop="fk_field" width="120">
              <template #default="{ row }">
                <ElTag size="small" type="warning">{{ row.fk_field || '—' }}</ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn label="显示字段" prop="relation_display_field" min-width="160">
              <template #default="{ row }">
                <ElInput
                  v-model="row.relation_display_field"
                  placeholder="自动推断，可手动覆盖"
                  size="small"
                  clearable
                />
              </template>
            </ElTableColumn>
          </ElTable>
          <div
            v-if="fieldConfigs.filter((f) => f.has_relation).length === 0"
            class="text-center py-20px text-gray-400"
          >
            该实体未检测到关联关系（无 Relation 枚举或 `_id` 结尾字段）
          </div>
        </ElTabPane>
      </ElTabs>

      <div class="mt-15px flex justify-end gap-10px">
        <BaseButton @click="configDialogVisible = false">取消</BaseButton>
        <BaseButton type="primary" :loading="generateLoading" @click="handleConfirmGenerate">
          确认生成
        </BaseButton>
      </div>
    </div>
  </Dialog>

  <!-- 生成结果对话框 -->
  <Dialog v-model="dialogVisible" title="生成结果" width="85%" maxHeight="85vh">
    <div v-if="generatedResult">
      <h4 class="mb-10px flex items-center gap-10px">
        生成文件清单 —
        <ElTag type="success">{{ generatedResult.entity_info.model_name }}</ElTag>
        共 {{ generatedResult.files.length }} 个文件
        <BaseButton type="primary" size="small" @click="downloadAllFiles"
          >⬇ 下载全部代码</BaseButton
        >
      </h4>

      <!-- 前后端分组 Tab -->
      <ElTabs v-model="resultTab" type="border-card" class="mb-10px">
        <ElTabPane name="backend">
          <template #label>
            <span>🦀 Rust 后端 ({{ backendFiles.length }})</span>
            <span v-if="backendFiles.length > 0" class="ml-10px" @click.stop>
              <BaseButton size="small" @click="downloadFiles(backendFiles, 'Rust 后端')"
                >⬇ 下载</BaseButton
              >
            </span>
          </template>
        </ElTabPane>
        <ElTabPane name="frontend">
          <template #label>
            <span>💚 Vue 前端 ({{ frontendFiles.length }})</span>
            <span v-if="frontendFiles.length > 0" class="ml-10px" @click.stop>
              <BaseButton size="small" @click="downloadFiles(frontendFiles, 'Vue 前端')"
                >⬇ 下载</BaseButton
              >
            </span>
          </template>
        </ElTabPane>
      </ElTabs>

      <div class="flex" style="height: 60vh">
        <!-- 左侧文件树 -->
        <div class="w-220px flex-shrink-0 border-r border-gray-200 overflow-auto pr-10px">
          <div
            v-for="file in resultTab === 'backend' ? backendFiles : frontendFiles"
            :key="file.path"
            class="py-6px px-8px cursor-pointer rounded text-sm truncate"
            :class="
              activeTab === file.path ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'
            "
            @click="activeTab = file.path"
          >
            <span :title="file.path">{{ file.path.split('/').pop() }}</span>
          </div>
        </div>

        <!-- 右侧代码预览 -->
        <div class="flex-1 flex flex-col overflow-hidden pl-10px">
          <div class="mb-5px flex items-center">
            <ElTag size="small" :type="currentFile?.file_type === 'rust' ? 'warning' : 'success'">{{
              currentFile?.file_type
            }}</ElTag>
            <span class="ml-5px text-gray-500 text-sm">{{ currentFile?.path }}</span>
            <span class="ml-5px text-gray-400 text-xs">{{ currentFile?.description }}</span>
          </div>
          <BaseButton size="small" @click="copyCode(currentFile!.content)">复制代码</BaseButton>
          <BaseButton
            v-if="currentFile"
            size="small"
            type="primary"
            class="ml-5px"
            @click="downloadFile(currentFile!)"
            >⬇ 下载当前文件</BaseButton
          >
          <CodeEditor
            v-model="currentFileContent"
            :language="currentFileLang"
            class="flex-1 mt-5px"
          />
        </div>
      </div>

      <div v-if="Object.keys(generatedResult.mod_updates).length > 0" class="mt-10px">
        <h4 class="mb-10px">
          <ElTag type="warning">mod.rs 需手动追加以下内容</ElTag>
        </h4>
        <div v-for="(content, path) in generatedResult.mod_updates" :key="path" class="mb-10px">
          <div class="flex items-center mb-5px">
            <ElTag size="small">{{ path }}</ElTag>
            <BaseButton size="small" class="ml-5px" @click="copyCode(content)">复制</BaseButton>
          </div>
          <pre
            class="m-0 p-10px text-sm bg-gray-900 text-green-400 rounded overflow-auto max-h-200px"
            >{{ content }}</pre
          >
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
:deep(.el-collapse-item__header) {
  font-weight: bold;
  font-size: 15px;
}
:deep(.monaco-editor) {
  border-radius: 4px;
}
</style>
