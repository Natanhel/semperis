<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <h4>Daily Health Reprot</h4>
    <v-row dense>
      <v-checkbox
        on-icon="mdi-checkbox-outline"
        color="#6FBCE4"
        v-model="dailyHealthReport"
        label="Send Daily health report at:"
        @change="reportDirty"
      />
      <input
        v-model="time"
        :disabled="!dailyHealthReport"
        type="time"
        name="time"
        id="time-picker"
      />
      <span class="error-hanlder">
        {{ dailyHealthError }}
      </span>
    </v-row>

    <h4>Monitor Service</h4>
    <v-row dense align="center">
      wait
      <span class="numbers-input">
        <v-text-field
          class="centered-input"
          v-model="wait"
          placeholder="0"
          type="number"
          :rules="monitorServiceRules"
          @input="reportDirty"
        ></v-text-field>
      </span>
      minutes before sending repetitive email alerts
    </v-row>
  </v-form>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PanelBase",

  props: {
    save: {
      type: Boolean,
      default: false,
      required: true,
    },
    discard: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  data: () => ({
    valid: true,
    wait: "",
    dailyHealthReport: false,
    monitorServiceRules: [
      (v) => (!!v && v !== 0) || "Required.",
      (v) => v >= 0 || "Must be positive.",
    ],
    dailyHealthError: "",
    time: "",
  }),

  watch: {
    save() {
      if (this.validate()) {
        this.$emit("saveData", {
          wait: this.wait,
          dailyHealthReport: this.dailyHealthReport,
          time: this.time,
        });
      }
    },
    discard() {
      this.$refs.form.reset();
      this.time = "";
    },
  },

  created() {
    // set sata from backend
    this.wait = this.waitData;
    this.time = this.sendTimeData;
    this.dailyHealthReport = this.dailyHealthReportData;
  },

  computed: {
    ...mapState({
      dailyHealthReportData: (state) => state.formData.dailyHealthReport,
      waitData: (state) => state.formData.wait,
      sendTimeData: (state) => state.formData.time,
    }),
  },

  methods: {
    reportDirty() {
      this.$emit("dirty");
    },
    validate() {
      // reset errors
      this.dailyHealthError = "";
      this.time === "" &&
        this.dailyHealthReport &&
        (this.dailyHealthError = "Required.");

      const isValid =
        this.dailyHealthError === "" && this.$refs.form.validate();

      return isValid;
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
#time-picker {
  width: 7rem;
  height: 2rem;
  margin: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.42);
}
#time-picker:hover {
  transition: all 0.3s;
  border-bottom: 1px solid rgba(0, 0, 0, 0.87);
}
.error-hanlder {
  height: 2rem;
  line-height: 12px;
  word-break: break-word;
  overflow-wrap: break-word;
  word-wrap: break-word;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  color: #ff5252;
  caret-color: #ff5252;
  font-size: 12px;
  transform: translate(-8rem, 3.5rem);
  transition: all 0.3s;
}

// input[type="time"]::-webkit-calendar-picker-indicator{
//   filter: invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%);
// }
</style>