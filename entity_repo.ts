import {EntityRepo} from './entity_repo.model';
export const entityRepo: EntityRepo = {
    harness: {
        db_name: 'harness',
        fields:[
            { key: 'id', title: 'ID', type: 'id', readonly: true },
        ],
        userRequired: true,
    },
};
