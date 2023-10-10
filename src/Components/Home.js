import React, { useEffect, useState } from "react";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import TextField from "@mui/material/TextField";
import { Button, ButtonGroup } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import MenuItem from "@mui/material/MenuItem";

export default function Home() {
  let date = new Date().toLocaleDateString();
  const [cDate, setCDate] = useState(date);
  let time = new Date().toLocaleTimeString();
  const [cTime, setCTime] = useState(time);
  let today = new Date();

  setInterval(() => {
    time = new Date().toLocaleTimeString();
    setCTime(time);
  }, 1000);
  setInterval(() => {
    date = new Date().toLocaleDateString();
    setCDate(date);
    setDay(today.getDay());
  }, 3600000);

  const [day, setDay] = useState(today.getDay());
  const [isClose, setIsClose] = useState(false);
  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [id, setId] = useState();
  const dayToString = () => {
    if (day === 0) return "Sunday";
    else if (day === 1) return "Monday";
    else if (day === 2) return "Tuesday";
    else if (day === 3) return "Wednesday";
    else if (day === 4) return "Thursday";
    else if (day === 5) return "Friday";
    return "Saturday";
  };

  const sortOptions = [
    {
      label: "Newest First",
    },
    {
      label: "Oldest First",
    },
  ];

  const submitTask = () => {
    if (title !== "") {
      axios
        .post("https://65197c95818c4e98ac606e25.mockapi.io/tasks", {
          title: title,
          description: Description,
        })
        .then((res) => {
          getTasks();
          toast.success(res.statusText, {
            position: "bottom-right",
            theme: "light",
          });
          setTitle("");
          setDescription("");
          setIsClose(false);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something wents wrong!", {
            position: "bottom-right",
            theme: "light",
          });
        });
    } else {
      toast.error("Please fillout the fields first!", {
        position: "bottom-right",
        theme: "light",
      });
    }
  };

  const getTasks = async () => {
    const res = await axios.get(
      "https://65197c95818c4e98ac606e25.mockapi.io/tasks"
    );
    setTasks(res.data);
  };

  const deleteTask = (id) => {
    axios
      .delete(`https://65197c95818c4e98ac606e25.mockapi.io/tasks/${id}`)
      .then((res) => {
        toast.success("Task Deleted", {
          position: "bottom-right",
          theme: "light",
        });
        getTasks();
      })
      .catch((error) => {
        toast.error("Something wents wrong!", {
          position: "bottom-right",
          theme: "light",
        });
      });
  };

  const updateTask = (id, ttl, desc) => {
    setIsClose(true);
    setIsUpdating(true);
    setTitle(ttl);
    setDescription(desc);
    setId(id);
  };

  const submitUpdatedTask = () => {
    axios
      .put(`https://65197c95818c4e98ac606e25.mockapi.io/tasks/${id}`, {
        title: title,
        description: Description,
      })
      .then((res) => {
        setIsClose(false);
        setTitle("");
        setDescription("");
        setIsUpdating(false);
        setId(null);
        getTasks();
        toast.success("Task Updated", {
          position: "bottom-right",
          theme: "light",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something wents wrong!", {
          position: "bottom-right",
          theme: "light",
        });
      });
  };

  const markAsDone = (id, title, desc) => {
    toast.success(`Task Completed ${id} - ${title} - ${desc}`, {
      position: "bottom-right",
      theme: "light",
    });
  };

  useEffect(() => {
    getTasks();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      <div className="header">
        <p>Today is</p>
        <h1>{dayToString()}</h1>
        <div className="date-time">
          <div className="date">
            <CalendarMonthOutlinedIcon
              fontSize="medium"
              htmlColor="#67649d"
              sx={{ marginRight: "7px" }}
            />
            {cDate}
          </div>
          <div className="time">
            <AccessTimeOutlinedIcon
              fontSize="medium"
              htmlColor="#67649d"
              sx={{ marginRight: "7px" }}
            />
            {cTime}
          </div>
        </div>
        <Fab
          sx={{
            background: "#8bbd1a",
            position: "absolute",
            left: "80%",
          }}
          onClick={() => {
            setIsClose(true);
          }}
        >
          <AddIcon />
        </Fab>
      </div>

      <div className="task-container">
        {isClose ? (
          <form
            className="form"
            style={{
              border: "1px solid #4a478b",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "#4a478b 0px 3px 8px",
              textAlign: "center",
            }}
          >
            <h1>{isUpdating ? "Update Task" : "Create New Task"}</h1>
            <TextField
              size="small"
              sx={{ my: 2 }}
              label="Title"
              variant="outlined"
              placeholder="Enter Title"
              fullWidth
              color="secondary"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <TextField
              size="small"
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              color="secondary"
              placeholder="Enter Description"
              rows={3}
              value={Description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <div className="btns">
              <ButtonGroup fullWidth>
                <Button
                  sx={{ my: 2 }}
                  variant="outlined"
                  fullWidth
                  color="secondary"
                  onClick={() => {
                    setIsClose(false);
                    setTitle("");
                    setDescription("");
                    setIsUpdating(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  sx={{ my: 2 }}
                  variant="contained"
                  fullWidth
                  color="secondary"
                  onClick={() => {
                    isUpdating ? submitUpdatedTask() : submitTask();
                  }}
                >
                  Submit
                </Button>
              </ButtonGroup>
            </div>
          </form>
        ) : null}
        <div className="tast-sort">
          <p>
            Your Tasks For Today - <b>{tasks.length} Tasks</b>
          </p>
          <TextField
            variant="standard"
            select
            label="Sort"
            defaultValue="Newest First"
            size="small"
            color="secondary"
          >
            {sortOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.label}
                onClick={() => {
                  tasks.reverse();
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        {isLoading ? (
          <div style={{ textAlign: "center", color: "#4a478b" }}>
            <h2>Loading...</h2>
          </div>
        ) : (
          tasks
            .map((task, index) => {
              return (
                <div className="task" key={index}>
                  <div className="content">
                    <h3>{task.title}</h3>
                    <type>{task.description}</type>
                  </div>
                  <div className="actions">
                    <ModeEditOutlinedIcon
                      htmlColor="orange"
                      onClick={() => {
                        updateTask(task.id, task.title, task.description);
                      }}
                    />
                    <CheckCircleOutlinedIcon
                      htmlColor="green"
                      onClick={() => {
                        markAsDone(task.id, task.title, task.description);
                      }}
                    />
                    <HighlightOffIcon
                      htmlColor="red"
                      onClick={() => {
                        deleteTask(task.id);
                      }}
                    />
                  </div>
                </div>
              );
            })
            .reverse()
        )}
        <ToastContainer theme="light" position="top-left" />
      </div>
    </>
  );
}
