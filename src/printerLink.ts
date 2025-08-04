import { ApolloLink, NextLink, Operation } from '@apollo/client';
import { fragmentRow, messageRow, operationRow, variablesRow } from './rows/index.js';
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

const printer = (operation: Operation, options: TLinkOptions) => {
    const { style = 'css' } = options;
    const mainrow = operationRow(operation, style);
    const { isSingleRow, subrows } = prepareSubrows(operation, options);
    
    try {
        if (isSingleRow) {
            console.log(...mainrow);
        } else {
            const { collapsed = false } = options;
            const group = collapsed ? 'groupCollapsed' : 'group'

            console[group](...mainrow) 
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
        try {
            const { print = true, ...otherOptions } = options;

            if (print) {
                printer(operation, otherOptions);
            }
        } catch (errMsg) {
            console.error(errMsg);
        }
        return forward(operation);
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


