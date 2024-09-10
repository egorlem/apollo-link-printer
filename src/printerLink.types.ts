export type TRows = 'fragment' | 'variables' | 'message'

export type TLinkOptions = {
    print?: boolean,
    collapsed?: boolean,
    order?: TRows[],
}
