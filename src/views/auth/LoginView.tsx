import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from '@tanstack/react-query'
import { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { authenticateUser } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function LoginView() {

  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
  const navigate = useNavigate()

  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      navigate('/')
    }
  })

  const handleLogin = (formData: UserLoginForm) => mutate(formData)

  return (
    <>
      <h1 className="text-4xl font-black text-white text-center">Iniciar Sesión</h1>
      <p className="text-xl font-light text-white mt-5 text-center">
        Comienza a planear tus proyectos {''}
        <span className=" text-yellow-300 font-bold"> iniciando sesión en este formulario</span>
      </p>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-4 p-10 mt-10 bg-white sm:w-[500px] mx-auto"
        noValidate
      >
        <div className="flex flex-col gap-2">
          <label
            className="font-normal text-xl"
          >Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="font-normal text-xl"
          >Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Iniciar Sesión'
          className="bg-yellow-600 hover:bg-yellow-700 w-full p-3 text-white font-black text-xl cursor-pointer"
        />
      </form>

      <nav className="mt-5 flex flex-col space-y-2">
        <Link
          to={'/auth/register'}
          className="text-center text-gray-300 font-normal"
        >¿No tienes cuenta? Crear Una</Link>

        {/* Todo aumentar cuando se tenga servicio de emailing */}
      </nav>
    </>
  )
}