export const getTodosGroupedByColumn = async () => {
    const data = {
        
    }
    const columns = data.todos.reduce((acc, todo) => {
        acc.get(data.todo.status)!.data.todos.push({
            title: data.todo.title,
            status: data.todo.status
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