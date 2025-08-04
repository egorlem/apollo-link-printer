import { Operation } from '@apollo/client';
import { TStyle } from '../printerLink.types';

/* CSS */
const bold = 'font-weight: bold';

export const titleBadgeStyle = `background-color: #abe9b2; color: #000000; ${bold}`;
export const titleBadgeStyleNoResponse = `background-color: #FF6275; color: #000000; ${bold}`;
export const titleTextStyle = `${bold}`;
export const rowBadgeStyle = `color: #cfc167; ${bold}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorsRow = (error: any, style: TStyle) => {
       const { message } = error;
    
     if (style === 'off') {
        return [`Error message : ${message}`,]
    };

    return [
        `%cError message :%c ${message}`,
        rowBadgeStyle, '',
    ];
}

/**
 * @param {Operation} operation
 * @returns
 */
export const messageRow = (operation: Operation, style: TStyle) => {
    const { message } = operation.getContext();
    if (!message && typeof message !== 'string') {
        return [];
    }

    if (style === 'off') {
        return [`Message : ${message}`,]
    };

    return [
        `%cMessage :%c ${message}`,
        rowBadgeStyle, '',
    ];
};

/**
 * @param {*} Operation
 * @returns
 */
export const variablesRow = ({ variables }: Operation, style: TStyle) => {
    if (!Object.keys(variables).length) {
        return [];
    }

    const content = JSON.stringify(variables, null, 1);

    if (style === 'off') {
        return [`Variables : ${content}`,]
    };

    return [
        `%cVariables :%c ${content}`,
        rowBadgeStyle, '',
    ];
};

/**
 * @description takes information about the included fragments in the request and formats them
 * @param {Operation} operation
 */
export const fragmentRow = ({ query: { definitions } }: Operation, style: TStyle) => {
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

    if (style === 'off') {
        return [`${text} ${fragmentsNames}`,]
    };

    return [
        `%c${text} %c${fragmentsNames}`,
        rowBadgeStyle, '',
    ];
};

/**
 * @description takes the value of operation type and operationName and formats them
 * @param {Operation} operation
 */
export const operationRow = (
    /* eslint-disable @typescript-eslint/no-explicit-any */
    { query: { definitions = [] }, operationName }: Operation | any, 
    style: TStyle, 
    isOK: boolean,
    errors: any = [],
) => {
    const definition = definitions.find(({ kind }) => kind === 'OperationDefinition');
    const operationType = definition.operation || 'unknown'

    if (style === 'off') {
        return [`${operationType.toUpperCase()} : ${operationName}`]
    };

    const titleStyle = isOK ? titleBadgeStyle : titleBadgeStyleNoResponse;
    const isError = !!errors.length;

    const ok = [
        `%c ${operationType.toUpperCase()} %c ${operationName}`,
        titleStyle, titleTextStyle,
    ];
    
    const error = [
        `%c ${operationType.toUpperCase()} %c ERROR %c ${operationName}`,
        titleStyle, titleBadgeStyleNoResponse, titleTextStyle,
    ];

    const message = isError ?  error : ok;

    return message;
};
