<template>
    <div>
        <CRow>
            <CCol col="11">
                <CCardText>{{ label }}</CCardText>
            </CCol>
            <CCol col="1">
                <div @click="addRow" class="clickable">
                    <CIcon name="cil-playlist-add" />
                </div>
            </CCol>
        </CRow>
        <div v-for="(input, index) in inputs" :key="index">
            <CRow>
                <CCol>
                    <CInput required inline :value="input">
                        <template #append-content>
                            <div class="clickable" @click="removeRow(index)">
                                <CIcon name="cil-x-circle" />
                            </div>
                        </template>
                    </CInput>
                </CCol>
            </CRow>
        </div>
    </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";

    @Component
    export default class DynamicInputList extends Vue {
        readonly name: string = 'DynamicInputList';
        //@ts-ignore
        @Prop(Array) readonly data: Array<string>;
        //@ts-ignore
        @Prop(String) readonly label: string;
        rows: Array<string> = [];

        addRow(): void {
            this.rows.push('');
        }

        removeRow(index: number): void {
            this.rows.splice(index, 1);
        }

        get inputs(): Array<String> {
            if (this.rows.length === 0) {
                this.rows = this.data;
            }

            return this.data;
        }
    }
</script>

<style scoped>

</style>
