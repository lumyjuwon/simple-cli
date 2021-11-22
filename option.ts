type ValueType = 'boolean' | 'number' | 'string' | 'object';

interface OptionParam {
    flag: string;
    alias?: string;
    choices?: any[];

    valueType: ValueType
    defaultValue?: any;
}

export class Option implements OptionParam {
    private static readonly flags = new Set<string>();
    private static readonly aliases = new Set<string>();

    public readonly flag: string;
    public readonly alias?: string;
    public readonly choices?: any[];

    public readonly valueType: ValueType;
    public readonly defaultValue?: any;
    
    static hasFlag(flag: string) {
        return Option.flags.has(flag)
    }

    static hasAlias(alias: string) {
        return Option.aliases.has(alias)
    }
    
    constructor(param: OptionParam) {
        this.flag = param.flag;
        this.alias = param.alias ? param.alias : undefined
        this.choices = param.choices;

        this.valueType = param.valueType;
        this.defaultValue = param.defaultValue;
        if (this.defaultValue && typeof this.defaultValue !== this.valueType) {
            throw new Error(`defaultValue "${this.defaultValue}" is not matched ${this.valueType}`)
        }

        if (Option.flags.has(this.flag)) {
            throw new Error(`flag "${this.flag}" already exist`);
        }
        if (this.alias && Option.aliases.has(this.alias)) {
            throw new Error(`alias "${this.alias}" already exist`);
        }
        Option.flags.add(this.flag);
        this.alias && Option.aliases.add(this.alias);
    }
}
