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
import React, { useEffect, useRef, useState } from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import TodoItem from '../TodoItem';

async function fetchTodos(page) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos?_limit=10&_page=${page}`,
    {
      method: 'GET',
    }
  );
  const data = await response.json();
  return data;
}
async function addTodos(newTodo) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
    method: 'POST',
    body: JSON.stringify(newTodo),
  });
  const data = await response.json();
  return data;
}

export default function TodoList() {
  const [title, setTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const nameRef = useRef(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery(['todos', currentPage + 1], () =>
      fetchTodos(currentPage + 1)
    );
  }, [currentPage, queryClient]);

  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery(['todos', currentPage], () => fetchTodos(currentPage), {
    keepPreviousData: true,
  });
  //   console.log(todos);

  const mutation = useMutation(newTodo => addTodos(newTodo));

  const handleAddTodo = () => {
    mutation.mutate({ id: new Date(), title: title, completed: false });
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
        <Heading textAlign="center">Todo App</Heading>

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
            {todos && todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
          </List>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={4}
        >
          <Button
            leftIcon={<AiFillCaretLeft />}
            colorScheme="teal"
            variant="solid"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous Page
          </Button>
          <Button
            rightIcon={<AiFillCaretRight />}
            colorScheme="teal"
            variant="solid"
            disabled={currentPage >= 20}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next Page
          </Button>
        </Box>
        <FormControl
          display="flex"
          position="absolute"
          bottom="10px"
          left="0px"
          p="24px"
        >
          <Input
            ref={nameRef}
            mr="4px"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
            }}
          />

          <Button
            isLoading={mutation.isLoading}
            loadingText="Submitting"
            colorScheme="teal"
            variant="outline"
            onClick={handleAddTodo}
          >
            Submit
          </Button>
        </FormControl>
      </Box>
    </Flex>
  );
}
