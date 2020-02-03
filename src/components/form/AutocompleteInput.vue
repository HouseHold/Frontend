<template>
  <div ref="root">
    <slot
      :rootProps="rootProps"
      :inputProps="inputProps"
      :inputListeners="inputListeners"
      :resultListProps="resultListProps"
      :resultListListeners="resultListListeners"
      :results="results"
      :resultProps="resultProps"
    >
      <div
        v-bind="rootProps"
        class="form-group"
      >
        <label :for="safeId">
          {{ label }}
        </label>
        <input
          :id="safeId"
          ref="input"
          :placeholder="placeholder"
          class="form-control"
          v-bind="inputProps"
          @input="handleInput"
          @keydown="core.handleKeyDown"
          @focus="core.handleFocus"
          @blur="core.handleBlur"
          v-on="$listeners"
        >
        <ul
          ref="resultList"
          v-bind="resultListProps"
          v-on="resultListListeners"
        >
          <template v-for="(result, index) in results">
            <slot
              name="result"
              :result="result"
              :props="resultProps[index]"
            >
              <li
                :key="resultProps[index].id"
                v-bind="resultProps[index]"
              >
                {{ getResultValue(result) }}
              </li>
            </slot>
          </template>
        </ul>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import AutocompleteCore from '@trevoreyre/autocomplete';
    import uniqueId from '@trevoreyre/autocomplete/util/uniqueId';
    import getRelativePosition from '@trevoreyre/autocomplete/util/getRelativePosition';

    @Component({
        inheritAttrs: false
    })
    export default class AutocompleteInput extends Vue {
      readonly name: string = 'AutocompleteInput';
      @Prop({
            type: Function,
            required: true,
        })
        search: any;

        @Prop({
            type: String,
            default: ''
        })
        label: string = '';

        @Prop({
            type: String,
            default: ''
        })
        placeholder: string = '';

        @Prop({
            type: String,
            default: 'autocomplete',
        })
        baseClass: string = '';

        @Prop({
            type: Boolean,
            default: false,
        })
        autoSelect: boolean = false;

        @Prop({
            type: Function,
            default: (result: string) => result,
        })
        getResultValue: any;

        @Prop({
            type: String,
            default: '',
        })
        defaultValue: any;

        // vue-convert: This property will initialized in data() method, with `this` reference.
        core: Object = {};

        // vue-convert: This property will initialized in data() method, with `this` reference.
        value: any;

        // vue-convert: This property will initialized in data() method, with `this` reference.
        resultListId: any;

        results: Object = [];
        selectedIndex: number = -1;
        expanded: boolean = false;
        loading: boolean = false;
        position: string = 'below';
        resetPosition: boolean = true;
        id: string = 'placeholder';

        data() {
            return {
                core: new AutocompleteCore({
                    search: this.search,
                    autoSelect: this.autoSelect,
                    setValue: this.setValue,
                    onUpdate: this.handleUpdate,
                    onSubmit: this.handleSubmit,
                    onShow: this.handleShow,
                    onHide: this.handleHide,
                    onLoading: this.handleLoading,
                    onLoaded: this.handleLoaded,
                }),

                value: this.defaultValue,
                resultListId: uniqueId(`${this.baseClass}-result-list-`)
            };
        }

        get safeId() {
            if (this.id !== 'placeholder') {
                return this.id
            }

            const key = Math.random()
                .toString(36)
                .replace('0.', '');
            this.id = '_safe_id_' + key;

            return this.id;
        }

        get rootProps() {
            return {
                class: this.baseClass,
                style: {position: 'relative'},
                'data-expanded': this.expanded,
                'data-loading': this.loading,
                'data-position': this.position,
            }
        }

        get inputProps() {
            return {
                class: `${this.baseClass}-input`,
                value: this.value,
                role: 'combobox',
                autocomplete: 'off',
                autocapitalize: 'off',
                autocorrect: 'off',
                spellcheck: 'false',
                'aria-autocomplete': 'list',
                'aria-haspopup': 'listbox',
                'aria-owns': this.resultListId,
                'aria-expanded': this.expanded ? 'true' : 'false',
                'aria-activedescendant':
                    this.selectedIndex > -1
                        ? this.resultProps[this.selectedIndex].id
                        : '',
                ...this.$attrs,
            }
        }

        get inputListeners() {
            return {
                input: this.handleInput,
                //@ts-ignore
                keydown: this.core.handleKeyDown,
                //@ts-ignore
                focus: this.core.handleFocus,
                //@ts-ignore
                blur: this.core.handleBlur,
            }
        }

        get resultListProps() {
            const yPosition = this.position === 'below' ? 'top' : 'bottom';
            return {
                id: this.resultListId,
                class: `${this.baseClass}-result-list`,
                role: 'listbox',
                style: {
                    position: 'absolute',
                    zIndex: 1,
                    width: '100%',
                    visibility: this.expanded ? 'visible' : 'hidden',
                    pointerEvents: this.expanded ? 'auto' : 'none',
                    [yPosition]: '100%',
                },
            }
        }

        get resultListListeners() {
            return {
                //@ts-ignore
                mousedown: this.core.handleResultMouseDown,
                //@ts-ignore
                click: this.core.handleResultClick,
            }
        }

        get resultProps() {
          //@ts-ignore
          return this.results.map((result: any, index: number) => ({
                id: `${this.baseClass}-result-${index}`,
                class: `${this.baseClass}-result`,
                'data-result-index': index,
                role: 'option',
                ...(this.selectedIndex === index ? {'aria-selected': 'true'} : {}),
            }))
        }

        mounted() {
            document.body.addEventListener('click', this.handleDocumentClick)
        }

        beforeDestroy() {
            document.body.removeEventListener('click', this.handleDocumentClick)
        }

        updated() {
            if (!this.$refs.input || !this.$refs.resultList) {
                return
            }
            //@ts-ignore
            if (this.resetPosition && this.results.length > 0) {
                this.resetPosition = false;
                this.position = getRelativePosition(
                    this.$refs.input,
                    this.$refs.resultList
                )
            }
            //@ts-ignore
            this.core.checkSelectedResultVisible(this.$refs.resultList)
        }

        setValue(result: string) {
            this.value = result ? this.getResultValue(result) : ''
        }

        handleUpdate(results: any, selectedIndex: any) {
            this.results = results;
            this.selectedIndex = selectedIndex
        }

        handleShow() {
            this.expanded = true
        }

        handleHide() {
            this.expanded = false;
            this.resetPosition = true
        }

        handleLoading() {
            this.loading = true
        }

        handleLoaded() {
            this.loading = false
        }

        handleInput(event: string) {
          //@ts-ignore
            this.value = event.target.value;
            //@ts-ignore
            this.core.handleInput(event)
        }

        handleSubmit(selectedResult: string) {
            this.$emit('submit', selectedResult)
        }

        handleDocumentClick(event: any) {
          //@ts-ignore
            if (this.$refs.root.contains(event.target)) {
                return
            }
            //@ts-ignore
            this.core.hideResults()
        }
    }
</script>
<style lang="scss">
    /* Loading spinner */
    .autocomplete[data-loading="true"]::after {
        content: "";
        border: 3px solid rgba(0, 0, 0, 0.12);
        border-right: 3px solid rgba(0, 0, 0, 0.48);
        border-radius: 100%;
        width: 15px;
        height: 15px;
        position: absolute;
        right: 12px;
        top: 70%;
        transform: translateY(-50%);
        animation: rotate 1s infinite linear;
    }

    .autocomplete-result-list {
        margin: 0;
        border: 1px solid rgba(0, 0, 0, 0.12);
        padding: 0;
        box-sizing: border-box;
        max-height: 296px;
        overflow-y: auto;
        background: #fff;
        list-style: none;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.16);
    }

    [data-position="below"] .autocomplete-result-list {
        margin-top: -1px;
        border-top-color: transparent;
        border-radius: 0 0 4px 4px;
        padding-bottom: 4px;
    }

    [data-position="above"] .autocomplete-result-list {
        margin-bottom: -1px;
        border-bottom-color: transparent;
        border-radius: 8px 8px 0 0;
        padding-top: 8px;
    }

    /* Single result item */
    .autocomplete-result {
        cursor: default;
        padding: 4px 4px 4px 12px;
    }

    .autocomplete-result:hover,
    .autocomplete-result[aria-selected="true"] {
        background-color: rgba(0, 0, 0, 0.06);
    }

    @keyframes rotate {
        from {
            transform: translateY(-50%) rotate(0deg);
        }
        to {
            transform: translateY(-50%) rotate(359deg);
        }
    }
</style>
