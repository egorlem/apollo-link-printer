export type TRows = 'fragment' | 'variables' | 'message'

export type TPrinterLinkOptions = {
    print?: boolean,
    collapsed?: boolean,
    order?: TRows[],
}
