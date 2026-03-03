const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function parseTodo(line) {
    const body = line.trimStart().slice(7).trim(); 
    const parts = body.split(';').map(s => s.trim());
    const [author, date, comment] = parts;
    return { author, date, comment, raw: line };
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            const files = getFiles();
            const todos = files.reduce((acc, file) => {
                const fileTodos = file.split('\n').filter(line => line.startsWith('// TODO'));
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
            break;
        case command.startsWith('user '): 
            const username = command.slice(5).trim().toLowerCase();
            const todo = getFiles().flatMap(file =>
                file
                    .split('\n')
                    .filter(line => line.trimStart().startsWith('// TODO '))
                    .map(parseTodo)
                    .filter(t => t && t.author.toLowerCase() === username)
                    .map(t => t.raw)
            );
            todo.forEach(todo => console.log(todo));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
