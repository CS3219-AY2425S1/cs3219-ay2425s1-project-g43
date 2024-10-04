import { createQuestion, updateQuestion } from "../services/QuestionService";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuestionModal = (props) => {
  const { question, closeModal, setQuestions } = props;
  const modalTitle = question ? "Edit Question" : "Create Question";
  const defaultValues = question
    ? {
        title: question.title,
        description: question.description,
        category: question.category,
        complexity: question.complexity,
      }
    : {
        title: "", // Default values
        description: "",
        category: "",
        complexity: "",
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const sendPostQuestion = async (questionData) => {
    try {
      const response = await createQuestion(questionData);
      setQuestions((prevQuestions) => [...prevQuestions, response]);
      toast.success("Question created successfully");
      closeModal();
    } catch (error) {
      toast.error("Failed to create question");
    }
  };

  const sendUpdateQuestion = async (questionData) => {
    try {
      const response = await updateQuestion(question._id, questionData);
      const updatedQuestion = questionData;
      updatedQuestion._id = question._id;
      setQuestions((questions) =>
        questions.map((q) => {
          return q._id === question._id ? updatedQuestion : q;
        }),
      );
      toast.success("Question updated successfully");
      closeModal();
    } catch (error) {
      toast.error("Failed to update question");
      console.error(error);
    }
  };

  const onSubmit = (questionData) => {
    if (question) {
      sendUpdateQuestion(questionData);
    } else {
      sendPostQuestion(questionData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 text-white">
      <div className="w-full max-w-md rounded-3xl bg-[#191919] bg-gradient-to-r from-white to-lime-400 p-1 shadow-lg">
        <div className="rounded-3xl bg-[#191919] p-6">
          <h2 className="mb-6 text-2xl font-semibold text-lime-300">
            {modalTitle}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-100">
                Title
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="mt-1 w-full rounded-lg bg-gray-300/10 p-2 focus:outline-none"
                placeholder="Enter question title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-100">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="mt-1 w-full rounded-lg bg-gray-300/10 p-2 focus:outline-none"
                placeholder="Enter question description"
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category Input */}
            <div>
              <label className="block text-sm font-medium text-gray-100">
                Category
              </label>
              <input
                {...register("category", {
                  required: "Category is required",
                })}
                className="mt-1 w-full rounded-lg bg-gray-300/10 p-2 focus:outline-none"
                placeholder="Enter question category"
              />
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Complexity Input */}
            <div>
              <label className="block text-sm font-medium text-gray-100">
                Complexity
              </label>

              <select
                {...register("complexity", {
                  required: "Complexity is required",
                  validate: (value) => {
                    return (
                      ["Easy", "Medium", "Hard"].includes(value) ||
                      "Complexity must be Easy, Medium, or Hard"
                    );
                  },
                })}
                className="mt-1 w-full rounded-lg bg-gray-300/10 p-2 text-sm focus:outline-none"
              >
                <option value="" className="text-black">
                  Select complexity
                </option>{" "}
                <option value="Easy" className="text-black">
                  Easy
                </option>
                <option value="Medium" className="text-black">
                  Medium
                </option>
                <option value="Hard" className="text-black">
                  Hard
                </option>
              </select>
              {errors.complexity && (
                <p className="text-sm text-red-500">
                  {errors.complexity.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex space-x-2">
              <button
                type="submit"
                className="rounded-full bg-lime-300 px-4 py-2 text-slate-900 hover:bg-lime-400"
              >
                Submit
              </button>
              <button
                className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
