<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ref, unref } from 'vue'
import { ElDivider, ElImage, ElTag, ElTabPane, ElTabs, ElButton, ElMessage } from 'element-plus'
import defaultAvatar from '@/assets/imgs/avatar.jpg'
import UploadAvatar from './components/UploadAvatar.vue'
import { Dialog } from '@/components/Dialog'
import EditInfo from './components/EditInfo.vue'
import EditPassword from './components/EditPassword.vue'
import { PutUpdateAvatar } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

const userStore = useUserStore()
const userInfo = ref()
const fetchDetailUserApi = async () => {
  userInfo.value = userStore.getUserInfo
}
fetchDetailUserApi()

const activeName = ref('first')

const dialogVisible = ref(false)

const uploadAvatarRef = ref<ComponentRef<typeof UploadAvatar>>()
const avatarLoading = ref(false)
const saveAvatar = async () => {
  try {
    avatarLoading.value = true
    const base64 = unref(uploadAvatarRef)?.getBase64()
    // 这里可以调用修改头像接口
    const res = await PutUpdateAvatar({ avatar: base64 })
    userStore.setUserAvatar(res.data)
    fetchDetailUserApi()
    ElMessage.success(t('personal.modifiedsucess'))
    dialogVisible.value = false
  } catch (error) {
    console.log(error)
  } finally {
    avatarLoading.value = false
  }
}
</script>

<template>
  <div class="flex w-100% h-100%">
    <ContentWrap :title="t('personal.personalinfo')" class="w-400px">
      <div class="flex justify-center items-center">
        <div
          class="avatar w-[150px] h-[150px] relative cursor-pointer"
          @click="dialogVisible = true"
        >
          <ElImage
            class="w-[150px] h-[150px] rounded-full"
            :src="userInfo?.avatar || defaultAvatar"
            fit="fill"
          />
        </div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>{{ t('personal.accout') }}：</div>
        <div>{{ userInfo?.username }}</div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>{{ t('personal.nickname') }}：</div>
        <div>{{ userInfo?.nickname }}</div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>{{ t('personal.phone') }}：</div>
        <div>{{ userInfo?.phone ?? '-' }}</div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>{{ t('personal.email') }}：</div>
        <div>{{ userInfo?.email ?? '-' }}</div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>{{ t('personal.haverole') }}：</div>
        <div>
          <template v-if="userInfo?.roleList?.length">
            <ElTag v-for="item in userInfo?.roleList || []" :key="item" class="ml-2 mb-w"
              >{{ item }}
            </ElTag>
          </template>
          <template v-else>-</template>
        </div>
      </div>
      <ElDivider />
    </ContentWrap>
    <ContentWrap :title="t('personal.basicdata')" class="flex-[3] ml-20px">
      <ElTabs v-model="activeName">
        <ElTabPane :label="t('personal.basicinformation')" name="first">
          <EditInfo :user-info="userInfo" />
        </ElTabPane>
        <ElTabPane :label="t('personal.modifiedpassword')" name="second">
          <EditPassword />
        </ElTabPane>
      </ElTabs>
    </ContentWrap>
  </div>

  <Dialog v-model="dialogVisible" :title="t('personal.modifiedavatar')" width="800px">
    <UploadAvatar ref="uploadAvatarRef" :url="userInfo?.avatar || defaultAvatar" />

    <template #footer>
      <ElButton type="primary" :loading="avatarLoading" @click="saveAvatar">
        {{ t('personal.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('personal.close') }}</ElButton>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
.avatar {
  position: relative;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    font-size: 50px;
    color: #fff;
    background-color: rgb(0 0 0 / 40%);
    border-radius: 50%;
    content: '+';
    opacity: 0;
    justify-content: center;
    align-items: center;
  }

  &:hover {
    &::after {
      opacity: 1;
    }
  }
}
</style>
