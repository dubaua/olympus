<template lang="pug">
  #app
    .sheet
      .header
        .header__logo
          img(:src="currentCompany.logo.path", :title="currentCompany.title")
        .header__details
          p
            | {{currentCompany.legalFrom}}
            br
            strong {{currentCompany.title}}
          p
            | Юридический адрес: {{currentCompany.address}}
            br
            | Телефон: {{currentCompany.phone}} Факс: {{currentCompany.fax}}
            br
            | Электронная почта: {{currentCompany.email}}
          p
            span.uppercase ИНН {{currentCompany.inn}} КПП {{currentCompany.kpp}}
            br
            | р/с {{currentCompany.rs}}
            br
            span.uppercase БИК {{currentCompany.bik}} к/с {{currentCompany.ks}}
        select.header__set-company.only-app(v-model="proposal.companyId")
          option(v-for="company in companies", :value="company.id") {{company.title}}
      .proposal
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
            th.table__left Модель
            th.table__left Наименование
            th.table__right Цена, ₽
            th.table__center Количество
            th.table__right Сумма, ₽
          template(v-for="(item, index) in proposal.goods")
            tr
              td.table__center {{index+1}}
              td.table__left: span.uppercase {{getItemById(item.id).code}}
              td.table__left {{getItemById(item.id).description_rc}}
              td.table__right: span.uppercase {{formatPrice(getItemById(item.id).price)}}
              td.table__center: input.table__center.proposal__input(
                v-model.number="item.amount",
                type="number")
              td.table__right.proposal__item: span.uppercase
                | {{calculateSum(getItemById(item.id).price, item.amount)}}
                button.proposal__remove.only-app(@click="removeItem(item.id)") &times;
          tr.only-app
            td(colspan="6").table__center
              button(@click="toggleDatabase") Добавить
          tr.table__head
            th
            th
            th.table__left Итого
            th
            th
            th.table__right {{formatPrice(calculateTotal)}}
        p * Цена этих позиций указана с учетом НДС 18%, в остальных позициях НДС не предусмотрен
        p ** Цена этих позиций указана с учетом НДС 10%, в остальных позициях НДС не предусмотрен
        p
          strong Итого: {{numberToRoubles(calculateTotal)}},&nbsp;
          | НДС не предусмотрен в связи с применением упрощенной системы налогообложения.
      .footer
        p
          strong Исполнитель:&nbsp;
          | {{proposal.executor}}
        p {{currentCompany.phone}} {{currentCompany.fax}}
    .database(v-if="isDatabaseActive")
      .database__filters
      table.table
        tr.table__head
          th(colspan="11").table__right
            button(@click="toggleDatabase") Закрыть
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
            td.table__center {{item.id}}
            td.table__left {{item.description_rc}}
            td.table__left {{item.description}}
            td.table__right {{item.price}}
            td.table__center {{item.vat}}
            td.table__left {{item.section}}
            td.table__left {{item.comment}}
            td.table__right {{item.price_prev}}
            td.table__right -
            td.table__left {{item.code_prev}}
            td.table__center
              button(@click="addToProposal(item.id, item)") Добавить
</template>

<script>
import Vue from 'vue';
import accounting from 'accounting';
import numberToRoubles from '@/utils/rubles';
import database from '@/api/hashMap.lite';
/* eslint-disable no-console, no-plusplus */
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      companies: {
        endomed: {
          id: 'endomed',
          logo: {
            path: '/static/img/uem_logo.png',
          },
          legalFrom: 'Общество с ограниченной ответственностью',
          title: 'Уралэндомед Сервис',
          address: '454048, г. Челябинск, ул.Худякова, д.19, пом.7',
          phone: '+7 (351) 230-52-64',
          fax: '+7 (351) 218-31-61',
          email: 'uraledomedservice@yandex.ru',
          inn: '7453257102',
          kpp: '745301001',
          ogrn: '1137453006415',
          okpo: '21621597',
          rs: '40702810000020001144 Филиал №6602 Банка ВТБ24 (ЗАО)',
          bik: '046568905',
          ks: '30101810400000000905',
        },
        olympus: {
          id: 'olympus',
          logo: {
            path: '/static/img/olympus_logo.png',
          },
          legalFrom: 'Общество с ограниченной ответственностью',
          title: 'Olympus',
          address: '454048, г. Челябинск, ул.Худякова, д.19, пом.7',
          phone: '+73512305264',
          fax: '+73512183161',
          email: 'uraledomedservice@yandex.ru',
          inn: '7453257102',
          kpp: '745301001',
          ogrn: '1137453006415',
          okpo: '21621597',
          pr: '40702810000020001144 Филиал №6602 Банка ВТБ24 (ЗАО)',
          bik: '046568905',
          ks: '30101810400000000905',
        },
      },
      database,
      proposal: {
        id: 231,
        companyId: 'endomed',
        title: 'Коммерческое предложение № 424\nпо оснащению оборудованием ф. Олимпас',
        date: '08 мая 2018 г.', // create datepicker
        buyer: 'МБУЗ "ГОРОДСКАЯ БОЛЬНИЦА №6" г. Челябинск',
        nomination: 'Поставка комплектующих для эндоскопа',
        limitation: 'До 08.06.2018 г.',
        terms_of_payment: 'Согласно условиям договора',
        delivery_time: 'В течение 8-12 недель (или ранее при наличии на складе)',
        guarantee: '12 месяцев с момента ввода в эксплуатацию',
        delivery_conditions: 'Склад покупателя, включая монтаж, ввод в эксплуатацию, обучение мед. персонала',
        goods: {},
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

<style lang="scss"></style>
