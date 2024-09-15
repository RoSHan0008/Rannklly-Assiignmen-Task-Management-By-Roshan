import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('https://dummyjson.com/todos');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.todos;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async (newTask, { rejectWithValue }) => {
  try {
    const response = await fetch('https://dummyjson.com/todos/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json(); 
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await fetch(`https://dummyjson.com/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`https://dummyjson.com/todos/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Network response was not ok');
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    moveTaskToInProgress: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) task.completed = false;
    },
    moveTaskToDone: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) task.completed = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex(task => task.id === updatedTask.id);
        if (index >= 0) {
          state.tasks[index] = updatedTask;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const id = action.payload;
        state.tasks = state.tasks.filter(task => task.id !== id);
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      });
  },
});

export const { moveTaskToInProgress, moveTaskToDone } = tasksSlice.actions;
export default tasksSlice.reducer;
