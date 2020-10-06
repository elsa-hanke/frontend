import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faFile,
  faSearch,
  faAward,
  faEnvelope,
  faFileAlt,
  faCalendar,
  faArrowsAlt,
  faCircle,
  faPortrait,
  faCheckCircle,
  faClipboard,
  faClipboardList,
  faArrowUp,
  faPaperPlane,
  faShare
} from "@fortawesome/free-solid-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeLayers
} from "@fortawesome/vue-fontawesome";

library.add(faHome);
library.add(faFile);
library.add(faSearch);
library.add(faAward);
library.add(faEnvelope);
library.add(faFileAlt);
library.add(faCalendar);
library.add(faArrowsAlt);
library.add(faCircle);
library.add(faPortrait);
library.add(faCheckCircle);
library.add(faClipboard);
library.add(faClipboardList);
library.add(faArrowUp);
library.add(faPaperPlane);
library.add(faShare);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("font-awesome-layers", FontAwesomeLayers);
