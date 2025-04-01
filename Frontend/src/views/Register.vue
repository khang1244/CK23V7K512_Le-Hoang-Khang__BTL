<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4 class="text-center">Đăng ký</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleRegister">
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
                    @input="updatePasswordStrength"
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
                <!-- Hiển thị độ mạnh mật khẩu với màu sắc -->
                <div v-if="passwordStrength" :class="passwordStrengthClass">
                  Độ mạnh mật khẩu: {{ passwordStrength }}
                </div>
              </div>
              <div class="form-group">
                <label for="confirmPassword">Xác nhận mật khẩu</label>
                <input
                  v-model="confirmPassword"
                  :type="passwordVisible ? 'text' : 'password'"
                  class="form-control"
                  id="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  required
                />
              </div>
              <!-- Thông báo lỗi hoặc thành công -->
              <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
              <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>

              <button type="submit" class="btn btn-success btn-block">
                Đăng ký
              </button>
            </form>
          </div>
        </div>
        <div class="mt-3 text-center">
          <span>Đã có tài khoản? </span>
          <router-link to="/login" class="btn btn-link">Đăng nhập</router-link>
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
      confirmPassword: "",
      errorMessage: null,
      successMessage: null,
      passwordStrength: null, // Thêm biến để lưu trữ độ mạnh mật khẩu
      passwordStrengthClass: "", // Thêm biến để lưu trữ lớp CSS cho độ mạnh mật khẩu
      passwordVisible: false, // Trạng thái ẩn/hiện mật khẩu
    };
  },
  methods: {
    // Hàm kiểm tra độ mạnh mật khẩu
    checkPasswordStrength(password) {
      let strength = "Yếu";
      const regexStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
      const regexMedium = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // Chỉ bao gồm chữ và số, ít nhất 8 ký tự

      if (regexStrong.test(password)) {
        strength = "Mạnh";
      } else if (regexMedium.test(password)) {
        strength = "Trung bình";
      }
      return strength;
    },

    // Hàm cập nhật độ mạnh mật khẩu và thay đổi lớp CSS
    updatePasswordStrength() {
      this.passwordStrength = this.checkPasswordStrength(this.password);

      if (this.passwordStrength === "Mạnh") {
        this.passwordStrengthClass = "strong-password";
      } else if (this.passwordStrength === "Trung bình") {
        this.passwordStrengthClass = "medium-password";
      } else {
        this.passwordStrengthClass = "weak-password";
      }
    },

    // Hàm chuyển đổi ẩn/hiện mật khẩu
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },

    async handleRegister() {
      // Kiểm tra độ dài tên đăng nhập và mật khẩu
      if (this.username.length <= 4) {
        this.errorMessage = "Tên đăng nhập phải dài hơn 4 ký tự.";
        return;
      }

      if (this.password.length <= 8) {
        this.errorMessage = "Mật khẩu phải dài hơn 8 ký tự.";
        return;
      }

      // Kiểm tra nếu mật khẩu và xác nhận mật khẩu không khớp
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Mật khẩu không khớp";
        return;
      }

      // Kiểm tra độ mạnh mật khẩu
      if (this.passwordStrength === "Yếu") {
        this.errorMessage = "Mật khẩu yếu, hãy thử mật khẩu mạnh hơn!";
        return;
      }

      try {
        // Gửi request đăng ký lên API
        const res = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        const data = await res.json();

        // Nếu đăng ký thất bại, hiển thị thông báo lỗi
        if (!res.ok) {
          throw new Error(data.message || "Đăng ký thất bại");
        }

        // Nếu đăng ký thành công, hiển thị thông báo thành công
        this.successMessage = "Đăng ký thành công!";
        this.errorMessage = null;

        // Điều hướng người dùng sang trang đăng nhập
        setTimeout(() => {
          this.$router.push("/login");
        }, 1500);  // Chờ 1 giây để người dùng thấy thông báo thành công
      } catch (err) {
        this.errorMessage = err.message;
        this.successMessage = null;
      }
    },
  },
};
</script>

<style scoped>
@import "@/assets/Register.css";
</style>


