const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            const files = getFiles();
            const todos = files.reduce((acc, file) => {
                const fileTodos = file.split('\n').filter(line => line.startWith('// TODO'));
                return acc.concat(fileTodos);
            }, []);
            todos.forEach(todo => console.log(todo));
            break;
        case 'important':
            const importantTodos = files.reduce((acc, file) => {
                const fileImportantTodos = file.split('\n').filter(line => line.startsWith('// TODO') && line.includes('!'));
                return acc.concat(fileImportantTodos);
            }, []);
            importantTodos.forEach(todo => console.log(todo));
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
