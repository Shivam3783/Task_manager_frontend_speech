import React, { useEffect, useState, useCallback } from 'react'
import Navbar from '../../components/Navbar'
import styles from "./ToDoList.module.css"
// import { Button, Divider, Input, Modal, message } from 'antd'
import { Button, Divider, Empty, Input, Modal, Select, Tag, Tooltip, message } from 'antd';
import { getErrorMessage } from '../../util/GetError';
import { getTodoDetails, getUserDetails } from '../../util/GetUser';
import ToDoServices from '../../services/toDoServices';
import { useNavigate } from 'react-router';


import { Howl, Howler } from 'howler'; // Import Howl and Howler from Howler.js

import axios, { all } from 'axios';

import { CheckCircleFilled, CheckCircleOutlined, DeleteOutlined, EditOutlined, AudioOutlined, CloudDownloadOutlined } from '@ant-design/icons';
<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.3.2/howler.min.js"></script>

// const SERVER_URL = 'http://localhost:3000/api/todo'; // Adjust the server URL
// const SERVER_URL = 'https://application-92.1ehfynoexv7e.au-syd.codeengine.appdomain.cloud/api/todo';
const SERVER_URL = 'https://task-manager-backend-7rx3.onrender.com/api/todo';

// const POLLING_INTERVAL = 5000; // Adjust the refresh interval as needed (in milliseconds)


function ToDoList() {
  // these 2 state variables store the value of the tasks that user entered
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // this state variable is basically a flag, which keeps track that user has clicked on Add Task Button or not
  // if clicked, isAdding value is true, else false
  const [isAdding, setIsAdding] = useState(false);

  // this state variable will handle the loading part
  const [loading, setLoading] = useState(false);

  // this state variable is to store all the todo tasks of the current logged in user
  const [allToDo, setAllToDo] = useState([]);

  // creating a navigate object using the useNavigate() hook
  // this object allow us to change the route
  const navigate = useNavigate();

  const [currentEditItem, setCurrentEditItem] = useState("");
  // const [currentEditItem, setCurrentEditItem] = useState(null);


  // this state variable is for opening the edit task modal
  // if its true then modal will open, else modal will close
  const [isEditing, setIsEditing] = useState(false);

  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");

  // this state variable will help us to make the Dropdown, so that we can se Completed, Incompleted Task
  const [currentTaskType, setCurrentTaskType] = useState("incomplete");
  const [completedTodo, setCompletedTodo] = useState([]);
  const [incompletedTodo, setIncompletedTodo] = useState([]);
  const [currentTodoTask, setCurrentToDoTask] = useState([]);

  // we store our search results in this filteredToDo state variable, after finding the task in the allToDo list
  const [filteredToDo, setFilteredToDo] = useState([]);

  const user = getUserDetails();
  const todo_data = getTodoDetails();

  const authHeaders = useCallback(() => {
    const token = user?.token;
    return { headers: { 'Authorization': token } };
  }, [user?.token]);

  const getallToDos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/all-to-do/${user?.username}`, authHeaders());
      // getAllToDo();

      const todoData = response.data; // Access the data array

      // getAllToDo();

      console.log('Todo tasks:', todoData);
      localStorage.setItem('todos', JSON.stringify(todoData));

      // console.log(' response' , response);
      localStorage.setItem('response of get all', JSON.stringify(response.data));

      setAllToDo(todoData);

    } catch (error) {
      // console.error('Error fetching todo tasks:', error);
      // Implement error handling (e.g., display user-friendly error message)
    } finally {
      setLoading(false);
    }
  }, [authHeaders, user?.username]); // Include authHeaders and user?.username in the dependency array

  // Fetch data initially (consider user authentication and data availability)
  useEffect(() => {
    if (user?.username) {
      getallToDos();
    }
  }, [getallToDos, user?.username]);


  // const getallToDos = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`${SERVER_URL}/all-to-do/${user?.username}`, authHeaders());
  //     console.log('Todo tasks:', response.data);
  //     localStorage.setItem('response of get all', JSON.stringify(response.data));

  //     setAllToDo(response.data);
  //   } catch (error) {
  //     console.error('Error fetching todo tasks:', error);
  //     // Implement error handling (e.g., display user-friendly error message)
  //   } finally {
  //     setLoading(false); // Ensure loading state is reset even in case of errors
  //   }
  // }, [authHeaders, user?.username]); // Include authHeaders and user?.username in the dependency array

  // // Fetch data initially (consider user authentication and data availability)
  // useEffect(() => {
  //   if (user?.username) { // Check if user is authenticated and has a username
  //     getallToDos();
  //   }
  // }, [getallToDos, user?.username]); 



  // const getallToDos = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`${SERVER_URL}/all-to-do/${user?.username}`, authHeaders());
  //     console.log('Todo tasks:', response.data);
  //     localStorage.setItem('response of get all', JSON.stringify(response.data));

  //     setAllToDo(response.data);
  //   } catch (error) {
  //     console.error('Error fetching todo tasks:', error);
  //     // message.error('Failed to fetch todo tasks. Please try again.');
  //   }
  //   setLoading(false);
  // }, [authHeaders, user?.username]); // Include authHeaders and user?.username in the dependency array of useCallback


  // {Object.entries(localStorage).map(([key, value]) => {
  //   // const value = JSON.parse(valueJSON);


  // useEffect(() => {
  //   // Fetch all todo tasks when the component mounts
  //   getallToDos();

  // }, [getallToDos]); // Include getallToDos in the dependency array of useEffect

  // useEffect(() => { 
  //   // console.log('alltodoo'+ JSON.stringify(allToDo));
  //   localStorage.setItem('todoTasks', JSON.stringify(allToDo));
  // }, [allToDo]);


  // working 
  // const handleSubmitTask = async () => {
  //   setLoading(true);
  //   const newTask = { title, description, isCompleted: false, completedOn: new Date().toISOString(), createdBy: user?.username };
  //   try {
  //     const response = await axios.post(`${SERVER_URL}/create-to-do`, newTask, authHeaders());
  //     console.log('Response:', response.data);
  //     setAllToDo(prevTasks => {
  //       // const updatedTasks = Array.isArray(prevTasks) ? [...prevTasks, response.data.data] : [response.data.data];
  //       const updatedTasks = Array.isArray(prevTasks)? [...prevTasks, newTask] : [newTask];

  //       return updatedTasks;
  //     });

  //     message.success("Task Added Successfully!");
  //     setIsAdding(false);
  //   } catch (error) {
  //     console.error("Error adding task:", error);
  //     // message.error("Failed to add task. Please try again.");
  //   }
  //   setLoading(false);
  // };

  //working

  // const handleSubmitTask = async () => {
  //   setLoading(true);
  //   const newTask = { title, description, isCompleted: false, completedOn: new Date().toISOString(), createdBy: user?.username };
  //   try {
  //     const response = await axios.post(`${SERVER_URL}/create-to-do`, newTask, authHeaders());
  //     console.log('Response:', response.data);

  //     localStorage.setItem('response of get after create data', JSON.stringify(response.data.data));

  //     // Inspect the current value of allToDo
  //     console.log('allToDo before update:', allToDo);


  //     // Update local state immediately (optimistic update)
  //     setAllToDo({...allToDo, todos: [...allToDo.todos, newTask]}); // Add new task to local state


  //     message.success("Task Added Successfully!");
  //     setIsAdding(false);

  //     // Re-fetch tasks from the server for consistency (optional)
  //     // await getallToDos(); // Uncomment to fetch latest data (consider trade-offs)
  //   } catch (error) {
  //     console.error("Error adding task:", error);
  //     // Implement error handling (e.g., display user-friendly error message)
  //   }
  //   setLoading(false);
  // };

  const handleSubmitTask = async () => {
    setLoading(true);
    const newTask = { title, description, isCompleted: false, completedOn: new Date().toISOString(), createdBy: user?.username };

    try {
      const response = await axios.post(`${SERVER_URL}/create-to-do`, newTask, authHeaders());
      console.log('Response:', response.data);

      const createdTask = response.data.data || {}; // Handle potential missing data
      const serverRev = response.data?.rev || ''; // Use rev if available, '' otherwise
      const serverId = response.data?.id || ''; // Use _id if available, '' otherwise

      // Update local state immediately with the new task (optimistic update)
      setAllToDo({
        ...allToDo,
        todos: [...allToDo.todos, {
          ...createdTask, // Include other task properties
        }],
      });

      // Store the updated tasks in local storage (using _rev and _id)
      localStorage.setItem(
        'todos',
        JSON.stringify({
          todos: [...allToDo.todos, {
            ...createdTask,
          }],
        })
      );

      message.success("Task Added Successfully!");
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding task:", error);
      // Implement error handling
    }

    setLoading(false);
  };




  // console.log(todo_data?.todos?.[0]?.title);

  // const handleSubmitTask = async () => {
  //   setLoading(true);
  //   const newTask = { title, description, isCompleted: false,completedOn:"07/04/2004", createdBy: user?.username };

  //   try {
  //     const response = await axios.post(`${SERVER_URL}/create-to-do`, newTask, authHeaders());
  //     console.log('Response:', response.data);

  //     // Access title and other properties from response data
  //     const { title, description, isCompleted, completedOn, createdBy } = response.data.data;
  //     console.log('New task:', { title, description, isCompleted, completedOn, createdBy });

  //     // Update the allToDo state with the new task
  //     setAllToDo(allToDo => {
  //       const updatedTasks = Array.isArray(allToDo) ? [...allToDo, response.data.data] : [response.data.data];
  //       console.log("newtask  " + updatedTasks);

  //       return updatedTasks;
  //     });

  //     // console.log("previous task "+ prevTasks);
  //     getAllToDo();


  //     message.success("Task Added Successfully!");
  //     setIsAdding(false);
  //     // getAllToDo();

  //   } catch (error) {
  //     console.error("Error adding task:", error);
  //     // message.error("Failed to add task. Please try again.");
  //   }

  //   setLoading(false);
  // };



  // useEffect(() => {
  //   const storedTodos = localStorage.getItem('todoTasks');
  //   if (storedTodos) {
  //     try {
  //       const todos = JSON.parse(storedTodos);
  //     } catch (error) {
  //       console.error('Error parsing todos data:', error);
  //     }
  //   }
  // }, []);



  //   // Get the todos data from local storage
  // const storedTodos = localStorage.getItem('todoTasks');

  // if (storedTodos) {
  //   try {
  //     const todos = JSON.parse(storedTodos);

  //     // Check if todos is an array before using map
  //     if (Array.isArray(todos)) {
  //       const titles = todos.map(todo => todo.title);
  //       console.log(titles);
  //     } else {
  //       console.error('Todos data is not an array:', todos);
  //     }
  //   } catch (error) {
  //     console.error('Error parsing todos data:', error);
  //   }
  // } else {
  //   console.error('No todos data found in local storage');
  // }

  //working

  // this function will fetch all the todo tasks of the current logged in user
  const getAllToDo = async () => {
    try {
      // fetching user from the local storage
      let user = getUserDetails();

      // first fetching the userId and then fetching all the todo tasks of the current fetched user
      const userId = user?.username
      const response = await ToDoServices.getAllToDo(userId);
      console.log('API Response:', response); // Log the entire response object

      // if (response && response.data && response.data.todos && response.data.todos.length > 0) {
      //   console.log('Todo tasks:', response.data.todos); // Log the actual tasks data
      //   setAllToDo(response.data.todos);
      // } else {
      //   console.error('Empty response or missing data.');
      // }
      if (response.data.todos && response.data.todos.length > 0) {
        console.log('Todo tasks:', response.data.todos); // Log the actual tasks data
        setAllToDo(response.data.todos);
      } else {
        console.error('Empty response or missing data.');
      }

      // console.log("getAlltodo: " + response);
      // console.log('Todo task:', response.data);
      // // Access specific properties if available
      // console.log('First todo title:', response.data[0]?.title);
      // // console.log(response.data);

      // finally we store all the todo tasks of the user into the allToDo variable, using setAllToDo method
      // setAllToDo(response.data);
    }
    catch (err) {
      // message.error(getErrorMessage(err));
    }
  }

  // const getAllToDo = async () => {
  //   try {
  //     let user = getUserDetails();
  //     const userId = user?.username; // Make sure userId is correctly retrieved

  //     console.log('User ID:', userId); // Log userId for debugging

  //     const response = await ToDoServices.getAllToDo(userId);
  //     console.log('API Response:', response); // Log the entire response object

  //     if (response && response.data && response.data.todos) {
  //       console.log('Todo tasks:', response.data.todos); // Log the actual tasks data
  //       setAllToDo(response.data.todos);
  //     } else {
  //       console.error('Empty response or missing data.');
  //     }
  //   } catch (err) {
  //     console.error('Error fetching todo tasks:', err);
  //     message.error(getErrorMessage(err));
  //   }
  // };

  useEffect(() => {
    // Fetch all todo tasks when the component mounts
    getallToDos();

  }, [getallToDos]); // Include getallToDos in the dependency array of useEffect

  useEffect(() => {
    // console.log('alltodoo'+ JSON.stringify(allToDo));
    localStorage.setItem('todoTasks', JSON.stringify(allToDo));
  }, [allToDo]);






  // on first render we want to fetch all the available tasks of the current logged in user, so we use useEffect Hook
  useEffect(() => {
    // fetching user from the local storage
    let user = getUserDetails();

    // const getAllToDo = async ()=>{
    //   try {
    //     const response = await ToDoServices.getAllToDo(user?.username);
    //     // const response = await ToDoServices.getAllToDo(user);

    //     setAllToDo(response.data);
    //   }
    //   catch(err) {
    //     // console.log(err);
    //     message.error(getErrorMessage(err));
    //   }
    // }

    // if we found user and user has userId
    // then we call the function which fetch all the todo tasks of the user
    if (user && user?.username) {
      getAllToDo();
    }
    // else if the user details is not there or the user id is not there
    // in that case we redirect the user to login page
    else {
      navigate('/');
    }
  }, [navigate]);


  // useEffect(() => {
  //   const incomplete = allToDo.filter((item) => item.isCompleted === false);
  //   const complete = allToDo.filter((item) => item.isCompleted === true);
  //   setIncompletedTodo(incomplete);
  //   setCompletedTodo(complete);
  //   if(currentTaskType === 'incomplete') {
  //     setCurrentToDoTask(incomplete);
  //   }
  //   else {
  //     setCurrentToDoTask(complete);
  //   }
  // }, [allToDo, currentTaskType])

  useEffect(() => {

    const incomplete = allToDo?.todos?.filter((item) => item.isCompleted == false);
    console.log('incomplete', incomplete);
    const complete = allToDo?.todos?.filter((item) => item.isCompleted == true);
    console.log('complete', complete);

    setIncompletedTodo(incomplete);
    setCompletedTodo(complete);

    let tasksToSend = [];
    if (currentTaskType === 'incomplete') {
      tasksToSend = incomplete;
    } else {
      tasksToSend = complete;
    }
    console.log('complete /incomplete task', tasksToSend);
    setCurrentToDoTask(tasksToSend);


    // if (currentTaskType === 'incomplete') {
    //     setCurrentToDoTask(incomplete);
    // } else {
    //     setCurrentToDoTask(complete);
    //   }
  }, [allToDo, currentTaskType]);


  // this function formats the date and return the final formatted date
  const getFormattedDate = (value) => {
    let date = new Date(value);
    let dateString = date.toDateString();
    let hh = date.getHours();
    let min = date.getMinutes();
    let ss = date.getSeconds();
    let finalDate = `${dateString} at ${hh}:${min}:${ss}`;
    return finalDate;
  }

  // this function will run when the user clicks on the edit icon of the specific task
  const handleEdit = (item) => {
    // const todoDataJSON = localStorage.getItem('todoTasks');


    // const todoData = JSON.parse(todoDataJSON);
    // // console.log('response of get all {todoTasks} ',todoData?.todos);


    // todoData.todos.forEach((todo) => {
    //   console.log('_id:', todo._id);
    //   console.log('id:', todo.id);
    // });


    // const editItem = todoData?.todos.find((todo) => {
    //   if (todo.id) {
    //     return todo.id == item._id;
    //   } else if (todo._id) {
    //     return todo._id == item._id;
    //   }
    //   return false;
    // });

    // if (editItem) {
    //   console.log('editItem.id', editItem.id);
    //   console.log('editItem._id', editItem._id);
    //   setCurrentEditItem(editItem);
    // } else {
    //   console.error('Edit item not found:', item);
    //   // Handle the case where the item to edit is not found
    // }

    // // setCurrentEditItem(editItem);




    // if (!editItem) {
    //   console.error('Todo item not found:', item);
    //   return;
    // }
    // console.log('todoToUpdate._id',editItem._id);
    // console.log('editItem clicked',editItem);
    // console.log(item);

    // setIsEditing true means this will open the edit modal on the screen
    setIsEditing(true);

    // this variable set the current item editable
    setCurrentEditItem(item);


    // below 3 state variables will show the current values of the tasks on the update modal
    setUpdatedTitle(item?.title);
    setUpdatedDescription(item?.description);
    setUpdatedStatus(item?.isCompleted);
  };


  // this function will run when the user clicks on the delete icon of the specific task
  const handleDelete = async (itemId) => {
    try {
      // Retrieve todo_data from localStorage

      // const todoDataJSON = localStorage.getItem('response of get all');
      const todoDataJSON = localStorage.getItem('todoTasks');

      if (!todoDataJSON) {
        console.error('Todo data not found in localStorage');
        return;
      }

      const todoData = JSON.parse(todoDataJSON);
      console.log('response of get all {todoTasks} ', todoData?.todos);

      if (!todoData || !todoData.todos) {
        console.error('Invalid todo data:', todoData);
        return;
      }
      todoData.todos.forEach((todo) => {
        console.log('_id:', todo._id);
        console.log('id:', todo.id);
      });

      // Find the todo item with the given ID
      // const todoToDelete = todoData?.todos.find((todo) => todo._id === itemId._id);

      // const todoToDelete = todoData?.todos.find((todo) => {
      //   if (todo._id) {
      //     return todo._id == itemId._id;
      //   } else if (todo.id) {
      //     return todo.id == itemId._id;
      //   }
      //   return false;
      // });
      const todoToDelete = todoData?.todos.find((todo) => todo._id == itemId._id || todo.id == itemId._id);

      if (!todoToDelete) {
        console.error('Todo item not found:', itemId);
        return;
      }
      console.log('todoToDelete._id', todoToDelete._id);
      console.log('todoToDelete._rev', todoToDelete._rev);

      // Call the delete API endpoint with the _id and _rev of the todo item to be deleted
      // const response = await ToDoServices.deleteToDo(itemId._id, itemId._rev);
      const response = await ToDoServices.deleteToDo(todoToDelete._id, todoToDelete._rev);

      // Remove the deleted todo item from the local todo_data
      todoData.todos = todoData?.todos.filter(todo => todo._id !== itemId._id);
      localStorage.setItem('response of get all', JSON.stringify(todoData));

      setAllToDo({
        ...allToDo,
        todos: allToDo.todos.filter(todo => todo._id !== itemId._id)
      });

      // Show success message and update todo list
      message.success(`${todoToDelete.title} Deleted Successfully!`);
      console.log('Deleted Successfully!');
      getAllToDo();
    } catch (err) {
      console.log(err);
      message.error(getErrorMessage(err));
    }
  }





  // on every task we have the icon which shows that the task is completed or not
  // so if the task is not completed and user clicks on the task, the task will be marked as completed and vice versa
  // this function will be called when user clicks on that icon
  // const handleUpdateStatus = async(id, status) => {
  //   try {
  //     // const response = await ToDoServices.updateToDo(id, {isCompleted: status});
  //     // console.log(response.data);
  //     await ToDoServices.updateToDo(id, {isCompleted: status});
  //     message.success("Task Status Updated Successfully!");
  //     localStorage.setItem('todo tasksss is completed?', JSON.stringify(status));


  //     getAllToDo();

  //   }
  //   catch(err) {
  //     // console.log(err);
  //     message.error(getErrorMessage(err));
  //   }
  // }
  //////working both 
  // const handleUpdateStatus = async (id, status) => {
  //   try {
  //     const data = {
  //       "isCompleted": status
  //     };

  //     // const response = await ToDoServices.updateToDo(id, { isCompleted: status });
  //     const response = await ToDoServices.updateToDo(id , data);

  //     if (response.status === 200) { // Handle successful backend update
  //       console.log('Task status updated successfully on the backend.');
  //       message.success("Task Status Updated Successfully!");
  //       localStorage.setItem('todo tasksss is completed?', JSON.stringify(status));
  //     } else {
  //       console.error('Error updating task on the backend:', response.statusText);
  //       message.error("Failed to update task status. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error('Error updating task:', err);
  //     message.error("An error occurred while updating the task. Please try again.");
  //   }
  // };


  const handleUpdateStatus = async (id, status) => {
    try {
      console.log('id', id);
      const data = { isCompleted: status };

      // Call the backend API to update the task status
      // const response = await ToDoServices.updateToDo(id, data);
      const response = await axios.patch(SERVER_URL + '/update-completed/' + id, data, authHeaders());

      console.log('response: status ', response)

      if (response.status === 200) {
        message.success("Task Status Updated Successfully!");

        // Update the task status in local storage
        const updatedTodos = allToDo.todos.map(todo => {
          if (todo.id || todo._id === id) {
            return { ...todo, isCompleted: status };
          }
          return todo;
        });

        setAllToDo({ ...allToDo, todos: updatedTodos });
      } else {
        console.error('Error updating task on the backend:', response.statusText);

        message.error("Failed to update task status. Please try again.");
      }
    } catch (err) {
      console.error('Error updating task:', err);
      message.error("An error occurred while updating the task. Please try again.");
    }
  };






  // when the user clicks on the ok button on update task modal
  // then this function will executed
  const handleUpdateTask = async () => {
    try {
      setLoading(true);

      const data = {
        title: updatedTitle,
        description: updatedDescription,
        // isCompleted: updatedStatus
      };
      const data1 = {
        isCompleted: updatedStatus
      };

      console.log('currentEditItem?.id', currentEditItem?._id);


      const response = await axios.patch(SERVER_URL + '/update-completed/' + currentEditItem?._id, data1, authHeaders());
      console.log('response of iscompleted', response);



      // here we call the backend API to update the task and we are passing the current items id and the updated data
      // const response = await ToDoServices.updateToDo(currentEditItem?._id, data);
      // console.log(response.data);
      await ToDoServices.updateToDo(currentEditItem?.id || currentEditItem?._id, data);

      const updatedTodos = allToDo.todos.map(todo => {
        if (todo.id || todo?._id == currentEditItem._id) {
          return { ...todo, ...data }; // Update the specific task with new data
        }
        return todo;
      });

      // localStorage.setItem('todoswww', updatedTodos?.todos);
      // localStorage.setItem('setall', { ...allToDo, todos: updatedTodos });

      setAllToDo({ ...allToDo, todos: updatedTodos });

      // try {
      //   localStorage.setItem(
      //     'todossssssasassdjbdssd',
      //     JSON.stringify({
      //       todos: [...allToDo.todos], // Use updated state
      //     })
      //   );
      //   console.log('Task updated in localStorage successfully.');
      // } catch (err) {
      //   console.error('Error saving to localStorage:', err);
      //   // Handle localStorage update error (optional)
      // }

      // showing the success message to the user that the task is updated
      message.success(`${currentEditItem?.title} Updated Successfully!`);

      setLoading(false);

      // after updating the task we close the modal
      setIsEditing(false);

      // after deleting the task, we again call the getAllToDo() function
      // and show the user his updated todo tasks
      getAllToDo();
    }
    catch (err) {
      console.log(err);
      setLoading(false);
      message.error(getErrorMessage(err));
    }
  }


  const handleTypeChange = (value) => {
    const todoDataJSON = localStorage.getItem('todoTasks');

    if (!todoDataJSON) {
      console.error('Todo data not found in localStorage');
      return;
    }

    const todoData = JSON.parse(todoDataJSON);

    // console.log('value,' ,value);
    setCurrentTaskType(value);

    if (value == 'incomplete') {
      // setCurrentToDoTask(incompletedTodo);
      setCurrentToDoTask(todoData?.todos.filter((todo) => !todo.isCompleted));

    }
    else {
      // setCurrentToDoTask(completedTodo);
      setCurrentToDoTask(todoData?.todos.filter((todo) => todo.isCompleted));

    }
  }

  const handleSearch = (e) => {
    let query = e.target.value.toLowerCase();

    // Filter the searched task from the all todo list
    let filteredTasks = allToDo.todos.filter((item) =>
      item.title.toLowerCase().includes(query)
    );

    console.log('filteredList', filteredTasks);

    // Update the state with the filtered tasks
    if (filteredTasks.length > 0 && query) {
      setFilteredToDo(filteredTasks);
    } else {
      setFilteredToDo([]);
    }
  };

  //   async function convertToSpeech(description) {
  //     try {
  //       const url = 'https://api.eu-gb.text-to-speech.watson.cloud.ibm.com/instances/1d18079a-d950-452b-8d33-14ea822cf6e4';
  //       const apiKey = 'rlxEkSI4rGuxlkGU4UqoGy22bfW3HUw_uF5ERuaZBIMo'; // Replace with your actual API key

  //       const response = await fetch(`${url}/v1/synthesize`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Basic ${btoa(`apikey:${apiKey}`)}`
  //         },
  //         body: JSON.stringify({
  //           text: description,
  //           voice: 'en-US_AllisonV3Voice', // Choose the voice (you can change this)
  //           accept: 'audio/wav'

  //         })
  //       });

  //       const audioBlob = await response.blob();
  //       const audioUrl = URL.createObjectURL(audioBlob);

  //       // Play the synthesized speech
  //       const audioElement = new Audio(audioUrl);
  //       audioElement.play();
  //     } catch (error) {
  //       console.error('Error converting text to speech:', error);
  //     }
  //  }
  // -----work

  // async function convertToSpeech(description) {
  //   try {
  //     const apiKey = 'rlxEkSI4rGuxlkGU4UqoGy22bfW3HUw_uF5ERuaZBIMo'; // Your actual API key

  //     // const acceptParam = 'audio/wav';
  //     // const acceptParam = 'application/json';
  //     // const voiceParam = 'es-ES_EnriqueV3Voice';

  //     const apiUrl = 'https://api.eu-gb.text-to-speech.watson.cloud.ibm.com/instances/1d18079a-d950-452b-8d33-14ea822cf6e4/v1/synthesize';


  //     // const apiUrl = `https://api.eu-gb.text-to-speech.watson.cloud.ibm.com/instances/1d18079a-d950-452b-8d33-14ea822cf6e4/v1/synthesize?accept=${encodeURIComponent(acceptParam)}&voice=${encodeURIComponent(voiceParam)}`;

  //     console.log('API URL:', apiUrl);


  //     console.log('2. API Key:', apiKey); // Replace with your actual API key (redacted for security)

  //     const authHeader = `Basic ${btoa(`apikey:${apiKey}`)}`;
  //     console.log('3.  auth header:', authHeader);






  //     console.log('Description Value:', description); // New line



  //     const requestBody = JSON.stringify({
  //       text: description  // Example text parameter
  //     });
  //     console.log('Request Body:', requestBody);



  //     const headers = {
  //       'Content-Type': 'application/json',
  //       'Accept': 'audio/wav',
  //       Authorization: authHeader,
  //     };
  //     const response = await axios.post(apiUrl, requestBody, { headers });


  //     // const response = await axios.post(apiUrl, requestBody,{
  //     //   headers: {
  //     //     'Content-Type': 'application/json',
  //     //     Authorization: authHeader,
  //     //   },

  //     //   // body:  JSON.stringify({
  //     //   //   text: 'Hello, world!'  // Example text parameter
  //     //   //})

  //     // });
  //     console.log('API Response.data:', response.data);
  //     console.log('Request headers:', (response.headers)); // Access the body as a property
  //     console.log('API Response:', response);
  //     console.log('Request jsonify headers:', JSON.stringify(response.headers)); // Access the body as a property

  //     // console.log('Request Body:', (response.body)); // Access the body as a property
  //     console.log('4. Fetch Response Status:', response.status);

  //     if (response.status === 200) {
  //       const audioData = response.data; // Assuming response.data contains the audio data as a binary string

  //       // // Convert binary string to blob
  //       // const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
  //       // console.log('audioBlob',audioBlob);

  //       // // Create object URL for playing the audio
  //       // const audioUrl = URL.createObjectURL(audioBlob);
  //       // console.log('audioUrl',audioUrl);


  //       // const audioElement = new Audio();
  //       // console.log('audioElement',audioElement);

  //       // audioElement.src = audioUrl;
  //       // audioElement.play();

  //       // // Convert binary string to blob
  //       // Create a temporary blob for Howler.js

  //       const audioBlob = new Blob([audioData], { type: 'audio/wav' });
  //       console.log('audioBlob', audioBlob);


  //       // Create object URL for Howler.js to access the audio
  //       const audioUrl = URL.createObjectURL(audioBlob);
  //       console.log('audioUrl:', audioUrl);

  //       // Use Howler.js for audio playback
  //       const sound = new Howl({
  //         src: [audioUrl],
  //         format: ['wav'], // Specify the audio format
  //         volume: 10, // Adjust volume as needed (0-1)
  //         autoplay: true,
  //         onplay: () => {
  //           console.log('Speech playback started');
  //         },
  //         onend: () => {
  //           URL.revokeObjectURL(audioUrl); // Clean up the object URL when playback is finished
  //           console.log('Speech playback finished');
  //         },
  //       });
  //       console.log('sound:', sound);

  //       // // Create a download link for the audio file
  //       // const downloadLink = document.createElement('a');
  //       // downloadLink.href = audioUrl;
  //       // downloadLink.download = 'result.wav'; // Set the filename for download
  //       // downloadLink.style.display = 'none';
  //       // document.body.appendChild(downloadLink);
  //       // downloadLink.click();
  //       // document.body.removeChild(downloadLink);

  //       sound.play();


  //       const duration = sound.duration();

  //       if (isNaN(duration) || duration <= 0) {
  //         console.warn('Audio might be corrupt or empty (based on duration)');
  //       }


  //       Howler.volume(5);



  //       // sound.play();




  //     } else {
  //       throw new Error(`Error: ${response.status} - ${response.statusText}`);
  //     }
  //   } catch (error) {
  //     console.error('Error converting text to speech:', error.message);
  //   }
  //   //   if (!response.ok) {
  //   //     throw new Error(`Error: ${response.status} - ${response.statusText}`);
  //   //   }

  //   //   const audioBlob = await response.blob();
  //   //   const audioUrl = URL.createObjectURL(audioBlob);

  //   //   console.log('5. Audio Blob Created');

  //   //   // Play the synthesized speech
  //   //   const audioElement = new Audio(audioUrl);
  //   //   audioElement.play();
  //   //   audioElement.onended = () => {
  //   //     URL.revokeObjectURL(audioUrl); // Clean up the object URL when playback is finished
  //   //   };
  //   // } catch (error) {
  //   //   console.error('Error converting text to speech:', error.message);
  //   // }
  // }

  // // --Safari working

  async function convertToSpeech(description, download) {
    try {
      const apiKey = 'rlxEkSI4rGuxlkGU4UqoGy22bfW3HUw_uF5ERuaZBIMo'; // Your actual API key
      const apiUrl = 'https://api.eu-gb.text-to-speech.watson.cloud.ibm.com/instances/1d18079a-d950-452b-8d33-14ea822cf6e4/v1/synthesize';

      // Constructing the request headers
      const authHeader = `Basic ${btoa(`apikey:${apiKey}`)}`;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'audio/wav',
        'Authorization': authHeader,
        
      };

      // Sending the POST request to the API with the output filename specified %2F , responseType: 'blob'
      const response = await axios.post(apiUrl + '?voice=en-US_MichaelV3Voice&accept=audio/wav', JSON.stringify({ text: description }), { headers, responseType: 'blob'});
      
      // console.log('API Response.data:', response.data);
      // console.log('response headers:', (response.headers)); // Access the body as a property
      // console.log('API Response:', response);
      // console.log('response jsonify headers:', JSON.stringify(response.headers)); // Access the body as a property

      // // console.log('Request Body:', (response.body)); // Access the body as a property
      // console.log('4. Fetch Response Status:', response.status);

      // Check if the response status is 200 (OK)
      if (response.status === 200) {
        const audioBlob = response.data; // Get the audio data as a Blob
        // console.log('audioBlob',audioBlob);

        // Create object URL for playing the audio using Howler.js
        const audioUrl = URL.createObjectURL(audioBlob);
        // console.log('audioUrl',audioUrl);

        if (download) {
          const downloadLink = document.createElement('a');
          downloadLink.href = audioUrl;
          downloadLink.download = 'result.wav';
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          message.success(`Audio Downloaded Successfully!`);

        } else {

          const sound = new Howl({
            // src: [audioUrl],
            src: [audioUrl],
            format: ['wav'],
            volume: 1,
            autoplay: true,
            onplay: () => {
              console.log('Speech playback started');
            },
            onend: () => {
              URL.revokeObjectURL(audioUrl);
              console.log('Speech playback finished');
            },
          });
        }
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error converting text to speech:', error.message);
    }

  }

  const downloadCSV = () => {
    const todoDataJSON = localStorage.getItem('todoTasks');

    if (!todoDataJSON) {
      console.error('Todo data not found in localStorage');
      return;
    }

    const todoData = JSON.parse(todoDataJSON);

    const csvRows = [];
    const headers = ['Title', 'Description', 'Is Completed', 'Completed On'];
    csvRows.push(headers.join(','));

    todoData.todos.forEach(todo => {
      const row = [
        `"${todo.title}"`,
        `"${todo.description}"`,
        todo.isCompleted ? 'Yes' : 'No',
        `"${todo.completedOn}"`,
      ];
      csvRows.push(row.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'todos.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Example usage




  // async function convertToSpeech(description) {
  //   try {
  //     const response = await fetch('http://localhost:3000/convert-to-speech', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ description })
  //     });

  //     if (response.ok) {
  //       const audioBlob = await response.blob();
  //       const audioUrl = URL.createObjectURL(audioBlob);

  //       const audioElement = new Audio(audioUrl);
  //       audioElement.play();
  //       audioElement.onended = () => URL.revokeObjectURL(audioUrl);
  //     } else {
  //       const errorResponse = await response.json();
  //       console.error('Error converting text to speech:', errorResponse);
  //     }
  //   } catch (error) {
  //     console.error('Error converting text to speech:', error);
  //   }
  // }
  // Assuming this is inside a React component or a function component






  // async function convertToSpeech(description) {
  //   try {
  //     const url = 'https://api.au-syd.text-to-speech.watson.cloud.ibm.com/instances/b6dee213-48c9-4c61-90b8-c4bd03e146eb/v1/synthesize?accept=audio%2Fwav&text=hola%20mundo&voice=es-ES_EnriqueV3Voice';
  //     const apiKey = 'UD1L-C2_uI2dCCeeUdJdbC3JAMMrd-XvEnvBV1QQoRUK'; // Replace with your actual API key

  //     const response = await fetch(`${url}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Basic ${btoa(`apikey:${apiKey}`)}`
  //       },
  //       body: JSON.stringify({
  //         text: description,
  //         // voice: 'en-US_AllisonV3Voice', // Choose the voice (you can change this)
  //         // accept: 'audio/wav'
  //       })
  //     });

  //     const audioBlob = await response.blob();
  //     const audioUrl = URL.createObjectURL(audioBlob);

  //     // Play the synthesized speech
  //     const audioElement = new Audio(audioUrl);
  //     audioElement.play();
  //   } catch (error) {
  //     console.error('Error converting text to speech:', error);
  //   }
  // }







  return (
    <>
      <Navbar active={"myTask"} />

      <section className={styles.toDoWrapper}>
        {/* this div contains title, input field where user can search their tasks, buttons from which user can add new task */}
        {/* when the user clicks on Add Task Button, the module will pop up and user can enter the details of the new task in that module */}
        <div className={styles.toDoHeader}>

          <h2>Your Tasks</h2>
          <Input style={{ width: '50%' }} onChange={handleSearch} placeholder='Search Your Tasks Here' />
          <Button type="primary" size="large" onClick={downloadCSV} style={{ backgroundColor: '#52c41a', color: '#fff', marginLeft: '10px' }}>
            Download Tasks
          </Button>
          <div>

            <Button type="primary" size="large" onClick={() => setIsAdding(true)}>
              Add Task
            </Button>

            <Select
              value={currentTaskType}
              style={{ width: 180, marginLeft: '10px' }}
              onChange={handleTypeChange}
              size="large"
              options={[
                {
                  value: "incomplete",
                  label: 'Incomplete'
                },
                {
                  value: "complete",
                  label: 'Complete'
                }
              ]}
            />
          </div>
        </div>

        {/* adding a divider, i.e., horizontal line */}
        <Divider />

        {/* creating the card for each todo task */}
        <div className={styles.toDoListCardWrapper}>
          {/* we run a map function on all fetched todo tasks, and create each card for each task */}
          {
            filteredToDo.length > 0 ? filteredToDo.map((item) => {
              // (setAllToDo.response.data && setAllToDo.response.data.length > 0) ? setAllToDo.response.data.data.map((item) => {
              // (todo_data?.todos && todo_data?.todos.length > 0) ? todo_data?.todos.map((item) => {
              // (allToDo?.todos && allToDo?.todos.length > 0) ? allToDo?.todos.map((item) => {

              // todo_data.todos.forEach((item) => {
              //   console.log(item.title);
              // });
              // console.log(todo_data?.todos?.[item]?.title);
              return (

                <div key={item?._id} className={styles.toDoCard}>
                  {/* this div shows the title, other details and description of the todo task */}
                  <div>
                  </div>
                  <div>
                    <div className={styles.toDoCardHeader}>
                      {/* showing title of the task */}
                      <h3>
                        {
                          item?.title
                        }
                      </h3>

                      {/* showing that the task is completed or incomplete yet, if its completed then we show it in cyan color, if its incomplete then we show it in red color */}
                      {
                        item?.isCompleted ? <Tag color="cyan">Completed</Tag> : <Tag color="red">Incomplete</Tag>
                      }
                    </div>

                    {/* showing description of the task */}
                    <p>
                      {
                        item?.description
                      }
                    </p>
                  </div>

                  {/* this div shows date of the task, edit task icon, delete task icon, and complete incomplete task icon */}
                  <div className={styles.toDoCardFooter}>
                    {/* here we show the date at which the task is created */}
                    <Tag>
                      {
                        getFormattedDate(item?.completedOn)
                      }
                    </Tag>

                    {/* this div shows edit task icon, delete task icon and complete incomplete task icon */}
                    <div className={styles.toDoFooterAction}>
                    <Tooltip title="Download description" placement='bottom'><CloudDownloadOutlined className={styles.actionIcon} onClick={() => convertToSpeech(item?.description, true)} /></Tooltip>

                      <Tooltip title="Audio of description" placement='bottom'><AudioOutlined style={{ color: 'red' }} className={styles.actionIcon} onClick={() => convertToSpeech(item?.description)} /></Tooltip>

                      {/* edit task icon */}
                      <Tooltip title="Edit Task" placement='bottom'><EditOutlined onClick={() => handleEdit(item)} className={styles.actionIcon} /></Tooltip>

                      {/* delete task icon */}
                      <Tooltip title="Delete Task" placement='bottom'><DeleteOutlined onClick={() => handleDelete(item)} style={{ color: 'red' }} className={styles.actionIcon} /></Tooltip>

                      {/* complete incomplete task icon */}
                      {
                        item?.isCompleted
                          ?

                          <Tooltip title="Mark as Incomplete"><CheckCircleFilled onClick={() => handleUpdateStatus(item.id || item._id, false)} style={{ color: 'green' }} className={styles.actionIcon} /></Tooltip>
                          :
                          <Tooltip title="Mark as Completed"><CheckCircleOutlined onClick={() => handleUpdateStatus(item.id || item._id, true)} className={styles.actionIcon} /></Tooltip>

                      }
                    </div>
                  </div>
                </div>
              )
            }) : currentTodoTask?.length > 0 ? currentTodoTask?.map((item) => {
              console.log('item?.isCompleted:', item?.isCompleted); // Log `isCompleted` status

              console.log('currentTodoTask', currentTodoTask);
              // }):  (allToDo?.todos && allToDo?.todos.length > 0) ? allToDo?.todos.map((item) => {

              return (
                <div key={item?._id} className={styles.toDoCard}>
                  {/* this div shows the title, other details and description of the todo task */}
                  <div>
                    <div className={styles.toDoCardHeader}>
                      {/* showing title of the task */}
                      <h3>
                        {
                          item?.title
                        }
                      </h3>

                      {/* showing that the task is completed or incomplete yet, if its completed then we show it in cyan color, if its incomplete then we show it in red color */}
                      {
                        item?.isCompleted ? <Tag color="cyan">Completed</Tag> : <Tag color="red">Incomplete</Tag>
                      }
                    </div>

                    {/* showing description of the task */}
                    <p>
                      {
                        item?.description
                      }
                    </p>
                  </div>

                  {/* this div shows date of the task, edit task icon, delete task icon, and complete incomplete task icon */}
                  <div className={styles.toDoCardFooter}>

                    {/* here we show the date at which the task is created */}
                    <Tag>
                      {
                        getFormattedDate(item?.completedOn)
                      }
                    </Tag>

                    {/* this div shows edit task icon, delete task icon and complete incomplete task icon */}
                    <div className={styles.toDoFooterAction}>
                      {/* {console.log('Is AudioOutlined rendered?', !!AudioOutlined)} */}

                      <Tooltip title="Download description" placement='bottom'><CloudDownloadOutlined className={styles.actionIcon} onClick={() => convertToSpeech(item?.description, true)} /></Tooltip>

                      <Tooltip title="Audio of description" placement='bottom'><AudioOutlined style={{ color: 'red' }} className={styles.actionIcon} onClick={() => convertToSpeech(item?.description, false)} /></Tooltip>

                      {/* edit task icon */}
                      <Tooltip title="Edit Task" placement='bottom'><EditOutlined onClick={() => handleEdit(item)} className={styles.actionIcon} /></Tooltip>

                      {/* delete task icon */}
                      <Tooltip title="Delete Task" placement='bottom'><DeleteOutlined onClick={() => handleDelete(item)} style={{ color: 'red' }} className={styles.actionIcon} /></Tooltip>

                      {/* complete incomplete task icon */}
                      {
                        item?.isCompleted
                          ?
                          <Tooltip title="Mark as Incomplete"><CheckCircleFilled onClick={() => handleUpdateStatus(item.id || item._id, false)} style={{ color: 'green' }} className={styles.actionIcon} /></Tooltip>
                          :
                          <Tooltip title="Mark as Completed"><CheckCircleOutlined onClick={() => handleUpdateStatus(item.id || item._id, true)} className={styles.actionIcon} /></Tooltip>
                      }
                    </div>
                  </div>
                </div>
              )
            }) : <div className={styles.noTaskWrapper}>
              <Empty />
            </div>
          }
        </div>


        {/* we are using the modal from ant design library */}
        {/* when someone clicks on cancel button in the modal then value of isAdding variable will set to false, and the modal will disappear */}
        {/* when someone clicks on ok button in the modal then handleSubmitTask function will call and do the specified operations */}
        {/* confirmLoading will show the loading spinner, if our loading value is set to true */}
        {/* title will set the title of the modal */}
        {/* when isAdding variable is true, means the user want to add new task, then this modal will open */}
        <Modal confirmLoading={loading} title="Add New Task" open={isAdding} onOk={handleSubmitTask} onCancel={() => setIsAdding(false)} okButtonProps={{ disabled: !(title && description) }}>
          <Input style={{ marginBottom: '1rem' }} placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input.TextArea placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
        </Modal>

        {/* suppose when the user click on the edit task icon on some task */}
        {/* then new modal will open on which the user can edit the details of the task */}
        <Modal confirmLoading={loading} title={`Update ${currentEditItem.title}`} open={isEditing} onOk={handleUpdateTask} onCancel={() => setIsEditing(false)} >
          <Input style={{ marginBottom: '1rem' }} placeholder='Updated Title' value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />
          <Input.TextArea style={{ marginBottom: '1rem' }} placeholder='Updated Description' value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)} />
          <Select
            onChange={(value) => setUpdatedStatus(value)}
            value={updatedStatus}
            options={[
              // {
              //   value: false,
              //   label: 'Not Completed',
              // },
              {
                value: false,
                label: 'Incomplete'
              },
              {
                value: true,
                label: 'Completed',
              }
            ]}
          />
        </Modal>
      </section>
    </>
  )
}

export default ToDoList