import { useEffect, useState } from "react";
import { deleteQuestion, getQuestions } from "../services/QuestionService";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import QuestionModal from "./QuestionModal";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions = await getQuestions();
        setQuestions(questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to fetch questions");
      }
    };

    fetchQuestions();
  }, []);

  const sendDeleteQuestion = async (id) => {
    try {
      const response = await deleteQuestion(id);
      const updatedQuestions = questions.filter((q) => q._id !== id);
      setQuestions(updatedQuestions);
      toast.success("Question deleted successfully");
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question");
    }
  };

  const editQuestion = (id) => {
    const questionToEdit = questions.find((q) => q._id === id);
    setCurrentQuestion(questionToEdit);
    setShowModal(true);
  };

  const addQuestion = () => {
    setCurrentQuestion(null);
    setShowModal(true);
  };

  const handleEditSubmit = (updatedData) => {
    const updatedQuestions = questions.map((q) =>
      q.id === currentQuestion.id ? { ...q, ...updatedData } : q,
    );
    setQuestions(updatedQuestions);
    setShowModal(false);
  };

  return (
    <div className="w-full rounded-3xl border border-gray-300/30 bg-[#191919] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Interview Questions
        </h2>
        <span
          onClick={addQuestion}
          className="flex cursor-pointer rounded-full border px-4 py-1 text-sm hover:border-lime-300 hover:bg-lime-300 hover:text-black"
        >
          <Plus className="mr-2 rounded-full" />
          <h1>Add Question</h1>
        </span>
      </div>

      {/* Questions List */}
      <div className="h-[18rem] space-y-2 overflow-y-auto">
        {questions.map((item) => (
          <div
            key={item._id}
            className="flex cursor-pointer items-center rounded-2xl bg-gray-100/10 p-4"
            onClick={() => toggleQuestion(item._id)}
          >
            <div className="flex-grow">
              <div className="flex flex-row items-center justify-between">
                <h3 className="font-semibold">{item.title}</h3>
                <div className="flex space-x-2">
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sendDeleteQuestion(item._id);
                    }}
                  >
                    <Trash2 className="text-red-500" />
                  </button>
                  {/* Edit button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editQuestion(item._id);
                    }}
                  >
                    <Pencil className="text-blue-400" />
                  </button>
                </div>
              </div>
              {item.category && (
                <p className="text-sm text-gray-300/30">
                  Category: {item.category}
                </p>
              )}
              <div className="mt-2 flex">
                <h3
                  className={`rounded-full px-4 py-1 text-xs font-light ${
                    item.complexity === "Easy"
                      ? "bg-lime-300 text-gray-900"
                      : item.complexity === "Medium"
                        ? "bg-yellow-400 text-gray-900"
                        : item.complexity === "Hard"
                          ? "bg-red-500 text-white"
                          : ""
                  }`}
                >
                  {item.complexity}
                </h3>
              </div>
              {openQuestion === item._id && (
                <p className="mt-4 text-sm font-light text-white">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <QuestionModal
          closeModal={() => setShowModal(false)}
          setQuestions={setQuestions}
          question={currentQuestion}
        />
      )}
    </div>
  );
};

export default Questions;
