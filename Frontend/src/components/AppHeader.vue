<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark">
        <a href="/" class="navbar-brand">Ứng dụng Quản lý danh bạ</a>
        <div class="mr-auto navbar-nav">
            <li class="nav-item">
                <router-link :to="{ name: 'contactbook' }" class="nav-link">
                     Danh bạ 
                     <i class="fas fa-address-book"></i>
                </router-link>
            </li>
        </div>
        <div class="ml-auto navbar-nav">
      <!-- Dropdown khi đã đăng nhập -->
      <li class="nav-item dropdown" v-if="username">
        <a
          class="nav-link dropdown-toggle text-white"
          href="#"
          id="userDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Xin chào, {{ username }}
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
          <a class="dropdown-item text-danger" href="#" @click.prevent="logout">Đăng xuất</a>
        </div>
      </li>

      <!-- Đăng nhập/Đăng ký khi chưa đăng nhập -->
      <li class="nav-item" v-else>
        <router-link to="/login" class="nav-link">Đăng nhập</router-link>
      </li>
      <li class="nav-item" v-if="!username">
        <router-link to="/register" class="nav-link">Đăng ký</router-link>
      </li>
    </div>
    </nav>
</template>
<script> 
export default {
  data() {
    return {
      username: null,
    };
  },
  mounted() {
    this.username = localStorage.getItem("username");
    window.addEventListener("storage", this.syncUser);
    window.addEventListener("update-username", this.syncUser);
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.syncUser);
    window.removeEventListener("update-username", this.syncUser);
  },
  methods: {
    syncUser() {
      this.username = localStorage.getItem("username");
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      this.username = null;
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* Đảm bảo dropdown menu không bị lỗi */
.dropdown-menu {
  min-width: 10rem;
}
</style>
