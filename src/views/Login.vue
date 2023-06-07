<template>
  <div id="logo"></div>
  <div class="form-container">
    <h1 class="text-center">{{ $t('Sign in') }}</h1>
    <el-alert v-if="loginError" :title="$t('Authentication failed')" type="error" :description="$t('Please check your credentials and try again.')" />
    <el-form ref="loginForm" :model="loginData" :rules="loginRules" class="py-2">
      <el-form-item prop="username">
        <el-input v-model="loginData.username" autocomplete="off" :prefix-icon="User" :placeholder="$t('Login')"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginData.password" type="password" autocomplete="off" show-password :prefix-icon="Lock" :placeholder="$t('Password')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login" :loading="isLoading">{{ $t('Sign in') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { onKeyStroke } from '@vueuse/core'
import { useRouter } from 'vue-router';
import { useConfig, useApi, useCookies } from '~/composables';

const config = useConfig() as any
const router = useRouter()
const cookies = useCookies()

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
          console.log(cookies.get(config.authTokenCookieName))
          router.push('/')
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
.form-container {
  padding: 0 50px;
  background: #ffffff;
  border-radius: var(--ep-border-radius-base);
}
</style>