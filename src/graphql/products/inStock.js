import gql from 'graphql-tag';

const query = gql`
    query listAll($cursor: String) {
        products(name: "", after: $cursor) {
            pageInfo {
                hasNextPage
                endCursor
            }
            edges {
                node {
                    id
                    collection {
                        id
                        name
                        category {
                            id
                            name
                        }
                    }
                    name
                    ean
                    price
                    expiring
                    stocks {
                        edges {
                            node {
                                id
                                quantity
                                bestBefore
                                location {
                                    id
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default query;
