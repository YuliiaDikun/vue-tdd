import { createI18n } from "vue-i18n";
import uk from './uk.json'
import en from './en.json'
const i18n = createI18n({
  locale: "en",
  messages: {
    en,
    uk,
  },
});


export default i18n;