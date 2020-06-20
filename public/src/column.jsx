import React from 'react'
import styled from 'styled-components'
import Task from './task'
import { Droppable, Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
  margin: 8px;
  background-color: #f6f8f9;
  border-radius: 7px;
  width: 280px;

  display: flex;
  flex-direction: column;
  `
  // border: 2px solid lightgrey;

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

export default class Column extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided) => (

          <Container {...provided.draggableProps} ref={provided.innerRef}>
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

          </Container>

        )}
      </Draggable>
    )
  }
}
