<template lang="pug">
.proposal
  .header
    .header__logo(v-if="currentCompany.logo")
      img(:src="currentCompany.logo.path", :title="currentCompany.title")
    .header__details
      p
        | {{ currentCompany.legalFrom }}
        br
        strong {{ currentCompany.title }}
      p
        | Юридический адрес: {{ currentCompany.address }}
        br
        | Телефон: {{ currentCompany.phone }} Факс: {{ currentCompany.fax }}
        br
        | Электронная почта: {{ currentCompany.email }}
      p
        span.uppercase ИНН {{ currentCompany.inn }} КПП {{ currentCompany.kpp }}
        br
        | р/с {{ currentCompany.rs }}
        br
        span.uppercase БИК {{ currentCompany.bik }} к/с {{ currentCompany.ks }}
  .proposal__date
    editable(v-model="proposal.date")
  h1.proposal__title
    editable(v-model="proposal.title")
  dl.proposal__details
    .proposal__term
      dt Покупатель:
      dd: editable(v-model="proposal.buyer")
    .proposal__term
      dt Наименование:
      dd: editable(v-model="proposal.nomination")
    .proposal__term
      dt Срок действия:
      dd: editable(v-model="proposal.limitation")
    .proposal__term
      dt Условия оплаты:
      dd: editable(v-model="proposal.terms_of_payment")
    .proposal__term
      dt Срок поставки:
      dd: editable(v-model="proposal.delivery_time")
    .proposal__term
      dt Гарантия:
      dd: editable(v-model="proposal.guarantee")
    .proposal__term
      dt Условия поставки:
      dd: editable(v-model="proposal.delivery_conditions")
  table.table
    tr.table__head
      th.table__center №
      th.table__left Наименование
      th.table__right Цена, руб.
      th.table__center Количество
      th.table__right Сумма, руб.
    template(v-for="(item, key, index) in proposal.goods")
      tr
        td.table__center {{ index+1 }}
        td.table__left {{ getItemById(item.id).description_rc }}
        td.table__right.nobr: span.uppercase {{ formatPrice(getItemById(item.id).price) }}
        td.table__center: input.table__center.proposal__input(
          v-model.number="item.amount",
          type="number")
        td.table__right.nobr.proposal__item: span.uppercase
          | {{ calculateSum(getItemById(item.id).price, item.amount) }}
          button.proposal__remove.dont-print(@click="removeItem(item.id)") &times;
    tr.dont-print
      td(colspan="5").table__center
        button(@click="toggleDatabase") Добавить
    tr
      th
      th.table__left Итого
      th
      th
      th.table__right {{ formatPrice(calculateTotal) }}
  p * Цена этих позиций указана с учетом НДС 18%, в остальных позициях НДС не предусмотрен
  p ** Цена этих позиций указана с учетом НДС 10%, в остальных позициях НДС не предусмотрен
  p
    strong Итого: {{ numberToRoubles(calculateTotal) }},&nbsp;
    | НДС не предусмотрен в связи с применением упрощенной системы налогообложения.
  .footer
    p
      strong Исполнитель:&nbsp;
      | {{ proposal.executor }}
    p {{ currentCompany.phone }} {{ currentCompany.fax }}
  products(
    :isActive="isDatabaseActive",
    @toogle="toggleDatabase",
    @add="addToProposal",
    :database="database")
</template>

<script>
import Vue from 'vue';
import accounting from 'accounting';
import numberToRoubles from '@/utils/rubles';
import database from '@/api/hashMap.lite';
import companies from '@/api/companies';
/* eslint-disable no-console, no-plusplus */
export default {
  name: 'ProposalChel',
  components: {
  },
  data() {
    return {
      companies,
      database,
      proposal: {
        id: 231,
        companyId: 'endomed_chel',
        title: 'Коммерческое предложение № 424\nпо оснащению оборудованием ф. Олимпас',
        date: '08 мая 2018 г.', // create datepicker
        buyer: 'МБУЗ "ГОРОДСКАЯ БОЛЬНИЦА №6" г. Челябинск',
        nomination: 'Поставка комплектующих для эндоскопа',
        limitation: 'До 08.06.2018 г.',
        terms_of_payment: 'Согласно условиям договора',
        delivery_time: 'В течение 8-12 недель (или ранее при наличии на складе)',
        guarantee: '12 месяцев с момента ввода в эксплуатацию',
        delivery_conditions: 'Склад покупателя, включая монтаж, ввод в эксплуатацию, обучение мед. персонала',
        goods: {
          4976200: {
            id: 4976200,
            amount: 1,
          },
          4976300: {
            id: 4976300,
            amount: 1,
          },
          4976400: {
            id: 4976400,
            amount: 1,
          },
          6808400: {
            id: 6808400,
            amount: 1,
          },
        },
        executor: 'Уфимцева Анна',
      },
      isDatabaseActive: false,
    };
  },
  computed: {
    currentCompany() {
      return this.companies[this.proposal.companyId];
    },
    calculateTotal() {
      return Object.values(this.proposal.goods).reduce((sum, item) =>
        sum + (this.unformat(this.getItemById(item.id).price) * item.amount), 0);
    },
  },
  methods: {
    getItemById(id) {
      return this.database[id];
    },
    calculateSum(price, amount) {
      return this.formatPrice(this.unformat(price) * amount);
    },
    unformat(price) {
      return parseFloat(price.replace(',', '.'));
    },
    formatPrice(price) {
      const result = typeof price === 'string' ? this.unformat(price) : price;
      return accounting.formatNumber(result, 2, ' ').replace('.', ',');
    },
    numberToRoubles,
    removeItem(id) {
      Vue.delete(this.proposal.goods, id);
    },
    addToProposal(id) {
      Vue.set(this.proposal.goods, id, {
        id,
        amount: 1,
      });
    },
    toggleDatabase() {
      this.isDatabaseActive = !this.isDatabaseActive;
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 4em;
  position: relative;

  &__details {
    flex-grow: 1;
    line-height: 1.5;
    margin-left: 2em;
  }

  &__set-company {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.proposal {
  font-family: "Century Gothic", Futura, sans-serif;
  &__date {
    text-align: right;
  }
  &__title {
    white-space: pre-line;
    text-align: center;
    margin-bottom: 1em;
  }
  &__details {
    margin: 1em 0 3em;
  }
  &__term {
    display: flex;
    margin: 1em 0;

    & dt {
      flex-basis: 10em;
      min-width: 10em;
      font-weight: bold;
    }

    & dd {
      margin: 0;
      flex-grow: 1;
    }
  }

  &__input {
    @media print {
      background: none;
      padding: 0;
      border: 0;
    }
  }

  &__item {
    position: relative;
  }

  &__remove {
    position: absolute;
    left: calc(100% + 1em);
    top: 0.67em;
  }
}

.footer {
  margin-top: 3em;
}
</style>
