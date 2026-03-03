const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function parseTodo(line) {
    const raw = line;
    const importance = (line.match(/!/g) || []).length;

    const body = line.trimStart().slice(7).trim(); 
    const parts = body.split(';').map(s => s.trim());
    if (parts.length < 3) {
        return { raw, author: null, date: null, comment: null, importance };
    }
    const [author, dateRaw, comment] = parts;
    const date = parseDate(dateRaw);
    return { raw, author: author || null, date, comment: comment || null, importance };
}

function parseDate(s) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
}

function collectTodos() {
    return getFiles().flatMap(file =>
        file
            .split('\n')
            .filter(line => line.trimStart().startsWith('// TODO '))
            .map(parseTodo)
    );
}

function processCommand(commandRaw) {
    const command = commandRaw.trim();

    switch (true) {
        case command === 'exit': {
            process.exit(0);
            break;
        }

        
        case command === 'show': {
            collectTodos().forEach(t => console.log(t.raw));
            break;
        }

        case command === 'important': {
            collectTodos()
                .filter(t => t.importance > 0)
                .forEach(t => console.log(t.raw));
            break;
        }

        case command.startsWith('user '): {
            const username = command.slice(5).trim().toLowerCase();
            if (!username) {
                console.log('wrong command');
                break;
            }
            collectTodos()
                .filter(t => t.author && t.author.toLowerCase() === username)
                .forEach(t => console.log(t.raw));
            break;
        }

        case command.startsWith('sort '): {
            const sortBy = command.slice(5).trim();
            const todos = collectTodos();

            if (sortBy === 'importance') {
                todos
                    .sort((a, b) => (b.importance || 0) - (a.importance || 0))
                    .forEach(t => console.log(t.raw));
                break;
            }

            if (sortBy === 'user') {
                todos
                    .sort((a, b) => {
                        const ua = (a.author || '').toLowerCase();
                        const ub = (b.author || '').toLowerCase();
                        if (ua && !ub) return -1;
                        if (!ua && ub) return 1;
                        return ua.localeCompare(ub);
                    })
                    .forEach(t => console.log(t.raw));
                break;
            }

            if (sortBy === 'date') {
                todos
                    .sort((a, b) => {
                        const da = a.date ? a.date.getTime() : -Infinity;
                        const db = b.date ? b.date.getTime() : -Infinity;
                        return db - da; 
                    })
                    .forEach(t => console.log(t.raw));
                break;
            }
            break;
        }

        default: {
            console.log('wrong command');
            break;
        }
    }
}