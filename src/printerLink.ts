import { ApolloLink, NextLink, Operation } from '@apollo/client';
import { fragmentRow, messageRow, operationRow, variablesRow } from './rows';
import { TLinkOptions } from './printerLink.types';

const prepareSubrows = (operation: Operation) => {
    const result = {
        isSingleRow: true,
        subrows: [],
    }
    const rows = [fragmentRow, variablesRow, messageRow];

    rows.forEach((handler) => {
        const row = handler(operation);
        
        if (row.length) {
            result.isSingleRow = false;
            result.subrows.push(row);
        }
    });

    return result;
};

const printer = (operation: Operation, options: TLinkOptions) => {
    const mainrow = operationRow(operation);
    const { isSingleRow, subrows } = prepareSubrows(operation);
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


