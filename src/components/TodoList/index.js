import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  List,
  Spinner,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addTodo, deleteTodo, fetchTodos } from '../../api/todoApi';
import TodoItem from '../TodoItem';

export default function TodoList() {
  const [title, setTitle] = useState('');

  const queryClient = useQueryClient();

  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery('todos', () => fetchTodos(), {
    keepPreviousData: true,
  });

  const addMutation = useMutation(newTodo => addTodo(newTodo), {
    onMutate: async newTodo => {
      await queryClient.cancelQueries('todos');
      const preTodos = queryClient.getQueryData('todos');
      queryClient.setQueryData('todos', oldTodos => [...oldTodos, newTodo]);
      // console.log(preTodos);
      return { preTodos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData('todos', context.preTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries('todos');
    },
  });
  const deleteMutation = useMutation(id => deleteTodo(id), {
    onMutate: async id => {
      await queryClient.cancelQueries('todos');
      const preTodos = queryClient.getQueryData('todos');
      queryClient.setQueryData('todos', oldTodos => {
        return oldTodos.filter(todo => todo.id !== id);
      });
      // console.log(preTodos);
      return { preTodos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData('todos', context.preTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const handleAddTodo = () => {
    addMutation.mutate({ id: new Date(), title: title, completed: false });
    setTitle('');
  };

  const handleDeleteTodo = id => {
    deleteMutation.mutate(id);
    setTitle('');
  };

  return (
    <Flex align="center" justify="center" h="100vh" bg="gray.200">
      <Box
        h="700px"
        w="500px"
        borderRadius={8}
        boxShadow="xl"
        p="6"
        rounded="md"
        bg="white"
        position="relative"
      >
        <Heading textAlign="center">React-Query</Heading>

        <Box w="100%" h="450px" mt="5" overflowY="auto">
          {isLoading && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              h="100%"
            >
              <Spinner color="red.500" size="lg" />
            </Box>
          )}
          {isError && <Box>{error.message}</Box>}

          <List spacing={3}>
            {todos &&
              todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDeleteTodo={handleDeleteTodo}
                />
              ))}
          </List>
        </Box>
        <FormControl
          display="flex"
          position="absolute"
          bottom="10px"
          left="0px"
          p="24px"
        >
          <Input
            mr="4px"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
            }}
          />

          <Button
            isLoading={addMutation.isLoading}
            loadingText="Adding..."
            colorScheme="teal"
            variant="outline"
            onClick={handleAddTodo}
          >
            Add
          </Button>
        </FormControl>
      </Box>
    </Flex>
  );
}
