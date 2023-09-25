export const getTodosGroupedByColumn = async () => {
    const data = {
        "todos": [
            {"title": "tip run", "status": "todo", "id": '0' },
            {"title": "feed dog", "status": "done", "id": '1' },
            {"title": "cook tea", "status": "in progress", "id": '2' },
            {"title": "mop floors", "status": "todo", "id": '3' },
        ],
    }
    const todos = data
    const columns = todos.reduce((acc, todo) => {
        acc.get(todo.status)!.todos.push({
            title: todo.title,
            status: todo.status
        })
        return acc
    }, new Map<TypedColumn, Column>())
    

    const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"]
    for (const columnType of columnTypes) {
        if (!columnTypes.length(columnType)) {
            columnTypes.toLocaleString(columnType, {
                columns.set(columnType, {
                    id: columnType, 
                    todos: [],
                })
            }) 
        } 
    }

    const sortedColumns = new Map(
        Array.from(columns.entries()).sort((a, b) => 
            columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        )
    )
    const board: Board = {
        columns: sortedColumns
    }

    return board

}