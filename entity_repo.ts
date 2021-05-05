import {EntityRepo} from './entity_repo.model';
export const entityRepo: EntityRepo = {
    canopy_brand: {
        db_name: 'canopy_brand',
        fields:[ 
            { key: 'id', title: 'ID', type: 'id', readonly: true },
            { key: 'slug', type: 'string', title: 'Ключ', required: true},
            { key: 'name', type: 'string', title: 'Название', required: true},
            { key: 'short_name', type: 'string', title: 'Короткое название', required: false},
            { key: 'description', type: 'string', title: 'Описание', required: false},
        ]
    },
    canopy_model: {
        db_name: 'canopy_model',
        fields:[
            { key: 'id', title: 'ID', type: 'id', readonly: true },
            { key: 'slug', type: 'string', title: 'Ключ', required: true},
            { key: 'name', type: 'string', title: 'Название', required: true},
            { key: 'short_name', type: 'string', title: 'Короткое название', required: false},
            { key: 'title', type: 'string', title: 'Заоголовок', required: false},
            { key: 'brand', type: 'string', title: 'Бренд', required: false},
        ]
    },
};
