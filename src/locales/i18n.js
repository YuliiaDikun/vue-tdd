import { createI18n } from "vue-i18n";
const i18n = createI18n({
  locale: "en",
  messages: {
    en: {
      signUp: "Sign Up",
      username: "Username",
      email: "E-mail",
      password: "Password",
      passwordRepeat: "Password Repeat",
    },
    uk: {
      signUp: "Реєстрація",
      username: "Ім'я користувача",
      email: "Електронна пошта",
      password: "Пароль",
      passwordRepeat: "Повторити пароль",
    },
  },
});


export default i18n;