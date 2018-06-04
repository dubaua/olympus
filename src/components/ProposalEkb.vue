<template lang="pug">
.proposal
  .proposal__header
    hr
    .proposal__company-title.pre
      h2 {{ currentCompany.legalFrom }}
      h1 «{{ currentCompany.title }}»
    .proposal__company-info
      .proposal__col
        | {{ currentCompany.address }}
        br
        | Тел./Факс: {{ currentCompany.phone }}
        br
        | e-mail: {{ currentCompany.email }}
      .proposal__col.proposal__col--last.pre
        span.uppercase ИНН {{ currentCompany.inn }} КПП {{ currentCompany.kpp }}
        br
        | р/с {{ currentCompany.rs }}
        br
        span.uppercase БИК {{ currentCompany.bik }} к/с {{ currentCompany.ks }}
    hr
  .proposal__thanks.pre
    | Благодарим Вас за запрос на медицинскую технику OLYMPUS
    | и направляем Вам коммерческое предложение на следующих условиях
  h1.proposal__title
    editable(v-model="proposal.title")
  dl.proposal__details
    .proposal__term
      dt Покупатель:
      dd: editable(v-model="proposal.buyer")
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
      dt Условия поставки:
      dd: editable(v-model="proposal.delivery_conditions")
    .proposal__term
      dt Гарантия:
      dd: editable(v-model="proposal.guarantee")
  table.table
    tr.table__head
      th.tac(width="20") №
      th.tal Наименование
      th.tac(width="50") Кол-во
      th.tar(width="100") Цена в&nbsp;рублях
      th.tar(width="100") Сумма в&nbsp;рублях
    template(v-for="(item, key, index) in proposal.products")
      tr
        td.tac {{ index+1 }}
        td.tal {{ getItemById(item.id).description_rc }}
        td.tac
          input.input.dont-print(
            v-model.number="item.amount",
            type="number",
            min="1")
          span.only-print {{item.amount}}
        td.tar.uppercase.nobr {{ formatPrice(getItemById(item.id).price) }}
        td.tar.nobr.proposal__item.uppercase
          | {{ calculateSum(getItemById(item.id).price, item.amount) }}
          button.proposal__remove.dont-print(@click="removeItem(item.id)") &times;
    tr.dont-print
      td(colspan="5").tac
        button(@click="toggleDatabase") Добавить
    tr
      th
      th.tal Итого
      th
      th
      th.tar.uppercase {{ formatPrice(calculateTotal) }}
  p
    strong Итого: {{ numberToRoubles(calculateTotal) }},&nbsp;
    | НДС не облагается
  .proposal__footer
    p
      strong С уважением, специалист отдела продаж -&nbsp;{{ proposal.executor }}
      br
      | тел.: {{ currentCompany.phone }}, e-mail: {{ currentCompany.email }}
    p *Компания применяет упрощенную систему налогообложения
  products(
    :isActive="isDatabaseActive",
    @toogle="toggleDatabase",
    @add="addToProposal",
    :database="database",
    :current="proposal.products")
</template>

<script>
import Vue from 'vue';
import numberToRoubles from '@/utils/rubles';
import { formatPrice } from '@/utils';
import database from '@/api/hashMap.lite';
import companies from '@/api/companies';
/* eslint-disable no-console, no-plusplus */
export default {
  name: 'ProposalChel',
  data() {
    return {
      companies,
      database,
      proposal: {
        id: 231,
        companyId: 'endomed_ekb',
        title: 'Коммерческое предложение № 424\nпо оснащению оборудованием ф. Олимпас',
        date: '08 мая 2018 г.', // create datepicker
        buyer: 'МБУЗ "ГОРОДСКАЯ БОЛЬНИЦА №6" г. Челябинск',
        nomination: 'Поставка комплектующих для эндоскопа',
        limitation: 'До 08.06.2018 г.',
        terms_of_payment: 'Согласно условиям договора',
        delivery_time: 'В течение 8-12 недель (или ранее при наличии на складе)',
        guarantee: '12 месяцев с момента ввода в эксплуатацию',
        delivery_conditions: 'Склад покупателя, включая монтаж, ввод в эксплуатацию, обучение мед. персонала',
        products: {
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
      return Object.values(this.proposal.products).reduce((sum, item) =>
        sum + (this.getItemById(item.id).price * item.amount), 0);
    },
  },
  methods: {
    numberToRoubles,
    formatPrice,
    getItemById(id) {
      return this.database[id];
    },
    calculateSum(price, amount) {
      return this.formatPrice(price * amount);
    },
    removeItem(id) {
      Vue.delete(this.proposal.products, id);
    },
    addToProposal(id) {
      Vue.set(this.proposal.products, id, {
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
.proposal {
  font-family: "Century Gothic", Futura, sans-serif;

  &__header {
    margin-bottom: 1em;
    position: relative;
    hr {
      border: double black;
      border-width: 6px 0;
      margin: 0.5em 0;
    }
  }
  &__company-title {
    text-align: center;
    margin-bottom: 1em;
    h1 {
      margin: 0;
      font-size: 3em;
    }
    h2 {
      margin: 0;
      font-size: 1.2em;
      text-transform: uppercase;
    }
  }
  &__company-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2em;
    line-height: 1.3;
  }
  &__col {
    &--last {
      text-align: right;
    }
  }
  &__thanks {
    font-style: italic;
    font-weight: bold;
    font-size: 1.4em;
    text-align: center;
  }
  &__date {
    text-align: right;
  }
  &__title {
    text-align: center;
    font-size: 1.6em;
  }
  &__details {
    margin: 1em 0;
  }
  &__term {
    display: flex;
    margin: 0.5em 0;

    & dt {
      flex-basis: 10em;
      min-width: 10em;
      font-weight: bold;
      text-align: right;
      margin-right: 1em;
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
  &__footer {
    margin-top: 3em;
    text-align: center;
  }
}
</style>
