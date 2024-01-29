import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { TodoInterface } from "./Todo";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

interface Props {
  editModal: boolean;
  oldTodo: TodoInterface;
  setEditModal: Dispatch<SetStateAction<boolean>>;
  fetchTodos: Function
}

const EditModal = ({ editModal, oldTodo, setEditModal, fetchTodos }: Props) => {
  const [loading, setLoading] = useState(false);
  const [todo, setTodo] = useState({
    content: oldTodo.content,
    title: oldTodo.title,
    completed: oldTodo.completed,
  });
  const handleSubmit = (e: FormEvent, _id: string) => {
    e.preventDefault();
    setLoading(true)
    const toastLoading = toast.loading("Please wait");
    fetch(`/api/v1/todo/update/${oldTodo._id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("todo-accessToken")}`,
      },
      body: JSON.stringify(todo),
    })
      .then((parsed) => parsed.json())
      .then((res) => {
        if (res.success) {
          setEditModal(false)
          fetchTodos()
          toast.success("Successfully updated task")
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        toast.dismiss(toastLoading)
        setLoading(false)
      });
  };

  const handleChange = (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement;
    setTodo({ ...todo, [input.name]: input.value });
  };
  return (
    <Dialog open={editModal}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={(e) => handleSubmit(e, oldTodo._id)}>
          <Label htmlFor="todo-title">Title</Label>
          <Input
            name="title"
            id="todo-title"
            type="text"
            className="my-1"
            value={todo.title}
            onChange={handleChange}
          />
          <Label htmlFor="todo-content">Task</Label>
          <Input
            name="content"
            id="todo-content"
            type="text"
            className="my-1"
            value={todo.content}
            onChange={handleChange}
          />
          <Button
            type="submit"
            className="mt-2"
            disabled={todo.title.length < 4 || todo.content.length < 4 || loading}
          >
            Update
          </Button>
          <Button
            variant="outline"
            className="ml-2 mt-2"
            type="reset"
            onClick={() => {
              setEditModal(false);
              setTodo({
                title: oldTodo.title,
                content: oldTodo.content,
                completed: oldTodo.completed,
              });
            }}
          >
            Cancel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
