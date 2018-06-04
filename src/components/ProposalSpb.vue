<template lang="pug">
.proposal
  .proposal__header
    .proposal__company-title.uppercase
      | {{ currentCompany.legalFrom }} «{{ currentCompany.title }}»
    .proposal__company-info
        | {{ currentCompany.address }}
        br
        span.uppercase ОКПО {{currentCompany.okpo}}, ОГРН {{currentCompany.ogrn}},&nbsp;
          | ИНН/КПП {{ currentCompany.inn }}/{{ currentCompany.kpp }}
  .proposal__date
    | Дата: {{proposal.date}}
  p
    | Покупатель:&nbsp;
    editable(v-model="proposal.buyer")
  h1.proposal__title
    editable(v-model="proposal.title")
  dl.proposal__details
    .proposal__term
      dt Наименование:
      dd: editable(v-model="proposal.nomination")
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
      dt Срок действия:
      dd: editable(v-model="proposal.limitation")
  .proposal__spec.tac
    | СПЕЦИФИКАЦИЯ к коммерческому предложению
  table.table
    tr.table__head
      th.tac(width="20") №
      th.tal Наименование
      th.tac(width="50") Кол-во
      th.tar(width="80") Цена (руб.)
      th.tar(width="80") Сумма (руб.)
      th.tar(width="80") Сумма НДС (руб.)
      th.tar(width="80") Итого (руб.)
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
        td.tar.uppercase.nobr
          | {{ formatPrice(calculateItemPrice(item.id, item.amount).price) }}
        td.tar.uppercase.nobr
          | {{ formatPrice(calculateItemPrice(item.id, item.amount).sum) }}
        td.tar.uppercase.nobr
          | {{ formatPrice(calculateItemPrice(item.id, item.amount).vat) }}
        td.tar.nobr.proposal__item.uppercase
          | {{ formatPrice(calculateItemPrice(item.id, item.amount).total) }}
          button.proposal__remove.dont-print(@click="removeItem(item.id)") &times;
    tr.dont-print
      td(colspan="7").tac
        button(@click="toggleDatabase") Добавить
    tr
      th
      th.tal Итого
      th
      th
      th.tar.nobr.uppercase {{ formatPrice(calculateTotal.sum) }}
      th.tar.nobr.uppercase {{ formatPrice(calculateTotal.vat) }}
      th.tar.nobr.uppercase {{ formatPrice(calculateTotal.total) }}
  p.proposal__note
    | *Цена этих позиций указана с учётом НДС – 18%, в остальных позициях НДС не предусмотрен.
  .proposal__total
    p
      | Всего:
      strong  {{formatPrice(calculateTotal.total)}}
      |  ({{ numberToRoubles(calculateTotal.total)}})
      |  в том числе НДС – {{formatPrice(calculateTotal.vat)}} руб.
  .proposal__stamp
    .pre
      | С уважением,
      | Директор
    | Никандров М.Г.
  .proposal__footer
    | Исполнитель:&nbsp;
    editable(v-model="proposal.executor")
    br
    | Тел.: {{ currentCompany.phone }}
  products(
    :isActive="isDatabaseActive",
    @toogle="toggleDatabase",
    @add="addToProposal",
    :products="database",
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
        companyId: 'endomed_spb',
        title: 'Коммерческое предложение № 424',
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
      const initialSummary = {
        sum: 0,
        vat: 0,
        total: 0,
      };
      /* eslint-disable no-param-reassign */
      return Object.values(this.proposal.products).reduce((summary, item) => {
        const itemSummary = this.calculateItemPrice(item.id, item.amount);
        summary.sum += itemSummary.sum;
        summary.vat += itemSummary.vat;
        summary.total += itemSummary.total;
        return summary;
      }, initialSummary);
      /* eslint-enable no-param-reassign */
    },
  },
  methods: {
    numberToRoubles,
    formatPrice,
    getItemById(id) {
      return this.database[id];
    },
    calculateItemPrice(id, amount) {
      const position = this.getItemById(id);
      const price = position.price;
      const sum = price * amount;
      const vat = sum * position.vat * 0.01;
      const total = sum + vat;
      return {
        price,
        sum,
        vat,
        total,
      };
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
  font-family: "Times New Roman", Times, serif;

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
    margin-bottom: 0.33em;
    font-size: 3em;
    font-weight: bold;
    text-transform: uppercase;
  }
  &__company-info {
    font-size: 1.2em;
    line-height: 1.3;
    text-align: center;
  }
  &__date {
    text-align: right;
  }
  &__title {
    text-align: center;
    font-size: 1.2em;
  }
  &__details {
    margin: 1em 0;
  }
  &__term {
    display: flex;
    margin: 0.33em 0;

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
  &__note {
    font-size: smaller;
    margin-top: 0;
  }
  &__total {
    margin-top: 3em;
  }
  &__stamp {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 7em 0;
  }
  &__footer {
    margin-top: 6em;
  }
}
</style>
