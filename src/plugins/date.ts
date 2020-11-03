import Vue from "vue";
import { parseISO, format } from "date-fns";
import { fi, sv, enUS } from "date-fns/locale";
import VueI18n from "@/plugins/i18n";

export class DatePlugin {
  public install(vue: typeof Vue) {
    vue.prototype.$date = function(value: string, pattern = "d.M.y") {
      const date = parseISO(value);
      let locale;
      switch (VueI18n.locale) {
        case "sv":
          locale = sv;
          break;
        case "en":
          locale = enUS;
          break;
        default:
          locale = fi;
          break;
      }
      return format(date, pattern, { locale });
    };
  }
}

Vue.use(new DatePlugin());
