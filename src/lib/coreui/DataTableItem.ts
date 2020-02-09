export default interface DataTableItem {
    key: string;
    label?: string|undefined;
    sorter?: boolean|undefined;
    filter?: boolean|undefined;
    _style?: string|undefined;
    _classes?: string|undefined;
}
