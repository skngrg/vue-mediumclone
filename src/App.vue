<template>
  <div>
    <mcv-top-bar></mcv-top-bar>

    <router-view></router-view>
  </div>
</template>

<script>
import McvTopBar from "./components/TopBar";
import { actionsTypes } from "./store/modules/auth";

export default {
  name: 'McvApp',
  components:{
    McvTopBar
  },
  mounted() {
    this.$store.dispatch(actionsTypes.getCurrentUser);
  }
}
</script>