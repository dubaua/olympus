<template lang="pug">
.database(v-if="isActive")
  .database__filters
  table.table
    tr.table__head
      th(colspan="11").tar
        button(@click="$emit('toogle')") Закрыть
    tr.table__head
      th.tac Код
      th.tal Описание как в РУ
      th.tal Описание
      th.tar Цена, руб.
      th.tac НДС
      th.tal Направление
      //- th.tal Комментарий
      //- th.tar Цена за предыдущий период
      //- th.tar Разница
      //- th.tal Старый код
      th.tac Действие
    template(v-for="item in database")
      tr
        td.tac {{ item.id }}
        td.tal {{ item.description_rc }}
        td.tal {{ item.description }}
        td.tar {{ item.price }}
        td.tac {{ item.vat }}
        td.tal {{ item.section }}
        //- td.tal {{ item.comment }}
        //- td.tar {{ item.price_prev }}
        //- td.tar -
        //- td.tal {{ item.code_prev }}
        td.tac
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
