import {EntityRepo} from './entity_repo.model';
export const entityRepo: EntityRepo = {
    harness: {
        db_name: 'harness',
        fields:[
            { key: 'id', title: 'ID', type: 'id', readonly: true },
            { key: 'brand ', title: 'Производитель', type: 'dict', useDict: true, dctKey: 'canopy_brand' },
            { key: 'model ', title: 'Модель', type: 'dict', useDict: true, dctKey: 'canopy_model' },
            { key: 'name', title: 'Название', type: 'text' },
            { key: 'serial', title: 'Серийный номер', type: 'text' },
            { key: 'size_min', title: 'Размер от', type: 'number' },
            { key: 'size_max', title: 'Размер до', type: 'number' },
            { key: 'user_id', title: 'Хозяин', type: 'id'},
            { key: 'note', title: 'Заметки', type: 'textarea' },
            { key: 'datetime_production', title: 'Дата изготовления', type: 'datetime' },
        ],
        userRequired: true,
    },
    aad: {
        db_name: 'aad',
        fields:[
            { key: 'id', title: 'ID', type: 'id', readonly: true },
            { key: 'brand ', title: 'Производитель', type: 'dict', useDict: true, dctKey: 'aad_brand' },
            { key: 'model ', title: 'Модель', type: 'dict', useDict: true, dctKey: 'aad_model' },
            { key: 'serial', title: 'Серийный номер', type: 'text' },
            { key: 'fires', title: 'Число срабатываний', type: 'number' },
            { key: 'user_id', title: 'Хозяин', type: 'id'},
            { key: 'note', title: 'Заметки', type: 'textarea' },
        ],
        userRequired: true,
    },
    canopy: {
        db_name: 'canopy',
        fields:[
            { key: 'id', title: 'ID', type: 'id', readonly: true },
            { key: 'brand ', title: 'Производитель', type: 'dict', useDict: true, dctKey: 'canopy_brand' },
            { key: 'model ', title: 'Модель', type: 'dict', useDict: true, dctKey: 'canopy_model' },
            { key: 'serial', title: 'Серийный номер', type: 'text' },
            { key: 'size', title: 'Размер', type: 'number' },
            { key: 'count', title: 'Число применений', type: 'number' },
            { key: 'reserve', title: 'Запасной', type: 'flag' },
            { key: 'user_id', title: 'Хозяин', type: 'id'},
            { key: 'note', title: 'Заметки', type: 'textarea' },
        ],
        userRequired: true,
    },
};
