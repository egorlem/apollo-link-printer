import { Operation } from '@apollo/client';

/* CSS */
const bold = 'font-weight: bold';

export const titleBadgeStyle = `background-color: #abe9b2; color: black; border-radius: 2px; ${bold}`;
export const titleTextStyle = `${bold}`;
export const rowBadgeStyle = `color: #cfc167; ${bold}`;

/**
 * @param {Operation} operation
 * @returns
 */
export const messageRow = (operation: Operation) => {
    const { message } = operation.getContext();
    if (!message && typeof message !== 'string') {
        return [];
    }
    return [
        `%cMessage :%c ${message}`,
        rowBadgeStyle, '',
    ];
};

/**
 * @param {*} Operation
 * @returns
 */
export const variablesRow = ({ variables }: Operation) => {
    if (!Object.keys(variables).length) {
        return [];
    }

    const content = JSON.stringify(variables, null, 1);

    return [
        `%cVariables :%c ${content}`,
        rowBadgeStyle, '',
    ];
};

/**
 * @description takes information about the included fragments in the request and formats them
 * @param {Operation} operation
 */
export const fragmentRow = ({ query: { definitions } }: Operation) => {
    const II = definitions.reduce((acc, item) => {
        const isFragementType = item.kind === 'FragmentDefinition';
        if (isFragementType) { return [...acc, item.name.value]; }
        return acc;
    }, []);

    if (!II.length) {
        return [];
    }

    const text = II.length > 1 ? 'Includes fragments :' : 'Includes fragment :';
    const fragmentsNames = II.join(', ');
    return [
        `%c${text} %c${fragmentsNames}`,
        rowBadgeStyle, '',
    ];
};

/**
 * @description takes the value of operation type and operationName and formats them
 * @param {Operation} operation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const operationRow = ({ query: { definitions = [] }, operationName }: Operation | any) => {
    const definition = definitions.find(({ kind }) => kind === 'OperationDefinition');
    const operationType = definition.operation || 'unknown'

    return [
        `%c ${operationType.toUpperCase()} %c ${operationName} _DEV_`,
        titleBadgeStyle, titleTextStyle,
    ];
};


