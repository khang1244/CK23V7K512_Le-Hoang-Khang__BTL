<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>
    <!-- Bên trái: danh sách danh bạ -->
    <div class="mt-3 col-md-6">
      <h4>
        Danh bạ 
        <i class="fas fa-address-book"></i>
    </h4>
      <ContactList v-if="filteredContactsCount > 0" :contacts="filteredContacts"
        v-model:activeIndex="activeIndex"  />
      <p v-else>Không có liên hệ nào.</p>
      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList()">
          <i class="fas fa-redo"></i> Làm mới
        </button>
        <button class="btn btn-sm btn-success" @click="goToAddContact()">
          <i class="fas fa-plus"></i> Thêm mới
        </button>
        <button class="btn btn-sm btn-danger" @click="removeAllContacts">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button> 
      </div>
    </div>

    <!-- Bên phải: chi tiết liên hệ + hình ảnh + nút -->
    <div class="mt-3 col-md-6">
      <div v-if="activeContact">
        <div id="pdf-export-wrapper">
          <div
            id="pdf-content"
            class="pdf-wrapper d-flex justify-content-center align-items-start" >
            <div class="detail-contact mr-3">
              <h4>
                Chi tiết liên hệ 
                <i class="fas fa-address-card"></i>
            </h4>
              <!-- Đây là component con -->
              <ContactCard :contact="activeContact" @export="exportToPDF" />
            </div>
            <div>
              <h6>Hình ảnh</h6>
              <img :src="activeContact.image" height="260px">
            </div>
          </div>
        </div>

        <!-- Đặt nút ngang hàng với "Liên hệ yêu thích" -->
        <div class="d-flex align-items-center justify-content-start ml-3">
          <router-link :to="{
                name: 'contact.edit',
                params: { id: activeContact._id },
        }">
            <button class="btn btn-warning btn-sm mr-2">
              <i class="fas fa-edit"></i> Hiệu chỉnh</button>
          </router-link>
          <button class="btn btn-warning btn-sm" @click="exportToPDF">
            📄 Xuất PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import html2pdf from "html2pdf.js";
import ContactCard from "@/components/ContactCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import ContactList from "@/components/ContactList.vue";
import ContactService from "@/services/contact.service";

export default {
  components: {
    ContactCard,
    InputSearch,
    ContactList
  },
    // Đoạn mã xử lý đầy đủ sẽ trình bày bên dưới
  data() {
    return {
      contacts: [],
      activeIndex: -1,
      searchText: "",
    };
  },

    watch: {
        searchText() {
            this.activeIndex = -1;
        },
    },

  computed: {
    contactStrings() {
            return this.contacts.map((contact) => {
                const { name, email, address, phone } = contact;
                return [name, email, address, phone].join("");
            });
    },
    filteredContacts() {
      if (!this.searchText) return this.contacts;
            return this.contacts.filter((_contact, index) =>
                this.contactStrings[index].includes(this.searchText)
      );
    },
    activeContact() {
      if (this.activeIndex < 0) return null;
      return this.filteredContacts[this.activeIndex];
    },
    filteredContactsCount() {
      return this.filteredContacts.length;
    },
  },

  methods: {
    async retrieveContacts() {
      try {
        this.contacts = await ContactService.getAll();
      } catch (error) {
                console.log(error);
      }
    },

    refreshList() {
      this.retrieveContacts();
      this.activeIndex = -1;
    },

    async removeAllContacts() {
      if (confirm("Bạn có muốn xóa tất cả Liên hệ?")) {
        try {
          await ContactService.deleteAll();
          this.refreshList();
        } catch (error) {
                    console.log(error);
        }
      }
    },

    goToAddContact() {
      this.$router.push({ name: "contact.add" });
    },
    exportToPDF() {
      const element = document.getElementById("pdf-export-wrapper");
      if (!element) return alert("Không tìm thấy vùng xuất PDF!");

      const opt = {
        margin: 0,
        filename: `${this.activeContact.name}_thong_tin_lien_he.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(opt).from(element).save();
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
@import "@/assets/ContactBook.css";
</style>

