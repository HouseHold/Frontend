import { Helpers } from "@/lib/api/index";

type FetchCallback = (page: number) => any;

export default {
    normalizeIri(iri: string):string {
        // @ts-ignore
        return /[^/]*$/.exec(iri)[0]
    },
    hasNextPage(data: any): boolean {
        if (!('hydra:view' in data)) {
            return false;
        }

        return 'hydra:next' in data['hydra:view'];
    },
    getNextPage(data: any): number {
        const url =  new URL("http://255.255.255.255"+data['hydra:view']['hydra:next']);
        return parseInt(url.searchParams.get('page') || 'Cause failure here!');
    },
    getData(data: any): { [key: string]: any } {
        return data['hydra:member'];
    },
    mapData(data: any, response: any): void {
        let objectData = this.getData(response);
        for (let key in objectData) {
            data[objectData[key]['@id']] = objectData[key];
        }
    },
    async fetchAllData(fetch: FetchCallback): Promise<object> {
        let returnValue: { [key: string]: object } = {};
        let response = await fetch(1);
        Helpers.mapData(returnValue, response);
        while(this.hasNextPage(response)) {
            response = await fetch(this.getNextPage(response));
            Helpers.mapData(returnValue, response);
        }

        return returnValue;
    }
};
