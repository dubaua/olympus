<template lang="pug">
  #app
    nav.menu.dont-print
      router-link(to="/chel") Уралэндомед Сервис
      router-link(to="/ekb") Уралэндомед Екатеринбург
      router-link(to="/spb") Эндоленд
    .sheet
      router-view
</template>

<script>
export default {
  name: 'App',
};
</script>
