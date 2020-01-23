export default {
    normalizeIri(iri) {
        return /[^/]*$/.exec(iri)[0]
    }
};
