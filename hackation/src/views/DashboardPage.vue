<template>
  <div>
    <div class="nav">
      <router-link to="/admin">Dashboard</router-link>
      <router-link to="/admin/manager-category">Manager Category</router-link>
      <router-link to="/admin/manager-product">Manager Product</router-link>
    </div>
    <div class="header">
      <div class="content">
        <h3>Dashboard Page</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  border: 1px solid black;
}
.nav {
  background-color: black;
  padding: 16px;
}
.nav a {
  color: white;
  margin: 0 15px;
  text-decoration: none;
}
.nav a.router-link-exact-active {
  font-weight: bold;
  color: #ffd700;
}
.content {
  padding: 20px;
}
</style>
