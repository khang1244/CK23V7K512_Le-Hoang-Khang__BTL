<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4 class="text-center">Đăng nhập</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="form-group">
                <label for="username">Tên đăng nhập</label>
                <input
                  v-model="username"
                  type="text"
                  class="form-control"
                  id="username"
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>
              <div class="form-group">
                <label for="password">Mật khẩu</label>
                <div class="input-group">
                  <input
                    v-model="password"
                    :type="passwordVisible ? 'text' : 'password'"
                    class="form-control"
                    id="password"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <div class="input-group-append">
                    <span
                      class="input-group-text"
                      @click="togglePasswordVisibility"
                      style="cursor: pointer"
                    >
                      <i :class="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </span>
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary btn-block">
                Đăng nhập
              </button>
            </form>

            <!-- Thông báo lỗi nếu có -->
            <div v-if="error" class="alert alert-danger mt-3">
              {{ error }}
            </div>

            <!-- Thông báo thành công nếu có -->
            <div v-if="successMessage" class="alert alert-success mt-3">
              {{ successMessage }}
            </div>
          </div>
        </div>
        <div class="mt-3 text-center">
          <span>Chưa có tài khoản? </span>
          <router-link to="/register" class="btn btn-link">Đăng ký</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      error: null,  // Lỗi đăng nhập
      successMessage: null,  // Thông báo thành công
      passwordVisible: false,  // Trạng thái ẩn/hiện mật khẩu
    };
  },
  methods: {
    // Hàm chuyển đổi ẩn/hiện mật khẩu
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },

    async handleLogin() {
  // Reset error and success messages before trying login
  this.error = null;
  this.successMessage = null;

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");

    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);

    // Cập nhật sự kiện khi đăng nhập thành công
    window.dispatchEvent(new Event("update-username"));

    // Hiển thị thông báo thành công
    this.successMessage = "Đăng nhập thành công! Bạn sẽ được chuyển đến trang chủ.";

    // Sau 3 giây chuyển hướng về trang chủ
    setTimeout(() => {
      this.$router.push("/");
    }, 970);

  } catch (err) {
    // Hiển thị thông báo lỗi nếu có
    this.error = err.message;
    this.successMessage = null;
  }
},
  },
};
</script>

<style scoped>
@import "@/assets/Login.css";
</style>


