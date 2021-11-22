import { Option } from "./option";

interface Argv {
    [flag: string]: any
}

export module CLI {
    let _options: Option[];

    export function applyOptions(options: Option[]) {
        _options = options;
        return CLI;
    }

    export function parse(): Argv {
        const isOptionApplied = _options && _options.length > 0;
        if (!isOptionApplied) {
            throw new Error(`Need options`)
        }

        const argv: Argv = {}
        const args = process.argv.slice(2);

        for (const option of _options) {
            let flagIndex = args.indexOf(`--${option.flag}`);
            if (flagIndex === -1 && option.alias) {
                flagIndex = args.indexOf(`-${option.alias}`);
            }

            let value;
            if(flagIndex === -1){
                value = option.defaultValue;
            }
            else{
                const nextValue = args[flagIndex + 1]
                const isNextValue = !(Option.hasFlag(nextValue) || Option.hasAlias(nextValue));
                value = isNextValue ? nextValue : option.defaultValue
            }

            switch (option.valueType) {
                case 'boolean':
                    argv[option.flag] = JSON.parse(value);
                    break;
                case 'number':
                    argv[option.flag] = Number(value);
                    break;
                case 'string':
                    argv[option.flag] = String(value);
                    break;
                case 'object':
                    if (typeof value === 'string') {
                        argv[option.flag] = JSON.parse(value);
                        break;
                    }
                default:
                    argv[option.flag] = value;
            }

            if (typeof argv[option.flag] !== option.valueType) {
                throw new Error(`Value ${argv[option.flag]} is not type "${option.valueType}"`)
            }

            if (option.choices) {
                if (!option.choices.includes(argv[option.flag])) {
                    throw new Error(`${argv[option.flag]} should be in ${option.choices}`)
                }
            }
        }

        return argv;
    }
}
