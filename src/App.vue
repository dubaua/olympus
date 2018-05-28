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
        button.header__set-company.only-app(@click="changeCompany") Изменить компанию
      .proposal
        .proposal__date {{proposal.date}}
        h1.proposal__title {{proposal.title}}
        dl.proposal__details
          .proposal__term
            dt Покупатель:
            dd {{proposal.buyer}}
          .proposal__term
            dt Наименование:
            dd {{proposal.nomination}}
          .proposal__term
            dt Срок действия:
            dd {{proposal.limitation}}
          .proposal__term
            dt Условия оплаты:
            dd {{proposal.terms_of_payment}}
          .proposal__term
            dt Срок поставки:
            dd {{proposal.delivery_time}}
          .proposal__term
            dt Гарантия:
            dd {{proposal.guarantee}}
          .proposal__term
            dt Условия поставки:
            dd {{proposal.delivery_conditions}}
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
              td.table__center: input.table__center.proposal__input(v-model.number="item.amount")
              td.table__right.proposal__item: span.uppercase
                | {{calculateSum(getItemById(item.id).price, item.amount)}}
                button.proposal__remove.only-app(@click="removeItem(item.id)") &times;
          tr.only-app
            td(colspan="6").table__center
              button(@click="openItems") Добавить
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
</template>

<script>
import accounting from 'accounting';
import numberToRoubles from '@/utils/rubles';
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
      database: {
        4976200: {
          code: '4976200',
          description_rc: 'MAJ-39 Течеискатель',
          description: 'Течеискатель',
          price: '25010',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '25010',
          code_prev: 'MAJ-39',
        },
        4976300: {
          code: '4976300',
          description_rc: 'MAJ-35 Фильтр',
          description: 'Фильтры',
          price: '25081,5',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '25081,5',
          code_prev: 'MAJ-35',
        },
        4976400: {
          code: '4976400',
          description_rc: 'MAJ-37 Фильтр',
          description: 'Фильтры',
          price: '23200',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '23200',
          code_prev: 'MAJ-37',
        },
        6808000: {
          code: '6808000',
          description_rc: 'MAJ-818 Трубка',
          description: 'Трубка',
          price: '13620',
          vat: 'Без НДС',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '13620',
          code_prev: 'MAJ-818',
        },
        6808100: {
          code: '6808100',
          description_rc: 'MAJ-819 Трубка',
          description: 'Трубка',
          price: '6400',
          vat: 'Без НДС',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '6400',
          code_prev: 'MAJ-819',
        },
        6808200: {
          code: '6808200',
          description_rc: 'MAJ-820 Трубка',
          description: 'Трубка',
          price: '9610',
          vat: 'Без НДС',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '9610',
          code_prev: 'MAJ-820',
        },
        6808300: {
          code: '6808300',
          description_rc: 'MAJ-821 Течеискатель',
          description: 'Течеискатель',
          price: '11010',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '11010',
          code_prev: 'MAJ-821',
        },
        6808400: {
          code: '6808400',
          description_rc: 'MAJ-822 Фильтр газовый',
          description: 'Фильтр газовый',
          price: '3190',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '3190',
          code_prev: 'MAJ-822',
        },
        6808500: {
          code: '6808500',
          description_rc: 'MAJ-823 Фильтр воздушный',
          description: 'Фильтр воздушный',
          price: '19150',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '19150',
          code_prev: 'MAJ-823',
        },
        6808600: {
          code: '6808600',
          description_rc: 'MAJ-824 Фильтр для очистки воды',
          description: 'Фильтр для очистки воды',
          price: '28730',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '28730',
          code_prev: 'MAJ-824',
        },
        6808700: {
          code: '6808700',
          description_rc: 'MAJ-825 Трубка',
          description: 'Трубка',
          price: '8510',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '8510',
          code_prev: 'MAJ-825',
        },
        6808900: {
          code: '6808900',
          description_rc: 'MAJ-827 Очистная коробка/корзина для очистки клапанов.',
          description: 'Фильтр сетчатый',
          price: '27630',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '27630',
          code_prev: 'MAJ-827',
        },
        6809000: {
          code: '6809000',
          description_rc: 'MAJ-828 Трубка промывочная',
          description: 'Трубка промывочная',
          price: '53200',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '53200',
          code_prev: 'MAJ-828',
        },
        6809100: {
          code: '6809100',
          description_rc: 'MAJ-829 Трубка промывочная',
          description: 'Трубка промывочная',
          price: '9467,8',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '9467,8',
          code_prev: 'MAJ-829',
        },
        6809300: {
          code: '6809300',
          description_rc: 'MAJ-831 Трубка промывочная',
          description: 'Трубка промывочная',
          price: '16010',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '16010',
          code_prev: 'MAJ-831',
        },
        6809400: {
          code: '6809400',
          description_rc: 'MAJ-832 Трубка промывочная',
          description: 'Трубка промывочная',
          price: '26231,5',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '26231,5',
          code_prev: 'MAJ-832',
        },
        6809700: {
          code: '6809700',
          description_rc: 'MAJ-838 Трубка',
          description: 'Трубка',
          price: '21280',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '21280',
          code_prev: 'MAJ-838',
        },
        6809900: {
          code: '6809900',
          description_rc: 'MAJ-840 Сетка-держатель',
          description: 'Сетка-держатель',
          price: '21280',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '21280',
          code_prev: 'MAJ-840',
        },
        6810000: {
          code: '6810000',
          description_rc: 'MAJ-865 Держатель коннектора',
          description: 'Держатель коннектора',
          price: '21280',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '21280',
          code_prev: 'MAJ-865',
        },
        Acecide: {
          code: 'Acecide',
          description_rc: 'Средство дезинфицирующее «Асесайд» (Acecide) (Реагент1 и Реагент2) – полимерные флаконы по 750 мл',
          description: 'Ср-во дезинфицирующее "Асесайд" для OER-A',
          price: '10520',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '10520',
          code_prev: '',
        },
        'Acecide 875': {
          code: 'Acecide 875',
          description_rc: 'Средство дезинфицирующее «Асесайд» (Acecide)(Реагент1 и Реагент2) – полимерные флаконы по 875 мл.',
          description: 'Ср-во дезинфицирующее "Асесайд" для OER-AW',
          price: '13470',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '13470',
          code_prev: '',
        },
        'Acecide checker': {
          code: 'Acecide checker',
          description_rc: 'индикаторные полоски по 100 шт.',
          description: 'Тест-полоски для Acecide (100 шт.)',
          price: '6000',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '6000',
          code_prev: '',
        },
        E0425604: {
          code: 'E0425604',
          description_rc: 'Принтер шкафа для сушки',
          description: 'Принтер шкафа для сушки',
          price: '179030',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '179030',
          code_prev: '',
        },
        E0425605: {
          code: 'E0425605',
          description_rc: 'Рулон/этикетка для принтера',
          description: 'Рулон/этикетка для принтера',
          price: '10810',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '10810',
          code_prev: '',
        },
        E0425614: {
          code: 'E0425614',
          description_rc: 'Адаптер для гастроинтестинальных эндоскопов с дополнительным жидкостным каналом',
          description: 'Адаптер',
          price: '16300',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '16300',
          code_prev: '',
        },
        E0425616: {
          code: 'E0425616',
          description_rc: 'Адаптер для эндоскопов LF/ENF-типов',
          description: 'Адаптер для эндоскопов LF/ENF-типов в наборе',
          price: '33570',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '33570',
          code_prev: '',
        },
        E0425618: {
          code: 'E0425618',
          description_rc: 'Адаптер для эндоскопов BF-30/BF-типов',
          description: 'Адаптер для эндоскопов BF-30/BF - типов в наборе',
          price: '10250',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '10250',
          code_prev: '',
        },
        E0425619: {
          code: 'E0425619',
          description_rc: 'Адаптер для эндоскопов URF/CYF/BF-UM-типов',
          description: 'Адаптер для эндоскопов URF/CYF/BF-UM -типов в наборе',
          price: '17830',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '17830',
          code_prev: '',
        },
        E0425620: {
          code: 'E0425620',
          description_rc: 'Адаптер для эндоскопов CHF-типа',
          description: 'Адаптер для эндоскопов CHF - типа в наборе',
          price: '24820',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '24820',
          code_prev: '',
        },
        E0425621: {
          code: 'E0425621',
          description_rc: 'Адаптер Pentax для гастро- и колоноскопов',
          description: 'Адаптер Pentax для гастро- и колоноскопов в наборе',
          price: '94190',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '94190',
          code_prev: '',
        },
        E0425622: {
          code: 'E0425622',
          description_rc: 'Адаптер Pentax для гастро- и бронхоскопов',
          description: 'Адаптер Pentax для гастро- и бронхоскопов в наборе',
          price: '25110',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '25110',
          code_prev: '',
        },
        E0425623: {
          code: 'E0425623',
          description_rc: 'Адаптер Pentax для дополнительного жидкостного канала',
          description: 'Адаптер Pentax для доп. жидкостного канала в наборе',
          price: '52890',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '52890',
          code_prev: '',
        },
        E0425624: {
          code: 'E0425624',
          description_rc: 'EDC.B Шкаф для сушки эндоскопов',
          description: 'Шкаф для хранения и сушки эндоскопов',
          price: '2605170',
          vat: 'Без НДС',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '2605170',
          code_prev: 'EDC.B',
        },
        E0425625: {
          code: 'E0425625',
          description_rc: 'EDC.D Шкаф для сушки эндоскопов',
          description: 'Шкаф для хранения и сушки эндоскопов с функцией ScopeID',
          price: '2971820',
          vat: 'Без НДС',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '2971820',
          code_prev: 'EDC.D',
        },
        E0425626: {
          code: 'E0425626',
          description_rc: 'Адаптер Fuji для гастро- и колоноскопов',
          description: 'Адаптер Fuji для гастро- и колоноскопов в наборе',
          price: '86160',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '86160',
          code_prev: '',
        },
        E0425627: {
          code: 'E0425627',
          description_rc: 'Корзина',
          description: 'Корзина',
          price: '125770',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '125770',
          code_prev: '',
        },
        E0425629: {
          code: 'E0425629',
          description_rc: 'Адаптер',
          description: 'Адаптер EDC для GIF-2T',
          price: '15430',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '15430',
          code_prev: '',
        },
        E0425635: {
          code: 'E0425635',
          description_rc: 'Адаптер',
          description: 'Адаптер EDC для Pentax.',
          price: '27090',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '27090',
          code_prev: '',
        },
        E0425637: {
          code: 'E0425637',
          description_rc: 'Адаптер',
          description: 'Адаптер EDC GI Olympus',
          price: '25050',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '25050',
          code_prev: '',
        },
        E0425638: {
          code: 'E0425638',
          description_rc: 'Адаптер',
          description: 'Адаптер EDC EUS-160',
          price: '65980',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '65980',
          code_prev: '',
        },
        EndoQuick: {
          code: 'EndoQuick',
          description_rc: 'Средство дезинфицирующее для предстерилизационной и окончательной очистки гибких эндоскопов механизированным способом "Эндоквик" (EndoQuick) - полимерные картриджи по 980 мл.',
          description: 'Ср-во для предстерилизационной очистки "ЭндоКвик"',
          price: '2990',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '2990',
          code_prev: '',
        },
        N1045600: {
          code: 'N1045600',
          description_rc: 'MAJ-1191 Трубка промывочная',
          description: 'Трубка промывочная',
          price: '14430',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '14430',
          code_prev: 'MAJ-1191',
        },
        N1062300: {
          code: 'N1062300',
          description_rc: 'MAJ-1234 Трубка промывочная',
          description: 'Трубки промывочные',
          price: '36126,33',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '36126,33',
          code_prev: 'MAJ-1234',
        },
        N2644800: {
          code: 'N2644800',
          description_rc: 'MAJ-1500 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '27660',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '27660',
          code_prev: 'MAJ-1500',
        },
        N2644900: {
          code: 'N2644900',
          description_rc: 'MAJ-1501 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '13830',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '13830',
          code_prev: 'MAJ-1501',
        },
        N2645000: {
          code: 'N2645000',
          description_rc: 'MAJ-1503 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '13830',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '13830',
          code_prev: 'MAJ-1503',
        },
        N2645100: {
          code: 'N2645100',
          description_rc: 'MAJ-1504 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '13830',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '13830',
          code_prev: 'MAJ-1504',
        },
        N2645200: {
          code: 'N2645200',
          description_rc: 'MAJ-1505 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '15960',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '15960',
          code_prev: 'MAJ-1505',
        },
        N2645300: {
          code: 'N2645300',
          description_rc: 'MAJ-1508 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '40430',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '40430',
          code_prev: 'MAJ-1508',
        },
        N2645400: {
          code: 'N2645400',
          description_rc: 'MAJ-1509 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '40430',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '40430',
          code_prev: 'MAJ-1509',
        },
        N2645500: {
          code: 'N2645500',
          description_rc: 'MAJ-1511 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '13830',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '13830',
          code_prev: 'MAJ-1511',
        },
        N2645600: {
          code: 'N2645600',
          description_rc: 'MAJ-1512 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '26600',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '26600',
          code_prev: 'MAJ-1512',
        },
        N2645700: {
          code: 'N2645700',
          description_rc: 'MAJ-1513 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '26600',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '26600',
          code_prev: 'MAJ-1513',
        },
        N2645800: {
          code: 'N2645800',
          description_rc: 'MAJ-1514 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '26600',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '26600',
          code_prev: 'MAJ-1514',
        },
        N2645900: {
          code: 'N2645900',
          description_rc: 'MAJ-1515 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '20210',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '20210',
          code_prev: 'MAJ-1515',
        },
        N2646000: {
          code: 'N2646000',
          description_rc: 'MAJ-1516 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '26600',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '26600',
          code_prev: 'MAJ-1516',
        },
        N2646100: {
          code: 'N2646100',
          description_rc: 'MAJ-1517 Трубка соединительная',
          description: 'Трубка соединительная',
          price: '26600',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '26600',
          code_prev: 'MAJ-1517',
        },
        N2646200: {
          code: 'N2646200',
          description_rc: 'MAJ-1497 Бумага для принтера (10 шт./уп.)',
          description: 'Бумага для принтера',
          price: '9860',
          vat: '18,00',
          section: 'MSE_CDS',
          comment: '',
          price_prev: '9860',
          code_prev: 'MAJ-1497',
        },
      },
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
        goods: [
          {
            id: 4976200,
            amount: 10,
          },
          {
            id: 4976300,
            amount: 1,
          },
          {
            id: 4976400,
            amount: 2,
          },
          {
            id: 6808300,
            amount: 1,
          },
          {
            id: 6808500,
            amount: 1,
          },
        ],
        executor: 'Уфимцева Анна',
      },
    };
  },
  computed: {
    currentCompany() {
      return this.companies[this.proposal.companyId];
    },
    calculateTotal() {
      return this.proposal.goods.reduce((accumulator, item) =>
        accumulator + (this.unformat(this.getItemById(item.id).price) * item.amount), 0);
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
    changeCompany() {
      console.log('Изменить компанию');
    },
    removeItem(id) {
      console.log('Удалить товар с id =', id);
    },
    openItems() {
      console.log('Открыть товары');
    },
  },
};
</script>

<style lang="scss"></style>
