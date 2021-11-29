import { Option } from "./option";

export module CLI {
    interface ParsedArg {
        [flag: string]: any
    }

    function validateArgs(args: string[]) {
        if(args.length % 2 !== 0) {
            throw new Error(`the key and value of ${args} is not suitable`);
        }

        for(let i = 0; i < args.length; i+=2) {
            const flag = args[i];
            
            if(!flag.startsWith('-')){
                throw new Error(`${flag} should be start with "--" or "-"`);
            }
        }
    }

    function validateOptions(options: Option[]) {
        if (options.length === 0) {
            throw new Error(`Need options`)
        }

        const flags = new Set<string>();
        const aliases = new Set<string>();

        for(const option of options){
            if (option.defaultValue && typeof option.defaultValue !== option.valueType) {
                throw new Error(`defaultValue "${option.defaultValue}" is not matched ${option.valueType}`)
            }
    
            if (flags.has(option.flag)) {
                throw new Error(`flag "${option.flag}" already exist`);
            }
            else{
                flags.add(option.flag);
            }
    
            if(option.alias){
                if(aliases.has(option.alias)){
                    throw new Error(`alias "${option.alias}" already exist`);    
                }
                aliases.add(option.alias);
            }
        }
    }

    export function parse(options: Option[], args: string[]): ParsedArg {
        validateOptions(options);
        validateArgs(args);
        const parsedArg: ParsedArg = {}

        for (const option of options) {
            const flag = `--${option.flag}`;
            const alias = `-${option.alias}`;

            const flagIndex = args.indexOf(flag) !== -1 ? args.indexOf(flag) : args.indexOf(alias);
            const value = flagIndex === -1 ? option.defaultValue : args[flagIndex + 1];
            parsedArg[option.flag] = value;
            
            switch (option.valueType) {
                case 'boolean':
                    if(value === 'true'){
                        parsedArg[option.flag] = true;
                    }                    
                    else if(value === 'false'){
                        parsedArg[option.flag] = false;
                    }
                    break;
                case 'number':
                    parsedArg[option.flag] = Number(value);
                    break;
                case 'string':
                    if(value) {
                        parsedArg[option.flag] = value.toString();
                    }
                    break;
                case 'object':
                    try{
                        parsedArg[option.flag] = JSON.parse(value);
                    }
                    catch{
                    }
                    break;
                default:
                    throw new Error(`${option.valueType} is not supported type`);
            }

            if (typeof parsedArg[option.flag] !== option.valueType) {
                throw new Error(`Value ${parsedArg[option.flag]} is not type "${option.valueType}"`)
            }

            if (option.choices) {
                if (!option.choices.includes(parsedArg[option.flag])) {
                    throw new Error(`${parsedArg[option.flag]} should be in ${option.choices}`)
                }
            }
        }

        return parsedArg;
    }
}
