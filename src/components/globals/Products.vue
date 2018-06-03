<template lang="pug">
.database(v-if="isActive")
  .database__filters
  table.table
    tr.table__head
      th(colspan="11").table__right
        button(@click="$emit('toogle')") Закрыть
    tr.table__head
      th.table__center Код
      th.table__left Описание как в РУ
      th.table__left Описание
      th.table__right Цена, руб.
      th.table__center НДС
      th.table__left Направление
      th.table__left Комментарий
      th.table__right Цена за предыдущий период
      th.table__right Разница
      th.table__left Старый код
      th.table__center Действие
    template(v-for="item in database")
      tr
        td.table__center {{ item.id }}
        td.table__left {{ item.description_rc }}
        td.table__left {{ item.description }}
        td.table__right {{ item.price }}
        td.table__center {{ item.vat }}
        td.table__left {{ item.section }}
        td.table__left {{ item.comment }}
        td.table__right {{ item.price_prev }}
        td.table__right -
        td.table__left {{ item.code_prev }}
        td.table__center
          template(v-if="alreadyExist(item.id)") Добавлено
          button(@click="add(item)", v-else) Добавить
</template>

<script>
export default {
  name: 'Products',
  props: {
    isActive: Boolean,
    database: Object,
    current: Object,
  },
  methods: {
    add(item) {
      if (!this.alreadyExist(item.id)) {
        this.$emit('add', item.id, item);
      }
    },
    alreadyExist(id) {
      return Object.keys(this.current).indexOf(id) !== -1;
    },
  },
};
</script>

<style lang="scss">
</style>
