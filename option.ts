type ValueType = 'boolean' | 'number' | 'string' | 'object';

interface OptionParam {
    flag: string;
    alias?: string;
    choices?: any[];

    valueType: ValueType
    defaultValue?: any;
}

export class Option implements OptionParam {
    public readonly flag: string;
    public readonly alias?: string;
    public readonly choices?: any[];

    public readonly valueType: ValueType;
    public readonly defaultValue?: any;
    
    constructor(param: OptionParam) {
        this.flag = param.flag;
        this.alias = param.alias ? param.alias : undefined
        this.choices = param.choices;

        this.valueType = param.valueType;
        this.defaultValue = param.defaultValue;
    }
}
