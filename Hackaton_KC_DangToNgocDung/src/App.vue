<template>
  <v-app>
    <v-app-bar app>
      <h1>Hackation</h1>
    </v-app-bar>
    <v-container>
      <router-view></router-view>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>
