import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import initialData from './initial-data'
import Column from './column'

const Container = styled.div`
  display: flex;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Helvetica,Arial,sans-serif;
  background-color: #f6f8f9;
`

class App extends React.Component {
  state = initialData

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
      newTaskIds.splice(destination.index, 0 , draggableId)

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
    
    return (
      <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
        <Droppable droppableId='all-columns' direction='horizontal' type='column'>
          {(provided) => (

            <Container {...provided.droppableProps} ref={provided.innerRef}>

                {this.state.columnOrder.map((columnId, index) => {
                  const column = this.state.columns[columnId]
                  const tasks = column.taskIds.map(taskId => this.state.tasks[taskId])
                  return <Column key={column.id} column={column} tasks={tasks} index={index}/>
                })}

                {provided.placeholder}
            </Container>
          )}

        </Droppable>
      </DragDropContext>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('root'));
