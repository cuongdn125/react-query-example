import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Heading,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTodo, updateTodo } from '../../api/todoApi';

export default function InfoTodo() {
  const params = useParams();
  const [completed, setCompleted] = useState(false);
  const [title, setTitle] = useState('');

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery(
    ['todo', params.id],
    () => fetchTodo(params.id),
    {
      keepPreviousData: true,
    }
  );
  useEffect(() => {
    if (data) {
      setCompleted(data.completed);
      setTitle(data.title);
    }
  }, [data]);

  const updateMutation = useMutation(todo => updateTodo(todo), {
    onMutate: async newTodo => {
      await queryClient.cancelQueries(['todo', newTodo.id]);
      const preTodo = queryClient.getQueryData(['todo', newTodo.id]);
      queryClient.setQueryData(['todo', newTodo.id], newTodo);
      return { preTodo };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todo', context.preTodo.id], context.preTodo);
    },
    onSettled: newTodo => {
      queryClient.invalidateQueries(['todo', newTodo.id]);
      navigate('/');
    },
  });

  const handleUpdateTodo = () => {
    updateMutation.mutate({
      id: params.id,
      title,
      completed,
    });
  };

  return (
    <Flex align="center" justify="center" h="100vh" bg="gray.200">
      <Box
        h="300px"
        w="500px"
        borderRadius={8}
        boxShadow="xl"
        p="6"
        rounded="md"
        bg="white"
        position="relative"
      >
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
        {data && (
          <>
            <Box display="flex">
              <Text mr={4}>Completed: </Text>
              <Checkbox
                isChecked={completed}
                size="lg"
                onChange={() => setCompleted(!completed)}
              />
            </Box>
            <Heading
              textDecoration={completed ? 'line-through' : 'none'}
              opacity={completed ? 0.3 : 1}
              textAlign="center"
              mt={4}
            >
              {title}
            </Heading>
          </>
        )}

        <FormControl
          display="flex"
          bottom="10px"
          left="0px"
          p="24px"
          position="absolute"
        >
          <Input
            mr="4px"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
            }}
          />

          <Button
            isLoading={updateMutation.isLoading}
            loadingText="Submitting"
            colorScheme="teal"
            variant="outline"
            onClick={handleUpdateTodo}
          >
            Submit
          </Button>
        </FormControl>
      </Box>
    </Flex>
  );
}
