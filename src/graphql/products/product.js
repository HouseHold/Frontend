import gql from 'graphql-tag';

const query = gql`
    query listAll($id: ID!) {
        product(id: $id) {
            id
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

`;

const denormalizeId = (id) => { return "/api/products/" + id; };
export { query, denormalizeId };
