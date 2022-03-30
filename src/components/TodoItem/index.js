import { Box, Checkbox, Text } from '@chakra-ui/react';
import React from 'react';

export default function TodoItem(props) {
  const { todo } = props;

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
          <Checkbox isChecked={todo.completed} mr={2}>
            <Text>{todo.title}</Text>
          </Checkbox>
        </Box>
      </Box>
    )
  );
}
