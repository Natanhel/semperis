<template>
  <v-form ref="advancedForm">
    <h4>Server data disk space</h4>
    <v-row align="center">
      <span>
        <v-checkbox
          color="#6FBCE4"
          on-icon="mdi-checkbox-outline"
          v-model="sendWeeklyAlerts"
          :label="`Send weekly disk space alert at:`"
          @click="$emit('dirty')"
        />
      </span>
      <span
        v-for="(items, key) in selections"
        :key="key"
        class="dropdown-input"
      >
        <v-select
          :items="items.data"
          v-model="items.model"
          :disabled="!sendWeeklyAlerts"
          :rules="dropdownRules()"
          :placeholder="items.data[0]"
          @change="$emit('dirty')"
        />
      </span>
      <span> when disk space has dropped below: </span>
    </v-row>

    <v-row
      v-for="option in options"
      :key="option.label"
      align="center"
      class="disk-space-options"
    >
      <v-checkbox
        color="#6FBCE4"
        on-icon="mdi-checkbox-outline"
        v-model="option.model"
        :disabled="!sendWeeklyAlerts"
        @click="$emit('dirty') && $refs.advancedForm.resetValidation()"
      />
      <span class="numbers-bigger-input">
        <v-text-field
          v-model="option.value"
          placeholder="0"
          type="number"
          :rules="getRules(option)"
          :disabled="!option.model"
          @input="$emit('dirty')"
        ></v-text-field>
      </span>

      {{ option.label }}
    </v-row>
  </v-form>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "PanelAdvanced",

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
    hoursInDay: 24,
    daysInWeek: 7,
    sendWeeklyAlerts: false,
    weekdays: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],

    gigaBytes: "number",
    percentage: "percentage",

    options: [
      { label: "GB", type: "number" },
      { label: "%", type: "percentage" },
    ],
  }),

  watch: {
    save() {
      const isValid = this.$refs.advancedForm.validate();

      if (isValid) {
        this.$emit("saveData", {
          options: this.options,
          selections: this.selections.map((s) => s.model),
        });
      }
    },
    discard() {
      this.$refs.advancedForm.reset();
    },
  },

  created() {
    if (this.selectionsData?.some((s) => s !== "")) {
      this.sendWeeklyAlerts = true;
    }

    this.optionsData?.forEach((option, index) => {
        option.model && (this.options[index] = option)
    });
  },

  methods: {
    dropdownRules() {
      return this.sendWeeklyAlerts ? [this.isEmpty] : [];
    },
    zeroPad: (num, places) => String(num).padStart(places, "0"),
    validateOneOrMoreSelected() {
      return (
        this.options.some((option) => option.model) || "Select at least one"
      );
    },

    isEmpty: (value) => !!value || "Required.",
    isPositive: (value) => value > 0 || "Use positives.",
    maxValue: (value) => value <= 100000 || "Too high!",
    maxPrecentageValue: (value) => value <= 100 || "Too high!",
    minPrecentageValue: (value) => value > 0 || "Too high!",

    getRules(option) {
      let rules = [];
      option.model &&
        rules.push(...[this.isEmpty, this.isPositive, this.maxValue]); // I don't care about maxValue for % - can be removed for optimization
      this.sendWeeklyAlerts && rules.push(this.validateOneOrMoreSelected);
      if (option.type === this.percentage && option.model) {
        rules.push(...[this.minPrecentageValue, this.maxPrecentageValue]);
      }
      return rules || [];
    },
  },
  computed: {
    ...mapState({
      // data from backend
      selectionsData: (state) => state.formData?.selections,
      optionsData: (state) => state.formData?.options,
    }),
    selections() {
      let res = [{ data: this.weekdays }, { data: this.hours }];
      if (this.selectionsData) {
        res = res.map((d, index) => {
          return {
            ...d,
            model: this.selectionsData[index],
          };
        });
      }
      return res;
    },
    halfHoursInDay() {
      return this.hoursInDay / 2;
    },
    hours() {
      return Array(this.hoursInDay)
        .fill(0)
        .map(
          (v, i) =>
            `${this.zeroPad(i % this.halfHoursInDay, 2)}:00 ${
              this.halfHoursInDay > i ? "AM" : "PM"
            }`
        );
    },
  },
};
</script>

<style lang="scss" scoped>
.col,
.row {
  padding: 0;
  margin: 0;
  // height: 1rem;
}
.disk-space-options {
  margin-left: 1rem;
  height: 3rem;
}
</style>