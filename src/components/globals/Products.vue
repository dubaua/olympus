<template lang="pug">
.products(v-if="isActive")
  table.table
    tr.table__head
      th(colspan="11")
        .products__filters
          //- .filter
          //-   .filter__label Код
          //-   .filter__control
          //-     input(v-model="code")
          //- .filter
          //-   .filter__label Описание
          //-   .filter__control
          //-     input(v-model="description")
          //- .filter
          //-   .filter__label Направление
          //-   .filter__control
          //-     select(v-model="currentSection")
          //-       option(value="") Все
          //-       option(v-for="section in sections", value="section") {{ section }}
          //- .filter
          //-   .filter__label НДС
          //-   .filter__control
          //-     select(v-model="currentVAT")
          //-       option(value="") Все
          //-       option(:value="0") 0
          //-       option(:value="10") 10
          //-       option(:value="18") 18
          .products__close
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
    template(v-for="position in products")
      tr
        td.tac {{ position.id }}
        td.tal {{ position.description_rc }}
        td.tal {{ position.description }}
        td.tar {{ position.price }}
        td.tac {{ position.vat }}
        td.tal {{ position.section }}
        //- td.tal {{ position.comment }}
        //- td.tar {{ position.price_prev }}
        //- td.tar -
        //- td.tal {{ position.code_prev }}
        td.tac
          template(v-if="alreadyExist(position.id)") Добавлено
          button(@click="add(position)", v-else) Добавить
</template>

<script>
export default {
  name: 'Products',
  props: {
    isActive: Boolean,
    products: Object,
    current: Object,
  },
  data() {
    return {
      code: '',
      description: '',
      currentSection: '',
      currentVAT: '',
      sections: [
        'MSE_CDS',
        'MSE_ENG',
        'MSE_ENT',
        'MSE_ET',
        'MSE_G&R',
        'MSE_LAP IMG',
        'MSE_SI',
        'MSE_Uro Hys',
        'MSE_Uro hys',
      ],
    };
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
.products {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: auto;
  overflow-y: scroll;
  background: white;

  &__filters {
    display: flex;
  }
  &__close {
    margin-left: auto;
  }
}
.filter {
  display: flex;
  align-items: center;
  margin-right: 1em;
  &__label {
    margin-right: 0.4em;
  }
}
</style>
