<template>
  <Form @submit="submitContact" :validation-schema="contactFormSchema">
    <div class="form-group">
      <label for="name">Tên</label>
      <Field name="name" type="text" class="form-control" v-model="contactLocal.name"></Field>
      <ErrorMessage name="name" class="error-feedback"/>
    </div>
    <div class="form-group">
      <label for="email">E-mail</label>
      <Field name="email" type="email" class="form-control" v-model="contactLocal.email"></Field>
      <ErrorMessage name="email" class="error-feedback"/>
    </div>
    <div class="form-group">
      <label for="address">Địa chỉ</label>
      <Field name="address" type="text" class="form-control" v-model="contactLocal.address"></Field>
      <ErrorMessage name="address" class="error-feedback"/>
    </div>
    <div class="form-group">
      <label for="phone">Điện thoại</label>
      <Field name="phone" type="tel" class="form-control" v-model="contactLocal.phone"></Field>
      <ErrorMessage name="phone" class="error-feedback"/>
    </div>

    <div class="form-group">
  <label><strong>Ngày làm việc trong tuần:</strong></label>
  <div class="work-schedule-grid">
    <div v-for="(schedule, index) in contactLocal.workSchedule" :key="index" class="schedule-item">
      <label>{{ schedule.day }}</label>
      <select v-model="schedule.timework" class="form-control">
        <option value="">-- Không có ca làm việc --</option>
        <option value="Ca sáng (7h30 - 11h30)">Ca sáng (7h30 - 11h30)</option>
        <option value="Ca chiều (13h30 - 17h30)">Ca chiều (13h30 - 17h30)</option>
        <option value="Cả ngày (7h30 - 22h)">Cả ngày (7h30 - 17h30)</option>
      </select>
    </div>
  </div>
</div>


    <div class="form-group form-check">
      <input name="favorite" type="checkbox" class="form-check-input" v-model="contactLocal.favorite" />
      <label for="favorite" class="form-check-label">
        <strong>Liên hệ yêu thích</strong>
      </label>
    </div>

    <div class="form-group">
      <button class="btn btn-primary">Lưu</button>
      <button v-if="contactLocal._id" type="button" class="ml-2 btn btn-danger" 
              @click="deleteContact">Xóa</button>
      <button type="button" class="ml-2 btn btn-danger" @click="Cancel">Thoát</button>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:contact", "delete:contact"],
  props: {
    contact: { type: Object, required: true }
  },
  data() {
    const contactFormSchema = yup.object().shape({
      name: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải có ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
      email: yup
        .string()
        .email("E-mail không đúng.")
        .max(50, "E-mail tối đa 50 ký tự"),
      address: yup.string().max(100, "Địa chỉ tối đa 100 ký tự"),
      phone: yup
        .string()
        .matches(
          /((09|03|07|08|05)+([0-9]{8})\b)/g,
          "Số điện thoại không hợp lệ."
        ),
    });
    return {
      contactLocal: this.contact ? this.contact : {
        name: "",
        email: "",
        address: "",
        phone: "",
        favorite: false,
        workSchedule: [
          { day: "Thứ 2", timework: "" },
          { day: "Thứ 3", timework: "" },
          { day: "Thứ 4", timework: "" },
          { day: "Thứ 5", timework: "" },
          { day: "Thứ 6", timework: "" },
          { day: "Thứ 7", timework: "" }
        ]
      },
        contactFormSchema,
    };
  },
  methods: {
    submitContact() {
      this.$emit("submit:contact", this.contactLocal);
    },
    deleteContact() {
      this.$emit("delete:contact", this.contactLocal.id);
    },
    Cancel() {
      const reply = window.confirm("You have unsaved changes! Do you want to leave?")
            if (!reply) {
                return false;
            }
            else this.$router.push({ name: "contactbook" });
        }
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>