<template>
  <el-space class="flex-justify-center flex-content-center" style="width: 100%; height: 100%">
    <div class="form-container">
      <h3>{{ config.title }}</h3>
      <el-alert v-if="loginError" :title="$t('Authentication failed')" type="error" :description="$t('Please check your credentials and try again.')" />
      <el-form ref="loginForm" :model="loginData" :rules="loginRules">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item prop="username"><el-input v-model="loginData.username" autocomplete="off" :prefix-icon="User" :placeholder="$t('Login')"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item prop="password"><el-input v-model="loginData.password" type="password" autocomplete="off" show-password :prefix-icon="Lock" :placeholder="$t('Password')"></el-input></el-form-item>
          </el-col>
          <el-col :span="8">
          <el-button type="primary" @click="login" :loading="isLoading">{{ $t('Sign in') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-space>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { onKeyStroke } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router';
import { useConfig, useApi, useUser } from '~/composables';

const { locale } = useI18n()
const router = useRouter()
const config = useConfig() as any
const { create: createUser } = useUser()

interface LoginData {
  username: string
  password: string
}

const loginData = reactive<LoginData>({
  username: '',
  password: '',
})
let isLoading = ref(false)

const loginRules = {
  username: [{ required: true, message: '', trigger: 'blur' }],
  password: [{ required: true, message: '', trigger: 'blur' }],
}
const loginForm = ref(null)
const loginError = ref(false)

onKeyStroke('Enter', () => {
  login()
})

const login = () => {
  loginError.value = false;
  (loginForm.value as any).validate(async(valid: boolean) => {
      if (valid) {
        isLoading.value = true
        const { statusCode, error, data } = await useApi('/session',).post({
          user: loginData.username,
          password: loginData.password,
        })
        isLoading.value = false
        if (statusCode.value == 200) {
          // start session
          createUser(loginData.username, (data as any).roles);
          router.push({ name: 'Home', params: { locale: locale.value } })
        }
        else {
          loginError.value = true
        }
      }
      else {
          loginError.value = true
      }
  });
}
</script>

<style>
#logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 240px;
  height: 100px;
  margin: 80px 0 0 80px;
}
</style>

<style scoped>
h3 {
  margin: 18px 0;
  text-transform: uppercase;
  font-size: 40px;
  letter-spacing: 2px;
}
.ep-alert {
  margin-bottom: 18px;
}
.form-container {
  min-width: 380px;
  padding: 24px 30px;
  background: #ffffff;
  border-radius: var(--ep-border-radius-base);
}
</style>