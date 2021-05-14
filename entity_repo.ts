import {EntityRepo} from './entity_repo.model';
export const entityRepo: EntityRepo = {
    harness: {
        db_name: 'harness',
        fields:[
            { key: 'id', title: 'ID', type: 'id', readonly: true },
        ],
        userRequired: true,
    },
    aad: {
        db_name: 'aad',
        fields:[
            { key: 'id', title: 'ID', type: 'id', readonly: true },
            { key: 'brand ', title: 'Производитель', type: 'dict', useDict: true, dctKey: 'aad_brand' },
            { key: 'model ', title: 'Модель', type: 'dict', useDict: true, dctKey: 'aad_model' },
            { key: 'serial', title: 'Серийный номер', type: 'string' },
            { key: 'fires', title: 'Число срабатываний', type: 'number' },
            { key: 'user_id ', title: 'Хозяин', type: 'id'},
            { key: 'note', title: 'Заметки', type: 'string' },
        ],
        userRequired: true,
    },
};
