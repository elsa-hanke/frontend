import Vue from "vue";
import { parseISO, format } from "date-fns";
import { fi, sv, enUS } from "date-fns/locale";
import VueI18n from "@/plugins/i18n";

export class DatePlugin {
  public install(vue: typeof Vue) {
    function parseAndFormat(value: string, pattern: string) {
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
    }

    vue.prototype.$date = function(value: string) {
      return parseAndFormat(value, "P");
    };

    vue.prototype.$datetime = function(value: string) {
      return parseAndFormat(value, "Pp");
    };
  }
}

Vue.use(new DatePlugin());
