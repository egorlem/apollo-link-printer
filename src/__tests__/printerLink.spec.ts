import { operationRow } from "../rows";

/* MOCK OPERATION */ 
const DocumentNodeQuery = {
  directives: [],
  kind: "OperationDefinition",
  name: { kind: 'Name', value: 'auth' },
  operation: "query",
  selectionSet: { kind: 'SelectionSet', selections: [] },
  variableDefinitions: [],
}
const operation = {
  extensions: '',
  operationName: '',
  query: {
    definitions: [DocumentNodeQuery],
    kind: "Document",
    loc: { start: 0, end: 91, source: '' }
  },
  variables: {},
  getContext: () => { },
  setContext: () => { },
}

describe('Rows function', () => {
  test('Operation Row: defines the name of operation', () => {
    const row = operationRow(operation);
    expect(row).toContain('%c QUERY %c ');
  });
});