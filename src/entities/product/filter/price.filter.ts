export class PriceFilter{
    amount:number;
    operator:PriceEnum=PriceEnum.LESS_EQUAL;
}

export class PriceFilterDto{ 
    price:PriceFilter
}

export enum PriceEnum{
    GREATHER=1,
    GREATHER_EQUAL,
    LESS,
    LESS_EQUAL,
    EQUAL,
    DIFFERENT
}