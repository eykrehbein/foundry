# CsvTool

## Functions

### writeCsvFileSync

Writes data to a csv file

Properties:
- `path` (string)
- `data` (array): The rows to write, as an array of objects, each key representing a column
- `columns` (array): Defines the columns to write, in order
### appendToCsvFileSync

Appends data to an existing csv file

Properties:
- `path` (string)
- `data` (array): The rows to append, as an array of objects, each key representing a column. Only use existing columns
### getCsvFileColumnsSync

Gets the columns of a csv file. Always call before appending to csv file, to know which structure to use

Properties:
- `path` (string)
### readCsvFileSync

Reads data from a csv file into an array of objects, each object representing a row

Properties:
- `path` (string)
