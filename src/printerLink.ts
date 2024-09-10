import { ApolloLink, NextLink, Operation } from '@apollo/client';
import { fragmentRow, messageRow, operationRow, variablesRow } from './rows';
import { TLinkOptions, TRows } from './printerLink.types';

const rowHandlerRecord = {
    fragment: fragmentRow,
    variables: variablesRow,
    message: messageRow,
};

const prepareSubrows = (operation: Operation, order: TRows[]) => {
    const result = {
        isSingleRow: true,
        subrows: [],
    }

    order.forEach((rowKey) => {
        const row = rowHandlerRecord[rowKey](operation);

        if (row.length) {
            result.isSingleRow = false;
            result.subrows.push(row);
        }
    });

    return result;
};

const printer = (operation: Operation, options: TLinkOptions) => {
    const { 
        collapsed = false, 
        order = ['fragment', 'variables', 'message'] 
    } = options;
    const mainrow = operationRow(operation);
    const { isSingleRow, subrows } = prepareSubrows(operation, order);
    try {
        if (isSingleRow) {
            console.log(...mainrow);
        } else {
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
 * @doc https://github.com/egorlem/apollo-link-printer
 * @description Pretty logger of Apollo GraphQL network operations
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


