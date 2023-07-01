declare class CsvTool {
    constructor()
    writeCsvFileSync: (args: { path: string; data: {}[]; columns: string[] }) => any
    appendToCsvFileSync: (args: { path: string; data: {}[] }) => any
    getCsvFileColumnsSync: (args: { path: string }) => any
    readCsvFileSync: (args: { path: string }) => any
    pickFunctions(
        functionNames: Array<keyof CsvTool>
    ): (
        | ((args: { path: string; data: {}[]; columns: string[] }) => any)
        | ((args: { path: string; data: {}[] }) => any)
        | ((args: { path: string }) => any)
        | ((args: { path: string }) => any)
        | ((
              functionNames: Array<keyof CsvTool>
          ) => (
              | ((args: { path: string; data: {}[]; columns: string[] }) => any)
              | ((args: { path: string; data: {}[] }) => any)
              | ((args: { path: string }) => any)
              | ((args: { path: string }) => any)
              | any
          )[])
    )[]
}

export { CsvTool as default }
