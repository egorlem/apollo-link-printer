import { ApolloLink, NextLink, Operation } from '@apollo/client';
import { fragmentRow, operationRow, variablesRow } from './rows';
import { TLinkOptions } from './printerLink.types';

// const prepareRows = () => {};

const printer = (operation: Operation, options: TLinkOptions) => {
    const { collapsed = false } = options;
    const group = collapsed ? 'groupCollapsed' : 'group';

    const rows: any[] = [];

    [fragmentRow, variablesRow].forEach((handler) => {
        const r = handler(operation);
        if (r) rows.push(r);
    });

    const log = rows.length ? group : 'log';

    try {
        console[log](...operationRow(operation));
        // console.log(variablesRow(operation));
        rows.forEach((r) => {
            console.log(...r);
        });
        console.groupEnd();
    } catch (err) {
        console.log(err);
    }
};

function operationPrinter(options: TLinkOptions) {
    return new ApolloLink(((operation, forward) => {
        try {
            const { print, ...otherOptions } = options;

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


