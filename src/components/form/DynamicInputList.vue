<template>
    <div>
        <CRow>
            <CCol col="11">
                <CCardText>{{ label }}</CCardText>
            </CCol>
            <CCol col="1">
                <div class="clickable" @click="addRow">
                    <CIcon name="cil-playlist-add" />
                </div>
            </CCol>
        </CRow>
        <div v-for="(input, index) in rows" :key="index">
            <CRow>
                <CCol>
                    <CInput
                        required
                        inline
                        :value="input"
                        style="margin-bottom: 2px"
                        :type="inputType"
                        @input="updateRow(index, $event)"
                    >
                        <template #append-content>
                            <div class="clickable" @click="removeRow(index)">
                                <CIcon name="cil-x-circle" />
                            </div>
                        </template>
                    </CInput>
                </CCol>
            </CRow>
        </div>
        <div style="margin-bottom: 13px" />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, PropSync, Vue } from "vue-property-decorator";

    @Component
    export default class DynamicInputList extends Vue {
        readonly name: string = 'DynamicInputList';
        //@ts-ignore
        @PropSync('data', { type: Array }) rows: Array<string>;
        //@ts-ignore
        @Prop(String) readonly label: string;
        @Prop(String) readonly type?: string|undefined;

        addRow(): void {
            this.rows.push('');
        }

        removeRow(index: number): void {
            this.rows.splice(index, 1);
        }

        updateRow(index: number, value: string): void {
            this.rows.splice(index, 1, value);
        }

        setData(data: Array<string>): void {
            this.rows.splice(0, data.length, ...data);
        }

        get inputType(): string {
            return this.type === undefined ? 'text' : this.type;
        }
    }
</script>

<style scoped>

</style>
