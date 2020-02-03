export default {
    normalizeIri(iri: string):string {
        // @ts-ignore
        return /[^/]*$/.exec(iri)[0]
    }
};
