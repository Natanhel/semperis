<template>
  <v-app>
    <div class="container">
      <v-card
        flat
        min-width="100%"
        color="grey lighten-4"
        class="mx-auto"
        max-width="100%"
      >
        <h3 class="primary-color">Health Alerts</h3>
        <v-expansion-panels multiple v-model="panel">
          <v-expansion-panel v-for="(item, i) in modes" :key="i">
            <v-expansion-panel-header class="expansion-header">
              <template v-slot:actions>
                <v-icon class="icon" color="#6FBCE4"> $expand </v-icon>
              </template>
              <h2 class="primary-color primary-font header">
                {{ item.title }}
              </h2>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <component
                :is="item.modeComponent"
                :save="save"
                :discard="discard"
                @dirty="changeDirty"
                @saveData="saveData"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </div>

    <div class="footer">
      <div class="footer-splitter">
        <v-btn
          depressed
          :disabled="!dirty"
          color="#6FBCE4"
          small
          rounded
          @click="saveForm"
          >save</v-btn
        >

        <v-btn
          depressed
          :disabled="!dirty"
          color="#6FBCE4"
          small
          rounded
          plain
          @click="discardForm"
          >Discard</v-btn
        >
      </div>
    </div>
  </v-app>
</template>

<script>
import PanelBase from "@/components/PanelBase";
import PanelAdvanced from "@/components/PanelAdvanced";

import { mapState } from "vuex";

export default {
  name: "App",

  data: () => ({
    data: {},
    dirty: false,
    panel: [0, 1],
    saveTimes: 0,
    // 0 indicate it's advanced, everything else is basic
    advancedMode: "0",
    save: false,
    discard: false,
  }),
  created() {
    this.$store.dispatch("getPermissions")
    this.$store.dispatch("getMode")
    this.$store.dispatch("getFormData")
  },

  computed: {
    ...mapState({
      mode: state => state.mode,
      formData: state => state.formData,
      permission: state => state.permission,
    }),
    isAdvancedMode() {
      // Check if mode is basic or not
      return this.mode === this.advancedMode;
    },
    modes() {
      const panels = [];
      this.permission.basic &&
        panels.push({ title: "Basic", modeComponent: PanelBase });
      this.isAdvancedMode && this.permission.advanced &&
        panels.push({ title: "Advanced", modeComponent: PanelAdvanced });
      return panels;
    },
  },
  methods: {
    saveForm() {
      this.save = !this.save;
      this.dirty = false;
      // localStorage.setItem("backendService", this.mode);
    },
    saveData(data) {
      Object.entries(data).forEach(([key, value]) => {
        this.data[key] = value;
      });
      this.saveTimes += 1;
      // if we got X panels sending us data, we can store the data on the server
      if (this.saveTimes === this.modes.length) {
        // TODO optimize code for saving data, not everything should be sent for updating.
        this.$store.dispatch("setFormData", this.data);
        this.saveTimes = 0;
      }
    },
    changeDirty() {
      this.dirty = true;
    },
    discardForm() {
      this.discard = false;
      this.dirty = false;
    },
  },
};
</script>

<style>
.primary-color {
  color: #6fbce4;
}
.primary-font {
  font-family: "Roboto", sans-serif;
  font-weight: 400;
}
.expansion-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0px !important;
  margin-bottom: 1rem;
}

.container {
  display: flex;
  flex-direction: column;
  padding: 3rem 2rem;

  max-width: 100%;
  min-width: 100%;
  max-height: 100vh;
  min-height: 100vh;
  /* color: black; */
  background: #f1f3f6;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 2rem;
  width: 100%;
  height: 8rem;
}
.footer-splitter {
  padding: 1rem;
  border-top: 1px solid black;
}

.numbers-input {
  width: 3.5rem;
  margin: 0 0.5rem;
}

.numbers-bigger-input {
  width: 7rem;
  margin: 0 0.5rem;
}

.dropdown-input {
  width: 8rem;
  margin: 0 0.5rem;
}
</style>

<style scoped>
.icon {
  order: 0;
}

.header {
  order: 1;
}
</style>
