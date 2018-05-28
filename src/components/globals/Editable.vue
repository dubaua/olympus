<template lang="pug">
.editable
  .editable__content(@click="edit") {{value}}
  .editable__popup(v-if="isEditting")
    textarea.editable__markdown-editor(
      v-model="temporaryValue",
      @keyup.ctrl.enter="save",
      @keyup.esc="cancel")
    .editable__controls
      | Ctrl + Enter
      button.editable__save(@click="save") Save
  .editable__overlay(v-if="isEditting", @click="cancel")
</template>

<script>
// import autosize from 'autosize';
// import marked from 'marked';

export default {
  name: 'editable',
  props: {
    value: String,
  },
  data() {
    return {
      temporaryValue: null,
      isEditting: false,
    };
  },
  // directives: {
  //   focus: {
  //     inserted(el) {
  //       el.focus();
  //       el.select();
  //     },
  //   },
  //   autosize: {
  //     inserted(el) {
  //       autosize(el);
  //     },
  //   },
  // },
  methods: {
    // compiled(markdown) {
    //   return marked(markdown, { sanitize: true, breaks: true });
    // },
    edit() {
      this.isEditting = true;
      this.temporaryValue = this.value;
    },
    save() {
      this.$emit('input', this.temporaryValue);
      this.isEditting = false;
    },
    cancel() {
      this.isEditting = false;
    },
  },
};
</script>

<style lang="scss">
.editable {
  position: relative;
  height: 100%;
}

.editable__content {
  cursor: pointer;
  height: 100%;
  position: relative;
  z-index: 0;
}

.editable__content:empty:hover {
  border: 1px dashed rgba(0, 0, 0, 0.5);
}

.editable_inverse .editable__content:empty:hover {
  border-color: white;
}

.editable__content:hover {
  text-decoration: underline;
}

.editable__popup {
  background: white;
  box-shadow: 0 1px 3px 1px #e1dfdf;
  left: -1.25rem;
  line-height: 0;
  min-width: 15rem;
  position: absolute;
  right: -1.25rem;
  top: -0.5rem;
  z-index: 2;
}

.editable__controls {
  -ms-align-items: center;
  align-items: center;
  background: #fbfbfa;
  border-top: 1px solid #e1dfdf;
  color: #8a8686;
  display: flex;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  justify-content: space-between;
  padding: 0.5rem 1.25rem;
}

.editable__label {
  font: 300 normal 0.88rem/1 "Helvetica Neue", "Open Sans", Helvetica,
    sans-serif;
  letter-spacing: 0.03rem;
  line-height: 1;
}

.editable__overlay {
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1;
}

.editable__markdown-editor {
  border: 0;
  box-sizing: border-box;
  font-family: monospace;
  font-size: 1.5rem;
  padding: 0.5rem 1.25rem;
  resize: vertical;
  width: 100%;
}

.editable__markdown-editor:focus {
  outline: none;
}
</style>

