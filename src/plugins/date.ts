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

    vue.prototype.$duration = function(value: number) {
      const years = value / 365;
      const months = (years - Math.trunc(years)) * 12;
      const days = (months - Math.trunc(months)) * 30.5;

      const res = [];
      if (Math.trunc(years) > 0) {
        res.push(`${Math.trunc(years)} v`);
      }
      if (Math.trunc(months) > 0) {
        res.push(`${Math.trunc(months)} kk`);
      }
      if (Math.round(days) > 0) {
        res.push(`${Math.round(days)} vrk`);
      }
      if (res.length > 0) {
        return res.join(" ");
      } else {
        return "0 vrk";
      }
    };
  }
}

Vue.use(new DatePlugin());
