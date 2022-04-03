import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { Link } from 'react-router-dom';

export default function TodoItem(props) {
  const { todo, onDeleteTodo } = props;

  const handleDelete = () => {
    onDeleteTodo(todo);
  };

  return (
    todo && (
      <Box
        w="100%"
        cursor="pointer"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        h={30}
        pl={4}
        pr={4}
        opacity={todo.completed ? 0.3 : 1}
        textDecoration={todo.completed ? 'line-through' : 'none'}
      >
        <Box display="flex">
          <Text>{todo.title}</Text>
        </Box>
        <Box display="flex" alignItems="center">
          <Link to={`/${todo.id}`}>
            <Box
              mr={4}
              w="20px"
              h="20px"
              bg="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="4px"
            >
              <AiFillEdit />
            </Box>
          </Link>

          <Box
            w="20px"
            h="20px"
            bg="tomato"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="4px"
            onClick={handleDelete}
          >
            <AiFillDelete />
          </Box>
        </Box>
      </Box>
    )
  );
}
