import { Operation } from '@apollo/client';

/* CSS */
const bold = 'font-weight: bold';

const titleBadgeStyle = `background-color: #abe9b2; color: black; border-radius: 2px; ${bold}`;
const titleTextStyle = `${bold}`;
const rowBadgeStyle = `color: #cfc167; ${bold}`;

/**
 * @param {*} Operation
 * @returns
 */
// const messageRow = (operation) => {
//     const { message, step } = operation.getContext();
//     if (step) {
//         console.log(`\x1b[1;33mStep :\x1b[0m \x1b[1m${step}\x1b[0m`);
//     }
// };

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
 * @param {*} Operation
 * @returns
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

    const text = II.length > 1 ? 'Includes fragments :' : 'Include fragment :';
    const fragmentsNames = II.join(', ');
    return [
        `%c${text} %c${fragmentsNames}`,
        rowBadgeStyle, '',
    ];
};

/**
 * @param {*} Operation
 * @returns
 */
export const operationRow = ({ query: { definitions }, operationName }: Operation | any) => {
    const [{ operation: operationType }] = definitions;

    return [
        `%c ${operationType.toUpperCase()} %c ${operationName}`,
        titleBadgeStyle, titleTextStyle,
    ];
};


