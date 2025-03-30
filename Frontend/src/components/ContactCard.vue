<script>
export default {
    props: {
        contact: { type: Object, required: true },
    },
};
</script>
<template>
    <div>
        <div class="p-1">
            <strong>Tên:</strong>
            {{ contact.name }}
        </div>
        <div class="p-1">
            <strong>Email:</strong>
            {{ contact.email }}
        </div>
        <div class="p-1">
            <strong>Địa chỉ:</strong>
            {{ contact.address }}
        </div>
        <div class="p-1">
            <strong>Điện thoại:</strong>
            {{ contact.phone }}
        </div>
        <div class="p-1">
  <strong>Ngày làm việc trong tuần:</strong>
  <table class="table table-bordered table-sm mt-2" style="width: auto;">
    <thead class="thead-light">
      <tr>
        <th scope="col">Ngày làm việc</th>
        <th scope="col">Ca làm việc</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(schedule, index) in contact.workSchedule" :key="index">
        <td>{{ schedule.day }}</td>
        <td>{{ schedule.timework || 'Không có ca làm việc' }}</td>
      </tr>
    </tbody>
  </table>
</div>

        <div class="p-1">
            <strong>Liên hệ yêu thích:&nbsp;</strong>
            <i v-if="contact.favorite" class="fas fa-check"></i>
            <i v-else class="fas fa-times"></i>
        </div>
    </div>
</template>