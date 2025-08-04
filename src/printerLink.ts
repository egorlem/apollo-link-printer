import { ApolloLink, NextLink, Operation } from '@apollo/client';
import { errorsRow, fragmentRow, messageRow, operationRow, variablesRow, } from './rows/index.js';
import { TLinkOptions } from './printerLink.types.js';

const prepareSubrows = (operation: Operation, options: TLinkOptions) => {
    const result = {
        isSingleRow: true,
        subrows: [],
    }
    const { style = 'css' } = options;

    const rows = [fragmentRow, variablesRow, messageRow];

    rows.forEach((handler) => {
        const row = handler(operation, style);

        if (row.length) {
            result.isSingleRow = false;
            result.subrows.push(row);
        }
    });

    return result;
};

const printer = (
    operation: Operation,
    options: TLinkOptions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors: any = [],
    isOK: boolean
) => {
    const { style = 'css' } = options;
    const mainrow = operationRow(operation, style, isOK, errors);
    const { isSingleRow, subrows } = prepareSubrows(operation, options);

    try {
        if (isSingleRow) {
            console.log(...mainrow);
        } else {
            const { collapsed = false } = options;
            const group = collapsed ? 'groupCollapsed' : 'group'

            console[group](...mainrow)
            errors.forEach((error) => {
                const subrow = errorsRow(error, style);
                console.log(...subrow);
            })
            subrows.forEach((subrow) => {
                console.log(...subrow);
            });
            console.groupEnd();
        }
    } catch (err) {
        console.error(err);
    }
};

function operationPrinter(options: TLinkOptions) {
    return new ApolloLink(((operation, forward) => {
        return forward(operation).map((response) => {
            try {
                const { print = true, ...otherOptions } = options;
                if (print) {
                    const { errors = [] } = response;
                    const isOK = 'data' in response;
                    printer(operation, otherOptions, errors, isOK);
                }
            } catch (errMsg) {
                console.error(errMsg);
            }
            return response;
        });
    }));
}

/**
 * @description Pretty logger of Apollo GraphQL network operations
 * @doc https://github.com/egorlem/apollo-link-printer
 */
export class PrinterLink extends ApolloLink {
    private link: ApolloLink;

    constructor(option: TLinkOptions = {}) {
        super();
        this.link = operationPrinter(option);
    }

    request(operation: Operation, forward: NextLink) {
        return this.link.request(operation, forward);
    }
}


