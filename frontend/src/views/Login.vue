<template>
  <n-flex justify="center" style="height: 100%">
    <n-flex vertical justify="center" align="center">
      <n-card class="login-form">
        <template #header>
          <h3>{{ config.title }}</h3>
        </template>
        <n-flex vertical justify="center">
          <n-form ref="loginForm" :model="loginData" :rules="loginRules" @submit.prevent="login">
            <n-form-item-row :label="t('Login')" path="username">
              <n-input v-model:value="loginData.username" :placeholder="t('Login')" />
            </n-form-item-row>
            <n-form-item-row :label="t('Password')" path="password">
              <n-input v-model:value="loginData.password" type="password" show-password-on="click" :placeholder="t('Password')" />
            </n-form-item-row>
            <n-button type="primary" @click="login" :loading="isLoading" block secondary strong>{{ $t('Sign in') }}</n-button>
          </n-form>
          <n-alert v-if="loginError" :title="$t('Authentication failed')" type="error" closable>
            {{ $t('Please check your credentials and try again.') }}
          </n-alert>
        </n-flex>
      </n-card>
    </n-flex>
  </n-flex>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router';
import { NFlex, NCard, NForm, NFormItemRow, NInput, NButton, NAlert, FormValidationError, FormInst } from 'naive-ui'
import { useConfig } from '~/composables/config';
import { useApi } from '~/composables/fetch';
import { useUser } from '~/composables/user';

const { locale, t } = useI18n()
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
const loginForm = ref<FormInst|null>(null)
const loginError = ref(false)

onKeyStroke('Enter', () => {
  login()
})

const login = async() => {
  loginError.value = false;
  try {
    await loginForm.value?.validate(async(errors: Array<FormValidationError>|undefined) => {
      if (!errors) {
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
    });
  }
  catch (error) {}
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
  text-transform: uppercase;
  margin: 0;
  font-size: 40px;
  letter-spacing: 2px;
}
.login-form {
  width: 500px;
}
@media only screen and (max-width: 500px) {
  .login-form {
    width: 90%;
  }
}
</style>