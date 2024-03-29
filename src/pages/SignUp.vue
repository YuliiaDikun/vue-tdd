<template>
  <div  data-test="signup" class="max-w-[500px] mx-auto pt-10 text-white">
    <form
      data-test="form-sing-up"
      v-if="!signupSuccess"
      class="border border-gray-300 rounded-lg p-5 mx-auto flex flex-col items-center gap-5 justify-center"
    >
      <h1 class="text-white text-center">{{ $t("signUp") }}</h1>

      <Input
        v-model="username"
        id="username"
        :label="$t('username')"
        :help="errors?.username"
      />

      <Input
        v-model="email"
        id="email"
        :label="$t('email')"
        :help="errors?.email"
      />

      <Input
        v-model="password"
        id="password"
        type="password"
        :label="$t('password')"
        :help="errors?.password"
      />

      <Input
        v-model="passwordrepeat"
        id="password-repeat"
        type="password"
        :label="$t('passwordRepeat')"
        :help="hasPasswordMismatch ? $t('passwordMismatch') : undefined"
      />

      <button
        class="submit_btn"
        type="submit"
        :disabled="isDisabled || apiProgress"
        @click.prevent="submit"
      >
        {{ $t("signUp") }}

        <svg
          v-show="apiProgress"
          data-test="progress"
          role="status"
          class="ml-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </button>
    </form>
    <p
      data-test="signupSuccess"
      :class="!signupSuccess && 'hidden'"
      role="alert"
      class="py-5 px-3 bg-green-900 rounded-xl mt-6"
    >
      {{ $t("emailCheck") }}
    </p>
  </div>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import Input from "../components/Input.vue";
import { signUp } from "../api/apiCalls";

const username = ref("");
const email = ref("");
const password = ref("");
const passwordrepeat = ref("");

const apiProgress = ref(false);
const signupSuccess = ref(false);

const errors = ref({});

watch(username, () => {
  delete errors.value.username;
});
watch(email, () => {
  delete errors.value.email;
});
watch(password, () => {
  delete errors.value.passsword;
});

const isDisabled = computed(() => {
  return password.value && passwordrepeat.value
    ? password.value !== passwordrepeat.value
    : true;
});

const hasPasswordMismatch = computed(() => {
  return password.value !== passwordrepeat.value;
});

const submit = async () => {
  try {
    apiProgress.value = true;
    await signUp({
      username: username.value,
      email: email.value,
      password: password.value,
    });
    signupSuccess.value = true;
  } catch (error) {
    if (error.response.status === 400) {
      errors.value = error.response.data.validationErrors;
    }
    apiProgress.value = false;
  }
};
</script>
