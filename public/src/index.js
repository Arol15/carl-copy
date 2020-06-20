'use-strict'
const React = window.React;
const ReactDOM = window.ReactDOM;
const { DragDropContext, Draggable, Droppable } = window.ReactBeautifulDnd;
const styled = window.styled

const TaskContainer = styled.div`
  border: 1px solid lightgrey;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(21,27,38,.15);

  padding: 16px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'skyblue' : 'white')};

  display: flex;
  justify-content: center;
  align-items: center;
`

class Task extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>

        {(provided, snapshot) => (

          <TaskContainer {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} isDragging={snapshot.isDragging}>

            {this.props.task.content}

          </TaskContainer>
        )}
      </Draggable>
    )
  }
}

const ColumnContainer = styled.div`
  margin: 8px;
  background-color: #f6f8f9;
  border-radius: 7px;
  width: 280px;

  display: flex;
  flex-direction: column;
  `

const Title = styled.h3`
  padding: 8px;
  text-align: center;
`
const TaskList = styled.div`
  padding: 8px;
  background-color: ${props => (props.isDraggingOver ? '#f0f3f6' : 'inherit')};

  flex-grow: 1;
  min-height: 100px;
  `

class Column extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided) => (

          <ColumnContainer {...provided.draggableProps} ref={provided.innerRef}>
            <Title {...provided.dragHandleProps}>{this.props.column.title}</Title>

            <Droppable type='task' droppableId={this.props.column.id}>
              {(provided, snapshot) => (

                <TaskList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>

                  {this.props.tasks.map((task, index) => (
                    <Task key={task.id} task={task} index={index} />
                  ))}

                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>

          </ColumnContainer>

        )}
      </Draggable>
    )
  }
}

const BoardContainer = styled.div`
  display: flex;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Helvetica,Arial,sans-serif;
  background-color: #f6f8f9;
`

class App extends React.Component {
  state = {
    tasks: {
      'task-1': { id: 'task-1', content: 'Take out the garbage' },
      'task-2': { id: 'task-2', content: 'Watch my favorite show' },
      'task-3': { id: 'task-3', content: 'Charge my phone' },
      'task-4': { id: 'task-4', content: 'Cook dinner' },
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To do',
        taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
      },
      'column-2': {
        id: 'column-2',
        title: 'In progress',
        taskIds: [],
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        taskIds: [],
      },
    },
    // Facilitate ordering of columns
    columnOrder: ['column-1', 'column-2', 'column-3'],
  }

  onDragStart = start => {
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId)
    this.setState({ homeIndex })
  }

  onDragEnd = result => {
    document.body.style.color = 'inherit'
    document.body.style.backgroundColor = 'inherit'
    this.setState({ homeIndex: null })

    const { destination, source, draggableId, type } = result

    if (!destination) { return }

    if (destination.droppableId === source.droppableId && destination.index === source.index) { return }

    if (type === 'column') {
      const newColumnOrder = Array.from(this.state.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      const newState = { ...this.state, columnOrder: newColumnOrder }

      this.setState(newState)
      return
    }

    const start = this.state.columns[source.droppableId]
    const finish = this.state.columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = { ...start, taskIds: newTaskIds }

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        }
      }

      this.setState(newState)
      // TODO: persist order state to database here
      return
    }

    // moving from one list to another
    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }

    this.setState(newState)
    // TODO: persist order state to database here
  }

  render() {
    //TODO: Fetch state here
    return (
      <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
        <Droppable droppableId='all-columns' direction='horizontal' type='column'>
          {(provided) => (

            <BoardContainer {...provided.droppableProps} ref={provided.innerRef}>

              {this.state.columnOrder.map((columnId, index) => {
                const column = this.state.columns[columnId]
                const tasks = column.taskIds.map(taskId => this.state.tasks[taskId])
                return <Column key={column.id} column={column} tasks={tasks} index={index} />
              })}

              {provided.placeholder}
            </BoardContainer>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}
const domContainer = document.querySelector('#board');
ReactDOM.render(<App />, domContainer);
