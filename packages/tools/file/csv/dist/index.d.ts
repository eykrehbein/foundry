declare class CsvTool {
    constructor();
    writeCsvFileSync: (args: {
        path: string;
        data: {}[];
        columns: string[];
    }) => any;
    appendToCsvFileSync: (args: {
        path: string;
        data: {}[];
    }) => any;
    getCsvFileColumnsSync: (args: {
        path: string;
    }) => any;
    readCsvFileSync: (args: {
        path: string;
    }) => any;
}

export { CsvTool as default };
