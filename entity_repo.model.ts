export interface EntityRepo {
    [key: string]: Entity;
}

export interface Entity{
    db_name: string,
    fk?: EntityForeignKey,
    fields: EntityField[],
    userRequired?: boolean,
}

export interface EntityFilter {
    name: string,
    title: string,
    type: string,
    readonly?: boolean,
    value?: any,
    db_name?: string,
    formLink?: {
        formKey?: string,
        formFieldKey?: string,
    }
}

export interface EntityField {
    key: string,
    type: string,
    title?: string,
    dctKey?: string,
    useDict?: boolean,
    canBeNull?: boolean,
    initData?: any,
    required?: boolean,
    readonly?: boolean,
    showOnTable?: boolean,
    hide?: boolean,
    titleDictKey?: string,
}

export interface EntityLink{
    type: string,
    entKey: string,
    title?: string,
    multiselect?: boolean,
    entType?: string,
    proxyTo?: string,
    conditionField?: string,
    conditionKey?: string,
    conditionValue?: string,
    dummyTitle?: string,
    image?: {
        urlType: string,
        urlKey: string,
    },
    imageLoader?: true,
    filters?: EntityFilter[],
}

export interface EntityCalc{
    key: string,
    type: string,
    id_key: string,
    db_name: string,
}

export interface EntityForeignKey{
    db: string,
    target: string[],
    key: string,
    restrictors?: [{
        key: string,
        value: string,
    }]
}
