import { fragmentRow, operationRow, rowBadgeStyle, titleBadgeStyle, titleTextStyle } from "../rows";

/* MOCK OPERATION */
const DocumentNodeQuery = {
  directives: [],
  kind: "OperationDefinition",
  name: { kind: 'Name', value: 'auth' },
  operation: "query",
  selectionSet: { kind: 'SelectionSet', selections: [] },
  variableDefinitions: [],
}

const DocumentNodeFragment = {
  directives: [],
  kind: "FragmentDefinition",
  name: {
    kind: "Name",
    value: "MOCK_FRAGMENT_NAME"
  },
  selectionSet: { kind: 'SelectionSet', selections: [] },
  variableDefinitions: [],
}

const operation = {
  extensions: {},
  operationName: '',
  query: {
    definitions: [DocumentNodeQuery, DocumentNodeFragment],
    kind: "Document",
    loc: { start: 0, end: 91, source: '' }
  },
  variables: {
    foo: 'bar',
  },
  getContext: () => ({ foo: 'bar' }),
  setContext: () => { },
}

// .toBeDefined()

// describe('Default', () => {
//   expect(new PrinterLink()).toBeInstanceOf(ApolloLink);
// })

describe('Operation Row', () => {
  it('Contains the necessary elements', () => {
    const expected = ['%c QUERY %c ', titleBadgeStyle, titleTextStyle]
    const row = operationRow(operation);
    expect(row).toEqual(expect.arrayContaining(expected));
  });

  it('Defines the name of operation', () => {
    const row = operationRow(operation);
    expect(row).toContain('%c QUERY %c ');
  });
});

describe('Fragemnt Row', () => {
  it('Contains the necessary elements', () => {
    const expected = ['%cIncludes fragment : %cMOCK_FRAGMENT_NAME', rowBadgeStyle, '']
    // @ts-ignore
    const row = fragmentRow(operation);
    expect(row).toEqual(expect.arrayContaining(expected));
  });
  
  it('Title text isn`t plurality', () => {
    // @ts-ignore
    const [text] = fragmentRow(operation);
    expect(text).not.toMatch(/%cIncludes fragments : %cMOCK_FRAGMENT_NAME/)
    expect(text).toMatch(/%cIncludes fragment : %cMOCK_FRAGMENT_NAME/)
  })
  it('Row is empty', () => {
    const data = fragmentRow({
      ...operation,
      query: {
        ...operation.query,
        // @ts-ignore
        definitions: [DocumentNodeQuery]
      }
    });
    expect(data).toHaveLength(0);
  })
});
