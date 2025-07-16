<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { Icon } from '@/components/Icon'
import { ElTag } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => undefined
  }
})

const renderTag = (enable?: boolean) => {
  return (
    <ElTag type={!enable ? 'danger' : 'success'}>
      {enable ? t('menu.enable') : t('menu.disable')}
    </ElTag>
  )
}

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'type',
    label: t('menu.menutype'),
    span: 24,
    slots: {
      default: (data) => {
        const menu_type = data.menu_type
        return <>{menu_type === 'M' ? t('menu.menu') : t('menu.contents')}</>
      }
    }
  },
  {
    field: 'title',
    label: t('menu.menuName')
  },
  {
    field: 'component',
    label: t('menu.component'),
    slots: {
      default: (data) => {
        const component = data.component
        return (
          <>
            {component === '#'
              ? t('menu.topmenu')
              : component === '##'
                ? t('menu.childcontents')
                : component}
          </>
        )
      }
    }
  },
  {
    field: 'name',
    label: t('menu.componentname')
  },
  {
    field: 'meta.icon',
    label: t('menu.icon'),
    slots: {
      default: (data) => {
        const icon = data.icon
        if (icon) {
          return (
            <>
              <Icon icon={icon} />
            </>
          )
        } else {
          return null
        }
      }
    }
  },
  {
    field: 'path',
    label: t('menu.path')
  },

  {
    field: 'status',
    label: t('menu.status'),
    slots: {
      default: (data) => {
        return renderTag(data.status === 1)
      }
    }
  },
  {
    field: 'meta.activeMenu',
    label: t('menu.activeMenu'),
    slots: {
      default: (data) => {
        return renderTag(data.enableHidden)
      }
    }
  },
  {
    field: 'meta.hidden',
    label: t('menu.hidden'),
    slots: {
      default: (data) => {
        return renderTag(data.enableHidden)
      }
    }
  },
  {
    field: 'meta.alwaysShow',
    label: t('menu.alwaysShow'),
    slots: {
      default: (data) => {
        return renderTag(data.enableDisplay)
      }
    }
  },
  {
    field: 'meta.noCache',
    label: t('menu.noCache'),
    slots: {
      default: (data) => {
        return renderTag(data.enableCleanCache)
      }
    }
  },
  {
    field: 'meta.breadcrumb',
    label: t('menu.breadcrumb'),
    slots: {
      default: (data) => {
        return renderTag(data.enableShowCrumb)
      }
    }
  },
  {
    field: 'meta.affix',
    label: t('menu.affix'),
    slots: {
      default: (data) => {
        return renderTag(data.enablePinnedTab)
      }
    }
  },
  {
    field: 'meta.noTagsView',
    label: t('menu.noTagsView'),
    slots: {
      default: (data) => {
        return renderTag(data.enableHiddenTab)
      }
    }
  },
  {
    field: 'meta.canTo',
    label: t('menu.canTo'),
    slots: {
      default: (data) => {
        return renderTag(data.enableSkip)
      }
    }
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
